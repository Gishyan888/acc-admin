import { create } from "zustand";

const useSeo = create((set) => ({
  activeSeo: {
    name: null, 
  },
  
  setActiveSeo: {
    name: (name) => set((state) => ({
      activeSeo: { ...state.activeSeo, name }
    }))
  },
  
  resetActiveSeo: () => set({
    activeSeo: {
      name: "",
    }
  })
}));

export default useSeo;