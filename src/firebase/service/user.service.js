import { collection, getDocs, query, where, setDoc, doc } from 'firebase/firestore';
import { db } from '../config';

const authService = async (data, collectionName) => {
    const { displayName, email, uid, photoURL, providerId, keywords } = data;

    // Use the `collectionName` parameter to specify the collection
    const q = query(collection(db, collectionName), where('uid', '==', uid));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        // Save new user to Firestore with safe values
        await setDoc(doc(db, collectionName, uid), {
            displayName,
            email,
            uid,
            photoURL,
            providerId,
            keywords,
            createdAt: new Date(),
        });
        return true;  // User is new
    } else {
        return false;  // User is old
    }
};

// tao keywords cho displayName, su dung cho search
const generateKeywords = (displayName) => {
    // liet ke tat cac hoan vi. vd: name = ["David", "Van", "Teo"]
    // => ["David", "Van", "Teo"], ["David", "Teo", "Van"], ["Teo", "David", "Van"],...
    const lowwerCaseName = displayName.toLowerCase()

    const name = lowwerCaseName.split(' ').filter((word) => word);

    const length = name.length;
    let flagArray = [];
    let result = [];
    let stringArray = [];

    /**
     * khoi tao mang flag false
     * dung de danh dau xem gia tri
     * tai vi tri nay da duoc su dung
     * hay chua
     **/
    for (let i = 0; i < length; i++) {
        flagArray[i] = false;
    }

    const createKeywords = (name) => {
        const arrName = [];
        let curName = '';
        name.split('').forEach((letter) => {
            curName += letter;
            arrName.push(curName);
        });
        return arrName;
    };

    function findPermutation(k) {
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

    findPermutation(0);

    const keywords = stringArray.reduce((acc, cur) => {
        const words = createKeywords(cur);
        return [...acc, ...words];
    }, []);

    return keywords;
};

export {
    authService,
    generateKeywords,
}