
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
  { id: 'c1', name: 'Home Cleaning', icon: 'cleaning_services', color: 'from-blue-400 to-blue-500' },
  { id: 'c2', name: 'Bathroom Cleaning', icon: 'bathroom', color: 'from-violet-400 to-violet-500' },
  { id: 'c3', name: 'Kitchen Cleaning', icon: 'kitchen', color: 'from-rose-400 to-rose-500' },
  { id: 'c4', name: 'Water Tank Cleaning', icon: 'water_drop', color: 'from-cyan-400 to-cyan-500' },
  { id: 'c5', name: 'Sofa Cleaning', icon: 'weekend', color: 'from-amber-300 to-amber-500' },
  { id: 'c6', name: 'Car Wash', icon: 'local_car_wash', color: 'from-indigo-300 to-indigo-500' },
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
          { 
            id: 'apartment', 
            name: 'Apartment', 
            icon: 'apartment', 
            color: 'bg-blue-50 text-blue-600',
            image: 'https://images.unsplash.com/photo-1502005229762-cf1e253c96bd?q=80&w=200&auto=format&fit=crop'
          },
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
          { 
            id: 'chimney', 
            name: 'Chimney Cleaning', 
            icon: 'mode_fan', 
            color: 'bg-orange-50 text-orange-600',
            image: 'https://images.unsplash.com/photo-1621252179027-94459d27d3ee?auto=format&fit=crop&q=80&w=300'
          },
          { 
            id: 'complete', 
            name: 'Complete Kitchen Cleaning', 
            icon: 'countertops', 
            color: 'bg-blue-50 text-blue-600',
            image: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=300'
          },
          { 
            id: 'appliance', 
            name: 'Appliance Cleaning', 
            icon: 'microwave', 
            color: 'bg-purple-50 text-purple-600',
            image: 'https://images.unsplash.com/photo-1585938389612-a552a28d6914?auto=format&fit=crop&q=80&w=300'
          },
          { 
            id: 'cabinet', 
            name: 'Cabinet and Tiles', 
            icon: 'shelves', 
            color: 'bg-amber-50 text-amber-600',
            image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=300'
          },
          { 
            id: 'mini', 
            name: 'Mini Services', 
            icon: 'cleaning_services', 
            color: 'bg-cyan-50 text-cyan-600',
            image: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&q=80&w=300'
          },
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
  },
  // Book by Room Services
  {
    id: 'room_bedroom',
    title: 'Bedroom cleaning',
    categoryId: 'c1',
    subCategoryId: 'room',
    price: 799,
    duration: '45 mins',
    description: 'Cleaning of one bedroom & dresser cabinets',
    rating: 4.81,
    reviews: '38K reviews',
    reviewCount: 38000,
    image: 'https://images.unsplash.com/photo-1616594039964-40891a90b7a8?auto=format&fit=crop&q=80&w=300',
    inclusions: ['Cleaning of one bedroom & dresser cabinets', 'Excludes attached bathroom, balcony, emptying of cabinets']
  },
  {
    id: 'room_living',
    title: 'Living room cleaning',
    categoryId: 'c1',
    subCategoryId: 'room',
    price: 999,
    duration: '1 hr',
    description: 'Cleaning of one living room & dresser cabinets',
    rating: 4.81,
    reviews: '23K reviews',
    reviewCount: 23000,
    image: 'https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?auto=format&fit=crop&q=80&w=300',
    inclusions: ['Cleaning of one living room & dresser cabinets', 'Excludes attached bathroom, balcony, emptying of cabinets']
  },
  {
    id: 'room_kitchen',
    title: 'Kitchen cleaning',
    categoryId: 'c1',
    subCategoryId: 'room',
    price: 1249,
    duration: '1.5 hrs',
    description: 'Through cleaning of objects, surfaces & appliances',
    rating: 4.82,
    reviews: '22K reviews',
    reviewCount: 22000,
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=300',
    inclusions: ['Through cleaning of objects, surfaces & appliances', 'Excludes cleaning using scrubbing machine']
  },
  {
    id: 'room_bathroom',
    title: 'Bathroom cleaning',
    categoryId: 'c1',
    subCategoryId: 'room',
    price: 579,
    duration: '45 mins',
    description: 'Deep cleaning of floor and tiles',
    rating: 4.81,
    reviews: '48K reviews',
    reviewCount: 48000,
    image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=300',
    inclusions: ['Deep cleaning of floor and tiles', 'Toilet and basin cleaning']
  },
  {
    id: 'room_balcony',
    title: 'Balcony cleaning',
    categoryId: 'c1',
    subCategoryId: 'room',
    price: 449,
    duration: '30 mins',
    description: 'Dry and wet mopping',
    rating: 4.81,
    reviews: '18K reviews',
    reviewCount: 18000,
    image: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&q=80&w=300',
    inclusions: ['Dry and wet mopping', 'Railing cleaning']
  },
  // Added Mini Services
  {
    id: 'mini_sofa',
    title: 'Sofa Cleaning',
    categoryId: 'c1',
    subCategoryId: 'mini',
    price: 299,
    duration: '45 mins',
    description: 'Vacuuming and shampooing of sofa seats.',
    rating: 4.8,
    reviews: '2K reviews',
    reviewCount: 2000,
    image: 'https://images.unsplash.com/photo-1629249767355-2d447d2f8319?auto=format&fit=crop&q=80&w=300',
    inclusions: ['Dry vacuuming', 'Shampooing', 'Stain removal']
  },
  {
    id: 'mini_cabinet',
    title: 'Cabinet Cleaning',
    categoryId: 'c1',
    subCategoryId: 'mini',
    price: 149,
    duration: '30 mins',
    description: 'Deep cleaning of cupboard and cabinet interiors.',
    rating: 4.7,
    reviews: '1.2K reviews',
    reviewCount: 1200,
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=300',
    inclusions: ['Dusting', 'Wet wiping', 'Organization']
  },
  {
    id: 'mini_ceiling',
    title: 'Ceiling Dusting & Cobwebs',
    categoryId: 'c1',
    subCategoryId: 'mini',
    price: 199,
    duration: '45 mins',
    description: 'Removal of cobwebs and dust from high ceilings.',
    rating: 4.9,
    reviews: '5K reviews',
    reviewCount: 5000,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=300',
    inclusions: ['Cobweb removal', 'Corner dusting', 'Fan dusting']
  },
  {
    id: 'mini_furniture',
    title: 'Furniture Wet Wipe',
    categoryId: 'c1',
    subCategoryId: 'mini',
    price: 99,
    duration: '20 mins',
    description: 'Wet wiping of hard furniture surfaces.',
    rating: 4.6,
    reviews: '3K reviews',
    reviewCount: 3000,
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=300',
    inclusions: ['Table cleaning', 'Chair cleaning', 'Shelf dusting']
  },
  {
    id: 'mini_fan',
    title: 'Ceiling Fans',
    categoryId: 'c1',
    subCategoryId: 'mini',
    price: 69,
    duration: '15 mins',
    description: 'Thorough cleaning of ceiling fan blades.',
    rating: 4.8,
    reviews: '10K reviews',
    reviewCount: 10000,
    image: 'https://plus.unsplash.com/premium_photo-1678733357597-29314417d45e?auto=format&fit=crop&q=80&w=300',
    inclusions: ['Blade wiping', 'Motor cleaning', 'Ladder provided']
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
