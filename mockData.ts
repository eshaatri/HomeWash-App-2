
import { Booking, BookingStatus, Service, ServiceCategory, User, UserRole } from "./types";

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Arjun Mehta',
  phone: '+91 98765 43210',
  role: UserRole.CUSTOMER,
  walletBalance: 2500.00
};

export const MOCK_PARTNER: User = {
  id: 'p1',
  name: 'Rajesh Kumar',
  phone: '+91 99887 76655',
  role: UserRole.PARTNER,
  walletBalance: 4500.50,
  rating: 4.9,
  isVerified: true,
  earningsToday: 2124.50
};

export const CATEGORIES: ServiceCategory[] = [
  { id: 'c1', name: 'Home Cleaning', icon: 'cleaning_services', color: 'bg-blue-50 text-blue-600' },
  { id: 'c2', name: 'Bathroom Cleaning', icon: 'bathroom', color: 'bg-purple-50 text-purple-600' },
  { id: 'c3', name: 'Kitchen Cleaning', icon: 'kitchen', color: 'bg-orange-50 text-orange-600' },
  { id: 'c4', name: 'Water Tank Cleaning', icon: 'water_drop', color: 'bg-cyan-50 text-cyan-600' },
  { id: 'c5', name: 'Sofa Cleaning', icon: 'weekend', color: 'bg-amber-50 text-amber-600' },
  { id: 'c6', name: 'Car Wash', icon: 'directions_car', color: 'bg-slate-50 text-slate-600' },
];

export interface ExtendedService extends Service {
  inclusions?: string[];
  reviews?: string;
  subCategoryId?: string;
}

export const SUB_CATEGORIES_DB: Record<string, { title: string, sections: { title: string, items: any[] }[] }> = {
  'c1': {
    title: "Home Cleaning",
    sections: [
      {
        title: "Select Property Type",
        items: [
          { id: 'apartment', name: 'Apartment', icon: 'apartment', color: 'bg-blue-50 text-blue-600' },
          { id: 'bungalow', name: 'Bungalow / Duplex', icon: 'cottage', color: 'bg-orange-50 text-orange-600' },
          { id: 'room', name: 'Book by room', icon: 'meeting_room', color: 'bg-purple-50 text-purple-600' },
          { id: 'mini', name: 'Mini Services', icon: 'cleaning_services', color: 'bg-green-50 text-green-600' },
        ]
      }
    ]
  },
  'c2': {
    title: "Bathroom Cleaning",
    sections: [
      {
        title: "Select Service Type",
        items: [
          { id: 'combos', name: 'Combos', icon: 'layers', color: 'bg-orange-50 text-orange-600' },
          { id: 'bathroom_clean', name: 'Bathroom Cleaning', icon: 'cleaning_services', color: 'bg-blue-50 text-blue-600' },
          { id: 'maintenance', name: 'Maintenance Pack', icon: 'handyman', color: 'bg-purple-50 text-purple-600' },
          { id: 'mini', name: 'Mini Services', icon: 'water_drop', color: 'bg-cyan-50 text-cyan-600' },
        ]
      }
    ]
  },
  'c3': {
    title: "Kitchen Cleaning",
    sections: [
      {
        title: "Select Service Type",
        items: [
          { id: 'discounted', name: 'Discounted Pack', icon: 'local_offer', color: 'bg-green-50 text-green-600' },
          { id: 'chimney', name: 'Chimney Cleaning', icon: 'mode_fan', color: 'bg-orange-50 text-orange-600' },
          { id: 'complete', name: 'Complete Kitchen Cleaning', icon: 'countertops', color: 'bg-blue-50 text-blue-600' },
          { id: 'appliance', name: 'Appliance Cleaning', icon: 'microwave', color: 'bg-purple-50 text-purple-600' },
          { id: 'cabinet', name: 'Cabinet and Tiles', icon: 'shelves', color: 'bg-amber-50 text-amber-600' },
          { id: 'mini', name: 'Mini Services', icon: 'cleaning_services', color: 'bg-cyan-50 text-cyan-600' },
        ]
      }
    ]
  },
  'c4': {
    title: "Water Tank Cleaning",
    sections: [
      {
        title: "Select Tank Type",
        items: [
          { id: 'plastic_tank', name: 'Plastic Tank', icon: 'water_bottle', color: 'bg-cyan-50 text-cyan-600' },
          { id: 'cemented_tank', name: 'Cemented/Underground', icon: 'architecture', color: 'bg-gray-50 text-gray-600' },
        ]
      }
    ]
  },
  'c5': {
    title: "Sofa Cleaning",
    sections: [
      {
        title: "Select Item",
        items: [
          { id: 'sofa', name: 'Sofa', icon: 'weekend', color: 'bg-amber-50 text-amber-600' },
          { id: 'carpet', name: 'Carpet', icon: 'texture', color: 'bg-orange-50 text-orange-600' },
          { id: 'mattress', name: 'Mattress', icon: 'bed', color: 'bg-blue-50 text-blue-600' },
          { id: 'curtain', name: 'Curtain', icon: 'curtains', color: 'bg-purple-50 text-purple-600' },
          { id: 'dining', name: 'Dining Table', icon: 'table_restaurant', color: 'bg-green-50 text-green-600' },
        ]
      }
    ]
  },
  'c6': {
    title: "Car Wash",
    sections: [
      {
        title: "Select Wash Type",
        items: [
          { id: 'interior', name: 'Interior', icon: 'airline_seat_recline_extra', color: 'bg-indigo-50 text-indigo-600' },
          { id: 'exterior', name: 'Exterior', icon: 'local_car_wash', color: 'bg-cyan-50 text-cyan-600' },
        ]
      }
    ]
  }
};

export const SERVICES: ExtendedService[] = [
  { 
    id: 's1', 
    title: 'Furnished Apartment', 
    categoryId: 'c1',
    subCategoryId: 'apartment',
    price: 3499, 
    originalPrice: 3999,
    duration: '3 hrs 45 mins', 
    description: 'Complete top-to-bottom restoration for your furnished space.',
    rating: 4.82,
    reviews: '380K reviews',
    reviewCount: 380000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5c6hvQ269iGoWpfvLQDj7bmbtgQqliAJq7BfBgfU8BHSZcE672IWwFIUyJwLcXTmRxl-d_6CJGFY8mrBW_yYweVNb0Z8pwQMyLnSDTo0OkDBx3H2C6kv7t6i8CmM--y6OgboO4_hRAVdAPLhRcmW5Iwf_tTuBbeplYcIo5l2upmHCwrLpjiX4GjFVevtkalgAkoM7Zmx65Lz5m_wtRsf-iJCLDXu9twEi1DRlqL1TtgrE-tHdbGkjNlYM0C2O5h4WFVNfyD4uPNY',
    bestseller: true,
    inclusions: [
      'Cleaning & stain removal from rooms, kitchen, bathroom & balcony',
      'Machine floor scrubbing & dusting of walls & ceilings'
    ]
  },
  { 
    id: 's1_un', 
    title: 'Unfurnished Apartment', 
    categoryId: 'c1',
    subCategoryId: 'apartment',
    price: 3199, 
    duration: '3 hrs', 
    description: 'Empty space cleaning focusing on deep floors and wall dusting.',
    rating: 4.82,
    reviews: '176K reviews',
    reviewCount: 176000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhMOlSsEXRDt3sDDyty-vRXWr9jTMfio4HeOZi-wMf023A4X41bpDbxNoMTChDF3Q7UsnfNjf4uO9K3KvdwtLVUq9OsiWgG827dJOoZ8asEZ3pr14pe72BEq5VkZ82epmnm4AUhIuDiL6TM_ev5YD5WhGGC2EWBxbosU6TMvisuWQs2qtTKt-f2FcexXRiQUbbC0IAy9oUDhO3H4gH-aDNn_C25obcofREoGJcAnmog7P2vfTgtxgrAvoJ1XCfM1K14feVlYB71eo',
    inclusions: [
      'Cleaning & stain removal from floors and skirting',
      'Dry vacuuming of walls and ceiling'
    ]
  },
  { 
    id: 's2_bun', 
    title: 'Bungalow Deep Clean', 
    categoryId: 'c1',
    subCategoryId: 'bungalow',
    price: 5499, 
    duration: '6 hrs', 
    description: 'Specialized cleaning for large multi-story homes.',
    rating: 4.9,
    reviews: '12K reviews',
    reviewCount: 12000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQyKII_vIaYbueglrCgh8F-6OF2PmOkj_bk4X1NuaRUaG6y4NFTB8zkvoUBZifEDIflhH_vZTPVTbUi9ppddj_PADLZ0Il4Vsmr9H9nVcoY0k-neYBhDNDzKMHL24IdQyDdjbg9z_AA9ueRIAis-0JpNbTycooHUHFjvfvfW12Ph2DWiEhKPP_W2nkZpSEYQ4K-opYDnVrif3S7JtLwW5khRfD5qc-wFSUznoff5_xsW1tqqLI73qRV4Sx0ZH-fvpasYD6YzS7f20',
    inclusions: [
      'Staircase and railing cleaning',
      'Extensive glass window cleaning'
    ]
  }
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    serviceName: 'Furnished Apartment Cleaning',
    status: BookingStatus.PARTNER_EN_ROUTE,
    date: 'Today',
    time: '2:00 PM',
    amount: 3499.00,
    partnerName: 'Rajesh Kumar',
    partnerImage: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=200&h=200',
    otp: '4492'
  }
];
