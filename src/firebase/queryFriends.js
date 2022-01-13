import { db, getDocs, updateDoc, collection, query, where, limit } from './config';


// Send friend request:
export async function sendFriendRequest(fromUID, toUID) {
    /**
     * 
     * @param {string} fromUID (called 'The First User') This is the user who want to make friend with someone. 
     * @param {string} toUID (called 'The Second User') This is the user who receives a friend request.
     * @returns {} 
     */

    // Example of how to update Cloud Firestore document:
    // const friendsRef = doc(db, "friends", friendsDocID);
    // await updateDoc(friendsRef, {
    //     friendRequestsSent: []
    // });


    // Update friendRequestsSent list of 'The First User':
    const q1 = query(collection(db, "friends"),
        where("uid", "==", fromUID),
        limit(1)
    );
    const querySnapshot1 = await getDocs(q1);
    querySnapshot1.forEach(async (doc) => {
        // Get current data:
        const currentFriendRequestsSent = doc.data().friendRequestsSent;
        // Update data:
        await updateDoc(doc.ref, {
            friendRequestsSent: [...currentFriendRequestsSent, toUID]
        });
    });

    // Update friendRequestsReceived list of 'The Second User':
    const q2 = query(collection(db, "friends"),
        where("uid", "==", toUID),
        limit(1)
    );
    const querySnapshot2 = await getDocs(q2);
    querySnapshot2.forEach(async (doc) => {
        // Get current data:
        const currentFriendRequestsReceived = doc.data().friendRequestsReceived;
        // Update data:
        await updateDoc(doc.ref, {
            friendRequestsReceived: [...currentFriendRequestsReceived, fromUID]
        });
    });
}