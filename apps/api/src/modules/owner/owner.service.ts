import bcrypt from "bcryptjs";
import xss from "xss";
import prisma from "@travenest/database";
import { ApiError } from "../../middleware/errorHandler.js";
import { generateTokens, UserRole, UserStatus } from "../auth/auth.service.js";
import type { OwnerRegistrationInput, VehicleInput } from "./owner.schemas.js";

// Map vehicle type to database enum
const mapVehicleType = (type: string) => {
  const typeMap: Record<string, string> = {
    luxury: "BUS",
    "semi-luxury": "BUS",
    standard: "BUS",
    mini: "MINI_BUS",
  };
  return typeMap[type] || "BUS";
};

// Map document type string to database enum
const mapDocumentType = (type: string) => {
  const typeMap: Record<string, string> = {
    NIC: "NIC",
    PROFILE_PHOTO: "PROFILE_PHOTO",
    DRIVING_LICENSE: "DRIVING_LICENSE",
    INSURANCE: "INSURANCE",
    REGISTRATION_CERTIFICATE: "REGISTRATION_CERTIFICATE",
  };
  return typeMap[type] || type;
};

// Generate a placeholder URL for documents (until S3 is configured)
const generatePlaceholderUrl = (fileName: string, type: string): string => {
  return `/uploads/pending/${type.toLowerCase()}/${Date.now()}_${fileName}`;
};

/**
 * Register a new bus owner with vehicles
 */
export const registerOwner = async (data: OwnerRegistrationInput) => {
  // Validate password confirmation
  if (data.password !== data.confirmPassword) {
    throw ApiError.badRequest("Passwords do not match");
  }

  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email.toLowerCase() },
  });

  if (existingUser) {
    throw ApiError.conflict("Email already registered");
  }

  // Check if any vehicle registration number already exists
  for (const vehicle of data.vehicles) {
    const existingVehicle = await prisma.vehicle.findUnique({
      where: { licensePlate: vehicle.registrationNumber },
    });
    if (existingVehicle) {
      throw ApiError.conflict(
        `Vehicle with registration number ${vehicle.registrationNumber} already exists`,
      );
    }
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, 12);

  // Sanitize inputs
  const sanitizedFirstName = xss(data.firstName.trim());
  const sanitizedLastName = xss(data.lastName.trim());
  const sanitizedNicNumber = xss(data.nicNumber.trim());

  // Create owner with all related data in a transaction
  const result = await prisma.$transaction(async (tx) => {
    // Create user
    const user = await tx.user.create({
      data: {
        email: data.email.toLowerCase().trim(),
        password: hashedPassword,
        firstName: sanitizedFirstName,
        lastName: sanitizedLastName,
        phone: data.phone || null,
        nicNumber: sanitizedNicNumber,
        role: UserRole.VEHICLE_OWNER,
        status: UserStatus.PENDING_VERIFICATION,
        isVerified: false,
      },
    });

    // Create business profile if provided
    if (data.businessProfile && data.businessProfile.businessName) {
      await tx.businessProfile.create({
        data: {
          ownerId: user.id,
          businessName: xss(data.businessProfile.businessName.trim()),
          businessType: data.businessProfile.businessType,
          registrationNumber: data.businessProfile.registrationNumber
            ? xss(data.businessProfile.registrationNumber.trim())
            : null,
          taxId: data.businessProfile.taxId
            ? xss(data.businessProfile.taxId.trim())
            : null,
        },
      });
    }

    // Create owner documents (if provided - optional for registration)
    if (data.ownerDocuments && data.ownerDocuments.length > 0) {
      for (const doc of data.ownerDocuments) {
        await tx.ownerDocument.create({
          data: {
            ownerId: user.id,
            type: mapDocumentType(doc.type) as any,
            url: doc.url || generatePlaceholderUrl(doc.fileName, doc.type),
            fileName: doc.fileName,
            fileSize: doc.fileSize,
            mimeType: doc.mimeType,
            status: "PENDING",
          },
        });
      }
    }

    // Create vehicles with documents and photos
    for (const vehicleData of data.vehicles) {
      const vehicle = await tx.vehicle.create({
        data: {
          ownerId: user.id,
          name: `${vehicleData.make} ${vehicleData.model}`,
          type: mapVehicleType(vehicleData.vehicleType) as any,
          brand: xss(vehicleData.make.trim()),
          model: xss(vehicleData.model.trim()),
          year: vehicleData.year,
          licensePlate: xss(vehicleData.registrationNumber.trim()),
          seats: vehicleData.seatingCapacity,
          acType: vehicleData.acType,
          fuelType: "DIESEL", // Default for buses
          transmission: "MANUAL", // Default for buses
          location: data.address.baseLocation,
          pricePerDay: 0, // To be set later by owner
          isAvailable: false, // Not available until verified
          isActive: false, // Not active until verified
          images: [], // Will be populated from photos
        },
      });

      // Create vehicle documents (if provided - optional for registration)
      if (vehicleData.documents && vehicleData.documents.length > 0) {
        for (const doc of vehicleData.documents) {
          await tx.vehicleDocument.create({
            data: {
              vehicleId: vehicle.id,
              type: mapDocumentType(doc.type) as any,
              url: doc.url || generatePlaceholderUrl(doc.fileName, doc.type),
              fileName: doc.fileName,
              fileSize: doc.fileSize,
              mimeType: doc.mimeType,
              status: "PENDING",
            },
          });
        }
      }

      // Create vehicle photos (if provided - optional for registration)
      if (vehicleData.photos && vehicleData.photos.length > 0) {
        for (let i = 0; i < vehicleData.photos.length; i++) {
          const photo = vehicleData.photos[i];
          await tx.vehiclePhoto.create({
            data: {
              vehicleId: vehicle.id,
              url:
                photo.url ||
                generatePlaceholderUrl(photo.fileName, "VEHICLE_PHOTO"),
              fileName: photo.fileName,
              fileSize: photo.fileSize,
              mimeType: photo.mimeType,
              isPrimary: i === 0 || photo.isPrimary,
              sortOrder: i,
            },
          });
        }
      }
    }

    return user;
  });

  // Generate tokens
  const tokens = generateTokens(result);

  // Return user without password
  const { password: _, ...userWithoutPassword } = result;

  return {
    user: userWithoutPassword,
    ...tokens,
  };
};

/**
 * Get owner profile with vehicles and documents
 */
export const getOwnerProfile = async (ownerId: string) => {
  const owner = await prisma.user.findUnique({
    where: { id: ownerId },
    include: {
      businessProfile: true,
      documents: true,
      vehicles: {
        include: {
          documents: true,
          photos: {
            orderBy: { sortOrder: "asc" },
          },
        },
      },
    },
  });

  if (!owner) {
    throw ApiError.notFound("Owner not found");
  }

  // Remove password from response
  const { password: _, ...ownerWithoutPassword } = owner;

  return ownerWithoutPassword;
};

/**
 * Update owner verification status (admin only)
 */
export const updateOwnerVerification = async (
  ownerId: string,
  isVerified: boolean,
  adminId: string,
) => {
  const owner = await prisma.user.findUnique({
    where: { id: ownerId },
  });

  if (!owner) {
    throw ApiError.notFound("Owner not found");
  }

  if (owner.role !== UserRole.VEHICLE_OWNER) {
    throw ApiError.badRequest("User is not a vehicle owner");
  }

  // Update user verification status
  const updatedOwner = await prisma.user.update({
    where: { id: ownerId },
    data: {
      isVerified,
      status: isVerified ? UserStatus.ACTIVE : UserStatus.PENDING_VERIFICATION,
      verifiedAt: isVerified ? new Date() : null,
      verifiedBy: isVerified ? adminId : null,
      rejectedAt: !isVerified ? new Date() : null,
    },
  });

  // If verified, activate all vehicles
  if (isVerified) {
    await prisma.vehicle.updateMany({
      where: { ownerId },
      data: {
        isActive: true,
        isAvailable: true,
      },
    });

    // Update all documents as verified
    await prisma.ownerDocument.updateMany({
      where: { ownerId },
      data: {
        status: "VERIFIED",
        verifiedAt: new Date(),
        verifiedBy: adminId,
      },
    });

    await prisma.vehicleDocument.updateMany({
      where: {
        vehicle: { ownerId },
      },
      data: {
        status: "VERIFIED",
        verifiedAt: new Date(),
        verifiedBy: adminId,
      },
    });
  }

  const { password: _, ...ownerWithoutPassword } = updatedOwner;
  return ownerWithoutPassword;
};
