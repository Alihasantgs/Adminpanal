import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import toast from 'react-hot-toast';
import { authAPI, type LoginRequest, type LoginResponse, type ApiError } from '../api/auth';

export interface User {
  id: string;
  discordId?: string;
  email: string;
  discordUsername?: string;
  avatar?: string;
  joinedAt?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const token = localStorage.getItem('access_token');
    
    if (token) {
      // If token exists, set a basic user object (no role requirement)
      const basicUser: User = {
        id: 'temp-id',
        email: 'admin@superclip.com',
        discordUsername: 'Admin User'
      };
      setUser(basicUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    
    try {
      const loginData: LoginRequest = { email, password };
      const response: LoginResponse = await authAPI.login(loginData);
      
      // Store access_token in localStorage
      localStorage.setItem('access_token', response.access_token);
      // Store user data in state (no role requirement)
      setUser(response.user);
      
      toast.success('Login successful!');
      return { success: true, message: 'Login successful' };
    } catch (error: any) {
      const apiError = error as ApiError;
      const errorMessage = apiError.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
      return { 
        success: false, 
        message: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    
    try {
      await authAPI.logout();
    } catch (error) {
      // Clear local storage regardless of API call success
    } finally {
      localStorage.removeItem('access_token');
      setUser(null);
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
