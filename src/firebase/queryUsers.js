import { db, getDocs, collection, query, where, orderBy, limit } from './config';
import { toPascalCaseForAllWords } from './services';


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
    const capitalizedUsername = toPascalCaseForAllWords(userName);

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


// Get list of users by list of uids:
/**
 * 
 * @param {string} listOfUserIDs This is the list of strings.
 * @returns {array} The list of users.
 */
export async function fetchUserListByUidList(listOfUserIDs = []) {
    const results = await Promise.all(listOfUserIDs.map(async (uid) => {
        const q = query(collection(db, "users"),
            where("uid", "==", uid),
            limit(1)
        );

        const querySnapshot = await getDocs(q);
        let temp = null;
        querySnapshot.forEach((doc) => {
            temp = {
                ...doc.data(),
                createdAt: (doc.data().createdAt) && (doc.data().createdAt.toDate().toString()),
                id: doc.id
            };
        });
        return temp;
    }));

    return results.filter((item) => {
        return !(item === null);
    });
}