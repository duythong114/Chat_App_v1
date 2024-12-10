import { createContext, useContext, useMemo, useState } from 'react';
import { useAuth } from './AuthProvider';
import useFirestore from '../../hooks/useFirestore';

const AppContext = createContext(null);

// eslint-disable-next-line react/prop-types
export const AppProvider = ({ children }) => {
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [isInviteVisible, setIsInviteVisible] = useState(false)
    const [selectedRoomId, setSelectedRoomId] = useState('')

    const { user } = useAuth();

    // Room chat
    const roomsCondition = useMemo(() => {
        if (!user || !user.uid) {
            return null;
        }
        return {
            fieldName: 'members',
            operator: 'array-contains',
            compareValue: user.uid
        };
    }, [user]);

    const rooms = useFirestore('rooms', roomsCondition);
    // console.log("rooms:", rooms)

    const selectedRoom = useMemo(
        () => rooms.find(room => room.id === selectedRoomId) || {},
        [rooms, selectedRoomId]
    )

    // Member of roomchat
    const usersCondition = useMemo(() => {
        if (!user || !selectedRoom) {
            return null;
        }

        return {
            fieldName: 'uid',
            operator: 'in',
            compareValue: selectedRoom.members
        };
    }, [user, selectedRoom]);

    const members = useFirestore('users', usersCondition);

    // console.log("members:", members)

    const value = {
        rooms,
        isOpenModal,
        setIsOpenModal,
        selectedRoomId,
        setSelectedRoomId,
        selectedRoom,
        members,
        isInviteVisible,
        setIsInviteVisible,
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => {
    return useContext(AppContext);
};