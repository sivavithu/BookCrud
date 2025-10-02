/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface User {
  userId: string;
  username: string;
  email?: string;
  role?: string;
  profilePicture?: string;
}

interface AuthContextType {
  user: User | null;
  login: (accessToken: string, refreshToken: string, userData?: Partial<User>) => void;
  logout: () => void;
  isAuthenticated: boolean;
  getAccessToken: () => string | null;
  refreshAccessToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');
    
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        
        // Try to get user from localStorage first, fallback to JWT
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser({
            userId: decoded.sub || decoded.userId || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
            username: decoded.username || decoded.name || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
            email: decoded.email || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
            role: decoded.role || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
          });
        }
      } catch (error) {
        console.error('Failed to decode token:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = (accessToken: string, refreshToken: string, userData?: Partial<User>) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    
    try {
      const decoded: any = jwtDecode(accessToken);
      
      // Merge userData with decoded token info
      const userInfo: User = {
        userId: userData?.userId || decoded.sub || decoded.userId || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
        username: userData?.username || decoded.username || decoded.name || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
        email: userData?.email || decoded.email || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
        role: userData?.role || decoded.role || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
        profilePicture: userData?.profilePicture,
      };

      setUser(userInfo);
      localStorage.setItem('user', JSON.stringify(userInfo));
    } catch (error) {
      console.error('Failed to decode token:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const getAccessToken = () => localStorage.getItem('accessToken');

  const refreshAccessToken = async (): Promise<boolean> => {
    const refreshToken = localStorage.getItem('refreshToken');
    const userId = user?.userId;

    if (!refreshToken || !userId) {
      logout();
      return false;
    }

    try {
      const response = await fetch('/auth/refresh-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.accessToken, data.refreshToken, {
          userId: data.userId,
          username: data.username,
          email: data.email,
          role: data.role,
          profilePicture: data.profilePicture,
        });
        return true;
      } else {
        logout();
        return false;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user,
      getAccessToken,
      refreshAccessToken,
    }}>
      {children}
    </AuthContext.Provider>
  );
};