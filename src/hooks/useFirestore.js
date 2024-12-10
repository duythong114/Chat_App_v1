import { useEffect, useState } from "react";
import { collection, query, orderBy, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";

const useFirestore = (collectionName, condition) => {
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        // Exit early if the condition is not valid
        if (!(condition && condition.compareValue && condition.compareValue.length)) return;

        // Build Firestore query
        const collectionRef = collection(db, collectionName);
        const firestoreQuery = query(
            collectionRef,
            orderBy("createdAt"),
            where(condition.fieldName, condition.operator, condition.compareValue)
        )

        // Subscribe to Firestore snapshot
        const unsubscribe = onSnapshot(firestoreQuery, (snapshot) => {
            const fetchedDocuments = snapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            setDocuments(fetchedDocuments);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [collectionName, condition]);

    return documents;
};

export default useFirestore;
