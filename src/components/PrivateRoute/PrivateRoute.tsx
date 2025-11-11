import { Navigate } from 'react-router-dom';

type Props = {
  children: JSX.Element;
  isAuthorized: boolean;
};

function PrivateRoute({ children, isAuthorized }: Props): JSX.Element {
  return isAuthorized ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;
