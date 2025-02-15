import {
  useState,
  useContext,
  createContext,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { UserCookie } from '@/types';

const DEFAULT_EXPIRATION_DAYS = 15;

type AuthContextType = {
  token: string;
  loggedIn: boolean;
  expiresAt: string;
  isAuthTokenValid: () => boolean;
  logout: () => void;
  getUserId: () => string | void;
  loggin: (jwt: string) => void;
  handleSaveUserInCookie: (user: UserCookie) => void;
  handleDeleteUserInCookie: () => void;
  handleGetUserFromCookie: () => UserCookie | undefined;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const storedToken = String(localStorage.getItem('auth_token')) || '';
  const storedLoggedIn = Boolean(localStorage.getItem('logged'));
  const storedExpiresAt = String(localStorage.getItem('expires_at')) || '';

  const [token, setToken] = useState<string>(storedToken);
  const [loggedIn, setLoggedIn] = useState<boolean>(storedLoggedIn);
  const [expiresAt, setExpiresAt] = useState<string>(storedExpiresAt);

  const isAuthTokenValid = useCallback((): boolean => {
    if (!loggedIn) return false;
    if (!expiresAt) return false;
    const expiresDate = new Date(expiresAt);
    const now = new Date();
    return now < expiresDate;
  }, [loggedIn, expiresAt]);

  const getUserId = useCallback((): string | void => {
    if (!loggedIn || !token) return;
    const decodedToken = jwtDecode<{ sub: string }>(token);
    return decodedToken.sub;
  }, [loggedIn, token]);

  const logout = useCallback(() => {
    if (!loggedIn) return;
    localStorage.setItem('logged', 'false');
    localStorage.setItem('auth_token', '');
    localStorage.setItem('expires_at', '');
    setToken('');
    setLoggedIn(false);
    setExpiresAt('');
  }, [loggedIn]);

  const loggin = useCallback((jwt: string) => {
    const durationDays = DEFAULT_EXPIRATION_DAYS;
    const now = new Date();
    const expiresAt = new Date(
      now.getTime() + durationDays * 24 * 60 * 60 * 1000
    );
    localStorage.setItem('logged', 'true');
    localStorage.setItem('auth_token', jwt);
    localStorage.setItem('expires_at', String(expiresAt));
    setToken(jwt);
    setLoggedIn(true);
    setExpiresAt(String(expiresAt));
  }, []);

  const handleSaveUserInCookie = (user: UserCookie) => {
    Cookies.set('user', JSON.stringify(user), {
      expires: 15,
    });
  };

  const handleDeleteUserInCookie = () => {
    Cookies.remove('user');
  };

  const handleGetUserFromCookie = (): UserCookie | undefined => {
    const userCookie = Cookies.get('user');
    const user: UserCookie | undefined = userCookie
      ? JSON.parse(userCookie)
      : undefined;

    return user;
  };

  const value = useMemo(
    () => ({
      token,
      loggedIn,
      expiresAt,
      logout,
      getUserId,
      isAuthTokenValid,
      loggin,
      handleSaveUserInCookie,
      handleDeleteUserInCookie,
      handleGetUserFromCookie,
    }),
    [
      token,
      loggedIn,
      expiresAt,
      logout,
      getUserId,
      isAuthTokenValid,
      loggin,
      handleSaveUserInCookie,
      handleDeleteUserInCookie,
      handleGetUserFromCookie,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
