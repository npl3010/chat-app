import { db, collection, doc, getDoc, getDocs, updateDoc, deleteDoc, query, where, limit } from './config';


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


// Get room by room id:
/**
 * 
 * @param {string} roomID This is id of a room.
 * @returns {array} The room.
 */
export async function fetchRoomByRoomID(roomID = '') {
    const docRef = doc(db, "rooms", roomID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return {
            ...docSnap.data(),
            id: docSnap.id
        };
    } else {
        // doc.data() will be undefined in this case
        return null
    }
}


// Delete a room:
/**
 * 
 * @param {string} roomID This is id of a room. 
 */
export async function deleteRoomAndRelatedThings(roomID) {
    // 1. Delete a room:
    await deleteDoc(doc(db, "rooms", roomID));

    // 2. Find documents related to this room to delete:
    const q = query(collection(db, "notificationsForOthers"),
        where("objectID", "==", roomID),
        where("objectType", "==", "group-chat"),
        limit(1)
    );

    const querySnapshot = await getDocs(q);

    let documentIDToBeDeleted = '';
    let result = false;

    querySnapshot.forEach((document) => {
        documentIDToBeDeleted = document.id;
    });

    // 3. Delete documents by ID:
    if (documentIDToBeDeleted !== '') {
        await deleteDoc(doc(db, "notificationsForOthers", documentIDToBeDeleted));
        result = true;
    }

    return result;
}


// Leave a group chat room:
/**
 * 
 * @param {string} roomID This is id of a room. 
 * @param {string} userID The user who want to leave the room.
 */
export async function leaveRoom(roomID, userID) {
    const roomRef = doc(db, "rooms", roomID);
    const docSnap = await getDoc(roomRef);

    if (docSnap.exists()) {
        if (docSnap.data().members.includes(userID) === true) {
            // Preparation:
            let memberIndex = -1;
            const newMembers = docSnap.data().members.filter((memberID, index) => {
                if (memberID === userID) {
                    memberIndex = index;
                }
                return !(memberID === userID);
            });
            const newMembersAddedBy = [...docSnap.data().membersAddedBy];
            const newMembersRole = [...docSnap.data().membersRole];
            if (memberIndex !== -1) {
                newMembersAddedBy.splice(memberIndex, 1);
                newMembersRole.splice(memberIndex, 1);
            }

            // Final action:
            if (newMembers.length === 0) {
                // Delete data:
                deleteRoomAndRelatedThings(roomID);
            } else {
                // Update data:
                await updateDoc(docSnap.ref, {
                    members: newMembers,
                    membersAddedBy: newMembersAddedBy,
                    membersRole: newMembersRole
                });
            }
        }
    } else {
        // doc.data() will be undefined in this case.
    }
}


// Set role for a member of a room:
/**
 * 
 * @param {string} roomID This is id of a room. 
 * @param {string} userID The user who will has the new role.
 * @param {string} role New role: "group-admin", "group-member".
 */
export async function setRoleForChatRoomMember(roomID, userID, role) {
    const roomRef = doc(db, "rooms", roomID);
    const docSnap = await getDoc(roomRef);

    if (docSnap.exists()) {
        if (docSnap.data().members.includes(userID) === true) {
            const currentMembers = [...docSnap.data().members];
            const newMembersRole = [...docSnap.data().membersRole];

            // Preparation:
            let memberIndex = -1;
            for (let i = 0; i < currentMembers.length; i++) {
                if (currentMembers[i] === userID) {
                    memberIndex = i;
                    break;
                }
            }
            if (memberIndex !== -1) {
                newMembersRole[memberIndex] = role;
            }

            // Final action:
            if (memberIndex !== -1) {
                await updateDoc(docSnap.ref, {
                    membersRole: newMembersRole
                });
            }
        }
    } else {
        // doc.data() will be undefined in this case.
    }
}


// Rename a group chat room:
/**
 * 
 * @param {string} roomID This is id of a room. 
 * @param {string} newRoomName The new name for the room.
 */
export async function renameGroupChatRoom(roomID, newRoomName) {
    const roomRef = doc(db, "rooms", roomID);
    const docSnap = await getDoc(roomRef);

    if (docSnap.exists()) {
        // Update data:
        await updateDoc(docSnap.ref, {
            name: newRoomName
        });
        return true;
    } else {
        // doc.data() will be undefined in this case.
        return false;
    }
}