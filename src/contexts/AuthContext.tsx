'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_BASE } from '../utils/apiConfig';

export interface TeamData {
  _id: string;
  id?: string;
  name: string;
  shortName: string;
  logo: string;
  color: string;
  budget: number;
  spent: number;
  remainingBudget?: number;
  maxPlayers: number;
  players?: Array<{
    _id: string;
    name: string;
    position: string;
    role?: string;
    stats?: { overall: number };
    currentPrice?: number;
    basePrice: number;
  }>;
}

export interface UserData {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'spectator';
  team?: TeamData | null;
}

interface AuthContextType {
  user: UserData | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isManager: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  switchDemoUser: (user: UserData) => void;
  demoUsers: UserData[];
  fetchDemoUsers: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);



export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [demoUsers, setDemoUsers] = useState<UserData[]>([]);

  const fetchDemoUsers = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/demo-users`);
      const data = await res.json();
      if (data.success) {
        setDemoUsers(data.users);
      }
    } catch (e) {
      // offline or server starting
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    const savedToken = token || (typeof window !== 'undefined' ? localStorage.getItem('pfd_token') : null);
    if (!savedToken) return;

    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${savedToken}` }
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('pfd_user', JSON.stringify(data.user));
        }
      }
    } catch (e) {
      console.warn('Could not refresh profile');
    }
  }, [token]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('pfd_token');
      const savedUser = localStorage.getItem('pfd_user');
      if (savedToken) setToken(savedToken);
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {}
      }
    }
    fetchDemoUsers();
  }, [fetchDemoUsers]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('pfd_token', data.token);
          localStorage.setItem('pfd_user', JSON.stringify(data.user));
        }
        return true;
      }
      alert(data.message || 'Login failed');
      return false;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error during login';
      alert(msg);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('pfd_token');
      localStorage.removeItem('pfd_user');
    }
  };

  const switchDemoUser = (selectedUser: UserData) => {
    setUser(selectedUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pfd_user', JSON.stringify(selectedUser));
    }
  };

  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        isManager,
        login,
        logout,
        refreshProfile,
        switchDemoUser,
        demoUsers,
        fetchDemoUsers
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
