import { useEffect, useState } from 'react';

// Firebase:
import { db, collection, onSnapshot, query, where, orderBy } from '../firebase/config';


// Work with Cloud Firestore:
/**
 * 
 * @param {string} collectionName Name of document to listen for realtime updates.
 * @param {Object} condition This object is used for where() function.
 * { fieldName: 'az', operator: '==', value: 'abc' }
 * @returns {Array} List of updated results.
 */
const useFirestore = (collectionName, condition) => {
    // State:
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

            // Lưu ý: Dữ liệu thuộc collection được đọc từ database phải có field là createdAt:
            q = query(collectionRef, where(condition.fieldName, condition.operator, condition.value), orderBy("createdAt", "desc"));
        }
        else {
            // Lưu ý: Dữ liệu thuộc collection được đọc từ database phải có field là createdAt:
            q = query(collectionRef, orderBy("createdAt", "desc"));
        }

        // Listen for realtime updates:
        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const data = snapshot.docs.map((doc) => {
                    return ({
                        ...doc.data(),
                        createdAt: (doc.data().createdAt) && (doc.data().createdAt.toDate().toString()),
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