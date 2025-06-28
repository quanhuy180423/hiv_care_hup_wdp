import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Theme, AppSettings } from "@/types";

interface SettingsState extends AppSettings {
  updateTheme: (theme: Theme) => void;
  updateLanguage: (language: "vi" | "en") => void;
  toggleNotifications: () => void;
  resetSettings: () => void;
}

const defaultSettings: AppSettings = {
  theme: "system",
  language: "vi",
  notifications: true,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      ...defaultSettings,
      updateTheme: (theme) => set({ theme }),
      updateLanguage: (language) => set({ language }),
      toggleNotifications: () => set({ notifications: !get().notifications }),
      resetSettings: () => set(defaultSettings),
    }),
    {
      name: "app-settings",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
