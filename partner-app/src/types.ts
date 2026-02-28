export enum ProfessionalScreen {
  LOGIN = "LOGIN",
  DASHBOARD = "DASHBOARD",
  JOBS = "JOBS",
  ACTIVE_JOB = "ACTIVE_JOB",
  WALLET = "WALLET",
  PROFILE = "PROFILE",
}

export enum JobStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  EN_ROUTE = "EN_ROUTE",
  ARRIVED = "ARRIVED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface Professional {
  id?: string;
  _id?: string;
  name: string;
  phone: string;
  rating: number;
  completedJobs: number;
  isOnline: boolean;
  earningsToday: number;
  walletBalance: number;
  tier: "SILVER" | "GOLD" | "PLATINUM";
  status?: string; // ACTIVE | ONBOARDING | SUSPENDED – when SUSPENDED, cannot go online or see new bookings
  serviceArea?: string; // area(s) assigned to this professional
  serviceAreaIds?: string[];
}

export interface Job {
  id?: string;
  _id?: string;
  serviceName: string;
  serviceArea?: string;
  customerName: string;
  customerPhone: string;
  address: string;
  addressLine2: string;
  lat: number;
  lng: number;
  amount: number;
  paymentMethod: "CASH" | "ONLINE";
  status: JobStatus;
  distance: string;
  duration: string;
  scheduledTime: string;
  otpStart?: string;
  otpEnd?: string;
}

export interface NavigationProps {
  currentScreen: ProfessionalScreen;
  navigateTo: (screen: ProfessionalScreen) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  professional: Professional | null;
  setProfessional: (professional: Professional | null) => void;
  jobs: Job[];
  activeJob: Job | null;
  setActiveJob: (job: Job | null) => void;
  acceptJob: (jobId: string) => void;
  rejectJob: (jobId: string) => void;
  updateJobStatus: (jobId: string, status: JobStatus) => void;
  refreshJobs: () => void;
  isProfessionalOnline: boolean;
  setProfessionalOnline: (online: boolean) => void;
  // Temporary for testing booking flow – remove when using live location
  testAddress?: string;
  testAddressLine2?: string;
  testLat?: number;
  testLng?: number;
  setTestAddress?: (
    address: string,
    addressLine2?: string,
    lat?: number,
    lng?: number,
  ) => void;
}
