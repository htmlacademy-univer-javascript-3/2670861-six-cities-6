import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@store/index';

type Props = {
  children: JSX.Element;
};

function PrivateRoute({ children }: Props): JSX.Element {
  const authorizationStatus = useAppSelector(
    (state) => state.authorizationStatus
  );
  const isAuthorized = authorizationStatus === 'AUTH';

  return isAuthorized ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;
