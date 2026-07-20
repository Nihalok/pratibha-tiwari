/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { safeLocalStorage } from './storage-helper';

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  loginAdmin: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/profile');
      const contentType = response.headers.get('content-type');
      
      if (response.ok && contentType && contentType.includes('application/json')) {
        const data = await response.json();
        setUser(data.admin);
        setIsAdmin(true);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    } catch (_err) {
      setUser(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const loginAdmin = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        void text; // consume response
        throw new Error('Server returned an invalid response (not JSON). Please check server logs.');
      }

      const data = await response.json();
      
      if (response.ok) {
        setUser(data.admin);
        setIsAdmin(true);
        // Token is handled via HTTP-only cookie by the backend
        return true;
      }
      
      throw new Error(data.message || 'Login failed');
    } catch (err: any) {
      throw err;
    }
  };

  const logout = async () => {
    setUser(null);
    setIsAdmin(false);
    try {
      await fetch('/api/admin/logout', { credentials: 'same-origin' });
    } catch (_err) {
      // Logout failed silently — session already cleared client-side
    }
    const adminPrefix = import.meta.env.VITE_ADMIN_PATH || 'admin';
    window.location.href = `/${adminPrefix}/login`;
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, loginAdmin, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
