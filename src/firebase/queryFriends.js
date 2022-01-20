import { db, collection, addDoc, getDocs, updateDoc, query, where, orderBy, limit } from './config';
import { capitalizeAllWords } from './services';


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
// Send friend request:
/**
 * 
 * @param {string} fromUID (called 'The First User') This is the user who want to make friend with someone. 
 * @param {string} toUID (called 'The Second User') This is the user who receives a friend request.
 * @returns {} 
 */
export async function sendFriendRequest(fromUID, toUID) {
    // Check params:
    if (fromUID === toUID) {
        alert('Bạn không thể kết bạn với chính mình!');
        return;
    }

    // Get date & time:
    const dUTC = new Date().toUTCString();

    // Add notifications for friend requests:
    const q1 = query(collection(db, 'notificationsForFriendRequests'),
        where("senderUID", "==", fromUID),
        where("receiverUID", "==", toUID),
        limit(1)
    );
    const querySnapshot1 = await getDocs(q1);
    if (querySnapshot1.docs.length === 0) {
        // Add data:
        await addDoc(collection(db, 'notificationsForFriendRequests'), {
            createdAt: dUTC,
            senderUID: fromUID,
            receiverUID: toUID,
            senderSeen: true,
            receiverSeen: false,
            state: 'pending',
            users: [fromUID, toUID]
        });
    }
}


// Cancel friend request:
export async function cancelFriendRequest(fromUID, toUID) {
    // Code this function later!
}


// Get friend requests bu uid:
/**
 * 
 * @param {string} uid Get friend requests by this user uid.
 * @returns {array} The list of friend requests.
 */
export async function getFriendRequestsByUID(uid) {
    // Check params:
    if (uid === '') {
        return;
    }

    // Get results:
    const q = query(collection(db, "notificationsForFriendRequests"), where("receiverUID", "==", uid));

    const querySnapshot = await getDocs(q);

    let results = [];

    querySnapshot.forEach((doc) => {
        const docData = doc.data();
        results.push(docData);
    });

    return results;
}


// Accept friend request:
/**
 * 
 * @param {string} fromUID (called 'The First User') This is the user who want to make friend with someone. 
 * @param {string} toUID (called 'The Second User') This is the user who receives a friend request.
 * @returns {} 
 */
export async function acceptFriendRequest(fromUID, toUID) {
    // Get date & time:
    const dUTC = new Date().toUTCString();

    // Update notifications for friend requests:
    const q = query(collection(db, 'notificationsForFriendRequests'),
        where("senderUID", "==", fromUID),
        where("receiverUID", "==", toUID),
        limit(1)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
        // Update data:
        await updateDoc(doc.ref, {
            createdAt: dUTC,
            senderSeen: false,
            receiverSeen: true,
            state: 'accepted'
        });
    });

    // Update friends & friendsFrom list of 'The First User':
    const q1 = query(collection(db, "friends"),
        where("uid", "==", fromUID),
        limit(1)
    );
    const querySnapshot1 = await getDocs(q1);
    querySnapshot1.forEach(async (doc) => {
        // Get current data:
        const currentFriends = doc.data().friends;
        const currentFriendsFrom = doc.data().friendsFrom;
        // Update data:
        await updateDoc(doc.ref, {
            friends: [...currentFriends, toUID],
            friendsFrom: [...currentFriendsFrom, dUTC]
        });
    });

    // Update friends & friendsFrom list of 'The Second User':
    const q2 = query(collection(db, "friends"),
        where("uid", "==", toUID),
        limit(1)
    );
    const querySnapshot2 = await getDocs(q2);
    querySnapshot2.forEach(async (doc) => {
        // Get current data:
        const currentFriends = doc.data().friends;
        const currentFriendsFrom = doc.data().friendsFrom;
        // Update data:
        await updateDoc(doc.ref, {
            friends: [...currentFriends, fromUID],
            friendsFrom: [...currentFriendsFrom, dUTC]
        });
    });
}


// Mark all notifications as read by uid:
/**
 * 
 * @param {string} uid Mark all notifications as read by the uid.
 * @returns {} 
 */
export async function markAllNotificationsAsReadByUID(uid) {
    // Mark all notifications as read for accepted requests were sent by this user:
    const q1 = query(collection(db, 'notificationsForFriendRequests'),
        where("senderUID", "==", uid),
        where("senderSeen", "==", false),
        where("state", "==", "accepted")
    );
    const querySnapshot1 = await getDocs(q1);
    querySnapshot1.forEach(async (doc) => {
        // Update data:
        await updateDoc(doc.ref, {
            senderSeen: true
        });
    });

    // Mark all notifications as read for new requests which this user received:
    const q2 = query(collection(db, 'notificationsForFriendRequests'),
        where("receiverUID", "==", uid),
        where("receiverSeen", "==", false)
    );
    const querySnapshot2 = await getDocs(q2);
    querySnapshot2.forEach(async (doc) => {
        // Update data:
        await updateDoc(doc.ref, {
            receiverSeen: true
        });
    });
}


// Get friends by name:
/**
 * 
 * @param {string} userId This is the id of the user who is searhing his friends.
 * @param {string} userName This is a keyword to search for. 
 * @param {array} excludedUsers The list of users to be excluded from the result list.
 * @returns {array} The list of users.
 */
export async function fetchFriendListByUserName(userId = '', userName = '', excludedUsers = []) {
    const capitalizedUsername = capitalizeAllWords(userName);

    let results = [];

    // 1. Get all friends' id:
    const qFriendList = query(collection(db, "friends"),
        where("friends", "array-contains", userId),
    );
    await getDocs(qFriendList)
        .then(async (res) => {
            // 2. Get personal info of each friend by userName:
            const listOfUsersInfo = await Promise.all(res.docs.map(async (doc) => {
                const qInfoList = query(collection(db, "users"),
                    where("uid", "==", doc.data().uid),
                    where("displayNameSearchKeywords", "array-contains-any", [userName, capitalizedUsername]),
                    orderBy("displayName"),
                    limit(1)
                );
                const qInfoListQuerySnapshot = await getDocs(qInfoList);
                let temp = null;
                qInfoListQuerySnapshot.forEach((qInfoDoc) => {
                    temp = { ...qInfoDoc.data() };
                });
                return temp;
            }));
            // Store data:
            results = listOfUsersInfo.filter((item) => {
                return !(item === null);
            });
        });

    // 3. Return result:
    return results;
}