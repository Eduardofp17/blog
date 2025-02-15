import apiUrl from '@/config/apiConfig';
import { User, Response } from '@/types';
import React, { useState, useContext, createContext } from 'react';
import { useAuthContext } from './AuthContext';

type GlobalContextType = {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  handleGetUser: () => void;
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function GlobalProvider({ children }: { children: React.ReactNode }) {
  const { getUserId, handleGetUserFromCookie, loggedIn } = useAuthContext();
  const sub = getUserId();
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User>({
    _id: '',
    email: '',
    username: '',
    profilePic: '',
    name: '',
    lastname: '',
    email_verified: false,
    createdAt: '',
    updatedAt: '',
  });

  const handleGetUser = async () => {
    try {
      if (!handleGetUserFromCookie() && loggedIn) return;

      const response = await fetch(`${apiUrl}/users/${sub}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Internal Server Error');
      }
      const json: Response = await response.json();
      if (!json.success) return;
      const data = (json.data ?? user) as User;
      setUser(data);
    } catch (err) {
      throw new Error('Internal Server Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlobalContext.Provider
      value={{ loading, setLoading, handleGetUser, user, setUser }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalContext() {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
}
