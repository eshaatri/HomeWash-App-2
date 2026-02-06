export enum AdminPage {
  LOGIN = "LOGIN",
  DASHBOARD = "DASHBOARD",
  USERS = "USERS",
  PARTNERS = "PARTNERS",
  BOOKINGS = "BOOKINGS",
  SERVICES = "SERVICES",
  REPORTS = "REPORTS",
  SETTINGS = "SETTINGS",
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
  role: "SUPER_ADMIN" | "ADMIN" | "SUPPORT";
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
