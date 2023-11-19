import Image from "next/image";
import Avatar from "../Avatar";

const Message = ({ own, message }: { own?: boolean; message: any }) => {
  return (
    <div className="flex flex-col">
      <div className={`flex  flex-col ${own ? "items-end" : "items-start"}`}>
        <div
          className={`flex  items-center gap-4 max-w-[90%] md:max-w-[50%] rounded-sm 
        
        `}
        >
          <div>
            <Avatar size={"sm"} userId={message.senderId} />
          </div>
          <div
            className={`w-full p-4 ${own ? "bg-sky-600" : "bg-white"}
        ${own ? "text-white" : "text-bla-ck"}`}
          >
            <p className=" font-normal w-[100%] text-sm ">{message.text}</p>
          </div>
        </div>
        <div
          className={`w-[90%] md:w-[60%] lg:w-[50%] h-fit  ${
            own ? "items-end" : "items-start"
          } mt-6`}
        >
          {message.img && (
            <img
              alt="message-image"
              src={message.img}
              className="w-full h-full"
            />
          )}
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default Message;
