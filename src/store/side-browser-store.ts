import { create } from "zustand";

interface SideBrowserStore {
  isOpen: boolean;
  url: string;
  title: string;
  openBrowser: (url: string, title?: string) => void;
  closeBrowser: () => void;
}

export const useSideBrowserStore = create<SideBrowserStore>((set) => ({
  isOpen: false,
  url: "",
  title: "External Preview",
  openBrowser: (url, title = "External Preview") => set({ isOpen: true, url, title }),
  closeBrowser: () => set({ isOpen: false, url: "" }),
}));
