import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthProvider';
import useFirestore from '../../hooks/useFirestore';

const AppContext = createContext(null);

// eslint-disable-next-line react/prop-types
export const AppProvider = ({ children }) => {
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [isInviteVisible, setIsInviteVisible] = useState(false)
    const [selectedRoomId, setSelectedRoomId] = useState('')
    const [collapsed, setCollapsed] = useState(false);

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

    useEffect(() => {
        const handleResize = () => {
            setCollapsed(window.innerWidth <= 600);
        };

        // Lắng nghe sự kiện resize
        window.addEventListener('resize', handleResize);

        // Gọi hàm ngay lập tức để thiết lập trạng thái ban đầu
        handleResize();

        // Dọn dẹp sự kiện khi component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

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
        collapsed,
        setCollapsed,
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