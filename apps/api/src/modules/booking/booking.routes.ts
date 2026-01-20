import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/errorHandler.js";
import type { Request, Response } from "express";
import prisma from "@travenest/database";

const router = Router();

// Customer routes
// Get my bookings
router.get(
  "/my-bookings",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const { status, page = 1, limit = 10 } = req.query;

    // TODO: Implement with database
    res.json({
      success: true,
      data: {
        bookings: [],
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: 0,
          totalPages: 0,
        },
      },
    });
  }),
);

// Create a booking
router.post(
  "/",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    // TODO: Implement with database
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: { booking: req.body },
    });
  }),
);

// Get booking by ID
router.get(
  "/:id",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        vehicle: {
          select: {
            id: true,
            name: true,
            licensePlate: true,
            type: true,
            brand: true,
            model: true,
            seats: true,
            ownerId: true,
          },
        },
        payment: {
          select: {
            id: true,
            amount: true,
            status: true,
            method: true,
            createdAt: true,
          },
        },
      },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: {
          message: "Booking not found",
          code: "BOOKING_NOT_FOUND",
        },
      });
    }

    // Check authorization - customer can view their own bookings, owner can view bookings for their vehicles
    const isCustomer = booking.customerId === userId;
    const isOwner = booking.vehicle.ownerId === userId;
    const isAdmin = userRole === "ADMIN";

    if (!isCustomer && !isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: {
          message: "Not authorized to view this booking",
          code: "FORBIDDEN",
        },
      });
    }

    // Calculate payment breakdown
    const platformCommissionRate = 0.1; // 10%
    const platformCommission = booking.totalAmount * platformCommissionRate;
    const netAmount = booking.totalAmount - platformCommission;

    // Generate itinerary stops from pickup and dropoff
    const stops = [
      {
        name: booking.pickupLocation,
        time: new Date(booking.startDate).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        notes: "Pickup point",
      },
      {
        name: booking.dropoffLocation || booking.pickupLocation,
        time: new Date(booking.endDate).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        notes: "Drop-off point",
      },
    ];

    // Transform to match frontend interface
    const transformedBooking = {
      id: booking.id,
      bookingRef: `BK-${booking.id.slice(0, 8).toUpperCase()}`,
      customer: {
        name: `${booking.customer.firstName} ${booking.customer.lastName}`,
        phone: booking.customer.phone || "",
        email: booking.customer.email,
      },
      vehicle: {
        registration: booking.vehicle.licensePlate,
        type: booking.vehicle.type,
        name: booking.vehicle.name,
        capacity: booking.vehicle.seats,
      },
      trip: {
        startDate: booking.startDate.toISOString(),
        endDate: booking.endDate.toISOString(),
        startTime: new Date(booking.startDate).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        pickupLocation: booking.pickupLocation,
        dropoffLocation: booking.dropoffLocation || booking.pickupLocation,
        route: `${booking.pickupLocation} → ${booking.dropoffLocation || booking.pickupLocation}`,
        passengers: booking.totalPassengers || 0,
        stops,
      },
      payment: {
        total: booking.totalAmount,
        status: booking.payment?.status?.toLowerCase() || "pending",
        method: booking.payment?.method || "Pending",
        breakdown: {
          basePrice: booking.totalAmount * 0.85, // 85% of total
          driverAllowance: booking.totalAmount * 0.1, // 10% for driver
          additionalCharges: booking.totalAmount * 0.05, // 5% other charges
        },
        platformCommission,
        netAmount,
      },
      status: booking.status,
      notes: booking.notes,
      driver: null, // No driver assignment yet
      gpsTracking: false, // GPS tracking not implemented yet
      createdAt: booking.createdAt.toISOString(),
    };

    res.json({
      success: true,
      data: transformedBooking,
    });
  }),
);

// Cancel a booking
router.patch(
  "/:id/cancel",
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    // TODO: Implement with database (check ownership)
    res.json({
      success: true,
      message: `Booking ${id} cancelled successfully`,
    });
  }),
);

// Owner routes
// Get bookings for owner's vehicles
router.get(
  "/owner/vehicle-bookings",
  authenticate,
  authorize("owner", "admin"),
  asyncHandler(async (req: Request, res: Response) => {
    const { status, vehicleId, page = 1, limit = 10 } = req.query;
    const ownerId = req.user!.id;

    // Build filter conditions
    const where: any = {
      vehicle: {
        ownerId: ownerId,
      },
    };

    if (status && typeof status === "string") {
      where.status = status.toUpperCase();
    }

    if (vehicleId && typeof vehicleId === "string") {
      where.vehicleId = vehicleId;
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    // Query bookings with related data
    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
          vehicle: {
            select: {
              id: true,
              name: true,
              licensePlate: true,
              type: true,
              brand: true,
              model: true,
            },
          },
          payment: {
            select: {
              id: true,
              amount: true,
              status: true,
              method: true,
              createdAt: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limitNum,
      }),
      prisma.booking.count({ where }),
    ]);

    // Transform bookings to match frontend interface
    const transformedBookings = bookings.map((booking) => ({
      id: booking.id,
      bookingRef: `BK-${booking.id.slice(0, 8).toUpperCase()}`,
      customer: {
        name: `${booking.customer.firstName} ${booking.customer.lastName}`,
        phone: booking.customer.phone || "",
        email: booking.customer.email,
      },
      vehicle: {
        registration: booking.vehicle.licensePlate,
        type: booking.vehicle.type,
      },
      trip: {
        startDate: booking.startDate.toISOString(),
        endDate: booking.endDate.toISOString(),
        route: `${booking.pickupLocation} → ${booking.dropoffLocation || booking.pickupLocation}`,
        passengers: booking.totalPassengers || 0,
      },
      payment: {
        total: booking.totalAmount,
        status: booking.payment?.status?.toLowerCase() || "pending",
      },
      status: booking.status,
      createdAt: booking.createdAt.toISOString(),
    }));

    res.json({
      success: true,
      data: {
        bookings: transformedBookings,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      },
    });
  }),
);

// Confirm a booking
router.patch(
  "/:id/confirm",
  authenticate,
  authorize("owner", "admin"),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    // TODO: Implement with database (check ownership)
    res.json({
      success: true,
      message: `Booking ${id} confirmed`,
    });
  }),
);

// Reject a booking
router.patch(
  "/:id/reject",
  authenticate,
  authorize("owner", "admin"),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { reason } = req.body;
    // TODO: Implement with database (check ownership)
    res.json({
      success: true,
      message: `Booking ${id} rejected`,
    });
  }),
);

// Complete a booking
router.patch(
  "/:id/complete",
  authenticate,
  authorize("owner", "admin"),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    // TODO: Implement with database (check ownership)
    res.json({
      success: true,
      message: `Booking ${id} marked as completed`,
    });
  }),
);

// Admin routes
// Get all bookings
router.get(
  "/",
  authenticate,
  authorize("admin"),
  asyncHandler(async (req: Request, res: Response) => {
    const { status, page = 1, limit = 10 } = req.query;

    // TODO: Implement with database
    res.json({
      success: true,
      data: {
        bookings: [],
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: 0,
          totalPages: 0,
        },
      },
    });
  }),
);

export default router;
