import { collection, setDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "../config";

const createMessageService = async (data, collectionName) => {
    const { text, uid, photoURL, displayName, roomId } = data;

    const messageId = doc(collection(db, collectionName)).id;

    // Save the new room to Firestore
    await setDoc(doc(db, collectionName, messageId), {
        text,
        uid,
        photoURL,
        displayName,
        roomId,
        createdAt: Timestamp.now(), 
    });
};

export {
    createMessageService,
};
