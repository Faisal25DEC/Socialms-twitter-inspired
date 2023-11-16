import { initializeApp } from "firebase/app";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyDW59GvRjuk_sX1flDTAsYAs4yjsKKGUCA",
  authDomain: "twitter-messages-db.firebaseapp.com",
  projectId: "twitter-messages-db",
  storageBucket: "twitter-messages-db.appspot.com",
  messagingSenderId: "321811575834",
  appId: "1:321811575834:web:c89db5cebd12468bc40da3",
};

export const app = initializeApp(firebaseConfig);

export const storage = getStorage();
export const db = getFirestore();
export const createUserDocumentFromAuth = async (userAuth) => {
  if (!userAuth) return;
  console.log(userAuth.id);
  const userDocRef = doc(db, "users", userAuth.id);
  console.log(userDocRef);

  const userSnapshot = await getDoc(userDocRef);
  if (!userSnapshot.exists()) {
    const { id, username, name, email, profileImage } = userAuth;
    console.log("%ccreating user document", username, "color:green");
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        id,
        username,
        name,
        email,
        image: profileImage,
        createdAt,
      });

      const chatDocRef = doc(db, "userChats", userAuth.id);
      const chatSnapshot = await getDoc(chatDocRef);
      if (!chatSnapshot.exists()) {
        await setDoc(chatDocRef, {});
      }
    } catch (err) {
      console.log("error creating user", err.message);
    }
  }
  return userDocRef;
};
