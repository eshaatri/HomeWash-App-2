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
  getWalletHistory: async (partnerId: string) => {
    // Currently returns mock data as backend doesn't have a transaction model yet
    return [
      { date: "Feb 5, 2024", jobs: 4, amount: 2450 },
      { date: "Feb 4, 2024", jobs: 3, amount: 1800 },
      { date: "Feb 3, 2024", jobs: 5, amount: 3100 },
    ];
  },
  withdrawFunds: async (partnerId: string, amount: number) => {
    // Mock withdrawal request
    console.log(`Withdrawal requested for ${partnerId}: ₹${amount}`);
    return { success: true, message: "Withdrawal request submitted" };
  },
};

export default api;
