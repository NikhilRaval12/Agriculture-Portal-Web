import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthResponse } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (credentials: { username: string; password: string }) => Promise<void>;
  signUp: (data: {
    fullName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone?: string;
  }) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('agri_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('agri_token');
      if (storedToken) {
        try {
          const profile = await api.auth.getProfile();
          setUser(profile);
        } catch (e) {
          console.error('Session expired or invalid token:', e);
          localStorage.removeItem('agri_token');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const signIn = async (credentials: { username: string; password: string }) => {
    const res: AuthResponse = await api.auth.signIn(credentials);
    localStorage.setItem('agri_token', res.token);
    setToken(res.token);
    setUser({
      id: res.id,
      username: res.username,
      fullName: res.fullName,
      email: res.email,
      role: res.role,
    });
  };

  const signUp = async (data: {
    fullName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone?: string;
  }) => {
    const res: AuthResponse = await api.auth.signUp(data);
    localStorage.setItem('agri_token', res.token);
    setToken(res.token);
    setUser({
      id: res.id,
      username: res.username,
      fullName: res.fullName,
      email: res.email,
      role: res.role,
    });
  };

  const signOut = () => {
    localStorage.removeItem('agri_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
