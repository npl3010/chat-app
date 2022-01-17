import { useEffect, useState } from 'react';

// Firebase:
import { db, collection, onSnapshot, query, where, orderBy } from '../firebase/config';


// Work with Cloud Firestore:
/**
 * 
 * @param {string} collectionName Name of document to listen for realtime updates.
 * @param {Object} condition This object is used for where() function.
 * { fieldName: 'az', operator: '==', value: 'abc' }
 * @param {Array} orderByFields List of field names.
 * @returns {Array} List of updated results.
 */
const useFirestoreCustomized = (collectionName, condition, orderByFields) => {
    // State:
    const [document, setDocument] = useState([]);


    // Side effects:
    useEffect(() => {
        // Return if params are invalid:
        if (collectionName === '') {
            return;
        }

        // Create a reference to the collection:
        const collectionRef = collection(db, collectionName);

        // Create a query against the collection:
        let q = null;
        if (condition !== null && Object.keys(condition).length > 0) {
            if (Array.isArray(orderByFields) === true) {
                if (orderByFields.length > 0) {
                    q = query(collectionRef, where(condition.fieldName, condition.operator, condition.value), orderBy(...orderByFields));
                } else {
                    q = query(collectionRef, where(condition.fieldName, condition.operator, condition.value));
                }
            } else {
                q = query(collectionRef, where(condition.fieldName, condition.operator, condition.value));
            }
        }
        else {
            if (Array.isArray(orderByFields) === true) {
                if (orderByFields.length > 0) {
                    q = query(collectionRef, orderBy(...orderByFields));
                } else {
                    q = query(collectionRef);
                }
            } else {
                q = query(collectionRef);
            }
        }

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

    }, [collectionName, condition, orderByFields]);


    // Result:
    return document;
}

export default useFirestoreCustomized;