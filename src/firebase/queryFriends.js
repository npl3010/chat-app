import { db, collection, doc, addDoc, getDocs, updateDoc, deleteDoc, query, where, orderBy, limit } from './config';
import { toPascalCaseForAllWords } from './services';


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
// Get friend request between two users:
/**
 * 
 * @param {string} fromUID (called 'The First User') This is the user who want to make friend with someone.
 * @param {string} toUID (called 'The Second User') This is the user who receives a friend request.
 * @returns {} 
 */
export async function getFriendRequestsBetweenTwoUsers(fromUID, toUID) {
    let results = [];

    const q1 = query(collection(db, 'notificationsForFriendRequests'),
        where("senderUID", "==", fromUID),
        where("receiverUID", "==", toUID),
        where("state", "==", "pending"),
        limit(1)
    );
    const querySnapshot1 = await getDocs(q1);
    querySnapshot1.forEach((doc) => {
        results.push(doc.data());
    });

    const q2 = query(collection(db, 'notificationsForFriendRequests'),
        where("senderUID", "==", toUID),
        where("receiverUID", "==", fromUID),
        where("state", "==", "pending"),
        limit(1)
    );
    const querySnapshot2 = await getDocs(q2);
    querySnapshot2.forEach((doc) => {
        results.push(doc.data());
    });

    return results;
}


// Send friend request:
/**
 * 
 * @param {string} fromUID (called 'The First User') This is the user who want to make friend with someone.
 * @param {string} toUID (called 'The Second User') This is the user who receives a friend request.
 * @returns {Object} Object or null.
 */
export async function sendFriendRequest(fromUID, toUID) {
    // Check params:
    if (fromUID === toUID) {
        alert('Bạn không thể kết bạn với chính mình!');
        return null;
    }

    // Get date & time:
    const dUTC = new Date().toUTCString();

    // Add notifications for friend requests if there are no friend requests between these users:
    const q1 = query(collection(db, 'notificationsForFriendRequests'),
        where("senderUID", "==", fromUID),
        where("receiverUID", "==", toUID),
        limit(1)
    );
    const q2 = query(collection(db, 'notificationsForFriendRequests'),
        where("senderUID", "==", toUID),
        where("receiverUID", "==", fromUID),
        limit(1)
    );

    const [querySnapshot1, querySnapshot2] = await Promise.all([
        getDocs(q1),
        getDocs(q2)
    ]);

    let docRef = null;

    if (querySnapshot1.docs.length === 0 && querySnapshot2.docs.length === 0) {
        // Add friend request:
        docRef = await addDoc(collection(db, 'notificationsForFriendRequests'), {
            createdAt: dUTC,
            senderUID: fromUID,
            receiverUID: toUID,
            senderSeen: true,
            receiverSeen: false,
            state: 'pending',
            users: [fromUID, toUID]
        });
    }

    return docRef;
}


// Cancel friend request sent:
export async function cancelFriendRequestSent(fromUID, toUID) {
    // 1. Find document to delete:
    const q = query(collection(db, 'notificationsForFriendRequests'),
        where("senderUID", "==", fromUID),
        where("receiverUID", "==", toUID),
        where("state", "==", "pending")
    );

    const querySnapshot = await getDocs(q);

    let documentIDToBeDeleted = '';
    let result = false;

    querySnapshot.forEach((document) => {
        documentIDToBeDeleted = document.id;
    });

    // 2. Delete document by its ID:
    if (documentIDToBeDeleted !== '') {
        await deleteDoc(doc(db, "notificationsForFriendRequests", documentIDToBeDeleted));
        result = true;
    }

    return result;
}


// Delete all friend requests between two users:
/**
 * 
 * @param {string} fromUID (called 'The First User').
 * @param {string} toUID (called 'The Second User').
 * @returns {Object} Object or null.
 */
export async function deleteFriendRequestBetweenTwoUsers(fromUID, toUID) {
    const params = [
        { from: fromUID, to: toUID },
        { from: toUID, to: fromUID }
    ];

    const results = await Promise.all(
        params.map(async (params) => {
            // 1. Find document to delete:
            const q = query(collection(db, 'notificationsForFriendRequests'),
                where("senderUID", "==", params.from),
                where("receiverUID", "==", params.to),
            );

            const querySnapshot = await getDocs(q);

            let documentIDToBeDeleted = '';
            let result = false;

            querySnapshot.forEach((document) => {
                documentIDToBeDeleted = document.id;
            });

            // 2. Delete document by its ID:
            if (documentIDToBeDeleted !== '') {
                await deleteDoc(doc(db, "notificationsForFriendRequests", documentIDToBeDeleted));
                result = true;
            }

            return result;
        })
    );

    return results.every((element) => {
        return element === true;
    });
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

    // If there is no friend request between them, do not update their friend lists:
    if (querySnapshot.docs.length === 0) {
        return false;
    } else {
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

        return true;
    }
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


// Get all friends of a user by user's id:
/**
 * 
 * @param {string} userID This is the id of the user who is searhing his friends.
 * @param {array} excludedUsers The list of users to be excluded from the result list.
 * @returns {array} The list of users.
 */
export async function fetchFriendListOfUser(userID = '', excludedUsers = []) {
    let results = [];

    // 1. Get all friends' id:
    const qFriendList = query(collection(db, "friends"),
        where("friends", "array-contains", userID),
    );
    await getDocs(qFriendList)
        .then(async (res) => {
            // 2. Get personal info of each friend by userName:
            const listOfUsersInfo = await Promise.all(res.docs.map(async (doc) => {
                const qInfoList = query(collection(db, "users"),
                    where("uid", "==", doc.data().uid),
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


// Get friends by name:
/**
 * 
 * @param {string} userID This is the id of the user who is searhing his friends.
 * @param {string} userName This is a keyword to search for. 
 * @param {array} excludedUsers The list of users to be excluded from the result list.
 * @returns {array} The list of users.
 */
export async function fetchFriendListByUserName(userID = '', userName = '', excludedUsers = []) {
    const capitalizedUsername = toPascalCaseForAllWords(userName);

    let results = [];

    // 1. Get all friends' id:
    const qFriendList = query(collection(db, "friends"),
        where("friends", "array-contains", userID),
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


// Unfriend:
/**
 * 
 * @param {string} fromUID (called 'The First User') This is the user who want to unfriend someone. 
 * @param {string} toUID (called 'The Second User') This is the user who is unfriended by 'The First User'.
 * @returns {} 
 */
export async function unfriend(fromUID, toUID) {
    // 1. Update the friend list of both users:
    const q = query(collection(db, 'friends'),
        where("uid", "in", [fromUID, toUID]),
    );

    const querySnapshot = await getDocs(q);

    let results1 = await Promise.all(
        querySnapshot.docs.map(async (document) => {
            let uidToBeRemoved = '';
            if (document.data().uid === fromUID) {
                uidToBeRemoved = toUID;
            } else if (document.data().uid === toUID) {
                uidToBeRemoved = fromUID;
            }

            // Preparation:
            let indexOfFriendList = -1;
            const newFriends = document.data().friends.filter((fID, i) => {
                if (fID === uidToBeRemoved) {
                    indexOfFriendList = i;
                    return false;
                } else {
                    return true;
                }
            });

            let newFriendsFrom = [...document.data().friendsFrom];
            if (indexOfFriendList !== -1) {
                newFriendsFrom.splice(indexOfFriendList, 1);
            }

            // Update data:
            await updateDoc(document.ref, {
                friends: newFriends,
                friendsFrom: newFriendsFrom
            });

            return true;
        })
    );

    results1 = results1.every((element) => {
        return element === true;
    });

    // 2. Delete all friend requests between them:
    const results2 = deleteFriendRequestBetweenTwoUsers(fromUID, toUID);

    // 3. Return result:
    if (results1 === results2 && results1 === true) {
        return true;
    }
    return false;
}