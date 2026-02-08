import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../models/Category";
import Service from "../models/Service";
import User, { UserRole } from "../models/User";
import Booking from "../models/Booking";

dotenv.config();

const MOCK_CATEGORIES = [
  {
    name: "Home Cleaning",
    icon: "cleaning_services",
    color: "from-blue-400 to-blue-500",
  },
  {
    name: "Bathroom Cleaning",
    icon: "bathroom",
    color: "from-violet-400 to-violet-500",
  },
  {
    name: "Kitchen Cleaning",
    icon: "kitchen",
    color: "from-rose-400 to-rose-500",
  },
  {
    name: "Water Tank Cleaning",
    icon: "water_drop",
    color: "from-cyan-400 to-cyan-500",
  },
  {
    name: "Sofa Cleaning",
    icon: "weekend",
    color: "from-amber-300 to-amber-500",
  },
  {
    name: "Car Wash",
    icon: "local_car_wash",
    color: "from-indigo-300 to-indigo-500",
  },
];

const MOCK_SERVICES = [
  {
    title: "Furnished Apartment",
    price: 3499,
    originalPrice: 3999,
    duration: "3 hrs 45 mins",
    description: "Complete top-to-bottom restoration for your furnished space.",
    rating: 4.82,
    reviewCount: 380000,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD5c6hvQ269iGoWpfvLQDj7bmbtgQqliAJq7BfBgfU8BHSZcE672IWwFIUyJwLcXTmRxl-d_6CJGFY8mrBW_yYweVNb0Z8pwQMyLnSDTo0OkDBx3H2C6kv7t6i8CmM--y6OgboO4_hRAVdAPLhRcmW5Iwf_tTuBbeplYcIo5l2upmHCwrLpjiX4GjFVevtkalgAkoM7Zmx65Lz5m_wtRsf-iJCLDXu9twEi1DRlqL1TtgrE-tHdbGkjNlYM0C2O5h4WFVNfyD4uPNY",
    bestseller: true,
    categoryName: "Home Cleaning",
    subCategoryId: "apartment",
  },
  {
    title: "Unfurnished Apartment",
    price: 3199,
    duration: "3 hrs",
    description:
      "Empty space cleaning focusing on deep floors and wall dusting.",
    rating: 4.82,
    reviewCount: 176000,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDhMOlSsEXRDt3sDDyty-vRXWr9jTMfio4HeOZi-wMf023A4X41bpDbxNoMTChDF3Q7UsnfNjf4uO9K3KvdwtLVUq9OsiWgG827dJOoZ8asEZ3pr14pe72BEq5VkZ82epmnm4AUhIuDiL6TM_ev5YD5WhGGC2EWBxbosU6TMvisuWQs2qtTKt-f2FcexXRiQUbbC0IAy9oUDhO3H4gH-aDNn_C25obcofREoGJcAnmog7P2vfTgtxgrAvoJ1XCfM1K14feVlYB71eo",
    categoryName: "Home Cleaning",
    subCategoryId: "apartment",
  },
  {
    title: "Intense bathroom cleaning",
    price: 499,
    duration: "45 mins",
    description: "Deep cleaning for tough stains",
    rating: 4.8,
    reviewCount: 4300000,
    bestseller: true,
    image:
      "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=300",
    categoryName: "Bathroom Cleaning",
    subCategoryId: "intense",
  },
];

const seed = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/homewash",
    );

    await Category.deleteMany({});
    await Service.deleteMany({});
    await User.deleteMany({});
    await Booking.deleteMany({});

    const createdCategories = await Category.insertMany(MOCK_CATEGORIES);
    console.log("Categories seeded");

    const servicesWithIds = MOCK_SERVICES.map((service) => {
      const cat = createdCategories.find(
        (c) => c.name === service.categoryName,
      );
      return {
        title: service.title,
        price: service.price,
        originalPrice: service.originalPrice,
        duration: service.duration,
        description: service.description,
        rating: service.rating,
        reviewCount: service.reviewCount,
        image: service.image,
        bestseller: service.bestseller,
        categoryId: cat?._id,
        subCategoryId: service.subCategoryId,
      };
    });
    await Service.insertMany(servicesWithIds);
    console.log("Services seeded");

    await User.create({
      name: "Arjun Mehta",
      phone: "+91 98765 43210",
      role: UserRole.CUSTOMER,
      walletBalance: 2500.0,
    });
    await User.create({
      name: "Rajesh Kumar",
      phone: "+91 99887 76655",
      role: UserRole.PARTNER,
      walletBalance: 4500.5,
      rating: 4.9,
      isVerified: true,
      earningsToday: 2124.5,
    });
    console.log("Users seeded");

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();
