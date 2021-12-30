import { useEffect, useState } from 'react';

// Firebase:
import { db, collection, onSnapshot, query, where, orderBy } from '../firebase/config';


// Work with Cloud Firestore:
const useFirestore = (collectionName, condition) => {
    // condition:
    /**
     * {
     *   fieldName: 'az',
     *   operator: '==',
     *   value: 'abc'
     * }
     */


    // States:
    const [document, setDocument] = useState([]);


    // Side effects:
    useEffect(() => {
        // Create a reference to the collection:
        const collectionRef = collection(db, collectionName);

        // Create a query against the collection:
        let q = null;
        if (condition) {
            if (!condition.value || condition.value.length === 0) {
                return;
            }
            q = query(collectionRef, where(condition.fieldName, condition.operator, condition.value), orderBy("createdAt"));
        }
        else {
            q = query(collectionRef, orderBy("createdAt"));
        }

        // Listen for realtime updates:
        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const data = snapshot.docs.map((doc) => {
                    return ({
                        ...doc.data(),
                        id: doc.id
                    });
                });

                setDocument(data);
            });

        // Cleanup function:
        return unsubscribe;

    }, [collectionName, condition]);


    // Result:
    return document;
}

export default useFirestore;