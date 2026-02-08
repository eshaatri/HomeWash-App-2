import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const adminService = {
  getUsers: async () => {
    const response = await api.get("/users");
    return response.data;
  },
  getPartners: async () => {
    // In this simple schema, partners are users with role PARTNER
    const response = await api.get("/users");
    return response.data.filter((u: any) => u.role === "PARTNER");
  },
  getBookings: async () => {
    const response = await api.get("/bookings");
    return response.data;
  },
  getServices: async () => {
    const response = await api.get("/services");
    return response.data;
  },
  getCategories: async () => {
    const response = await api.get("/categories");
    return response.data;
  },
};

export default api;
