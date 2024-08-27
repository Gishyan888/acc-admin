import { create } from "zustand";
const useCategory = create((set) => ({
  activeCategory: {},
  setActiveCategory: (category) => set({ activeCategory: category }),
}));

export default useCategory;
