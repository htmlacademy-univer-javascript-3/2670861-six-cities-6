import { changeCity, setOffers } from './offers-slice';
import { setAuthStatus, setUser, logout } from './auth-slice';

export const actions = {
  changeCity,
  setOffers,
  setAuthStatus,
  setUser,
  logout,
};

export { changeCity, setOffers, setAuthStatus, setUser, logout };
