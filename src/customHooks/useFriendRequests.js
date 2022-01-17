import { useEffect, useState } from 'react';

// Firebase:
import { db, collection, onSnapshot, query, where, orderBy, limit } from '../firebase/config';


// Work with Cloud Firestore:
const useFriendRequests = (collectionName, params) => {
    // State:
    const [document, setDocument] = useState([]);


    // Side effects:
    useEffect(() => {
        // Create a reference to the collection:
        const collectionRef = collection(db, collectionName);

        // Create a query against the collection:
        const q = query(collectionRef,
            where('users', 'array-contains', params.userID),
            orderBy('createdAt', 'desc'),
            limit(params.limit)
        );

        // Listen for realtime updates:
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = [];
            snapshot.forEach((doc) => {
                data.push(doc.data());
            });

            setDocument(data);
        });

        // Cleanup function:
        return unsubscribe;

    }, [collectionName, params]);


    // Result:
    return document;
}

export default useFriendRequests;