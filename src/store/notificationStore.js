import { create } from "zustand";

const useNotificationStore = create((set) => ({
  notification: null,
  setNotification: (msg) => set({ notification: msg }),
  clearNotification: () => set({ notification: null }),
}));

export default useNotificationStore;
