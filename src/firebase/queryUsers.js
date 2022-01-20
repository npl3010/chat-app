import { db, getDocs, collection, query, where, orderBy, limit } from './config';
import { capitalizeAllWords } from './services';


// Get users by email:
/**
 * 
 * @param {string} userEmail This is a user's email to search for. 
 * @param {array} excludedUsers The list of users to be excluded from the result list.
 * @returns {array} The list of users.
 */
export async function fetchUserListByUserEmail(userEmail = '', excludedUsers = [], limitValue = 10) {
    const q = query(collection(db, "users"),
        where("email", "==", userEmail),
        orderBy("displayName"),
        limit(limitValue)
    );

    const querySnapshot = await getDocs(q);

    let results = [];

    querySnapshot.forEach((doc) => {
        const docData = doc.data();
        results.push(docData);
    });

    return results.filter((arrItem) => {
        return !excludedUsers.includes(arrItem.uid);
    });
}


// Get users by name:
/**
 * 
 * @param {string} userName This is a keyword to search for. 
 * @param {array} excludedUsers The list of users to be excluded from the result list.
 * @returns {array} The list of users.
 */
export async function fetchUserListByUserName(userName = '', excludedUsers = [], limitValue = 10) {
    const capitalizedUsername = capitalizeAllWords(userName);

    const q = query(collection(db, "users"),
        where("displayNameSearchKeywords", "array-contains-any", [userName, capitalizedUsername]),
        orderBy("displayName"),
        limit(limitValue)
    );

    const querySnapshot = await getDocs(q);

    let results = [];

    querySnapshot.forEach((doc) => {
        const docData = doc.data();
        results.push(docData);
    });

    return results.filter((arrItem) => {
        return !excludedUsers.includes(arrItem.uid);
    });
}


// Get users by uid:
/**
 * 
 * @param {string} userID This is a keyword to search for. 
 * @returns {array} The list of users.
 */
export async function fetchUserListByUserID(userID = '') {
    const q = query(collection(db, "users"), where("uid", "==", userID));

    const querySnapshot = await getDocs(q);

    let results = [];

    querySnapshot.forEach((doc) => {
        const docData = doc.data();
        results.push(docData);
    });

    return results;
}