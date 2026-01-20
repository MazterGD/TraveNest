import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Sri Lankan Districts for realistic data
const SRI_LANKAN_DISTRICTS = [
  "Colombo",
  "Gampaha",
  "Kalutara",
  "Kandy",
  "Matale",
  "Nuwara Eliya",
  "Galle",
  "Matara",
  "Hambantota",
  "Jaffna",
  "Kilinochchi",
  "Mannar",
  "Vavuniya",
  "Trincomalee",
  "Batticaloa",
  "Ampara",
  "Kurunegala",
  "Puttalam",
  "Anuradhapura",
  "Polonnaruwa",
  "Badulla",
  "Monaragala",
  "Ratnapura",
  "Kegalle",
];

// Sri Lankan location coordinates
const LOCATIONS: Record<string, { latitude: number; longitude: number }> = {
  Colombo: { latitude: 6.9271, longitude: 79.8612 },
  Kandy: { latitude: 7.2906, longitude: 80.6337 },
  Galle: { latitude: 6.0535, longitude: 80.221 },
  Jaffna: { latitude: 9.6615, longitude: 80.0255 },
  Negombo: { latitude: 7.2008, longitude: 79.8737 },
  Anuradhapura: { latitude: 8.3114, longitude: 80.4037 },
  Matara: { latitude: 5.9549, longitude: 80.555 },
  Kurunegala: { latitude: 7.4863, longitude: 80.3647 },
  Batticaloa: { latitude: 7.7102, longitude: 81.6924 },
  Trincomalee: { latitude: 8.5874, longitude: 81.2152 },
};

// Bus makes and models popular in Sri Lanka
const BUS_MAKES = [
  {
    make: "Ashok Leyland",
    models: ["Viking", "Lynx", "Boss", "Sunshine", "2820"],
  },
  {
    make: "TATA",
    models: ["Starbus", "Marcopolo", "LP913", "LP1512", "Ultra"],
  },
  { make: "Isuzu", models: ["Journey", "NQR", "NPR", "FTR"] },
  { make: "Mitsubishi", models: ["Rosa", "Fuso", "Canter"] },
  { make: "Toyota", models: ["Coaster", "HiAce"] },
  { make: "Hino", models: ["Dutro", "Poncho", "RK8J"] },
  { make: "Nissan", models: ["Civilian", "UD"] },
  { make: "BYD", models: ["K9", "C6", "Electric Coach"] },
];

// Generate Sri Lankan vehicle registration numbers
const generateLicensePlate = (index: number): string => {
  const provinces = ["WP", "CP", "SP", "NP", "EP", "NW", "NC", "SG", "UV"];
  const province = provinces[Math.floor(Math.random() * provinces.length)];
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const letter1 = letters[Math.floor(Math.random() * letters.length)];
  const letter2 = letters[Math.floor(Math.random() * letters.length)];
  const number = String(1000 + index + Math.floor(Math.random() * 8999));
  return `${province}-${letter1}${letter2}-${number}`;
};

async function main() {
  console.log("Starting Sri Lankan TraveNest database seed...\n");

  // Clean up existing data
  console.log("Cleaning up existing data...");
  await prisma.vehiclePhoto.deleteMany({});
  await prisma.vehicleDocument.deleteMany({});
  await prisma.vehicle.deleteMany({});
  await prisma.ownerDocument.deleteMany({});
  await prisma.businessProfile.deleteMany({});
  await prisma.user.deleteMany({});
  console.log("Cleanup complete\n");

  // ===========================================
  // Create Admin User
  // ===========================================
  console.log("Creating admin user...");
  const adminPassword = await bcrypt.hash("admin@123", 12);
  const admin = await prisma.user.create({
    data: {
      email: "admin@travenest.lk",
      password: adminPassword,
      firstName: "Rajitha",
      lastName: "Wickramasinghe",
      phone: "+94112345678",
      role: "ADMIN",
      status: "ACTIVE",
      isVerified: true,
      address: "No. 45, Galle Road",
      city: "Colombo 03",
      district: "Colombo",
      postalCode: "00300",
    },
  });
  console.log(`Admin created: ${admin.email}\n`);

  // ===========================================
  // Create Bus Owners with Realistic Sri Lankan Data
  // ===========================================
  console.log("Creating bus owners...\n");

  const owners = [];
  const ownerPassword = await bcrypt.hash("owner@123", 12);

  // Owner 1: Sinhala name from Colombo
  const owner1 = await prisma.user.create({
    data: {
      email: "nuwan.perera@gmail.com",
      password: ownerPassword,
      firstName: "Nuwan",
      lastName: "Perera",
      phone: "+94771234567",
      nicNumber: "199012345678",
      role: "VEHICLE_OWNER",
      status: "ACTIVE",
      isVerified: true,
      address: "No. 123, Highlevel Road",
      city: "Maharagama",
      district: "Colombo",
      postalCode: "10280",
      baseLocation: "Colombo",
    },
  });
  owners.push(owner1);

  // Create business profile for owner 1
  await prisma.businessProfile.create({
    data: {
      ownerId: owner1.id,
      businessName: "Perera Transport Services (Pvt) Ltd",
      businessType: "private-limited",
      registrationNumber: "PV123456",
      taxId: "TIN-2024-001234",
    },
  });
  console.log(`Owner 1: ${owner1.firstName} ${owner1.lastName} - Colombo`);

  // Owner 2: Tamil name from Jaffna
  const owner2 = await prisma.user.create({
    data: {
      email: "siva.kumar@yahoo.com",
      password: ownerPassword,
      firstName: "Sivakumar",
      lastName: "Rajaratnam",
      phone: "+94772345678",
      nicNumber: "198523456789",
      role: "VEHICLE_OWNER",
      status: "ACTIVE",
      isVerified: true,
      address: "No. 45, Hospital Road",
      city: "Jaffna",
      district: "Jaffna",
      postalCode: "40000",
      baseLocation: "Jaffna",
    },
  });
  owners.push(owner2);

  // Create business profile for owner 2
  await prisma.businessProfile.create({
    data: {
      ownerId: owner2.id,
      businessName: "Northern Express Tours",
      businessType: "sole-proprietorship",
      registrationNumber: "SP789012",
    },
  });
  console.log(`Owner 2: ${owner2.firstName} ${owner2.lastName} - Jaffna`);

  // Owner 3: Sinhala name from Kandy
  const owner3 = await prisma.user.create({
    data: {
      email: "chaminda.silva@hotmail.com",
      password: ownerPassword,
      firstName: "Chaminda",
      lastName: "Silva",
      phone: "+94773456789",
      nicNumber: "198834567890",
      role: "VEHICLE_OWNER",
      status: "ACTIVE",
      isVerified: true,
      address: "No. 78, Peradeniya Road",
      city: "Kandy",
      district: "Kandy",
      postalCode: "20000",
      baseLocation: "Kandy",
    },
  });
  owners.push(owner3);

  // Create business profile for owner 3
  await prisma.businessProfile.create({
    data: {
      ownerId: owner3.id,
      businessName: "Hill Country Tours & Travels",
      businessType: "partnership",
      registrationNumber: "PT456789",
      taxId: "TIN-2023-005678",
    },
  });
  console.log(`Owner 3: ${owner3.firstName} ${owner3.lastName} - Kandy`);

  // Owner 4: Muslim name from Batticaloa
  const owner4 = await prisma.user.create({
    data: {
      email: "mohamed.farook@gmail.com",
      password: ownerPassword,
      firstName: "Mohamed",
      lastName: "Farook",
      phone: "+94774567890",
      nicNumber: "199245678901",
      role: "VEHICLE_OWNER",
      status: "ACTIVE",
      isVerified: true,
      address: "No. 34, Main Street",
      city: "Batticaloa",
      district: "Batticaloa",
      postalCode: "30000",
      baseLocation: "Batticaloa",
    },
  });
  owners.push(owner4);
  console.log(`Owner 4: ${owner4.firstName} ${owner4.lastName} - Batticaloa`);

  // Owner 5: Sinhala name from Galle
  const owner5 = await prisma.user.create({
    data: {
      email: "kasun.fernando@outlook.com",
      password: ownerPassword,
      firstName: "Kasun",
      lastName: "Fernando",
      phone: "+94775678901",
      nicNumber: "199156789012",
      role: "VEHICLE_OWNER",
      status: "PENDING_VERIFICATION",
      isVerified: false,
      address: "No. 56, Matara Road",
      city: "Galle",
      district: "Galle",
      postalCode: "80000",
      baseLocation: "Galle",
    },
  });
  owners.push(owner5);

  // Create business profile for owner 5
  await prisma.businessProfile.create({
    data: {
      ownerId: owner5.id,
      businessName: "Southern Coast Transport",
      businessType: "sole-proprietorship",
    },
  });
  console.log(
    `Owner 5: ${owner5.firstName} ${owner5.lastName} - Galle (Pending Verification)`,
  );

  console.log(`\nTotal owners created: ${owners.length}\n`);

  // ===========================================
  // Create Customers
  // ===========================================
  console.log("Creating customers...\n");
  const customerPassword = await bcrypt.hash("customer@123", 12);

  const customer1 = await prisma.user.create({
    data: {
      email: "dilshan.jayawardena@gmail.com",
      password: customerPassword,
      firstName: "Dilshan",
      lastName: "Jayawardena",
      phone: "+94776789012",
      role: "CUSTOMER",
      status: "ACTIVE",
      isVerified: true,
      address: "No. 89, Lake Road",
      city: "Nugegoda",
      district: "Colombo",
    },
  });
  console.log(`Customer 1: ${customer1.firstName} ${customer1.lastName}`);

  const customer2 = await prisma.user.create({
    data: {
      email: "priya.nathan@yahoo.com",
      password: customerPassword,
      firstName: "Priya",
      lastName: "Nathan",
      phone: "+94777890123",
      role: "CUSTOMER",
      status: "ACTIVE",
      isVerified: true,
      city: "Wellawatte",
      district: "Colombo",
    },
  });
  console.log(`Customer 2: ${customer2.firstName} ${customer2.lastName}`);

  const customer3 = await prisma.user.create({
    data: {
      email: "amal.senanayake@outlook.com",
      password: customerPassword,
      firstName: "Amal",
      lastName: "Senanayake",
      phone: "+94778901234",
      role: "CUSTOMER",
      status: "ACTIVE",
      isVerified: true,
      city: "Kandy",
      district: "Kandy",
    },
  });
  console.log(`Customer 3: ${customer3.firstName} ${customer3.lastName}\n`);

  // ===========================================
  // Create Vehicles for Each Owner
  // ===========================================
  console.log("Creating vehicles...\n");

  let vehicleIndex = 0;

  // Owner 1 Vehicles (Nuwan Perera - Colombo) - 4 Luxury Coaches
  const owner1VehicleData = [
    {
      name: "Ashok Leyland Viking Luxury Coach",
      description:
        "Premium luxury coach with reclining seats, entertainment system, and refreshments. Perfect for corporate tours and long-distance travel.",
      type: "BUS" as const,
      brand: "Ashok Leyland",
      model: "Viking",
      year: 2023,
      color: "White",
      seats: 45,
      acType: "FULL_AC" as const,
      fuelType: "DIESEL" as const,
      transmission: "MANUAL" as const,
      features: [
        "Full AC",
        "Reclining Seats",
        "Entertainment System",
        "WiFi",
        "Refreshments",
        "USB Charging",
        "GPS Tracking",
        "CCTV",
      ],
      pricePerDay: 35000,
      pricePerKm: 85,
      location: "Colombo",
      condition: "EXCELLENT" as const,
      isAvailable: true,
      isActive: true,
    },
    {
      name: "TATA Marcopolo Semi-Luxury",
      description:
        "Comfortable semi-luxury bus ideal for pilgrimages and family trips. Well-maintained with experienced drivers.",
      type: "BUS" as const,
      brand: "TATA",
      model: "Marcopolo",
      year: 2022,
      color: "Silver",
      seats: 52,
      acType: "SEMI_AC" as const,
      fuelType: "DIESEL" as const,
      transmission: "MANUAL" as const,
      features: [
        "Semi AC",
        "Pushback Seats",
        "PA System",
        "Luggage Compartment",
        "First Aid Kit",
      ],
      pricePerDay: 28000,
      pricePerKm: 70,
      location: "Colombo",
      condition: "GOOD" as const,
      isAvailable: true,
      isActive: true,
    },
    {
      name: "Toyota Coaster Mini Bus",
      description:
        "Compact and efficient mini bus perfect for small groups and city tours. Easy to maneuver through narrow roads.",
      type: "MINI_BUS" as const,
      brand: "Toyota",
      model: "Coaster",
      year: 2021,
      color: "Blue",
      seats: 28,
      acType: "FULL_AC" as const,
      fuelType: "DIESEL" as const,
      transmission: "AUTOMATIC" as const,
      features: [
        "Full AC",
        "Comfortable Seats",
        "TV/DVD",
        "Microphone",
        "USB Charging",
      ],
      pricePerDay: 22000,
      pricePerKm: 60,
      location: "Colombo",
      condition: "EXCELLENT" as const,
      isAvailable: true,
      isActive: true,
    },
    {
      name: "Isuzu Journey School Service",
      description:
        "Reliable school service bus with safety features. Currently available for weekend bookings.",
      type: "BUS" as const,
      brand: "Isuzu",
      model: "Journey",
      year: 2020,
      color: "Yellow",
      seats: 40,
      acType: "NON_AC" as const,
      fuelType: "DIESEL" as const,
      transmission: "MANUAL" as const,
      features: [
        "Safety Belts",
        "First Aid",
        "Fire Extinguisher",
        "Emergency Exit",
        "CCTV",
      ],
      pricePerDay: 18000,
      pricePerKm: 50,
      location: "Colombo",
      condition: "GOOD" as const,
      isAvailable: false, // In use for school service on weekdays
      isActive: true,
    },
  ];

  for (const vehicleData of owner1VehicleData) {
    const coords = LOCATIONS[vehicleData.location];
    await prisma.vehicle.create({
      data: {
        ownerId: owner1.id,
        name: vehicleData.name,
        description: vehicleData.description,
        type: vehicleData.type,
        brand: vehicleData.brand,
        model: vehicleData.model,
        year: vehicleData.year,
        licensePlate: generateLicensePlate(vehicleIndex++),
        color: vehicleData.color,
        seats: vehicleData.seats,
        acType: vehicleData.acType,
        fuelType: vehicleData.fuelType,
        transmission: vehicleData.transmission,
        features: vehicleData.features,
        images: [],
        pricePerDay: vehicleData.pricePerDay,
        pricePerKm: vehicleData.pricePerKm,
        location: vehicleData.location,
        latitude: coords.latitude,
        longitude: coords.longitude,
        condition: vehicleData.condition,
        isAvailable: vehicleData.isAvailable,
        isActive: vehicleData.isActive,
      },
    });
  }
  console.log(
    `Created ${owner1VehicleData.length} vehicles for ${owner1.firstName} ${owner1.lastName}`,
  );

  // Owner 2 Vehicles (Sivakumar - Jaffna) - 3 Vehicles
  const owner2VehicleData = [
    {
      name: "Ashok Leyland Lynx AC Coach",
      description:
        "Modern AC coach for comfortable travel across Northern Province. Ideal for temple visits and cultural tours.",
      type: "BUS" as const,
      brand: "Ashok Leyland",
      model: "Lynx",
      year: 2022,
      color: "White",
      seats: 48,
      acType: "FULL_AC" as const,
      fuelType: "DIESEL" as const,
      transmission: "MANUAL" as const,
      features: [
        "Full AC",
        "Reclining Seats",
        "Curtains",
        "PA System",
        "Cool Box",
      ],
      pricePerDay: 30000,
      pricePerKm: 75,
      location: "Jaffna",
      condition: "EXCELLENT" as const,
      isAvailable: true,
      isActive: true,
    },
    {
      name: "TATA Starbus Standard",
      description:
        "Economical option for budget-conscious travelers. Well-maintained and reliable for local trips.",
      type: "BUS" as const,
      brand: "TATA",
      model: "Starbus",
      year: 2019,
      color: "Red",
      seats: 54,
      acType: "NON_AC" as const,
      fuelType: "DIESEL" as const,
      transmission: "MANUAL" as const,
      features: ["Fan", "Luggage Rack", "Emergency Exit", "First Aid"],
      pricePerDay: 15000,
      pricePerKm: 45,
      location: "Jaffna",
      condition: "GOOD" as const,
      isAvailable: true,
      isActive: true,
    },
    {
      name: "Mitsubishi Rosa Deluxe",
      description:
        "Premium mini bus with extra legroom. Perfect for VIP transport and small corporate groups.",
      type: "MINI_BUS" as const,
      brand: "Mitsubishi",
      model: "Rosa",
      year: 2023,
      color: "Black",
      seats: 22,
      acType: "FULL_AC" as const,
      fuelType: "DIESEL" as const,
      transmission: "AUTOMATIC" as const,
      features: [
        "Full AC",
        "Leather Seats",
        "Tinted Windows",
        "Mini Fridge",
        "WiFi",
        "TV",
      ],
      pricePerDay: 25000,
      pricePerKm: 65,
      location: "Jaffna",
      condition: "EXCELLENT" as const,
      isAvailable: true,
      isActive: true,
    },
  ];

  for (const vehicleData of owner2VehicleData) {
    const coords = LOCATIONS[vehicleData.location];
    await prisma.vehicle.create({
      data: {
        ownerId: owner2.id,
        name: vehicleData.name,
        description: vehicleData.description,
        type: vehicleData.type,
        brand: vehicleData.brand,
        model: vehicleData.model,
        year: vehicleData.year,
        licensePlate: generateLicensePlate(vehicleIndex++),
        color: vehicleData.color,
        seats: vehicleData.seats,
        acType: vehicleData.acType,
        fuelType: vehicleData.fuelType,
        transmission: vehicleData.transmission,
        features: vehicleData.features,
        images: [],
        pricePerDay: vehicleData.pricePerDay,
        pricePerKm: vehicleData.pricePerKm,
        location: vehicleData.location,
        latitude: coords.latitude,
        longitude: coords.longitude,
        condition: vehicleData.condition,
        isAvailable: vehicleData.isAvailable,
        isActive: vehicleData.isActive,
      },
    });
  }
  console.log(
    `Created ${owner2VehicleData.length} vehicles for ${owner2.firstName} ${owner2.lastName}`,
  );

  // Owner 3 Vehicles (Chaminda - Kandy) - 3 Vehicles
  const owner3VehicleData = [
    {
      name: "Hino RK8J Tourist Coach",
      description:
        "Japanese-built tourist coach with panoramic windows. Ideal for hill country tours and scenic routes.",
      type: "BUS" as const,
      brand: "Hino",
      model: "RK8J",
      year: 2021,
      color: "Green",
      seats: 42,
      acType: "FULL_AC" as const,
      fuelType: "DIESEL" as const,
      transmission: "MANUAL" as const,
      features: [
        "Panoramic Windows",
        "Full AC",
        "Reclining Seats",
        "Tour Guide Mic",
        "Cool Box",
        "USB Charging",
      ],
      pricePerDay: 32000,
      pricePerKm: 80,
      location: "Kandy",
      condition: "EXCELLENT" as const,
      isAvailable: true,
      isActive: true,
    },
    {
      name: "Toyota HiAce Commuter",
      description:
        "Versatile commuter van perfect for small groups exploring Kandy and surrounding areas.",
      type: "VAN" as const,
      brand: "Toyota",
      model: "HiAce",
      year: 2022,
      color: "Silver",
      seats: 14,
      acType: "FULL_AC" as const,
      fuelType: "DIESEL" as const,
      transmission: "AUTOMATIC" as const,
      features: [
        "Full AC",
        "Comfortable Seats",
        "Luggage Space",
        "USB Charging",
      ],
      pricePerDay: 18000,
      pricePerKm: 55,
      location: "Kandy",
      condition: "EXCELLENT" as const,
      isAvailable: true,
      isActive: true,
    },
    {
      name: "Nissan Civilian Pilgrim Bus",
      description:
        "Specially equipped for religious pilgrimages with ample space for offerings and luggage.",
      type: "BUS" as const,
      brand: "Nissan",
      model: "Civilian",
      year: 2020,
      color: "White",
      seats: 30,
      acType: "SEMI_AC" as const,
      fuelType: "DIESEL" as const,
      transmission: "MANUAL" as const,
      features: [
        "Semi AC",
        "Extra Luggage Space",
        "PA System",
        "DVD Player",
        "Curtains",
      ],
      pricePerDay: 20000,
      pricePerKm: 55,
      location: "Kandy",
      condition: "GOOD" as const,
      isAvailable: true,
      isActive: true,
    },
  ];

  for (const vehicleData of owner3VehicleData) {
    const coords = LOCATIONS[vehicleData.location];
    await prisma.vehicle.create({
      data: {
        ownerId: owner3.id,
        name: vehicleData.name,
        description: vehicleData.description,
        type: vehicleData.type,
        brand: vehicleData.brand,
        model: vehicleData.model,
        year: vehicleData.year,
        licensePlate: generateLicensePlate(vehicleIndex++),
        color: vehicleData.color,
        seats: vehicleData.seats,
        acType: vehicleData.acType,
        fuelType: vehicleData.fuelType,
        transmission: vehicleData.transmission,
        features: vehicleData.features,
        images: [],
        pricePerDay: vehicleData.pricePerDay,
        pricePerKm: vehicleData.pricePerKm,
        location: vehicleData.location,
        latitude: coords.latitude,
        longitude: coords.longitude,
        condition: vehicleData.condition,
        isAvailable: vehicleData.isAvailable,
        isActive: vehicleData.isActive,
      },
    });
  }
  console.log(
    `Created ${owner3VehicleData.length} vehicles for ${owner3.firstName} ${owner3.lastName}`,
  );

  // Owner 4 Vehicles (Mohamed Farook - Batticaloa) - 2 Vehicles
  const owner4VehicleData = [
    {
      name: "TATA LP913 Eastern Express",
      description:
        "Reliable bus for Eastern Province travel. Regular service to Colombo and back.",
      type: "BUS" as const,
      brand: "TATA",
      model: "LP913",
      year: 2021,
      color: "Blue",
      seats: 50,
      acType: "SEMI_AC" as const,
      fuelType: "DIESEL" as const,
      transmission: "MANUAL" as const,
      features: [
        "Semi AC",
        "Reclining Seats",
        "Luggage Compartment",
        "Mobile Charging",
      ],
      pricePerDay: 25000,
      pricePerKm: 65,
      location: "Batticaloa",
      condition: "GOOD" as const,
      isAvailable: true,
      isActive: true,
    },
    {
      name: "Isuzu NPR Mini Coach",
      description:
        "Compact coach ideal for local tours and wedding transport in the Eastern region.",
      type: "MINI_BUS" as const,
      brand: "Isuzu",
      model: "NPR",
      year: 2022,
      color: "White",
      seats: 26,
      acType: "FULL_AC" as const,
      fuelType: "DIESEL" as const,
      transmission: "MANUAL" as const,
      features: ["Full AC", "Decorated Interior", "Sound System", "LED Lights"],
      pricePerDay: 20000,
      pricePerKm: 55,
      location: "Batticaloa",
      condition: "EXCELLENT" as const,
      isAvailable: true,
      isActive: true,
    },
  ];

  for (const vehicleData of owner4VehicleData) {
    const coords = LOCATIONS[vehicleData.location];
    await prisma.vehicle.create({
      data: {
        ownerId: owner4.id,
        name: vehicleData.name,
        description: vehicleData.description,
        type: vehicleData.type,
        brand: vehicleData.brand,
        model: vehicleData.model,
        year: vehicleData.year,
        licensePlate: generateLicensePlate(vehicleIndex++),
        color: vehicleData.color,
        seats: vehicleData.seats,
        acType: vehicleData.acType,
        fuelType: vehicleData.fuelType,
        transmission: vehicleData.transmission,
        features: vehicleData.features,
        images: [],
        pricePerDay: vehicleData.pricePerDay,
        pricePerKm: vehicleData.pricePerKm,
        location: vehicleData.location,
        latitude: coords.latitude,
        longitude: coords.longitude,
        condition: vehicleData.condition,
        isAvailable: vehicleData.isAvailable,
        isActive: vehicleData.isActive,
      },
    });
  }
  console.log(
    `Created ${owner4VehicleData.length} vehicles for ${owner4.firstName} ${owner4.lastName}`,
  );

  // Owner 5 Vehicles (Kasun Fernando - Galle, Pending Verification) - 2 Vehicles (inactive)
  const owner5VehicleData = [
    {
      name: "Ashok Leyland Boss Super Luxury",
      description:
        "Brand new super luxury coach with premium amenities. Currently pending verification.",
      type: "BUS" as const,
      brand: "Ashok Leyland",
      model: "Boss",
      year: 2024,
      color: "Pearl White",
      seats: 45,
      acType: "FULL_AC" as const,
      fuelType: "DIESEL" as const,
      transmission: "MANUAL" as const,
      features: [
        "Super AC",
        "Leather Reclining Seats",
        "Personal Screens",
        "WiFi",
        "Refreshments",
        "Toilet",
      ],
      pricePerDay: 45000,
      pricePerKm: 100,
      location: "Galle",
      condition: "EXCELLENT" as const,
      isAvailable: false,
      isActive: false, // Pending verification
    },
    {
      name: "BYD K9 Electric Coach",
      description:
        "Eco-friendly electric bus for sustainable tourism. Zero emissions, quiet operation.",
      type: "BUS" as const,
      brand: "BYD",
      model: "K9",
      year: 2024,
      color: "Green",
      seats: 35,
      acType: "FULL_AC" as const,
      fuelType: "ELECTRIC" as const,
      transmission: "AUTOMATIC" as const,
      features: [
        "Full AC",
        "Zero Emissions",
        "Quiet Ride",
        "USB Charging",
        "WiFi",
        "Large Windows",
      ],
      pricePerDay: 40000,
      pricePerKm: 90,
      location: "Galle",
      condition: "EXCELLENT" as const,
      isAvailable: false,
      isActive: false, // Pending verification
    },
  ];

  for (const vehicleData of owner5VehicleData) {
    const coords = LOCATIONS[vehicleData.location];
    await prisma.vehicle.create({
      data: {
        ownerId: owner5.id,
        name: vehicleData.name,
        description: vehicleData.description,
        type: vehicleData.type,
        brand: vehicleData.brand,
        model: vehicleData.model,
        year: vehicleData.year,
        licensePlate: generateLicensePlate(vehicleIndex++),
        color: vehicleData.color,
        seats: vehicleData.seats,
        acType: vehicleData.acType,
        fuelType: vehicleData.fuelType,
        transmission: vehicleData.transmission,
        features: vehicleData.features,
        images: [],
        pricePerDay: vehicleData.pricePerDay,
        pricePerKm: vehicleData.pricePerKm,
        location: vehicleData.location,
        latitude: coords.latitude,
        longitude: coords.longitude,
        condition: vehicleData.condition,
        isAvailable: vehicleData.isAvailable,
        isActive: vehicleData.isActive,
      },
    });
  }
  console.log(
    `Created ${owner5VehicleData.length} vehicles for ${owner5.firstName} ${owner5.lastName} (Pending)`,
  );

  // ===========================================
  // Create sample bookings for demo data
  // ===========================================
  console.log("Creating sample bookings...\n");

  // Get all vehicles for each owner to create multiple bookings
  const owner1Vehicles = await prisma.vehicle.findMany({
    where: { ownerId: owner1.id },
    take: 3,
  });

  const owner2Vehicles = await prisma.vehicle.findMany({
    where: { ownerId: owner2.id },
    take: 3,
  });

  const owner3Vehicles = await prisma.vehicle.findMany({
    where: { ownerId: owner3.id },
    take: 3,
  });

  const owner4Vehicles = await prisma.vehicle.findMany({
    where: { ownerId: owner4.id },
    take: 2,
  });

  let totalBookings = 0;

  // OWNER 1 BOOKINGS (Nuwan Perera - Colombo)
  if (owner1Vehicles.length > 0) {
    // Confirmed booking - upcoming
    const booking1 = await prisma.booking.create({
      data: {
        customerId: customer1.id,
        vehicleId: owner1Vehicles[0].id,
        startDate: new Date("2026-01-25T06:00:00.000Z"),
        endDate: new Date("2026-01-27T18:00:00.000Z"),
        pickupLocation: "Colombo - Fort Railway Station",
        dropoffLocation: "Nuwara Eliya - Grand Hotel",
        totalPassengers: 40,
        totalAmount: 150000,
        status: "CONFIRMED",
        notes: "Corporate tour with 40 employees",
      },
    });
    await prisma.payment.create({
      data: {
        userId: customer1.id,
        bookingId: booking1.id,
        amount: 150000,
        currency: "LKR",
        status: "COMPLETED",
        method: "Card",
      },
    });
    totalBookings++;

    // Pending booking - awaiting confirmation
    await prisma.booking.create({
      data: {
        customerId: customer2.id,
        vehicleId: owner1Vehicles[1].id,
        startDate: new Date("2026-02-05T08:00:00.000Z"),
        endDate: new Date("2026-02-07T20:00:00.000Z"),
        pickupLocation: "Colombo - Cinnamon Grand Hotel",
        dropoffLocation: "Galle - Lighthouse Hotel",
        totalPassengers: 50,
        totalAmount: 95000,
        status: "PENDING",
        notes: "Wedding party transport",
      },
    });
    totalBookings++;

    // Completed booking - past trip
    const booking3 = await prisma.booking.create({
      data: {
        customerId: customer3.id,
        vehicleId: owner1Vehicles[0].id,
        startDate: new Date("2025-12-15T06:00:00.000Z"),
        endDate: new Date("2025-12-18T18:00:00.000Z"),
        pickupLocation: "Colombo Airport",
        dropoffLocation: "Colombo Airport",
        totalPassengers: 35,
        totalAmount: 120000,
        status: "COMPLETED",
        notes: "Airport shuttle and city tour",
      },
    });
    await prisma.payment.create({
      data: {
        userId: customer3.id,
        bookingId: booking3.id,
        amount: 120000,
        currency: "LKR",
        status: "COMPLETED",
        method: "Card",
      },
    });
    totalBookings++;

    // Cancelled booking
    await prisma.booking.create({
      data: {
        customerId: customer1.id,
        vehicleId: owner1Vehicles[2].id,
        startDate: new Date("2026-01-22T10:00:00.000Z"),
        endDate: new Date("2026-01-22T18:00:00.000Z"),
        pickupLocation: "Colombo - Slave Island",
        dropoffLocation: "Kandy",
        totalPassengers: 25,
        totalAmount: 45000,
        status: "CANCELLED",
        notes: "Customer cancelled due to schedule change",
      },
    });
    totalBookings++;
  }

  // OWNER 2 BOOKINGS (Sivakumar - Jaffna)
  if (owner2Vehicles.length > 0) {
    // Confirmed booking
    const booking5 = await prisma.booking.create({
      data: {
        customerId: customer2.id,
        vehicleId: owner2Vehicles[0].id,
        startDate: new Date("2026-02-10T08:00:00.000Z"),
        endDate: new Date("2026-02-10T18:00:00.000Z"),
        pickupLocation: "Jaffna - Railway Station",
        dropoffLocation: "Nallur Kandaswamy Kovil",
        totalPassengers: 45,
        totalAmount: 35000,
        status: "CONFIRMED",
        notes: "Temple pilgrimage group",
      },
    });
    await prisma.payment.create({
      data: {
        userId: customer2.id,
        bookingId: booking5.id,
        amount: 35000,
        currency: "LKR",
        status: "COMPLETED",
        method: "Card",
      },
    });
    totalBookings++;

    // Pending booking
    await prisma.booking.create({
      data: {
        customerId: customer3.id,
        vehicleId: owner2Vehicles[1].id,
        startDate: new Date("2026-01-28T06:00:00.000Z"),
        endDate: new Date("2026-01-30T20:00:00.000Z"),
        pickupLocation: "Jaffna - City Center",
        dropoffLocation: "Trincomalee Beach",
        totalPassengers: 30,
        totalAmount: 85000,
        status: "PENDING",
        notes: "Family vacation to eastern beaches",
      },
    });
    totalBookings++;

    // Completed booking
    const booking7 = await prisma.booking.create({
      data: {
        customerId: customer1.id,
        vehicleId: owner2Vehicles[0].id,
        startDate: new Date("2026-01-10T08:00:00.000Z"),
        endDate: new Date("2026-01-12T18:00:00.000Z"),
        pickupLocation: "Jaffna",
        dropoffLocation: "Jaffna",
        totalPassengers: 40,
        totalAmount: 75000,
        status: "COMPLETED",
        notes: "Northern heritage tour",
      },
    });
    await prisma.payment.create({
      data: {
        userId: customer1.id,
        bookingId: booking7.id,
        amount: 75000,
        currency: "LKR",
        status: "COMPLETED",
        method: "Card",
      },
    });
    totalBookings++;
  }

  // OWNER 3 BOOKINGS (Chaminda - Kandy)
  if (owner3Vehicles.length > 0) {
    // Confirmed booking
    const booking8 = await prisma.booking.create({
      data: {
        customerId: customer3.id,
        vehicleId: owner3Vehicles[0].id,
        startDate: new Date("2026-01-30T06:00:00.000Z"),
        endDate: new Date("2026-02-01T18:00:00.000Z"),
        pickupLocation: "Kandy - City Center",
        dropoffLocation: "Ella - Railway Station",
        totalPassengers: 38,
        totalAmount: 95000,
        status: "CONFIRMED",
        notes: "Hill country scenic tour",
      },
    });
    await prisma.payment.create({
      data: {
        userId: customer3.id,
        bookingId: booking8.id,
        amount: 95000,
        currency: "LKR",
        status: "COMPLETED",
        method: "Card",
      },
    });
    totalBookings++;

    // Completed booking
    const booking9 = await prisma.booking.create({
      data: {
        customerId: customer2.id,
        vehicleId: owner3Vehicles[1].id,
        startDate: new Date("2025-12-20T06:00:00.000Z"),
        endDate: new Date("2025-12-22T20:00:00.000Z"),
        pickupLocation: "Kandy - Temple of the Tooth",
        dropoffLocation: "Nuwara Eliya - Victoria Park",
        totalPassengers: 12,
        totalAmount: 65000,
        status: "COMPLETED",
        notes: "Year-end family trip",
      },
    });
    await prisma.payment.create({
      data: {
        userId: customer2.id,
        bookingId: booking9.id,
        amount: 65000,
        currency: "LKR",
        status: "COMPLETED",
        method: "Card",
      },
    });
    totalBookings++;

    // Ongoing booking - currently in progress
    await prisma.booking.create({
      data: {
        customerId: customer1.id,
        vehicleId: owner3Vehicles[2].id,
        startDate: new Date("2026-01-19T06:00:00.000Z"),
        endDate: new Date("2026-01-21T18:00:00.000Z"),
        pickupLocation: "Kandy",
        dropoffLocation: "Sigiriya",
        totalPassengers: 28,
        totalAmount: 55000,
        status: "ONGOING",
        notes: "Cultural triangle tour",
      },
    });
    totalBookings++;
  }

  // OWNER 4 BOOKINGS (Mohamed Farook - Batticaloa)
  if (owner4Vehicles.length > 0) {
    // Confirmed booking
    const booking11 = await prisma.booking.create({
      data: {
        customerId: customer1.id,
        vehicleId: owner4Vehicles[0].id,
        startDate: new Date("2026-02-15T06:00:00.000Z"),
        endDate: new Date("2026-02-17T18:00:00.000Z"),
        pickupLocation: "Batticaloa - Bus Stand",
        dropoffLocation: "Colombo - Fort",
        totalPassengers: 48,
        totalAmount: 70000,
        status: "CONFIRMED",
        notes: "Business trip to Colombo",
      },
    });
    await prisma.payment.create({
      data: {
        userId: customer1.id,
        bookingId: booking11.id,
        amount: 70000,
        currency: "LKR",
        status: "COMPLETED",
        method: "Card",
      },
    });
    totalBookings++;

    // Completed booking
    const booking12 = await prisma.booking.create({
      data: {
        customerId: customer3.id,
        vehicleId: owner4Vehicles[1].id,
        startDate: new Date("2026-01-05T08:00:00.000Z"),
        endDate: new Date("2026-01-07T18:00:00.000Z"),
        pickupLocation: "Batticaloa",
        dropoffLocation: "Arugam Bay",
        totalPassengers: 20,
        totalAmount: 45000,
        status: "COMPLETED",
        notes: "Surfing trip",
      },
    });
    await prisma.payment.create({
      data: {
        userId: customer3.id,
        bookingId: booking12.id,
        amount: 45000,
        currency: "LKR",
        status: "COMPLETED",
        method: "Card",
      },
    });
    totalBookings++;
  }

  console.log(`Created ${totalBookings} bookings across all owners\n`);

  const totalVehicles =
    owner1VehicleData.length +
    owner2VehicleData.length +
    owner3VehicleData.length +
    owner4VehicleData.length +
    owner5VehicleData.length;

  // ===========================================
  // Summary
  // ===========================================
  console.log("\n" + "=".repeat(60));
  console.log("Sri Lankan TraveNest Database Seed Completed!");
  console.log("=".repeat(60));
  console.log("\nSummary:");
  console.log(`   • Admin users: 1`);
  console.log(`   • Bus owners: ${owners.length}`);
  console.log(`   • Customers: 3`);
  console.log(`   • Total vehicles: ${totalVehicles}`);
  console.log(`   • Total bookings: ${totalBookings}`);
  console.log("\nLogin Credentials:");
  console.log("   Admin:    admin@travenest.lk / admin@123");
  console.log("   Owner 1:  nuwan.perera@gmail.com / owner@123");
  console.log("   Owner 2:  siva.kumar@yahoo.com / owner@123");
  console.log("   Owner 3:  chaminda.silva@hotmail.com / owner@123");
  console.log("   Owner 4:  mohamed.farook@gmail.com / owner@123");
  console.log("   Owner 5:  kasun.fernando@outlook.com / owner@123 (Pending)");
  console.log("   Customer: dilshan.jayawardena@gmail.com / customer@123");
  console.log("=".repeat(60) + "\n");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
