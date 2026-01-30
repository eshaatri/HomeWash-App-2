export enum AppScreen {
  LOGIN = 'LOGIN',
  HOME = 'HOME',
  CITY_SELECT = 'CITY_SELECT',
  MEMBERSHIP = 'MEMBERSHIP',
  ADDRESSES = 'ADDRESSES',
  BOOKING = 'BOOKING', // My Bookings List
  BOOKING_DETAIL = 'BOOKING_DETAIL', // Specific Booking Track
  SLOT_SELECTION = 'SLOT_SELECTION', // Date & Time Picker
  SUPPORT = 'SUPPORT',
  SUB_CATEGORY = 'SUB_CATEGORY',
  SERVICE_SELECTION = 'SERVICE_SELECTION',
  CART = 'CART',
  CHECKOUT = 'CHECKOUT',
  PARTNER_DASHBOARD = 'PARTNER_DASHBOARD',
}

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  PARTNER = 'PARTNER',
  ADMIN = 'ADMIN'
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PARTNER_ASSIGNED = 'PARTNER_ASSIGNED',
  PARTNER_EN_ROUTE = 'PARTNER_EN_ROUTE',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  walletBalance: number;
  rating?: number; // For partners
  isVerified?: boolean; // For partners
  earningsToday?: number; // For partners
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
  partnerName?: string;
  partnerImage?: string;
  otp?: string;
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
  
  // Data State
  bookings: Booking[];
  cart: CartItem[];
  // Map serviceId -> { date, time }
  serviceSlots: Record<string, { date: string; time: string }>;

  // Actions
  addToCart: (service: Service) => void;
  removeFromCart: (serviceId: string) => void;
  decreaseQuantity: (service: Service) => void;
  setServiceSlot: (serviceId: string, date: string, time: string) => void;
  onPaymentComplete: () => void;
}
