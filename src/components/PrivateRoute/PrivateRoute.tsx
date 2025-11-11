import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@store/index';

type Props = {
  children: JSX.Element;
};

function PrivateRoute({ children }: Props): JSX.Element {
  const authorizationStatus = useSelector(
    (state: RootState) => state.authorizationStatus
  );
  const isAuthorized = authorizationStatus === 'AUTH';

  return isAuthorized ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;
