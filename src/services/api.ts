import axios from "axios";
import {
  User,
  Booking,
  Service,
  ServiceCategory,
  UserRole,
  BookingStatus,
} from "../../types";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const userService = {
  login: async (phone: string, role: UserRole, name?: string) => {
    const response = await api.post("/users/login", { phone, role, name });
    return response.data;
  },
  getUser: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  updateProfile: async (
    id: string,
    update: { name: string; email?: string },
  ) => {
    console.log(`Updating profile for ID: ${id}`, update);
    const response = await api.patch(`/users/${id}`, update);
    return response.data;
  },
};

export const serviceFetchService = {
  getServices: async () => {
    const response = await api.get("/services");
    return response.data;
  },
  getCategories: async () => {
    const response = await api.get("/categories");
    return response.data;
  },
};

export const bookingService = {
  getBookings: async () => {
    const response = await api.get("/bookings");
    return response.data;
  },
  getCustomerBookings: async (customerId: string) => {
    const response = await api.get(`/bookings/customer/${customerId}`);
    return response.data;
  },
  getPartnerBookings: async (partnerId: string) => {
    const response = await api.get(`/bookings/partner/${partnerId}`);
    return response.data;
  },
  createBooking: async (
    bookingData: Partial<Booking> & { customerId: string; serviceId: string },
  ) => {
    const response = await api.post("/bookings", bookingData);
    return response.data;
  },
  updateStatus: async (id: string, status: BookingStatus) => {
    const response = await api.patch(`/bookings/${id}/status`, { status });
    return response.data;
  },
};

export const pricingService = {
  resolvePrice: async (serviceId: string, areaName: string) => {
    const response = await api.get("/pricing/resolve", {
      params: { serviceId, areaName },
    });
    return response.data;
  },
};

export default api;
