import { db, collection, addDoc, serverTimestamp } from '../firebase/config';


// Add data to Cloud Firestore:
export const addDocument = async (collectionName, data) => {
    const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp()
    });
    return docRef;
}


// Add data to Cloud Firestore without timestamp:
export const addDocumentWithoutTimestamp = async (collectionName, data) => {
    const docRef = await addDoc(collection(db, collectionName), {
        ...data
    });
    return docRef;
}


// Create keywords for displayName.
// Keywords are used for implementing full-text search without third party (Elastic, Algolia,...).
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


// Capitalize text:
export const capitalizeSingleWord = (word) => {
    if (word.length > 0) {
        return word[0].toUpperCase() + word.slice(1);
    }
    return '';
}

export const capitalizeAllWords = (text) => {
    const arrOfSubstr = text.split(" ")
    for (let i = 0; i < arrOfSubstr.length; i++) {
        arrOfSubstr[i] = capitalizeSingleWord(arrOfSubstr[i]);
    }
    return arrOfSubstr.join(" ");
}