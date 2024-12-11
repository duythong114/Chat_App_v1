import React from 'react';

const ChatRoom = React.lazy(() => import('../../pages/ChatRoomPage/ChatRoomPage'));
const LoginPage = React.lazy(() => import('../../pages/LoginPage/LoginPage'));
const LoginPage2 = React.lazy(() => import('../../pages/LoginPage/LoginPage2'));

export {
    ChatRoom,
    LoginPage,
    LoginPage2,
}