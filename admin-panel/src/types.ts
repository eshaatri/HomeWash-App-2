export enum AdminPage {
  LOGIN = "LOGIN",
  DASHBOARD = "DASHBOARD",
  USERS = "USERS",
  PROFESSIONALS = "PROFESSIONALS", // Renamed from PARTNERS
  PARTNERS = "PARTNERS", // Renamed from VENDORS
  AREAS = "AREAS",
  BOOKINGS = "BOOKINGS",
  SERVICES = "SERVICES",
  REPORTS = "REPORTS",
  SETTINGS = "SETTINGS",
  // Partner specific pages (previously Vendor)
  PARTNER_DASHBOARD = "PARTNER_DASHBOARD",
  PARTNER_BOOKINGS = "PARTNER_BOOKINGS",
  PARTNER_PROFESSIONALS = "PARTNER_PROFESSIONALS",
  PARTNER_SERVICE_CONFIG = "PARTNER_SERVICE_CONFIG",
}

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PROFESSIONAL_ASSIGNED = "PROFESSIONAL_ASSIGNED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum ProfessionalStatus {
  // Renamed from PartnerStatus
  ONBOARDING = "ONBOARDING",
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "SUPPORT" | "PARTNER";
  partnerId?: string; // Formerly vendorId
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

export interface Professional {
  // Renamed from Partner
  id: string;
  name: string;
  phone: string;
  email: string;
  status: ProfessionalStatus;
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
  professionalId?: string; // Formerly partnerId
  professionalName?: string; // Formerly partnerName
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

export interface Partner {
  // Renamed from Vendor
  id: string;
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  activeAreas: string[];
  isActive: boolean;
  commissionRate: number;
  professionalsCount: number; // Formerly partnersCount
  ownerId?: string;
}

export interface Area {
  id: string;
  name: string;
  city: string;
  zipCodes: string[];
  isActive: boolean;
  partnersCount: number; // Formerly vendorsCount
  lat?: number;
  lng?: number;
  assignedPartnerId?: string; // Formerly assignedVendorId
  assignedPartnerName?: string; // Formerly assignedVendorName
  geoJson?: any;
}

export interface DashboardStats {
  totalRevenue: number;
  revenueChange: number;
  totalBookings: number;
  bookingsChange: number;
  activeProfessionals: number; // Formerly activePartners
  professionalsChange: number; // Formerly partnersChange
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
