import { useEffect, useState } from 'react';

// Firebase:
import { db, doc, onSnapshot } from '../firebase/config';


// Work with Cloud Firestore:
const useRoom = (roomId) => {
    // State:
    const [document, setDocument] = useState(null);


    // Side effects:
    useEffect(() => {
        if (roomId === '') {
            return;
        }

        // Listen for realtime updates:
        const unsubscribe = onSnapshot(doc(db, "rooms", roomId), (doc) => {
            setDocument(doc.data());
        });

        // Cleanup function:
        return () => {
            console.log(`Detach a listener for room ${roomId}`)
            return unsubscribe;
        };

    }, [roomId]);


    // Result:
    return document;
}

export default useRoom;