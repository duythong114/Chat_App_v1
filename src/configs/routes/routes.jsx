import { Outlet } from 'react-router-dom';
import NotFoundPage from '../../pages/NotFoundPage/NotFoundPage'
import LoginPage from '../../pages/LoginPage/LoginPage'
import paths from '../../constant/paths';
import AppLayout from '../../components/layout/AppLayout';
import {
    ChatRoom
} from './lazyComponent';
import PrivateRoute from '../../components/protected/PrivateRoute';

const extendedRoutes = [
    {
        index: true,
        path: paths.chatroom,
        element: (<PrivateRoute><ChatRoom /></PrivateRoute>),
    },
];

const routes = [
    {
        path: paths.default,
        element: (
            <AppLayout>
                <Outlet />
            </AppLayout>
        ),
        children: [
            ...extendedRoutes,
            {
                path: '*',
                element: <NotFoundPage />,
            },
        ],
    },
    {
        path: paths.login,
        element: <LoginPage />,
    },
];

export default routes;
