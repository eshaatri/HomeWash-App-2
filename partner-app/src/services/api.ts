import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const professionalService = {
  login: async (phone: string) => {
    const response = await api.post("/users/login", {
      phone,
      role: "PROFESSIONAL",
    });
    return response.data;
  },
  getJobs: async (professionalId: string) => {
    const response = await api.get(`/bookings/professional/${professionalId}`);
    return response.data;
  },
  updateJobStatus: async (
    jobId: string,
    status: string,
    additionalData?: any,
  ) => {
    const response = await api.patch(`/bookings/${jobId}/status`, {
      status,
      ...additionalData,
    });
    return response.data;
  },
  getWalletHistory: async (_professionalId: string) => {
    return [];
  },
  withdrawFunds: async (_professionalId: string, amount: number) => {
    return { success: true, message: "Withdrawal request submitted" };
  },
};

export default api;
