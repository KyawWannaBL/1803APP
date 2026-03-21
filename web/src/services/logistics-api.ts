import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api/v1",
  withCredentials: true,
});
const adminEdge = (action: string) => api.get("/enterprise-admin", { params: { action } });
export const LogisticsApi = {
  async getAdminMetrics() { const res = await adminEdge("metrics"); return res.data; },
  async getRegionalLoads() { const res = await adminEdge("regional_loads"); return res.data.items || []; },
  async getPendingApprovals() { const res = await adminEdge("pending_tasks"); return res.data.items || []; },
  async getActivityTimeline() { const res = await adminEdge("activity_feed"); return res.data.items || []; }
};
