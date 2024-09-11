import { create } from "zustand";

const usePagination = create((set) => ({
  currentPage: 1,
  setCurrentPage: (page) => set({ currentPage: page }),
}));

export default usePagination;
