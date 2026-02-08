import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const partnerService = {
  login: async (phone: string) => {
    const response = await api.post("/users/login", { phone, role: "PARTNER" });
    return response.data;
  },
  getJobs: async (partnerId: string) => {
    const response = await api.get(`/bookings/partner/${partnerId}`);
    return response.data;
  },
  updateJobStatus: async (jobId: string, status: string) => {
    const response = await api.patch(`/bookings/${jobId}/status`, { status });
    return response.data;
  },
};

export default api;
