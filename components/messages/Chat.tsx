import React, { RefObject, useEffect, useRef, useState } from "react";
import Header from "../Header";
import { BiInfoCircle, BiSend } from "react-icons/bi";
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

const Chat = () => {
  const { currentChat, setCurrentChat } = useCurrentChat();
  const { data: currentUser } = useCurrentUser();

  const [messages, setMessages] = useState([]);
  const [img, setImg] = useState(null);
  const [text, setText] = useState<string>("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const scrollRef: RefObject<HTMLDivElement> = useRef(null);
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
  console.log(currentChat?.chatId);

  const handleSend = async () => {
    if (img) {
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
                await updateDoc(doc(db, "chats", currentChat.chatId), {
                  messages: arrayUnion({
                    id: uuid(),
                    text,
                    senderId: currentUser.id,
                    date: Timestamp.now(),
                    img: downloadURL,
                  }),
                });
                resolve();
              }
            );
          }
        );
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
  console.log(messages);

  return currentChat ? (
    <div className="  ">
      <Header label="Direct Messages" Icon={BiInfoCircle} />
      <div
        className="flex flex-col gap-4 p-10 overflow-scroll overflow-x-hidden"
        style={{ height: "calc(100vh - 7rem)" }}
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

      <div className="flex justify-between items-center px-8 gap-1 border-t-2">
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
        <button
          onClick={() => {
            handleSend();
            setText("");
          }}
        >
          <BiSend size={28} />
        </button>
      </div>
    </div>
  ) : (
    <NoChat />
  );
};

export default Chat;
