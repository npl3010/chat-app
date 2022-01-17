import { useEffect, useState } from 'react';

// Firebase:
import { db, collection, onSnapshot, query, where, limit } from '../firebase/config';


// Work with Cloud Firestore:
/**
 * 
 * @param {string} collectionName Name of document to listen for realtime updates.
 * @param {Object} condition This object is used for where() function.
 * { fieldName: 'az', operator: '==', value: 'abc' }
 * @returns {Array}} List of updated results.
 */
const useFirestoreSample = (collectionName, condition) => {
    // State:
    const [document, setDocument] = useState([]);


    // Side effects:
    useEffect(() => {
        // Create a reference to the collection:
        const collectionRef = collection(db, collectionName);

        // Create a query against the collection:
        const q = query(collectionRef, where(condition.fieldName, condition.operator, condition.value), limit(1));

        // Listen for realtime updates:
        const unsubscribe = onSnapshot(q, (snapshot) => {
            // Solution 1:
            // const data = snapshot.docs.map((doc) => {
            //     return ({
            //         ...doc.data()
            //     });
            // });
            // Solution 2:
            const data = [];
            snapshot.forEach((doc) => {
                data.push(doc.data());
            });

            setDocument(data);
        });

        // Cleanup function:
        return unsubscribe;

    }, [collectionName, condition]);


    // Result:
    return document;
}

export default useFirestoreSample;