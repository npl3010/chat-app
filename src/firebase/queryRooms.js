import { db, collection, doc, getDoc, getDocs, updateDoc, query, where } from './config';


// 1. INSTRUCTIONS:
// // Example of how to add Cloud Firestore document:
// await addDoc(collection(db, 'friends'), {
//     friends: []
// });


// // Example of how to update Cloud Firestore document:
// const friendsRef = doc(db, "friends", friendsDocID);
// await updateDoc(friendsRef, {
//     friends: []
// });


// 2. METHODS:
// Get rooms by uid:
/**
 * 
 * @param {string} userID This is user's id. 
 * @returns {array} The list of rooms.
 */
export async function fetchRoomListByUserID(userID = '') {
    const q = query(collection(db, "rooms"), where("members", "array-contains", userID));

    const querySnapshot = await getDocs(q);

    let results = [];

    querySnapshot.forEach((doc) => {
        results.push({
            ...doc.data(),
            createdAt: (doc.data().createdAt) && (doc.data().createdAt.toDate().toString()),
            lastActiveAt: (doc.data().lastActiveAt) && (doc.data().lastActiveAt.toDate().toString()),
            id: doc.id
        });
    });

    return results;
}


// Mark new messages of a room as read by uid:
/**
 * 
 * @param {string} uid The user who read the new messages.
 * @returns {} 
 */
export async function markNewMessagesAsReadByUID(roomID, userID) {
    const roomRef = doc(db, "rooms", roomID);
    const docSnap = await getDoc(roomRef);

    if (docSnap.exists()) {
        if (docSnap.data().isSeenBy.includes(userID) === false) {
            // Preparation:
            const newIsSeenBy = [...docSnap.data().isSeenBy];
            newIsSeenBy.push(userID);
            // Update data:
            await updateDoc(docSnap.ref, {
                isSeenBy: newIsSeenBy
            });
        }
    } else {
        // doc.data() will be undefined in this case.
    }
}