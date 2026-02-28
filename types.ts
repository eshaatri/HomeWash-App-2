export enum AppScreen {
  LOGIN = "LOGIN",
  HOME = "HOME",
  PROFILE = "PROFILE",
  CITY_SELECT = "CITY_SELECT",
  MEMBERSHIP = "MEMBERSHIP",
  ADDRESSES = "ADDRESSES",
  BOOKING = "BOOKING", // My Bookings List
  BOOKING_DETAIL = "BOOKING_DETAIL", // Specific Booking Track
  SLOT_SELECTION = "SLOT_SELECTION", // Date & Time Picker
  SUPPORT = "SUPPORT",
  SUB_CATEGORY = "SUB_CATEGORY",
  SERVICE_SELECTION = "SERVICE_SELECTION",
  SERVICE_DETAIL = "SERVICE_DETAIL", // New Config Screen
  CART = "CART",
  CHECKOUT = "CHECKOUT",
  PARTNER_DASHBOARD = "PARTNER_DASHBOARD",
}

export enum UserRole {
  CUSTOMER = "CUSTOMER",
  PROFESSIONAL = "PROFESSIONAL",
  PARTNER = "PARTNER", // Renamed from VENDOR
  ADMIN = "ADMIN",
}

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PROFESSIONAL_ASSIGNED = "PROFESSIONAL_ASSIGNED",
  PROFESSIONAL_EN_ROUTE = "PROFESSIONAL_EN_ROUTE",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  walletBalance: number;
  rating?: number; // For professionals/partners
  isVerified?: boolean; // For professionals/partners
  earningsToday?: number; // For professionals/partners
}

export interface Service {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  duration: string;
  description: string;
  rating: number;
  reviewCount: number;
  image: string;
  bestseller?: boolean;
  categoryId?: string;
  offerTag?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Booking {
  id: string;
  serviceName: string;
  status: BookingStatus;
  date: string;
  time: string;
  amount: number;
   address?: string;
  professionalName?: string;
  professionalImage?: string;
  otp?: string;
  paidAmount?: number;
  remainingAmount?: number;
  serviceArea?: string;
  customerLat?: number;
  customerLng?: number;
}

export interface CartItem {
  service: Service;
  quantity: number;
}

export interface NavigationProps {
  currentScreen: AppScreen;
  navigateTo: (screen: AppScreen) => void;
  isPremium: boolean;
  togglePremium: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  user: User | null;
  login: (phone: string, role: UserRole) => void;
  logout: () => void;

  // Location State
  currentLocation: string;
  currentLocationLabel: string;
  selectedArea: string | null;
  currentLat?: number;
  currentLng?: number;
  setCurrentLocation: (
    location: string,
    label?: string,
    area?: string | null,
    lat?: number,
    lng?: number,
  ) => void;

  // Data State
  bookings: Booking[];
  cart: CartItem[];
  // Map serviceId -> { date, time }
  serviceSlots: Record<string, { date: string; time: string }>;

  // Category Selection
  selectedCategory: ServiceCategory | null;
  setSelectedCategory: (category: ServiceCategory | null) => void;

  // Sub Category Selection
  selectedSubCategoryId: string | null;
  setSelectedSubCategoryId: (id: string | null) => void;

  // Service Selection for Config
  selectedService: Service | null;
  setSelectedService: (service: Service | null) => void;

  // Actions
  addToCart: (service: Service, price?: number) => void;
  removeFromCart: (serviceId: string) => void;
  decreaseQuantity: (service: Service) => void;
  setServiceSlot: (serviceId: string, date: string, time: string) => void;
  onPaymentComplete: (profileUpdate?: {
    name: string;
    email: string;
  }) => Promise<void>;
  updateProfile: (update: { name: string; email?: string }) => Promise<void>;
}
