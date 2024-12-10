import { collection, setDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "../config";

const createRoomService = async (data, collectionName) => {
    const { description, name, members } = data;

    // Generate a unique ID for the new room document
    const roomId = doc(collection(db, collectionName)).id;

    // Save the new room to Firestore
    await setDoc(doc(db, collectionName, roomId), {
        description,
        name,
        members, // Expected to be an array of user IDs
        createdAt: Timestamp.now(), // Use Firestore's server timestamp
    });

    return
};

export {
    createRoomService,
};
