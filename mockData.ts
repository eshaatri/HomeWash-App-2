import {
  Booking,
  BookingStatus,
  Service,
  ServiceCategory,
  User,
  UserRole,
} from "./types";

export const MOCK_USER: User = {
  id: "u1",
  name: "Arjun Mehta",
  phone: "+91 98765 43210",
  role: UserRole.CUSTOMER,
  walletBalance: 2500.0,
};

export const MOCK_PARTNER: User = {
  id: "pa1",
  name: "Clean Home Services",
  phone: "+91 99999 00000",
  role: UserRole.PARTNER,
  walletBalance: 12500.0,
  rating: 4.8,
  isVerified: true,
  earningsToday: 5420.0,
};

export const MOCK_PROFESSIONAL: User = {
  id: "p1",
  name: "Rajesh Kumar",
  phone: "+91 99887 76655",
  role: UserRole.PROFESSIONAL,
  walletBalance: 4500.5,
  rating: 4.9,
  isVerified: true,
  earningsToday: 2124.5,
};

export const CATEGORIES: ServiceCategory[] = [
  {
    id: "c1",
    name: "Home Cleaning",
    icon: "cleaning_services",
    color: "from-blue-400 to-blue-500",
  },
  {
    id: "c2",
    name: "Bathroom Cleaning",
    icon: "bathroom",
    color: "from-violet-400 to-violet-500",
  },
  {
    id: "c3",
    name: "Kitchen Cleaning",
    icon: "kitchen",
    color: "from-rose-400 to-rose-500",
  },
  {
    id: "c4",
    name: "Water Tank Cleaning",
    icon: "water_drop",
    color: "from-cyan-400 to-cyan-500",
  },
  {
    id: "c5",
    name: "Sofa Cleaning",
    icon: "weekend",
    color: "from-amber-300 to-amber-500",
  },
  {
    id: "c6",
    name: "Car Wash",
    icon: "local_car_wash",
    color: "from-indigo-300 to-indigo-500",
  },
];

export interface ExtendedService extends Service {
  inclusions?: string[];
  reviews?: string;
  subCategoryId?: string;
}

export const SUB_CATEGORIES_DB: Record<
  string,
  { title: string; sections: { title: string; items: any[] }[] }
> = {
  c1: {
    title: "Home Cleaning",
    sections: [
      {
        title: "Select Property Type",
        items: [
          {
            id: "furnished_apartment",
            name: "Furnished Apartment",
            icon: "apartment",
            color: "bg-blue-50 text-blue-600",
            image:
              "https://images.unsplash.com/photo-1502005229762-cf1e253c96bd?q=80&w=200&auto=format&fit=crop",
          },
          {
            id: "unfurnished_apartment",
            name: "Unfurnished Apartment",
            icon: "home_work",
            color: "bg-orange-50 text-orange-600",
            image:
              "https://images.unsplash.com/photo-1560416313-2d126435f308?auto=format&fit=crop&q=80&w=200",
          },
          {
            id: "bungalow",
            name: "Bungalow / Duplex",
            icon: "cottage",
            color: "bg-orange-50 text-orange-600",
          },
          {
            id: "room",
            name: "Book by room",
            icon: "meeting_room",
            color: "bg-purple-50 text-purple-600",
          },
          {
            id: "mini",
            name: "Mini Services",
            icon: "cleaning_services",
            color: "bg-green-50 text-green-600",
          },
        ],
      },
    ],
  },
  c2: {
    title: "Bathroom Cleaning",
    sections: [
      {
        title: "Select Service Type",
        items: [
          {
            id: "intense",
            name: "Intense Cleaning",
            icon: "cleaning_services",
            color: "bg-orange-50 text-orange-600",
          },
        ],
      },
    ],
  },
  c3: {
    title: "Kitchen Cleaning",
    sections: [
      {
        title: "Select Service Type",
        items: [
          {
            id: "complete",
            name: "Complete Kitchen Cleaning",
            icon: "countertops",
            color: "bg-orange-50 text-orange-600",
          },
          {
            id: "mini",
            name: "Mini Services",
            icon: "cleaning_services",
            color: "bg-green-50 text-green-600",
          },
        ],
      },
    ],
  },
  c4: {
    title: "Water Tank Cleaning",
    sections: [
      {
        title: "Select Tank Type",
        items: [
          {
            id: "plastic_tank",
            name: "Plastic Tank",
            icon: "water_bottle",
            color: "bg-cyan-50 text-cyan-600",
          },
          {
            id: "cemented_tank",
            name: "Cemented/Underground",
            icon: "architecture",
            color: "bg-gray-50 text-gray-600",
          },
        ],
      },
    ],
  },
  c5: {
    title: "Sofa Cleaning",
    sections: [
      {
        title: "Select Item",
        items: [
          {
            id: "sofa",
            name: "Sofa",
            icon: "weekend",
            color: "from-amber-300 to-amber-500",
          },
          {
            id: "carpet",
            name: "Carpet",
            icon: "texture",
            color: "bg-orange-50 text-orange-600",
          },
          {
            id: "mattress",
            name: "Mattress",
            icon: "bed",
            color: "bg-blue-50 text-blue-600",
          },
          {
            id: "blinds",
            name: "Blinds",
            icon: "blinds",
            color: "bg-purple-50 text-purple-600",
          },
          {
            id: "chair",
            name: "Chair",
            icon: "chair",
            color: "bg-green-50 text-green-600",
          },
          {
            id: "mini",
            name: "Mini Services",
            icon: "cleaning_services",
            color: "bg-teal-50 text-teal-600",
          },
        ],
      },
    ],
  },
  c6: {
    title: "Car Wash",
    sections: [
      {
        title: "Select Wash Type",
        items: [
          {
            id: "interior",
            name: "Interior deep clean",
            icon: "airline_seat_recline_extra",
            color: "bg-indigo-50 text-indigo-600",
          },
          {
            id: "exterior",
            name: "Complete car wash",
            icon: "local_car_wash",
            color: "bg-cyan-50 text-cyan-600",
          },
        ],
      },
    ],
  },
};

export const SERVICES: ExtendedService[] = [
  // Furnished Apartment Services
  {
    id: "s1_1bhk",
    title: "1 BHK",
    categoryId: "c1",
    subCategoryId: "furnished_apartment",
    price: 3499,
    originalPrice: 3999,
    duration: "4 hrs",
    description: "Deep cleaning for 1 BHK Furnished Apartment.",
    rating: 4.82,
    reviews: "380K reviews",
    reviewCount: 380000,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD5c6hvQ269iGoWpfvLQDj7bmbtgQqliAJq7BfBgfU8BHSZcE672IWwFIUyJwLcXTmRxl-d_6CJGFY8mrBW_yYweVNb0Z8pwQMyLnSDTo0OkDBx3H2C6kv7t6i8CmM--y6OgboO4_hRAVdAPLhRcmW5Iwf_tTuBbeplYcIo5l2upmHCwrLpjiX4GjFVevtkalgAkoM7Zmx65Lz5m_wtRsf-iJCLDXu9twEi1DRlqL1TtgrE-tHdbGkjNlYM0C2O5h4WFVNfyD4uPNY",
    bestseller: true,
    inclusions: [
      "Cleaning & stain removal from rooms, kitchen, bathroom & balcony",
      "Machine floor scrubbing & dusting of walls & ceilings",
    ],
  },
  {
    id: "s1_2bhk",
    title: "2 BHK",
    categoryId: "c1",
    subCategoryId: "furnished_apartment",
    price: 3899,
    originalPrice: 4499,
    duration: "5 hrs",
    description: "Deep cleaning for 2 BHK Furnished Apartment.",
    rating: 4.82,
    reviews: "380K reviews",
    reviewCount: 380000,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD5c6hvQ269iGoWpfvLQDj7bmbtgQqliAJq7BfBgfU8BHSZcE672IWwFIUyJwLcXTmRxl-d_6CJGFY8mrBW_yYweVNb0Z8pwQMyLnSDTo0OkDBx3H2C6kv7t6i8CmM--y6OgboO4_hRAVdAPLhRcmW5Iwf_tTuBbeplYcIo5l2upmHCwrLpjiX4GjFVevtkalgAkoM7Zmx65Lz5m_wtRsf-iJCLDXu9twEi1DRlqL1TtgrE-tHdbGkjNlYM0C2O5h4WFVNfyD4uPNY",
    inclusions: [
      "Cleaning & stain removal from rooms, kitchen, bathroom & balcony",
      "Machine floor scrubbing & dusting of walls & ceilings",
    ],
  },
  {
    id: "s1_3bhk",
    title: "3 BHK",
    categoryId: "c1",
    subCategoryId: "furnished_apartment",
    price: 4799,
    originalPrice: 5399,
    duration: "6 hrs",
    description: "Deep cleaning for 3 BHK Furnished Apartment.",
    rating: 4.82,
    reviews: "380K reviews",
    reviewCount: 380000,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD5c6hvQ269iGoWpfvLQDj7bmbtgQqliAJq7BfBgfU8BHSZcE672IWwFIUyJwLcXTmRxl-d_6CJGFY8mrBW_yYweVNb0Z8pwQMyLnSDTo0OkDBx3H2C6kv7t6i8CmM--y6OgboO4_hRAVdAPLhRcmW5Iwf_tTuBbeplYcIo5l2upmHCwrLpjiX4GjFVevtkalgAkoM7Zmx65Lz5m_wtRsf-iJCLDXu9twEi1DRlqL1TtgrE-tHdbGkjNlYM0C2O5h4WFVNfyD4uPNY",
    inclusions: [
      "Cleaning & stain removal from rooms, kitchen, bathroom & balcony",
      "Machine floor scrubbing & dusting of walls & ceilings",
    ],
  },
  {
    id: "s1_4bhk",
    title: "4 BHK",
    categoryId: "c1",
    subCategoryId: "furnished_apartment",
    price: 5699,
    originalPrice: 6299,
    duration: "7 hrs",
    description: "Deep cleaning for 4 BHK Furnished Apartment.",
    rating: 4.82,
    reviews: "380K reviews",
    reviewCount: 380000,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD5c6hvQ269iGoWpfvLQDj7bmbtgQqliAJq7BfBgfU8BHSZcE672IWwFIUyJwLcXTmRxl-d_6CJGFY8mrBW_yYweVNb0Z8pwQMyLnSDTo0OkDBx3H2C6kv7t6i8CmM--y6OgboO4_hRAVdAPLhRcmW5Iwf_tTuBbeplYcIo5l2upmHCwrLpjiX4GjFVevtkalgAkoM7Zmx65Lz5m_wtRsf-iJCLDXu9twEi1DRlqL1TtgrE-tHdbGkjNlYM0C2O5h4WFVNfyD4uPNY",
    inclusions: [
      "Cleaning & stain removal from rooms, kitchen, bathroom & balcony",
      "Machine floor scrubbing & dusting of walls & ceilings",
    ],
  },
  {
    id: "s1_5bhk",
    title: "5 BHK",
    categoryId: "c1",
    subCategoryId: "furnished_apartment",
    price: 6599,
    originalPrice: 7199,
    duration: "8 hrs",
    description: "Deep cleaning for 5 BHK Furnished Apartment.",
    rating: 4.82,
    reviews: "380K reviews",
    reviewCount: 380000,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD5c6hvQ269iGoWpfvLQDj7bmbtgQqliAJq7BfBgfU8BHSZcE672IWwFIUyJwLcXTmRxl-d_6CJGFY8mrBW_yYweVNb0Z8pwQMyLnSDTo0OkDBx3H2C6kv7t6i8CmM--y6OgboO4_hRAVdAPLhRcmW5Iwf_tTuBbeplYcIo5l2upmHCwrLpjiX4GjFVevtkalgAkoM7Zmx65Lz5m_wtRsf-iJCLDXu9twEi1DRlqL1TtgrE-tHdbGkjNlYM0C2O5h4WFVNfyD4uPNY",
    inclusions: [
      "Cleaning & stain removal from rooms, kitchen, bathroom & balcony",
      "Machine floor scrubbing & dusting of walls & ceilings",
    ],
  },
  // Unfurnished Apartment Services
  {
    id: "s1_un_service",
    title: "Unfurnished Apartment Cleaning",
    categoryId: "c1",
    subCategoryId: "unfurnished_apartment",
    price: 3199,
    duration: "3 hrs",
    description:
      "Empty space cleaning focusing on deep floors and wall dusting.",
    rating: 4.82,
    reviews: "176K reviews",
    reviewCount: 176000,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDhMOlSsEXRDt3sDDyty-vRXWr9jTMfio4HeOZi-wMf023A4X41bpDbxNoMTChDF3Q7UsnfNjf4uO9K3KvdwtLVUq9OsiWgG827dJOoZ8asEZ3pr14pe72BEq5VkZ82epmnm4AUhIuDiL6TM_ev5YD5WhGGC2EWBxbosU6TMvisuWQs2qtTKt-f2FcexXRiQUbbC0IAy9oUDhO3H4gH-aDNn_C25obcofREoGJcAnmog7P2vfTgtxgrAvoJ1XCfM1K14feVlYB71eo",
    inclusions: [
      "Cleaning & stain removal from floors and skirting",
      "Dry vacuuming of walls and ceiling",
    ],
  },
  {
    id: "s2_bun",
    title: "Bungalow Deep Clean",
    categoryId: "c1",
    subCategoryId: "bungalow",
    price: 5499,
    duration: "6 hrs",
    description: "Specialized cleaning for large multi-story homes.",
    rating: 4.9,
    reviews: "12K reviews",
    reviewCount: 12000,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBQyKII_vIaYbueglrCgh8F-6OF2PmOkj_bk4X1NuaRUaG6y4NFTB8zkvoUBZifEDIflhH_vZTPVTbUi9ppddj_PADLZ0Il4Vsmr9H9nVcoY0k-neYBhDNDzKMHL24IdQyDdjbg9z_AA9ueRIAis-0JpNbTycooHUHFjvfvfW12Ph2DWiEhKPP_W2nkZpSEYQ4K-opYDnVrif3S7JtLwW5khRfD5qc-wFSUznoff5_xsW1tqqLI73qRV4Sx0ZH-fvpasYD6YzS7f20",
    inclusions: [
      "Staircase and railing cleaning",
      "Extensive glass window cleaning",
    ],
  },
  // Bathroom Services Replacement
  {
    id: "s_bath_intense",
    title: "Intense bathroom cleaning",
    categoryId: "c2",
    subCategoryId: "intense",
    price: 499,
    duration: "45 mins",
    description: "Deep cleaning for tough stains",
    rating: 4.8,
    reviews: "4.3M reviews",
    reviewCount: 4300000,
    bestseller: true,
    offerTag: "Add more & save up to 13%",
    image:
      "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=300",
    inclusions: [
      "Floor & tile cleaning with scrubbing machine",
      "Recommended for deep-cleaning and tough stains",
    ],
  },
  // Kitchen Services - Added Occupied/Unoccupied
  {
    id: "kitchen_occupied",
    title: "Occupied kitchen cleaning",
    categoryId: "c3",
    subCategoryId: "complete",
    price: 1999,
    duration: "2.5 hrs",
    description:
      "Deep cleaning of kitchen while in use. Includes appliance cleaning.",
    rating: 4.82,
    reviews: "1.5M bookings",
    reviewCount: 1500000,
    bestseller: true,
    image:
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=300",
    inclusions: [
      "Removal of oil & grease stains from walls, slabs, cabinets & stove",
      "Cleaning of cabinets inside & out",
      "Cleaning of appliances: Fridge, Microwave, Chimney",
    ],
  },
  {
    id: "kitchen_unoccupied",
    title: "Unoccupied kitchen cleaning",
    categoryId: "c3",
    subCategoryId: "complete",
    price: 1499,
    duration: "2 hrs",
    description: "Deep cleaning of empty kitchen (move-in/move-out).",
    rating: 4.75,
    reviews: "800K bookings",
    reviewCount: 800000,
    image:
      "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&q=80&w=300",
    inclusions: [
      "Deep cleaning of empty cabinets & shelves",
      "Floor scrubbing and wall stain removal",
      "Does not include appliance cleaning inside",
    ],
  },
  {
    id: "kitchen_mini_cabinet",
    title: "Cabinet Cleaning",
    categoryId: "c3",
    subCategoryId: "mini",
    price: 249,
    duration: "45 mins",
    description: "Deep cleaning of kitchen cabinets (interior & exterior).",
    rating: 4.7,
    reviews: "500 reviews",
    reviewCount: 500,
    image:
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=300",
    inclusions: ["Dusting", "Wet wiping", "Organization", "Oil removal"],
  },
  {
    id: "kitchen_mini_furniture",
    title: "Furniture Wet Wipe",
    categoryId: "c3",
    subCategoryId: "mini",
    price: 149,
    duration: "20 mins",
    description: "Wet wiping of kitchen tables and chairs.",
    rating: 4.6,
    reviews: "300 reviews",
    reviewCount: 300,
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=300",
    inclusions: ["Table cleaning", "Chair cleaning", "Stain removal"],
  },
  {
    id: "kitchen_mini_ceiling",
    title: "Ceiling Dusting",
    categoryId: "c3",
    subCategoryId: "mini",
    price: 149,
    duration: "20 mins",
    description: "Removal of cobwebs and dust from kitchen ceiling.",
    rating: 4.8,
    reviews: "400 reviews",
    reviewCount: 400,
    image:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=300",
    inclusions: ["Cobweb removal", "Corner dusting", "Exhaust fan exterior"],
  },
  {
    id: "kitchen_mini_fan",
    title: "Ceiling Fan Cleaning",
    categoryId: "c3",
    subCategoryId: "mini",
    price: 99,
    duration: "15 mins",
    description: "Cleaning of kitchen ceiling fans.",
    rating: 4.7,
    reviews: "600 reviews",
    reviewCount: 600,
    image:
      "https://plus.unsplash.com/premium_photo-1678733357597-29314417d45e?auto=format&fit=crop&q=80&w=300",
    inclusions: ["Blade wiping", "Motor cleaning"],
  },
  {
    id: "tank_plastic",
    title: "Plastic Tank Cleaning",
    categoryId: "c4",
    subCategoryId: "plastic_tank",
    price: 399,
    duration: "45 mins",
    description: "Mechanized cleaning, dewatering & sludge removal.",
    rating: 4.8,
    reviews: "12K reviews",
    reviewCount: 12000,
    image:
      "https://plus.unsplash.com/premium_photo-1663089895885-c20e104f7556?auto=format&fit=crop&q=80&w=300",
    inclusions: [
      "Dewatering",
      "Sludge removal",
      "High pressure cleaning",
      "Vacuuming",
    ],
  },
  {
    id: "tank_cemented",
    title: "Cemented Tank Cleaning",
    categoryId: "c4",
    subCategoryId: "cemented_tank",
    price: 699,
    duration: "1 hr",
    description:
      "Professional cleaning for underground or overhead cemented tanks.",
    rating: 4.75,
    reviews: "8K reviews",
    reviewCount: 8000,
    image:
      "https://plus.unsplash.com/premium_photo-1664300900349-afd61c20f8b8?auto=format&fit=crop&q=80&w=300",
    inclusions: [
      "Dewatering",
      "Sludge removal",
      "High pressure cleaning",
      "Vacuuming",
      "Anti-bacterial spray",
    ],
  },
  {
    id: "room_bedroom",
    title: "Bedroom cleaning",
    categoryId: "c1",
    subCategoryId: "room",
    price: 799,
    duration: "45 mins",
    description: "Cleaning of one bedroom & dresser cabinets",
    rating: 4.81,
    reviews: "38K reviews",
    reviewCount: 38000,
    image:
      "https://images.unsplash.com/photo-1616594039964-40891a90b7a8?auto=format&fit=crop&q=80&w=300",
    inclusions: [
      "Cleaning of one bedroom & dresser cabinets",
      "Excludes attached bathroom, balcony, emptying of cabinets",
    ],
  },
  {
    id: "room_living",
    title: "Living room cleaning",
    categoryId: "c1",
    subCategoryId: "room",
    price: 999,
    duration: "1 hr",
    description: "Cleaning of one living room & dresser cabinets",
    rating: 4.81,
    reviews: "23K reviews",
    reviewCount: 23000,
    image:
      "https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?auto=format&fit=crop&q=80&w=300",
    inclusions: [
      "Cleaning of one living room & dresser cabinets",
      "Excludes attached bathroom, balcony, emptying of cabinets",
    ],
  },
  {
    id: "room_kitchen",
    title: "Kitchen cleaning",
    categoryId: "c1",
    subCategoryId: "room",
    price: 1249,
    duration: "1.5 hrs",
    description: "Through cleaning of objects, surfaces & appliances",
    rating: 4.82,
    reviews: "22K reviews",
    reviewCount: 22000,
    image:
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=300",
    inclusions: [
      "Through cleaning of objects, surfaces & appliances",
      "Excludes cleaning using scrubbing machine",
    ],
  },
  {
    id: "room_balcony",
    title: "Balcony cleaning",
    categoryId: "c1",
    subCategoryId: "room",
    price: 449,
    duration: "30 mins",
    description: "Dry and wet mopping",
    rating: 4.81,
    reviews: "18K reviews",
    reviewCount: 18000,
    image:
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&q=80&w=300",
    inclusions: ["Dry and wet mopping", "Railing cleaning"],
  },
  {
    id: "mini_sofa",
    title: "Sofa Cleaning",
    categoryId: "c1",
    subCategoryId: "mini",
    price: 299,
    duration: "45 mins",
    description: "Vacuuming and shampooing of sofa seats.",
    rating: 4.8,
    reviews: "2K reviews",
    reviewCount: 2000,
    image:
      "https://images.unsplash.com/photo-1629249767355-2d447d2f8319?auto=format&fit=crop&q=80&w=300",
    inclusions: ["Dry vacuuming", "Shampooing", "Stain removal"],
  },
  {
    id: "mini_cabinet",
    title: "Cabinet Cleaning",
    categoryId: "c1",
    subCategoryId: "mini",
    price: 149,
    duration: "30 mins",
    description: "Deep cleaning of cupboard and cabinet interiors.",
    rating: 4.7,
    reviews: "1.2K reviews",
    reviewCount: 1200,
    image:
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=300",
    inclusions: ["Dusting", "Wet wiping", "Organization"],
  },
  {
    id: "mini_ceiling",
    title: "Ceiling Dusting & Cobwebs",
    categoryId: "c1",
    subCategoryId: "mini",
    price: 199,
    duration: "45 mins",
    description: "Removal of cobwebs and dust from high ceilings.",
    rating: 4.9,
    reviews: "5K reviews",
    reviewCount: 5000,
    image:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=300",
    inclusions: ["Cobweb removal", "Corner dusting", "Fan dusting"],
  },
  {
    id: "mini_furniture",
    title: "Furniture Wet Wipe",
    categoryId: "c1",
    subCategoryId: "mini",
    price: 99,
    duration: "20 mins",
    description: "Wet wiping of hard furniture surfaces.",
    rating: 4.6,
    reviews: "3K reviews",
    reviewCount: 3000,
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=300",
    inclusions: ["Table cleaning", "Chair cleaning", "Shelf dusting"],
  },
  {
    id: "mini_fan",
    title: "Ceiling Fans",
    categoryId: "c1",
    subCategoryId: "mini",
    price: 69,
    duration: "15 mins",
    description: "Thorough cleaning of ceiling fan blades.",
    rating: 4.8,
    reviews: "10K reviews",
    reviewCount: 10000,
    image:
      "https://plus.unsplash.com/premium_photo-1678733357597-29314417d45e?auto=format&fit=crop&q=80&w=300",
    inclusions: ["Blade wiping", "Motor cleaning", "Ladder provided"],
  },
  {
    id: "sofa_mini_cushions",
    title: "Cushions Cleaning",
    categoryId: "c5",
    subCategoryId: "mini",
    price: 149,
    duration: "30 mins",
    description: "Deep cleaning and shampooing of sofa cushions.",
    rating: 4.6,
    reviews: "500 reviews",
    reviewCount: 500,
    image:
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=300",
    inclusions: ["Vacuuming", "Shampooing", "Drying"],
  },
  {
    id: "sofa_mini_table",
    title: "Centre Table Cleaning",
    categoryId: "c5",
    subCategoryId: "mini",
    price: 199,
    duration: "20 mins",
    description: "Deep cleaning and polishing of centre table.",
    rating: 4.8,
    reviews: "1K reviews",
    reviewCount: 1000,
    image:
      "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=300",
    inclusions: ["Dusting", "Wet wiping", "Glass cleaning", "Polishing"],
  },
  {
    id: "sofa_shampoo",
    title: "Sofa Cleaning",
    categoryId: "c5",
    subCategoryId: "sofa",
    price: 349,
    duration: "45 mins",
    description: "Deep cleaning and shampooing of sofa seats.",
    rating: 4.85,
    reviews: "10K reviews",
    reviewCount: 10000,
    image:
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&q=80&w=300",
    inclusions: [
      "Dry vacuuming",
      "Shampooing",
      "Wet vacuuming",
      "Stain removal",
    ],
  },
  {
    id: "carpet_shampoo",
    title: "Carpet Cleaning",
    categoryId: "c5",
    subCategoryId: "carpet",
    price: 399,
    duration: "1 hr",
    description: "Deep cleaning and shampooing of carpets.",
    rating: 4.8,
    reviews: "5K reviews",
    reviewCount: 5000,
    image:
      "https://images.unsplash.com/photo-1558317374-a354d5f6d4da?auto=format&fit=crop&q=80&w=300",
    inclusions: [
      "Dry vacuuming",
      "Shampooing",
      "Wet vacuuming",
      "Stain removal",
    ],
  },
  {
    id: "mattress_shampoo",
    title: "Mattress Cleaning",
    categoryId: "c5",
    subCategoryId: "mattress",
    price: 499,
    duration: "1 hr",
    description: "Deep cleaning and sanitization of mattress.",
    rating: 4.75,
    reviews: "4K reviews",
    reviewCount: 4000,
    image:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=300",
    inclusions: [
      "Dry vacuuming",
      "Shampooing",
      "Wet vacuuming",
      "Stain removal",
    ],
  },
  {
    id: "blinds_cleaning",
    title: "Blinds",
    categoryId: "c5",
    subCategoryId: "blinds",
    price: 299,
    duration: "45 mins",
    description: "Deep cleaning of window blinds.",
    rating: 4.7,
    reviews: "1.2K reviews",
    reviewCount: 1200,
    image:
      "https://images.unsplash.com/photo-1505691938895-1cd1027d1a58?auto=format&fit=crop&q=80&w=300",
    inclusions: ["Dusting", "Wet wiping", "Stain removal"],
  },
  {
    id: "chair_shampoo",
    title: "Chair",
    categoryId: "c5",
    subCategoryId: "chair",
    price: 199,
    duration: "30 mins",
    description: "Deep cleaning and shampooing of dining/office chairs.",
    rating: 4.7,
    reviews: "3K reviews",
    reviewCount: 3000,
    image:
      "https://images.unsplash.com/photo-1519947486511-46149fa0a254?auto=format&fit=crop&q=80&w=300",
    inclusions: ["Vacuuming", "Shampooing", "Stain removal"],
  },
  {
    id: "car_interior",
    title: "Interior deep clean",
    categoryId: "c6",
    subCategoryId: "interior",
    price: 1299,
    duration: "2 hrs",
    description: "Complete interior detailing with vacuuming and shampooing.",
    rating: 4.82,
    reviews: "1.5K reviews",
    reviewCount: 1500,
    image:
      "https://images.unsplash.com/photo-1552930294-6b595f4c2974?auto=format&fit=crop&q=80&w=300",
    inclusions: [
      "Deep vacuuming",
      "Upholstery shampooing",
      "Dashboard polishing",
      "Roof & floor cleaning",
    ],
  },
  {
    id: "car_complete",
    title: "Complete car wash",
    categoryId: "c6",
    subCategoryId: "exterior",
    price: 799,
    duration: "1 hr",
    description: "Comprehensive exterior wash and basic interior cleaning.",
    rating: 4.75,
    reviews: "3K reviews",
    reviewCount: 3000,
    image:
      "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80&w=300",
    inclusions: [
      "Exterior foam wash",
      "Interior vacuuming",
      "Tyre polishing",
      "Mat cleaning",
    ],
  },
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: "b1",
    serviceName: "Furnished Apartment Cleaning",
    status: BookingStatus.PROFESSIONAL_EN_ROUTE,
    date: "Today",
    time: "2:00 PM",
    amount: 3499.0,
    professionalName: "Rajesh Kumar",
    professionalImage:
      "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=200&h=200",
    otp: "4492",
  },
];
