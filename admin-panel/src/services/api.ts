import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const adminService = {
  // Users
  getUsers: async () => {
    const response = await api.get("/users");
    return response.data;
  },
  createUser: async (userData: any) => {
    const response = await api.post("/users/login", userData); // Uses login for auto-creation logic or we could add a dedicated POST
    return response.data;
  },
  updateUser: async (id: string, userData: any) => {
    const response = await api.patch(`/users/${id}`, userData);
    return response.data;
  },
  deleteUser: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  // Partners
  getPartners: async () => {
    const response = await api.get("/users");
    return response.data.filter((u: any) => u.role === "PARTNER");
  },

  // Bookings
  getBookings: async () => {
    const response = await api.get("/bookings");
    return response.data;
  },
  updateBookingStatus: async (id: string, status: string) => {
    const response = await api.patch(`/bookings/${id}/status`, { status });
    return response.data;
  },
  assignPartner: async (
    bookingId: string,
    partnerId: string,
    partnerName: string,
  ) => {
    const response = await api.patch(`/bookings/${bookingId}/status`, {
      status: "PARTNER_ASSIGNED",
      partnerId,
      partnerName,
    });
    return response.data;
  },

  // Services
  getServices: async () => {
    const response = await api.get("/services");
    return response.data;
  },
  createService: async (serviceData: any) => {
    const response = await api.post("/services", serviceData);
    return response.data;
  },
  updateService: async (id: string, serviceData: any) => {
    const response = await api.patch(`/services/${id}`, serviceData);
    return response.data;
  },
  deleteService: async (id: string) => {
    const response = await api.delete(`/services/${id}`);
    return response.data;
  },

  // Categories
  getCategories: async () => {
    const response = await api.get("/categories");
    return response.data;
  },
  createCategory: async (categoryData: any) => {
    const response = await api.post("/categories", categoryData);
    return response.data;
  },
  updateCategory: async (id: string, categoryData: any) => {
    const response = await api.patch(`/categories/${id}`, categoryData);
    return response.data;
  },
  deleteCategory: async (id: string) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

export default api;
