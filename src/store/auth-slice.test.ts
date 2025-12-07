import { describe, it, expect } from 'vitest';
import { authReducer, setAuthStatus, setUser, logout } from './auth-slice';

const mockUser: AuthInfo = {
  id: 1,
  name: 'John Doe',
  avatarUrl: 'avatar.jpg',
  isPro: false,
  email: 'john@example.com',
  token: 'test-token',
};

describe('authSlice reducer', () => {
  const initialState = {
    authorizationStatus: 'UNKNOWN' as const,
    user: null,
  };

  it('should return the initial state', () => {
    const result = authReducer(undefined, { type: undefined });
    expect(result).toEqual(initialState);
  });

  describe('setAuthStatus action', () => {
    it('should set authorization status to AUTH', () => {
      const action = setAuthStatus('AUTH');
      const result = authReducer(initialState, action);

      expect(result.authorizationStatus).toBe('AUTH');
      expect(result.user).toBeNull();
    });

    it('should set authorization status to NO_AUTH', () => {
      const action = setAuthStatus('NO_AUTH');
      const result = authReducer(initialState, action);

      expect(result.authorizationStatus).toBe('NO_AUTH');
      expect(result.user).toBeNull();
    });

    it('should set authorization status to UNKNOWN', () => {
      const action = setAuthStatus('UNKNOWN');
      const result = authReducer(initialState, action);

      expect(result.authorizationStatus).toBe('UNKNOWN');
      expect(result.user).toBeNull();
    });
  });

  describe('setUser action', () => {
    it('should set user data', () => {
      const action = setUser(mockUser);
      const result = authReducer(initialState, action);

      expect(result.user).toEqual(mockUser);
      expect(result.authorizationStatus).toBe('UNKNOWN');
    });

    it('should set user to null', () => {
      const action = setUser(null);
      const result = authReducer(initialState, action);

      expect(result.user).toBeNull();
      expect(result.authorizationStatus).toBe('UNKNOWN');
    });
  });

  describe('logout action', () => {
    it('should reset state to logged out', () => {
      const stateWithUser = {
        authorizationStatus: 'AUTH' as const,
        user: mockUser,
      };

      const action = logout();
      const result = authReducer(stateWithUser, action);

      expect(result.authorizationStatus).toBe('NO_AUTH');
      expect(result.user).toBeNull();
    });

    it('should handle logout from unknown state', () => {
      const action = logout();
      const result = authReducer(initialState, action);

      expect(result.authorizationStatus).toBe('NO_AUTH');
      expect(result.user).toBeNull();
    });
  });
});
