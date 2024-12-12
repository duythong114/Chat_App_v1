import { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext(null);

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const userId = user?.uid

    useEffect(() => {
        const fetchUserData = async () => {
            if (!userId) return; // Exit if userId is not defined

            try {
                const userDoc = doc(db, 'users', userId);
                const userData = await getDoc(userDoc);

                if (userData.exists()) {
                    setUser(userData.data());
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, [userId]);

    const value = {
        user,
        setUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    return useContext(AuthContext);
};