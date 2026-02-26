export interface User {
  _id: string;
  name: string;
  phone: string;
  role: "ADMIN" | "PARTNER" | "CUSTOMER";
  walletBalance: number;
  totalBookings?: number;
  totalSpent?: number;
  lastActive?: string;
  isActive?: boolean;
  createdAt: string;
}
