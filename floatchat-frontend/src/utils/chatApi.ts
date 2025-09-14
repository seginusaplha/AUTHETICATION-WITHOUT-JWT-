import axiosInstance from "@/lib/axiosInstance.ts";

export const chatApi = {
  sendMessage: async (message: string, sessionId?: string) => {
    try {
      const { data } = await axiosInstance.post("/chat/send", {
        message,
        sessionId, // if available, continue the same chat session
      });
      return { success: true, data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || "Server error",
      };
    }
  },

  getHistory: async () => {
    try {
      const { data } = await axiosInstance.get("/chat/history");
      return { success: true, data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to fetch history",
      };
    }
  },

  deleteSession: async (sessionId: string) => {
    try {
      const { data } = await axiosInstance.delete(`/chat/${sessionId}`);
      return { success: true, data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to delete session",
      };
    }
  },
};
