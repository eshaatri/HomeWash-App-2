import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../models/Category";
import SubCategory from "../models/SubCategory";
import Service from "../models/Service";
import User, { UserRole } from "../models/User";
import Booking from "../models/Booking";
import Vendor from "../models/Vendor";
import Area from "../models/Area";

dotenv.config();

const CATEGORIES = [
  {
    originalId: "c1",
    name: "Home Cleaning",
    icon: "cleaning_services",
    color: "from-blue-400 to-blue-500",
  },
  {
    originalId: "c2",
    name: "Bathroom Cleaning",
    icon: "bathroom",
    color: "from-violet-400 to-violet-500",
  },
  {
    originalId: "c3",
    name: "Kitchen Cleaning",
    icon: "kitchen",
    color: "from-rose-400 to-rose-500",
  },
  {
    originalId: "c4",
    name: "Water Tank Cleaning",
    icon: "water_drop",
    color: "from-cyan-400 to-cyan-500",
  },
  {
    originalId: "c5",
    name: "Sofa Cleaning",
    icon: "weekend",
    color: "from-amber-300 to-amber-500",
  },
  {
    originalId: "c6",
    name: "Car Wash",
    icon: "local_car_wash",
    color: "from-indigo-300 to-indigo-500",
  },
];

const SUB_CATEGORIES_RAW = {
  c1: {
    sections: [
      {
        title: "Select Property Type",
        items: [
          {
            originalId: "furnished_apartment",
            name: "Furnished Apartment",
            icon: "apartment",
            color: "bg-blue-50 text-blue-600",
            image:
              "https://images.unsplash.com/photo-1502005229762-cf1e253c96bd?q=80&w=200&auto=format&fit=crop",
          },
          {
            originalId: "unfurnished_apartment",
            name: "Unfurnished Apartment",
            icon: "home_work",
            color: "bg-orange-50 text-orange-600",
            image:
              "https://images.unsplash.com/photo-1560416313-2d126435f308?auto=format&fit=crop&q=80&w=200",
          },
          {
            originalId: "bungalow",
            name: "Bungalow / Duplex",
            icon: "cottage",
            color: "bg-orange-50 text-orange-600",
          },
          {
            originalId: "room",
            name: "Book by room",
            icon: "meeting_room",
            color: "bg-purple-50 text-purple-600",
          },
          {
            originalId: "mini",
            name: "Mini Services",
            icon: "cleaning_services",
            color: "bg-green-50 text-green-600",
          },
        ],
      },
    ],
  },
  c2: {
    sections: [
      {
        title: "Select Service Type",
        items: [
          {
            originalId: "intense",
            name: "Intense Cleaning",
            icon: "cleaning_services",
            color: "bg-orange-50 text-orange-600",
          },
        ],
      },
    ],
  },
  c3: {
    sections: [
      {
        title: "Select Service Type",
        items: [
          {
            originalId: "complete",
            name: "Complete Kitchen Cleaning",
            icon: "countertops",
            color: "bg-orange-50 text-orange-600",
          },
          {
            originalId: "mini",
            name: "Mini Services",
            icon: "cleaning_services",
            color: "bg-green-50 text-green-600",
          },
        ],
      },
    ],
  },
  c4: {
    sections: [
      {
        title: "Select Tank Type",
        items: [
          {
            originalId: "plastic_tank",
            name: "Plastic Tank",
            icon: "water_bottle",
            color: "bg-cyan-50 text-cyan-600",
          },
          {
            originalId: "cemented_tank",
            name: "Cemented/Underground",
            icon: "architecture",
            color: "bg-gray-50 text-gray-600",
          },
        ],
      },
    ],
  },
  c5: {
    sections: [
      {
        title: "Select Item",
        items: [
          {
            originalId: "sofa",
            name: "Sofa",
            icon: "weekend",
            color: "from-amber-300 to-amber-500",
          },
          {
            originalId: "carpet",
            name: "Carpet",
            icon: "texture",
            color: "bg-orange-50 text-orange-600",
          },
          {
            originalId: "mattress",
            name: "Mattress",
            icon: "bed",
            color: "bg-blue-50 text-blue-600",
          },
          {
            originalId: "blinds",
            name: "Blinds",
            icon: "blinds",
            color: "bg-purple-50 text-purple-600",
          },
          {
            originalId: "chair",
            name: "Chair",
            icon: "chair",
            color: "bg-green-50 text-green-600",
          },
          {
            originalId: "mini",
            name: "Mini Services",
            icon: "cleaning_services",
            color: "bg-teal-50 text-teal-600",
          },
        ],
      },
    ],
  },
  c6: {
    sections: [
      {
        title: "Select Wash Type",
        items: [
          {
            originalId: "interior",
            name: "Interior deep clean",
            icon: "airline_seat_recline_extra",
            color: "bg-indigo-50 text-indigo-600",
          },
          {
            originalId: "exterior",
            name: "Complete car wash",
            icon: "local_car_wash",
            color: "bg-cyan-50 text-cyan-600",
          },
        ],
      },
    ],
  },
};

const SERVICES_RAW = [
  // Home Cleaning -> Furnished Apartment
  {
    title: "1 BHK",
    categoryId: "c1",
    subCategoryId: "furnished_apartment",
    price: 3499,
    originalPrice: 3999,
    duration: "4 hrs",
    description: "Deep cleaning for 1 BHK Furnished Apartment.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD5c6hvQ269iGoWpfvLQDj7bmbtgQqliAJq7BfBgfU8BHSZcE672IWwFIUyJwLcXTmRxl-d_6CJGFY8mrBW_yYweVNb0Z8pwQMyLnSDTo0OkDBx3H2C6kv7t6i8CmM--y6OgboO4_hRAVdAPLhRcmW5Iwf_tTuBbeplYcIo5l2upmHCwrLpjiX4GjFVevtkalgAkoM7Zmx65Lz5m_wtRsf-iJCLDXu9twEi1DRlqL1TtgrE-tHdbGkjNlYM0C2O5h4WFVNfyD4uPNY",
    bestseller: true,
  },
  {
    title: "2 BHK",
    categoryId: "c1",
    subCategoryId: "furnished_apartment",
    price: 3899,
    originalPrice: 4499,
    duration: "5 hrs",
    description: "Deep cleaning for 2 BHK Furnished Apartment.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD5c6hvQ269iGoWpfvLQDj7bmbtgQqliAJq7BfBgfU8BHSZcE672IWwFIUyJwLcXTmRxl-d_6CJGFY8mrBW_yYweVNb0Z8pwQMyLnSDTo0OkDBx3H2C6kv7t6i8CmM--y6OgboO4_hRAVdAPLhRcmW5Iwf_tTuBbeplYcIo5l2upmHCwrLpjiX4GjFVevtkalgAkoM7Zmx65Lz5m_wtRsf-iJCLDXu9twEi1DRlqL1TtgrE-tHdbGkjNlYM0C2O5h4WFVNfyD4uPNY",
  },
  {
    title: "3 BHK",
    categoryId: "c1",
    subCategoryId: "furnished_apartment",
    price: 4799,
    originalPrice: 5399,
    duration: "6 hrs",
    description: "Deep cleaning for 3 BHK Furnished Apartment.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD5c6hvQ269iGoWpfvLQDj7bmbtgQqliAJq7BfBgfU8BHSZcE672IWwFIUyJwLcXTmRxl-d_6CJGFY8mrBW_yYweVNb0Z8pwQMyLnSDTo0OkDBx3H2C6kv7t6i8CmM--y6OgboO4_hRAVdAPLhRcmW5Iwf_tTuBbeplYcIo5l2upmHCwrLpjiX4GjFVevtkalgAkoM7Zmx65Lz5m_wtRsf-iJCLDXu9twEi1DRlqL1TtgrE-tHdbGkjNlYM0C2O5h4WFVNfyD4uPNY",
  },

  // Home Cleaning -> Unfurnished
  {
    title: "Unfurnished Apartment Cleaning",
    categoryId: "c1",
    subCategoryId: "unfurnished_apartment",
    price: 3199,
    duration: "3 hrs",
    description:
      "Empty space cleaning focusing on deep floors and wall dusting.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDhMOlSsEXRDt3sDDyty-vRXWr9jTMfio4HeOZi-wMf023A4X41bpDbxNoMTChDF3Q7UsnfNjf4uO9K3KvdwtLVUq9OsiWgG827dJOoZ8asEZ3pr14pe72BEq5VkZ82epmnm4AUhIuDiL6TM_ev5YD5WhGGC2EWBxbosU6TMvisuWQs2qtTKt-f2FcexXRiQUbbC0IAy9oUDhO3H4gH-aDNn_C25obcofREoGJcAnmog7P2vfTgtxgrAvoJ1XCfM1K14feVlYB71eo",
  },

  // Bathroom Cleaning -> Intense
  {
    title: "Intense bathroom cleaning",
    categoryId: "c2",
    subCategoryId: "intense",
    price: 499,
    duration: "45 mins",
    description: "Deep cleaning for tough stains",
    bestseller: true,
    image:
      "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=300",
  },

  // Kitchen Cleaning -> Complete
  {
    title: "Occupied kitchen cleaning",
    categoryId: "c3",
    subCategoryId: "complete",
    price: 1999,
    duration: "2.5 hrs",
    description:
      "Deep cleaning of kitchen while in use. Includes appliance cleaning.",
    bestseller: true,
    image:
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=300",
  },
  {
    title: "Unoccupied kitchen cleaning",
    categoryId: "c3",
    subCategoryId: "complete",
    price: 1499,
    duration: "2 hrs",
    description: "Deep cleaning of empty kitchen (move-in/move-out).",
    image:
      "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&q=80&w=300",
  },

  // Car Wash -> Interior
  {
    title: "Interior deep clean",
    categoryId: "c6",
    subCategoryId: "interior",
    price: 1299,
    duration: "2 hrs",
    description: "Complete interior detailing with vacuuming and shampooing.",
    image:
      "https://images.unsplash.com/photo-1552930294-6b595f4c2974?auto=format&fit=crop&q=80&w=300",
  },
];

const seed = async () => {
  try {
    console.log("Starting seed process...");
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/homewash";
    console.log(`Connecting to MongoDB at: ${uri}`);
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    console.log("Cleaning collections...");
    await Category.deleteMany({});
    await SubCategory.deleteMany({});
    await Service.deleteMany({});
    await User.deleteMany({});
    await Booking.deleteMany({});
    await Vendor.deleteMany({});
    await Area.deleteMany({});

    console.log("Seeding areas...");
    const createdAreas = await Area.insertMany([
      { name: "Bandra", city: "Mumbai", zipCodes: ["400050"], isActive: true },
      { name: "Andheri", city: "Mumbai", zipCodes: ["400053"], isActive: true },
      { name: "Powai", city: "Mumbai", zipCodes: ["400076"], isActive: true },
    ]);

    console.log("Seeding categories...");
    const createdCategories = await Category.insertMany(
      CATEGORIES.map((c) => ({
        name: c.name,
        icon: c.icon,
        color: c.color,
      })),
    );

    const categoryMap: Record<string, string> = {};
    createdCategories.forEach((cat, index) => {
      categoryMap[CATEGORIES[index].originalId] = (
        cat._id as unknown as string
      ).toString();
    });

    console.log("Seeding subcategories...");
    const subCategoriesToInsert: any[] = [];
    Object.entries(SUB_CATEGORIES_RAW).forEach(([catId, data]) => {
      const dbCatId = categoryMap[catId];
      data.sections.forEach((section) => {
        section.items.forEach((item: any) => {
          subCategoriesToInsert.push({
            name: item.name,
            categoryId: dbCatId,
            sectionTitle: section.title,
            icon: item.icon,
            color: item.color,
            image: item.image,
            originalId: item.originalId,
          });
        });
      });
    });
    await SubCategory.insertMany(subCategoriesToInsert);

    console.log("Seeding services...");
    const servicesToInsert = SERVICES_RAW.map((s) => ({
      title: s.title,
      price: s.price,
      originalPrice: (s as any).originalPrice,
      duration: s.duration,
      description: s.description,
      image: s.image,
      bestseller: s.bestseller || false,
      categoryId: categoryMap[s.categoryId],
      subCategoryId: s.subCategoryId,
      rating: 4.8,
      reviewCount: 1000,
    }));
    await Service.insertMany(servicesToInsert);

    console.log("Seeding demo user and partners...");
    await User.create({
      name: "Demo Customer",
      phone: "+91 98765 43210",
      role: UserRole.CUSTOMER,
      walletBalance: 2500.0,
      email: "customer@example.com",
    });

    const demoPartners = [
      {
        name: "Mumbai Partner",
        phone: "+91 90000 00001",
        role: UserRole.PARTNER,
        city: "Mumbai",
        serviceArea: "Bandra",
        isVerified: true,
        rating: 4.8,
      },
      {
        name: "Pune Partner",
        phone: "+91 90000 00002",
        role: UserRole.PARTNER,
        city: "Pune",
        serviceArea: "Conditioned Area",
        isVerified: true,
        rating: 4.7,
      },
      {
        name: "Lucknow Partner",
        phone: "+91 90000 00003",
        role: UserRole.PARTNER,
        city: "Lucknow",
        serviceArea: "Hazratganj",
        isVerified: true,
        rating: 4.9,
      },
    ];
    await User.insertMany(demoPartners);

    console.log("Seeding vendors...");
    await Vendor.create([
      {
        name: "Luxury Cleaners PVT LTD",
        ownerName: "Rajesh Sharma",
        email: "rajesh@luxury.com",
        phone: "9876543210",
        address: "Bandra West, Mumbai",
        activeAreas: ["Bandra", "Andheri"],
        isActive: true,
        commissionRate: 15,
      },
      {
        name: "HomeWash Experts",
        ownerName: "Suresh Gupta",
        email: "suresh@homewash.com",
        phone: "9123456789",
        address: "Powai, Mumbai",
        activeAreas: ["Powai"],
        isActive: true,
        commissionRate: 20,
      },
    ]);

    console.log("Seed successful!");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
};

seed();
