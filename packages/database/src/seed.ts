import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@travenest.com" },
    update: {},
    create: {
      email: "admin@travenest.com",
      password: adminPassword,
      firstName: "Admin",
      lastName: "User",
      role: "ADMIN",
      isVerified: true,
    },
  });
  console.log("Admin user created:", admin.email);

  // Create demo owner
  const ownerPassword = await bcrypt.hash("owner123", 12);
  const owner = await prisma.user.upsert({
    where: { email: "owner@travenest.com" },
    update: {},
    create: {
      email: "owner@travenest.com",
      password: ownerPassword,
      firstName: "Demo",
      lastName: "Owner",
      phone: "+94771234567",
      role: "VEHICLE_OWNER",
      isVerified: true,
    },
  });
  console.log("Owner user created:", owner.email);

  // Create demo customer
  const customerPassword = await bcrypt.hash("customer123", 12);
  const customer = await prisma.user.upsert({
    where: { email: "customer@travenest.com" },
    update: {},
    create: {
      email: "customer@travenest.com",
      password: customerPassword,
      firstName: "Demo",
      lastName: "Customer",
      phone: "+94779876543",
      role: "CUSTOMER",
      isVerified: true,
    },
  });
  console.log("Customer user created:", customer.email);

  // Create demo vehicles
  const vehicles = await Promise.all([
    prisma.vehicle.create({
      data: {
        ownerId: owner.id,
        name: "Toyota Aqua Hybrid",
        description:
          "Fuel-efficient hybrid car perfect for city travel and long trips.",
        type: "CAR",
        brand: "Toyota",
        model: "Aqua",
        year: 2022,
        licensePlate: "CAB-1234",
        color: "White",
        seats: 5,
        doors: 4,
        fuelType: "HYBRID",
        transmission: "AUTOMATIC",
        mileage: 25000,
        features: ["AC", "Bluetooth", "Backup Camera", "USB Charging"],
        images: ["/images/vehicles/aqua-1.jpg", "/images/vehicles/aqua-2.jpg"],
        pricePerDay: 8000,
        pricePerHour: 500,
        location: "Colombo",
        latitude: 6.9271,
        longitude: 79.8612,
      },
    }),
    prisma.vehicle.create({
      data: {
        ownerId: owner.id,
        name: "Toyota KDH Van",
        description: "Spacious van ideal for group travel and family trips.",
        type: "VAN",
        brand: "Toyota",
        model: "KDH",
        year: 2021,
        licensePlate: "VAN-5678",
        color: "Silver",
        seats: 15,
        doors: 4,
        fuelType: "DIESEL",
        transmission: "MANUAL",
        mileage: 45000,
        features: ["AC", "PA System", "Luggage Space", "Curtains"],
        images: ["/images/vehicles/kdh-1.jpg", "/images/vehicles/kdh-2.jpg"],
        pricePerDay: 15000,
        location: "Kandy",
        latitude: 7.2906,
        longitude: 80.6337,
      },
    }),
    prisma.vehicle.create({
      data: {
        ownerId: owner.id,
        name: "Honda Vezel SUV",
        description:
          "Comfortable SUV with excellent fuel efficiency and modern features.",
        type: "SUV",
        brand: "Honda",
        model: "Vezel",
        year: 2023,
        licensePlate: "SUV-9012",
        color: "Black",
        seats: 5,
        doors: 4,
        fuelType: "HYBRID",
        transmission: "AUTOMATIC",
        mileage: 10000,
        features: [
          "AC",
          "Sunroof",
          "Leather Seats",
          "Navigation",
          "Cruise Control",
        ],
        images: [
          "/images/vehicles/vezel-1.jpg",
          "/images/vehicles/vezel-2.jpg",
        ],
        pricePerDay: 12000,
        pricePerHour: 750,
        location: "Galle",
        latitude: 6.0535,
        longitude: 80.221,
      },
    }),
  ]);
  console.log(`${vehicles.length} demo vehicles created`);

  console.log("Database seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
