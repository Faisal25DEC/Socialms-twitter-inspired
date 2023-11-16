import { create } from "zustand";

interface MessageModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useMessageModal = create<MessageModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useMessageModal;
