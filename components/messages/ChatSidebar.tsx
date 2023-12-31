import { BiMessageAdd } from "react-icons/bi";
import Header from "../Header";
import ChatItem from "./ChatItem";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/utils/firebase";
import useCurrentUser from "@/hooks/useCurrentUser";
import useCurrentChat from "@/hooks/useCurrentChat";
import useMessageModal from "@/hooks/useMessageModal";

const ChatSidebar = () => {
  const [chats, setChats] = useState<any>({});
  const { data: currentUser } = useCurrentUser();
  const { currentChat, setCurrentChat } = useCurrentChat();
  const messageModal = useMessageModal();
  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.id), (doc) => {
        setChats(doc.data());
      });
    };
    currentUser?.id && getChats();
  }, [currentUser?.id]);
  return (
    <div className="w-[100%]">
      <Header
        label="Messages"
        showBackArrow
        Icon={BiMessageAdd}
        onClick={messageModal.onOpen}
      />
      {chats &&
        Object.entries(chats) &&
        Object.entries(chats)
          ?.sort((a: any, b: any) => b[1].date - a[1].date)
          .map((ele: any) => {
            return (
              <div
                key={ele[1].userInfo.id}
                onClick={() => {
                  setCurrentChat(currentUser, ele[1].userInfo);
                }}
              >
                {" "}
                <ChatItem
                  user={ele[1].userInfo}
                  fromChatSidebar
                  lastMessage={ele[1].lastMessage?.text.substring(0, 75)}
                />
              </div>
            );
          })}
    </div>
  );
};

export default ChatSidebar;
