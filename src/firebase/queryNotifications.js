import { db, collection, doc, getDoc, getDocs, updateDoc, query, where, limit } from './config';


// Mark a notification as read by uid:
/**
 * 
 * @param {*} notificationID Doc id for a notification.
 * @param {*} userID The user id.
 */
export async function markNotificationAsReadByUID(notificationID, userID) {
    const docRef = doc(db, "notificationsForOthers", notificationID);
    const docSnap = await getDoc(docRef);

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


// When adding new members to a group chat room, we have to notify them by add their uids to the notification item:
/**
 * 
 * @param {*} roomID Doc id for a room.
 * @param {*} listOfUserIDs This is the list of strings.
 */
export async function updateNotificationVisibleToUsers(roomID, listOfUserIDs = []) {
    if (listOfUserIDs.length > 0) {
        const q = query(collection(db, "notificationsForOthers"),
            where("objectID", "==", roomID),
            where("objectType", "==", "group-chat"),
            limit(1)
        );

        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(async (doc) => {
            // Preparation:
            const newUsers = [...doc.data().users, ...listOfUserIDs];
            // Update data:
            await updateDoc(doc.ref, {
                users: newUsers
            });
        });
    }
}