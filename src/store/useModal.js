import { create } from "zustand";
const useModal = create((set) => ({
  isModalOpen: false,
  setModalState: (state) => set({ isModalOpen: state }),
}));

export default useModal;
