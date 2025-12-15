import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../utils/api';

interface User {
  email: string;
  referral_code: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, referralCode?: string, router?: any) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      const storedUser = await AsyncStorage.getItem('user');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string, router?: any) => {
    console.log('[AUTH] Login attempt for:', email);
    
    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });

      const { access_token, user: userData } = response.data;
      console.log('[AUTH] Login successful, got token');
      
      // Persist to AsyncStorage FIRST (wait for it)
      await AsyncStorage.setItem('token', access_token);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      console.log('[AUTH] Token saved to AsyncStorage');
      
      // Then update state
      setToken(access_token);
      setUser(userData);
      console.log('[AUTH] State updated - user logged in');
      
      // Navigate directly to dashboard
      if (router) {
        console.log('[AUTH] Navigating to dashboard');
        router.replace('/(tabs)/dashboard');
      }
    } catch (error) {
      console.error('[AUTH] Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, referralCode?: string, router?: any) => {
    console.log('[AUTH] Registration attempt for:', email);
    
    try {
      const response = await api.post('/auth/register', {
        email,
        password,
        referral_code: referralCode || ''
      });

      const { access_token, user: userData } = response.data;
      console.log('[AUTH] Registration successful, got token');
      
      // Persist to AsyncStorage FIRST (wait for it)
      await AsyncStorage.setItem('token', access_token);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      console.log('[AUTH] Token saved to AsyncStorage');
      
      // Then update state
      setToken(access_token);
      setUser(userData);
      console.log('[AUTH] State updated - user registered and logged in');
      
      // Navigate directly to dashboard (same as login)
      if (router) {
        console.log('[AUTH] Navigating to dashboard after registration');
        router.replace('/(tabs)/dashboard');
      }
    } catch (error) {
      console.error('[AUTH] Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    console.log('[AUTH] Logout initiated');
    
    try {
      // Clear AsyncStorage FIRST (wait for it)
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      console.log('[AUTH] AsyncStorage cleared');
      
      // Then update state
      setToken(null);
      setUser(null);
      console.log('[AUTH] State cleared - token and user set to null');
    } catch (error) {
      console.error('[AUTH] Error during logout:', error);
      // Still clear state even if storage fails
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!token
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};