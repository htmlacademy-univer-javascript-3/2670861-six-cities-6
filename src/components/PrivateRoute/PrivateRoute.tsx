import { Navigate } from 'react-router-dom';

type PrivateRouteProps = {
  children: JSX.Element;
  isAuthorized: boolean;
};

function PrivateRoute({
  children,
  isAuthorized,
}: PrivateRouteProps): JSX.Element {
  return isAuthorized ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;
