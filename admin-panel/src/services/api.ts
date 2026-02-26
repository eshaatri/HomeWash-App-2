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
<<<<<<< HEAD
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
  createService: async (serviceData: any) => {
    const response = await api.post("/services", serviceData);
    return response.data;
  },
  updateService: async (id: string, serviceData: any) => {
    const response = await api.put(`/services/${id}`, serviceData);
    return response.data;
  },
  deleteService: async (id: string) => {
    const response = await api.delete(`/services/${id}`);
    return response.data;
  },
  getCategories: async () => {
    const response = await api.get("/categories");
    return response.data;
  },
  createCategory: async (categoryData: any) => {
    const response = await api.post("/categories", categoryData);
    return response.data;
  },
  updateCategory: async (id: string, categoryData: any) => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },
  deleteCategory: async (id: string) => {
    const response = await api.delete(`/categories/${id}`);
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
=======
  createUser: async (userData: any) => {
    const response = await api.post("/users/login", userData);
>>>>>>> b5fc866eeee2083a79001363f3e10fb9620463df
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

  // Professionals (formerly Partners)
  getProfessionals: async () => {
    const response = await api.get("/users");
    return response.data.filter((u: any) => u.role === "PROFESSIONAL");
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
  assignProfessional: async (
    bookingId: string,
    professionalId: string,
    professionalName: string,
  ) => {
    const response = await api.patch(`/bookings/${bookingId}/status`, {
      status: "PROFESSIONAL_ASSIGNED",
      professionalId,
      professionalName,
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

  // Partners (formerly Vendors)
  getPartners: async () => {
    const response = await api.get("/partners");
    return response.data;
  },
  createPartner: async (data: any) => {
    const response = await api.post("/partners", data);
    return response.data;
  },
  updatePartner: async (id: string, data: any) => {
    const response = await api.patch(`/partners/${id}`, data);
    return response.data;
  },
  deletePartner: async (id: string) => {
    const response = await api.delete(`/partners/${id}`);
    return response.data;
  },

  // Partner Configs (formerly Vendor Configs)
  getPartnerConfigs: async (partnerId: string) => {
    const response = await api.get(`/partner-configs/partner/${partnerId}`);
    return response.data;
  },
  updatePartnerConfig: async (data: any) => {
    const response = await api.post("/partner-configs", data);
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

export const partnerService = {
  getStats: async (partnerId: string) => {
    const response = await api.get(`/partners/${partnerId}/stats`);
    return response.data;
  },
  getBookings: async (partnerId: string) => {
    const response = await api.get(`/partners/${partnerId}/bookings`);
    return response.data;
  },
  getProfessionals: async (partnerId: string) => {
    const response = await api.get(`/partners/${partnerId}/professionals`);
    return response.data;
  },
};

export default api;
