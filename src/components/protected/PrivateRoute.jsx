import { Navigate } from 'react-router-dom';
import { useAuth } from '../wrapper/AuthProvider';
import paths from '../../constant/paths';

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ children }) => {
    const { user } = useAuth();

    return user ? children : <Navigate to={paths.login} replace />;
};

export default PrivateRoute;
