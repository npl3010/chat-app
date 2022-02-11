import { db, collection, doc, getDoc, addDoc, updateDoc, serverTimestamp } from '../firebase/config';
import formatRelative from 'date-fns/formatRelative'


// Add data to Cloud Firestore:
/**
 * 
 * @param {string} collectionName Name of collection.
 * @param {Object} data Data to be inserted.
 * @returns 
 */
export const addDocument = async (collectionName, data) => {
    const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp()
    });
    return docRef;
}


// Add data to Cloud Firestore without timestamp:
/**
 * 
 * @param {string} collectionName Name of collection.
 * @param {Object} data Data to be inserted.
 * @returns 
 */
export const addDocumentWithoutTimestamp = async (collectionName, data) => {
    const docRef = await addDoc(collection(db, collectionName), {
        ...data
    });
    return docRef;
}


// Add data to Cloud Firestore with timestamps:
/**
 * 
 * @param {string} collectionName Name of collection.
 * @param {Object} data Data to be inserted.
 * @param {Array} timestampKeys List of string.
 * @returns 
 */
export const addDocumentWithTimestamps = async (collectionName, data, timestampKeys) => {
    let timestamps = {};
    for (let i = 0; i < timestampKeys.length; i++) {
        if (typeof timestampKeys[i] === 'string') {
            timestamps[timestampKeys[i]] = serverTimestamp();
        }
    }
    const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        ...timestamps
    });
    return docRef;
}


// Update a document by its ID:
/**
 * 
 * @param {string} collectionName Name of collection.
 * @param {string} docID Id of a document.
 * @param {Object} data Updated data to be inserted.
 * @param {Array} timestampKeys List of string.
 * @returns 
 */
export const updateDocumentByIDWithTimestamps = async (collectionName, docID, data, timestampKeys) => {
    let timestamps = {};
    for (let i = 0; i < timestampKeys.length; i++) {
        if (typeof timestampKeys[i] === 'string') {
            timestamps[timestampKeys[i]] = serverTimestamp();
        }
    }
    const docRef = doc(db, collectionName, docID);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
        await updateDoc(docSnapshot.ref, {
            ...data,
            ...timestamps,
        });
    }

    return docRef;
}


// Create keywords for displayName.
// Keywords are used for implementing full-text search without third party (Elastic, Algolia,...).
/**
 * 
 * @param {string} displayName A user's full name.
 * @returns 
 */
export const generateUserNameKeywords = (displayName) => {

    // 1. List all permutations. Example: name = ["Nguyen", "Gia", "Tran"]
    // => Expected results: ["Nguyen", "Gia", "Tran"], ["Nguyen", "Tran", "Gia"], ["Tran", "Nguyen", "Gia"],...

    /**
     * - Prepare:
     */
    const name = displayName.split(' ').filter((word) => word); // Convert String to Array.
    const length = name.length;
    let flagArray = [];
    let result = [];
    let stringArray = [];

    /**
     * Create an array where all the elements are FALSE.
     * This array is used to check if a value at the corresponding array index is already used or not.
     **/
    for (let i = 0; i < length; i++) {
        flagArray[i] = false;
    }

    /**
     * Methods:
     */
    const createKeywords = (name) => {
        const arrName = [];
        let curName = '';
        name.split('').forEach((letter) => {
            curName += letter;
            arrName.push(curName);
        });
        return arrName;
    };

    const findPermutation = (k) => {
        for (let i = 0; i < length; i++) {
            if (!flagArray[i]) {
                flagArray[i] = true;
                result[k] = name[i];

                if (k === length - 1) {
                    stringArray.push(result.join(' '));
                }

                findPermutation(k + 1);
                flagArray[i] = false;
            }
        }
    }

    // Run:
    findPermutation(0);

    const keywords = stringArray.reduce((acc, cur) => {
        const words = createKeywords(cur);
        return [...acc, ...words];
    }, []);

    return keywords;
};


// (Pascal Case) Capitalize the first letter of a word:
/**
 * 
 * @param {string} word A word.
 * @returns 
 */
export const toPascalCaseForSingleWord = (word) => {
    if (word.length > 0) {
        return word[0].toUpperCase() + word.slice(1);
    }
    return '';
}


// (Pascal Case) Capitalize the first letter of each word:
/**
 * 
 * @param {string} text Text (contains multiple words).
 * @returns 
 */
export const toPascalCaseForAllWords = (text) => {
    const arrOfSubstr = text.split(" ")
    for (let i = 0; i < arrOfSubstr.length; i++) {
        arrOfSubstr[i] = toPascalCaseForSingleWord(arrOfSubstr[i]);
    }
    return arrOfSubstr.join(" ");
}


// Get current datetime from date string:
/**
 * 
 * @param {string} dateString A string
 * @returns {string}
 */
export const getDateAndTimeFromDateString = (dateString) => {
    const objDate = new Date(dateString);
    const strDateTime = objDate.toLocaleString();
    return strDateTime;
}


// Relative Date Formatting with date-fns:
/**
 * 
 * @param {string} dateString A string
 * @returns {string}
 */
export const formatDateTimeFromDateString = (dateString) => {
    let result = '';
    if (dateString) {
        result = formatRelative(
            new Date(dateString),
            new Date()
        );

        result = result.charAt(0).toUpperCase() + result.slice(1);
    }
    return result;
}