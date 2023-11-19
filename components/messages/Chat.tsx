import React, { RefObject, useEffect, useRef, useState } from "react";
import Header from "../Header";
import { BiImageAdd, BiSend, BiWindowClose } from "react-icons/bi";
import ChatHeader from "./ChatHeader";
import Message from "./Message";
import useCurrentChat from "@/hooks/useCurrentChat";
import {
  Timestamp,
  arrayUnion,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { v4 as uuid } from "uuid";
import { db, storage } from "@/utils/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import useCurrentUser from "@/hooks/useCurrentUser";
import NoChat from "./NoChat";
import { LoaderIcon } from "react-hot-toast";
import Avatar from "../Avatar";

const Chat = () => {
  const { currentChat, setCurrentChatNull } = useCurrentChat();
  const { data: currentUser } = useCurrentUser();
  const [uploadImageLoading, setUploadImageLoading] = useState(false);

  const [messages, setMessages] = useState([]);
  const [img, setImg] = useState<Blob | null>(null);
  const [text, setText] = useState<string>("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const scrollRef: RefObject<HTMLDivElement> = useRef(null);

  const [scroll, setScroll] = useState(0);
  const headerRef: RefObject<HTMLDivElement> = useRef(null);

  useEffect(() => {
    if (headerRef.current && scroll > 298) {
      headerRef.current.style.display = "flex";
    } else if (headerRef.current) {
      headerRef.current.style.display = "none";
    }
  }, [scroll]);

  useEffect(() => {
    const unSub =
      currentChat &&
      onSnapshot(doc(db, "chats", currentChat?.chatId), (doc: any) => {
        doc.exists() && setMessages(doc.data().messages);
      });
  }, [currentChat]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView();
  }, [messages]);

  const uploadImage = async (img: any) => {
    if (img) {
      setUploadImageLoading(true);
      console.log("image upload");
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);

      await new Promise<void>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          null,
          (error) => {
            console.error("Error uploading image:", error);
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL: string) => {
                setUploadedImage(downloadURL);
                setUploadImageLoading(false);

                resolve();
              }
            );
          }
        );
      });
    }
  };

  const handleSend = async () => {
    if (uploadedImage) {
      await updateDoc(doc(db, "chats", currentChat.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.id,
          date: Timestamp.now(),
          img: uploadedImage,
        }),
      });
    } else {
      await updateDoc(doc(db, "chats", currentChat.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.id,
          date: Timestamp.now(),
        }),
      });
    }

    await updateDoc(doc(db, "userChats", currentUser.id), {
      [currentChat.chatId + ".lastMessage"]: {
        text,
      },
      [currentChat.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", currentChat.user.id), {
      [currentChat.chatId + ".lastMessage"]: {
        text,
      },
      [currentChat.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setImg(null);
    setUploadedImage(null);
  };

  return currentChat ? (
    <>
      <div className="w-full overflow-hidden">
        <div
          className={`${
            headerRef.current?.style.display === "flex" ? "hidden" : "block"
          }`}
        >
          <Header
            label="Direct Messages"
            Icon={BiWindowClose}
            onClick={() => {
              setCurrentChatNull();
            }}
          />
        </div>
        <div
          ref={headerRef}
          className={` hidden gap-4 items-center bg-black p-4 h-16`}
        >
          <Avatar size="sm" userId={currentChat.user.id} />
          <p>{currentChat.user.name} </p>
          <BiWindowClose
            className="ml-auto"
            size={22}
            onClick={() => {
              setCurrentChatNull();
            }}
          />
        </div>
        <div
          onScroll={(e: any) => {
            setScroll(e.target.scrollTop);
          }}
          className="flex flex-col gap-4 p-10 overflow-scroll overflow-x-hidden"
          style={{
            height: "calc(100vh - 8rem)",
          }}
        >
          <ChatHeader />

          {messages?.map((m: any) => {
            return (
              <div key={m.id} ref={scrollRef}>
                <Message message={m} own={currentUser.id === m.senderId} />
              </div>
            );
          })}
        </div>
        <div className=" w-full">
          <div className="  w-full flex justify-between items-center px-8 gap-1 border-t-2">
            <input
              type="text"
              className="w-full border-none outline-none bg-transparent p-4"
              placeholder="Write your message"
              onChange={(e: any) => setText(e.target.value)}
              value={text}
              onKeyDown={(e) => {
                e.key === "Enter" && handleSend();
                e.key === "Enter" && setText("");
              }}
            />
            <div className="flex gap-4 items-center">
              <input
                type="file"
                name=""
                id="file"
                className="hidden"
                onChange={async (e: any) => {
                  await uploadImage(e.target.files[0]);
                }}
              />
              <label htmlFor="file" className="cursor-pointer hover:opacity-80">
                <BiImageAdd size={28} />
              </label>
            </div>
            <button
              onClick={() => {
                handleSend();
                setText("");
              }}
            >
              <BiSend size={28} />
            </button>
            <div>{uploadImageLoading && <LoaderIcon />}</div>
          </div>
        </div>
      </div>
      {uploadedImage && (
        <div className="bg-black absolute border-neutral-500 border-[1px] h-[35vh] w-[30rem] bottom-[10vh] right-0 flex justify-center items-center">
          <img
            alt="message-img"
            src={uploadedImage}
            className="w-[90%] h-[90%]  object-cover"
          />
        </div>
      )}
    </>
  ) : (
    <NoChat />
  );
};

export default Chat;
