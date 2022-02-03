import { useEffect, useState } from 'react';

// Firebase:
import { db, collection, onSnapshot, query, where, orderBy, limit } from '../firebase/config';


// Work with Cloud Firestore:
/**
 * 
 * @param {string} collectionName Name of document to listen for realtime updates.
 * @param {Object} params This object is used for where() function.
 * { userID: 'abc', limit: 15 }
 * @returns {Array} List of updated results.
 */
const useNotifications = (collectionName, params) => {
    // State:
    const [document, setDocument] = useState([]);


    // Side effects:
    useEffect(() => {
        // Return if params are invalid:
        if (!collectionName || !params.userID) {
            return;
        }

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
                data.push({
                    ...doc.data(),
                    id: doc.id
                });
            });

            setDocument(data);
        });

        // Cleanup function:
        return unsubscribe;

    }, [collectionName, params]);


    // Result:
    return document;
}

export default useNotifications;