import React from "react";
import Button from "../Button";
import useMessageModal from "@/hooks/useMessageModal";

const NoChat = () => {
  const messageModal = useMessageModal();
  return (
    <div
      className={`w-[50%] m-auto h-full  justify-center items-center flex-col gap-6 hidden md:flex `}
    >
      <p className="md:text-[30px] text-[25px] lg:text-[40px] font-semibold">
        Click on the button to start conversation
      </p>
      <Button label="Start Coversation" onClick={messageModal.onOpen} />
    </div>
  );
};

export default NoChat;
