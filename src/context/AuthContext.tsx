import React, { createContext, useContext, useState } from 'react';
import { authService } from '../services/authService';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (emailOrPhone: string, password: string) => Promise<void>;
  signup: (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    location: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (fields: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = async (emailOrPhone: string, password: string) => {
    setIsLoading(true);
    try {
      const loggedUser = await authService.login(emailOrPhone, password);
      setUser(loggedUser);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    location: string;
  }) => {
    setIsLoading(true);
    try {
      const newUser = await authService.signup(userData);
      setUser(newUser);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (fields: Partial<User>) => {
    setIsLoading(true);
    try {
      const updated = await authService.updateProfile(fields);
      setUser(updated);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
