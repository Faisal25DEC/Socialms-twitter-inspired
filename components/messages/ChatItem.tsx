import React from "react";
import Avatar from "../Avatar";
import Image from "next/image";

const ChatItem = ({
  user,
  fromChatSidebar,
  lastMessage,
}: {
  user: any;
  fromChatSidebar?: boolean;
  lastMessage?: string;
}) => {
  return (
    <div className="p-4 border-b-[1px] border-neutral-600 hover:bg-neutral-700 cursor-pointer">
      <div className="flex flex-row justify-start items-center gap-4  ">
        <Avatar userId={user?.id} />
        <p className="text-neutral-100">{user.name}</p>
      </div>
      {fromChatSidebar && (
        <p className="text-gray-300 text-right">{lastMessage}</p>
      )}
    </div>
  );
};

export default ChatItem;
