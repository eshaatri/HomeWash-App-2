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
  getVendors: async () => {
    const response = await api.get("/vendors");
    return response.data;
  },
  createVendor: async (vendorData: any) => {
    const response = await api.post("/vendors", vendorData);
    return response.data;
  },
  updateVendor: async (id: string, vendorData: any) => {
    const response = await api.patch(`/vendors/${id}`, vendorData);
    return response.data;
  },
  deleteVendor: async (id: string) => {
    const response = await api.delete(`/vendors/${id}`);
    return response.data;
  },

  getAreas: async () => {
    const response = await api.get("/areas");
    return response.data;
  },
  createArea: async (areaData: any) => {
    const response = await api.post("/areas", areaData);
    return response.data;
  },
  updateArea: async (id: string, areaData: any) => {
    const response = await api.patch(`/areas/${id}`, areaData);
    return response.data;
  },
  deleteArea: async (id: string) => {
    const response = await api.delete(`/areas/${id}`);
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
  getSubCategories: async () => {
    const response = await api.get("/subcategories");
    return response.data;
  },
  updateService: async (id: string, serviceData: any) => {
    const response = await api.patch(`/services/${id}`, serviceData);
    return response.data;
  },
  updateCategory: async (id: string, categoryData: any) => {
    const response = await api.patch(`/categories/${id}`, categoryData);
    return response.data;
  },
  updateSubCategory: async (id: string, subCategoryData: any) => {
    const response = await api.patch(`/subcategories/${id}`, subCategoryData);
    return response.data;
  },
  getVendorConfigs: async (vendorId: string) => {
    const response = await api.get(`/vendor-configs/vendor/${vendorId}`);
    return response.data;
  },
  updateVendorConfig: async (configData: any) => {
    const response = await api.post("/vendor-configs", configData);
    return response.data;
  },
};

export const vendorService = {
  getStats: async (vendorId: string) => {
    const response = await api.get(`/vendors/${vendorId}/stats`);
    return response.data;
  },
  getBookings: async (vendorId: string) => {
    const response = await api.get(`/vendors/${vendorId}/bookings`);
    return response.data;
  },
  getPartners: async (vendorId: string) => {
    const response = await api.get(`/vendors/${vendorId}/partners`);
    return response.data;
  },
};

export default api;
