'use client';

import React, { createContext, useContext } from 'react';
import { useStore } from '@/context/StoreContext';
import { UserProfile } from '@/types';

export interface AuthContextType {
  user: UserProfile | null;
  role: 'admin' | 'customer' | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signIn: (email: string, role?: 'admin' | 'customer') => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = useStore();

  const user = store.currentUser;
  const role = user?.role || null;
  const isAuthenticated = !!user;
  const isAdmin = role === 'admin';

  const signIn = async (email: string, requestedRole?: 'admin' | 'customer') => {
    const isKeina =
      requestedRole === 'admin' ||
      email.toLowerCase().includes('admin') ||
      email.toLowerCase().includes('keina');
    if (isKeina) {
      store.loginAsDemoAdmin();
    } else {
      store.loginAsDemoCustomer();
    }
  };

  const signOut = async () => {
    store.logout();
  };

  const signUp = async () => {
    store.loginAsDemoCustomer();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        isAdmin,
        signIn,
        signOut,
        signUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  const store = useStore();

  if (context) {
    return context;
  }

  const user = store.currentUser;
  const role = user?.role || null;
  const isAuthenticated = !!user;
  const isAdmin = role === 'admin';

  return {
    user,
    role,
    isAuthenticated,
    isAdmin,
    signIn: async (email: string, requestedRole?: 'admin' | 'customer') => {
      const isKeina =
        requestedRole === 'admin' ||
        email.toLowerCase().includes('admin') ||
        email.toLowerCase().includes('keina');
      if (isKeina) {
        store.loginAsDemoAdmin();
      } else {
        store.loginAsDemoCustomer();
      }
    },
    signOut: async () => {
      store.logout();
    },
    signUp: async () => {
      store.loginAsDemoCustomer();
    },
  };
};
