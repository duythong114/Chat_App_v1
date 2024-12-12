import { Outlet } from 'react-router-dom';
import NotFoundPage from '../../pages/NotFoundPage/NotFoundPage'
import paths from '../../constant/paths';
import AppLayout from '../../components/layout/AppLayout';
import {
    HomePage,
    ChatPage,
    LoginPage2,
} from './lazyComponent';
import PrivateRoute from '../../components/protected/PrivateRoute';

const extendedRoutes = [
    {
        index: true,
        path: paths.home,
        element: (<HomePage />),
    },
    {
        path: paths.chatroom,
        element: (<ChatPage />),
    },
];

const routes = [
    {
        path: paths.default,
        element: (
            <PrivateRoute>
                <AppLayout>
                    <Outlet />
                </AppLayout>
            </PrivateRoute>
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
        element: <LoginPage2 />,
    },
];

export default routes;
