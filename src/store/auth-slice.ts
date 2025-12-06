import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  authorizationStatus: AuthorizationStatus;
  user: AuthInfo | null;
}

const initialState: AuthState = {
  authorizationStatus: 'UNKNOWN',
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthStatus: (state, action: PayloadAction<AuthorizationStatus>) => {
      state.authorizationStatus = action.payload;
    },
    setUser: (state, action: PayloadAction<AuthInfo | null>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.authorizationStatus = 'NO_AUTH';
      state.user = null;
    },
  },
});

export const { setAuthStatus, setUser, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
