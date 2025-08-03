import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';
import api, { login as apiLogin, logout as apiLogout } from '../app/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isLoading: true,
    user: null,
  });

  useEffect(() => {
    initializeAuth();

    // Handle app state changes
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'active' && authState.isAuthenticated) {
        validateCurrentUser();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, []);

  const initializeAuth = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');

      if (!accessToken) {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
        });
        return;
      }

      // Validate token by getting user profile
      await validateCurrentUser();
    } catch (error) {
      console.error('Auth initialization error:', error);
      await clearAuthData();
    }
  };

  const validateCurrentUser = async () => {
    try {
      // Use your existing /api/users/profile endpoint to validate token
      const response = await api.get('/api/users/profile');

      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        user: response.data,
      });
    } catch (error) {
      console.error('Token validation failed:', error);
      await clearAuthData();
    }
  };

  const login = async (username, password) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      const response = await apiLogin(username, password);

      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        user: response.user,
      });

      return { success: true, data: response };
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return {
        success: false,
        error: error.non_field_errors?.[0] || error.error || 'Login failed'
      };
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await clearAuthData();
    }
  };

  const clearAuthData = async () => {
    try {
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
      });
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  };

  const refreshAuth = async () => {
    await validateCurrentUser();
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        refreshAuth,
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
