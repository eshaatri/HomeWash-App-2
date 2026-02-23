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
    const response = await api.post("/users/login", userData);
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

  // SubCategories
  getSubCategories: async () => {
    const response = await api.get("/subcategories");
    return response.data;
  },
  createSubCategory: async (data: any) => {
    const response = await api.post("/subcategories", data);
    return response.data;
  },
  updateSubCategory: async (id: string, data: any) => {
    const response = await api.patch(`/subcategories/${id}`, data);
    return response.data;
  },
  deleteSubCategory: async (id: string) => {
    const response = await api.delete(`/subcategories/${id}`);
    return response.data;
  },

  // Vendors
  getVendors: async () => {
    const response = await api.get("/vendors");
    return response.data;
  },
  createVendor: async (data: any) => {
    const response = await api.post("/vendors", data);
    return response.data;
  },
  updateVendor: async (id: string, data: any) => {
    const response = await api.patch(`/vendors/${id}`, data);
    return response.data;
  },
  deleteVendor: async (id: string) => {
    const response = await api.delete(`/vendors/${id}`);
    return response.data;
  },

  // Areas
  getAreas: async () => {
    const response = await api.get("/areas");
    return response.data;
  },
  createArea: async (data: any) => {
    const response = await api.post("/areas", data);
    return response.data;
  },
  updateArea: async (id: string, data: any) => {
    const response = await api.patch(`/areas/${id}`, data);
    return response.data;
  },
  deleteArea: async (id: string) => {
    const response = await api.delete(`/areas/${id}`);
    return response.data;
  },

  // Vendor Configs
  getVendorConfigs: async (vendorId: string) => {
    const response = await api.get(`/vendor-configs/vendor/${vendorId}`);
    return response.data;
  },
  updateVendorConfig: async (data: any) => {
    const response = await api.post("/vendor-configs", data);
    return response.data;
  },

  // Location / Boundaries
  getBoundary: async (params: {
    zipcode?: string;
    city?: string;
    name?: string;
  }) => {
    const response = await api.get("/location/boundary", { params });
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
