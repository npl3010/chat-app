import { useEffect, useState } from 'react';

// Firebase:
import { db, collection, onSnapshot, query, where, limit } from '../firebase/config';


// Work with Cloud Firestore:
const useFirestoreSample = (collectionName, condition) => {
    // condition (This object is used for where() function):
    /**
     * {
     *   fieldName: 'az',
     *   operator: '==',
     *   value: 'abc'
     * }
     */


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