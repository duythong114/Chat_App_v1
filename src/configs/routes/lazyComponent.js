import React from 'react';

const ChatRoom = React.lazy(() => import('../../pages/ChatRoomPage/ChatRoomPage'));
const LoginPage = React.lazy(() => import('../../pages/LoginPage/LoginPage'));

export {
    ChatRoom,
    LoginPage,
}