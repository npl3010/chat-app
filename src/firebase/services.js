import { db, collection, addDoc, serverTimestamp } from '../firebase/config';


// Add data to Cloud Firestore:
export const addDocument = async (collectionName, data) => {
    await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp()
    });
}