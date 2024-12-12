import React from 'react';
import {
    BrowserRouter,
    useRoutes,
    Navigate,
} from 'react-router-dom';
import routes from '../../configs/routes/routes';
import { Spin } from 'antd';

export function Routes(props) {
    // eslint-disable-next-line react/prop-types
    const { defaultRoute } = props;

    const defaultRouteObject = {
        index: true,
        path: '/',
        element: <Navigate to={defaultRoute} />,
    };

    const elements = useRoutes([defaultRouteObject, ...routes]);

    return (
        <React.Suspense
            fallback={
                <Spin size='large' />
            }
        >
            {elements}
        </React.Suspense>
    );
}

function Router(props) {

    return (
        <BrowserRouter>
            <Routes {...props} />
        </BrowserRouter>
    );
}

export default Router;
