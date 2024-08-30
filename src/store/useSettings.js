import { create } from "zustand";

const useSettings = create((set) => ({
  activeSettings: {
    name: null, 
    isCRUD: false,
    item: {
      id: null,
      name: "",
      icon: null,
    }
  },
  
  setActiveSettings: {
    name: (name) => set((state) => ({
      activeSettings: { ...state.activeSettings, name }
    })),
    isCRUD: (isCRUD) => set((state) => ({
      activeSettings: { ...state.activeSettings, isCRUD }
    })),
    item: (item) => set((state) => ({
      activeSettings: { ...state.activeSettings, item }
    })),
  },
  
  resetActiveSettings: () => set({
    activeSettings: {
      name: "",
      isCRUD: false,
      item: { id: null, name: "", icon: null }
    }
  })
}));

export default useSettings;