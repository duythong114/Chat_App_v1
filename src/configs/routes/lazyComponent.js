import React from 'react';

const HomePage = React.lazy(() => import('../../pages/HomePage/HomePage'));
const ChatPage = React.lazy(() => import('../../pages/ChatPage/ChatPage'));
const LoginPage = React.lazy(() => import('../../pages/LoginPage/LoginPage'));
const LoginPage2 = React.lazy(() => import('../../pages/LoginPage/LoginPage2'));

export {
    HomePage,
    ChatPage,
    LoginPage,
    LoginPage2,
}