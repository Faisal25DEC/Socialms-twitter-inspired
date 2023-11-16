import { db } from "@/utils/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import React, { useCallback, useState } from "react";
import Input from "../Input";
import ChatItem from "@/components/messages/ChatItem";
import Modal from "../Modal";
import useMessageModal from "@/hooks/useMessageModal";
import useCurrentUser from "@/hooks/useCurrentUser";
import useCurrentChat from "@/hooks/useCurrentChat";

const MessageModal = () => {
  const { currentChat, setCurrentChat } = useCurrentChat();
  const [searchedUsers, setSearchedUsers] = useState([]);
  const messageModal = useMessageModal();
  const { data: currentUser } = useCurrentUser();

  const handleSelect = async (user) => {
    //check whether the group(chats in firestore) exists, if not create
    console.log(user);
    const combinedId =
      currentUser.id > user.id
        ? currentUser.id + user.id
        : user.id + currentUser.id;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        //create user chats
        await updateDoc(doc(db, "userChats", currentUser.id), {
          [combinedId + ".userInfo"]: {
            id: user.id,
            name: user.name,
            image: user.image,
            username: user.username,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.id), {
          [combinedId + ".userInfo"]: {
            id: currentUser.id,
            name: currentUser.name,
            image: currentUser.profileImage,
            username: currentUser.username,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onSearch = useCallback(async (value) => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const usersArray = [];
    querySnapshot.forEach((e) => usersArray.push(e.data()));
    console.log(usersArray);
    const filteredUsers = usersArray.filter((e) =>
      e.name.toLowerCase().includes(value)
    );
    setSearchedUsers([...filteredUsers]);
  }, []);

  const bodyContent = (
    <div className="h-[35vh] overflow-scroll overflow-x-hidden">
      <Input
        onMessage
        placeholder="Search users"
        onChange={(e) => onSearch(e.target.value)}
      />
      {searchedUsers.map((ele) => {
        return ele.id !== currentUser.id ? (
          <div
            className="p-4"
            key={ele.id}
            onClick={() => {
              handleSelect(ele);
              setCurrentChat(currentUser, ele);
              messageModal.onClose();
            }}
          >
            <ChatItem user={ele} />
          </div>
        ) : null;
      })}
    </div>
  );

  return (
    <Modal
      isOpen={messageModal.isOpen}
      title="Search For Users"
      actionLabel="Search"
      onClose={messageModal.onClose}
      onSubmit={onSearch}
      body={bodyContent}
    />
  );
};

export default MessageModal;
