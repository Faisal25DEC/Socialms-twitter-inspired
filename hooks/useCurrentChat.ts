// useCurrentChat.js
import { create } from "zustand";
import useCurrentUser from "./useCurrentUser";

interface CurrentChatStore {
  currentChat: any;
  setCurrentChat: (currentUser: any, user: any) => void;
  setCurrentChatNull: () => void;
}

const useCurrentChat = create<CurrentChatStore>((set) => {
  return {
    currentChat: null,
    setCurrentChat: (currentUser: any, user: any) =>
      set({
        currentChat: {
          user,
          chatId:
            currentUser.id > user.id
              ? currentUser.id + user.id
              : user.id + currentUser.id,
        },
      }),
    setCurrentChatNull: () =>
      set({
        currentChat: null,
      }),
  };
});

export default useCurrentChat;
