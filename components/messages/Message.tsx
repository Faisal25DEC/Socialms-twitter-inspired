import Avatar from "../Avatar";

const Message = ({ own, message }: { own?: boolean; message: any }) => {
  return (
    <div className={`flex   ${own ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex  items-center gap-4 max-w-[50%] rounded-sm p-4 ${
          own ? "bg-sky-600" : "bg-white"
        }
        ${own ? "text-white" : "text-black"}
        
        `}
      >
        <div className=" sm:hidden md:hidden lg:block">
          <Avatar size={"sm"} userId={message.senderId} />
        </div>
        <p className=" font-normal w-[75%] text-sm ">{message.text}</p>
      </div>
    </div>
  );
};

export default Message;
