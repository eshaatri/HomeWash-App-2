import { Booking, BookingStatus, Service, ServiceCategory, User, UserRole } from "./types";

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Alex Johnson',
  phone: '+1 987 654 3210',
  role: UserRole.CUSTOMER,
  walletBalance: 150.00
};

export const MOCK_PARTNER: User = {
  id: 'p1',
  name: 'Sarah Connor',
  phone: '+1 555 000 0000',
  role: UserRole.PARTNER,
  walletBalance: 450.50,
  rating: 4.9,
  isVerified: true,
  earningsToday: 124.50
};

export const CATEGORIES: ServiceCategory[] = [
  { id: 'c1', name: 'Cleaning', icon: 'cleaning_services', color: 'bg-blue-100 text-blue-600' },
  { id: 'c2', name: 'Electrician', icon: 'electrical_services', color: 'bg-yellow-100 text-yellow-600' },
  { id: 'c3', name: 'Plumber', icon: 'plumbing', color: 'bg-cyan-100 text-cyan-600' },
  { id: 'c4', name: 'Salon', icon: 'face', color: 'bg-pink-100 text-pink-600' },
  { id: 'c5', name: 'Massage', icon: 'spa', color: 'bg-purple-100 text-purple-600' },
  { id: 'c6', name: 'Painting', icon: 'format_paint', color: 'bg-orange-100 text-orange-600' },
];

export const SERVICES: Service[] = [
  { 
    id: 's1', 
    title: 'Deep Home Cleaning', 
    price: 199, 
    originalPrice: 249,
    duration: '4 Hrs', 
    description: 'Complete top-to-bottom restoration including machine floor scrubbing.',
    rating: 4.8,
    reviewCount: 1240,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5c6hvQ269iGoWpfvLQDj7bmbtgQqliAJq7BfBgfU8BHSZcE672IWwFIUyJwLcXTmRxl-d_6CJGFY8mrBW_yYweVNb0Z8pwQMyLnSDTo0OkDBx3H2C6kv7t6i8CmM--y6OgboO4_hRAVdAPLhRcmW5Iwf_tTuBbeplYcIo5l2upmHCwrLpjiX4GjFVevtkalgAkoM7Zmx65Lz5m_wtRsf-iJCLDXu9twEi1DRlqL1TtgrE-tHdbGkjNlYM0C2O5h4WFVNfyD4uPNY',
    bestseller: true
  },
  { 
    id: 's2', 
    title: 'Sofa Cleaning', 
    price: 49, 
    duration: '1 Hr', 
    description: 'Vacuuming and shampooing for 3-seater sofa.',
    rating: 4.7,
    reviewCount: 850,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQyKII_vIaYbueglrCgh8F-6OF2PmOkj_bk4X1NuaRUaG6y4NFTB8zkvoUBZifEDIflhH_vZTPVTbUi9ppddj_PADLZ0Il4Vsmr9H9nVcoY0k-neYBhDNDzKMHL24IdQyDdjbg9z_AA9ueRIAis-0JpNbTycooHUHFjvfvfW12Ph2DWiEhKPP_W2nkZpSEYQ4K-opYDnVrif3S7JtLwW5khRfD5qc-wFSUznoff5_xsW1tqqLI73qRV4Sx0ZH-fvpasYD6YzS7f20'
  },
  { 
    id: 's3', 
    title: 'Bathroom Cleaning', 
    price: 39, 
    duration: '45 Mins', 
    description: 'Scale removal, tile scrubbing and sanitization.',
    rating: 4.9,
    reviewCount: 2100,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhMOlSsEXRDt3sDDyty-vRXWr9jTMfio4HeOZi-wMf023A4X41bpDbxNoMTChDF3Q7UsnfNjf4uO9K3KvdwtLVUq9OsiWgG827dJOoZ8asEZ3pr14pe72BEq5VkZ82epmnm4AUhIuDiL6TM_ev5YD5WhGGC2EWBxbosU6TMvisuWQs2qtTKt-f2FcexXRiQUbbC0IAy9oUDhO3H4gH-aDNn_C25obcofREoGJcAnmog7P2vfTgtxgrAvoJ1XCfM1K14feVlYB71eo'
  }
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    serviceName: 'Deep Home Cleaning',
    status: BookingStatus.PARTNER_EN_ROUTE,
    date: 'Today',
    time: '2:00 PM',
    amount: 199.00,
    partnerName: 'David Miller',
    partnerImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8Ef8ElZ7J83hubPUVTphlL6jRIDuWtp5EFsDw6rd_Icq1Yg2EQlc_I5qUWcgFpbBfNFA0m-LM4jEponYXscfjzKcyhtVnstRyC40_1JyrUVKNb4ZjZyDeHZ4D6vL8v36QtcGod1pP6AQ5eh1kVQaYGeITmlsGU7RyFTaYQhENZM-HQsJjXQhJ_37OsDcQmMXZuLR7fKun5432GAyyjSHO4ai2cYemjusup_DY_6ZQY7sLdmnu4Ag0bto7swuZk-tjKULVADDumYo',
    otp: '4492'
  },
  {
    id: 'b2',
    serviceName: 'AC Service',
    status: BookingStatus.COMPLETED,
    date: 'Aug 12',
    time: '11:00 AM',
    amount: 59.00,
    partnerName: 'Mike Ross'
  }
];
