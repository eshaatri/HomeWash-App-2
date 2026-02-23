export enum AdminPage {
  LOGIN = "LOGIN",
  DASHBOARD = "DASHBOARD",
  USERS = "USERS",
  PARTNERS = "PARTNERS",
  VENDORS = "VENDORS",
  AREAS = "AREAS",
  BOOKINGS = "BOOKINGS",
  SERVICES = "SERVICES",
  REPORTS = "REPORTS",
  SETTINGS = "SETTINGS",
  // Vendor specific pages
  VENDOR_DASHBOARD = "VENDOR_DASHBOARD",
  VENDOR_BOOKINGS = "VENDOR_BOOKINGS",
  VENDOR_PARTNERS = "VENDOR_PARTNERS",
  VENDOR_SERVICE_CONFIG = "VENDOR_SERVICE_CONFIG",
}

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PARTNER_ASSIGNED = "PARTNER_ASSIGNED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum PartnerStatus {
  ONBOARDING = "ONBOARDING",
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "SUPPORT" | "VENDOR";
  vendorId?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalBookings: number;
  totalSpent: number;
  joinedDate: string;
  lastActive: string;
}

export interface Partner {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: PartnerStatus;
  rating: number;
  completedJobs: number;
  earnings: number;
  tier: "SILVER" | "GOLD" | "PLATINUM";
  joinedDate: string;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  partnerId?: string;
  partnerName?: string;
  serviceName: string;
  amount: number;
  status: BookingStatus;
  scheduledDate: string;
  scheduledTime: string;
  address: string;
  createdAt: string;
  lat?: number;
  lng?: number;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  servicesCount: number;
}

export interface Service {
  id: string;
  name: string;
  categoryId: string;
  price: number;
  duration: string;
  isActive: boolean;
}

export interface Vendor {
  id: string;
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  activeAreas: string[];
  isActive: boolean;
  commissionRate: number;
  partnersCount: number;
  ownerId?: string;
}

export interface Area {
  id: string;
  name: string;
  city: string;
  zipCodes: string[];
  isActive: boolean;
  vendorsCount: number;
  lat?: number;
  lng?: number;
  assignedVendorId?: string;
  assignedVendorName?: string;
  geoJson?: any;
}

export interface DashboardStats {
  totalRevenue: number;
  revenueChange: number;
  totalBookings: number;
  bookingsChange: number;
  activePartners: number;
  partnersChange: number;
  activeUsers: number;
  usersChange: number;
}

export interface NavigationProps {
  currentPage: AdminPage;
  navigateTo: (page: AdminPage) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  admin: Admin | null;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}
