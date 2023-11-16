import Chat from "@/components/messages/Chat";
import ChatSidebar from "@/components/messages/ChatSidebar";
import useCurrentUser from "@/hooks/useCurrentUser";
import React, { useEffect } from "react";
import { createUserDocumentFromAuth } from "@/utils/firebase";

const Messages = () => {
  const { data: currentUser } = useCurrentUser();

  useEffect(() => {
    const initializeDoc = async () => {
      const res = await createUserDocumentFromAuth(currentUser);
    };
    currentUser && initializeDoc();
  }, [currentUser]);
  return (
    <div className="flex flex-row h-full">
      <div className="flex-[1] text-white border-r-[1px] border-neutral-600">
        <ChatSidebar />
      </div>
      <div className="flex-[2] text-white">
        <Chat />
      </div>
    </div>
  );
};

export default Messages;
