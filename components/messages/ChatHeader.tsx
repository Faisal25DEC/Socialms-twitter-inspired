import useCurrentChat from "@/hooks/useCurrentChat";
import Avatar from "../Avatar";

const ChatHeader = () => {
  const { currentChat } = useCurrentChat();
  return (
    <div className="flex flex-col justify-center items-center gap-4 p-10">
      <Avatar userId={currentChat.user.id} isLarge />
      <p className="text-2xl text-white">{currentChat.user.name}</p>
      <p className="text text-neutral-400">{currentChat.user.username}</p>
    </div>
  );
};

export default ChatHeader;
