import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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

  // Prevent multiple simultaneous validation calls
  const validationInProgress = useRef(false);

  useEffect(() => {
    initializeAuth();
  }, []); // Remove authState dependency to prevent infinite loops

  useEffect(() => {
    // Handle app state changes - only set up after initial auth
    if (authState.isLoading) return;

    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'active' && authState.isAuthenticated && !validationInProgress.current) {
        validateCurrentUser();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [authState.isAuthenticated, authState.isLoading]);

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
    if (validationInProgress.current) {
      return; // Prevent multiple simultaneous calls
    }

    try {
      validationInProgress.current = true;

      const response = await api.get('/api/users/profile');

      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        user: response.data,
      });
    } catch (error) {
      console.error('Token validation failed:', error);

      // Handle different error types
      if (error.response) {
        const status = error.response.status;

        // Authentication/Authorization errors - clear auth data
        if (status === 401 || status === 403) {
          console.log('Authentication failed, clearing auth data');
          await clearAuthData();
        } else {
          // Other errors (500, network issues) - don't logout user immediately
          console.warn('Non-auth error during validation:', status);
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } else {
        // Network errors - don't logout user, just stop loading
        console.warn('Network error during validation');
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } finally {
      validationInProgress.current = false;
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

      // Better error handling
      let errorMessage = 'Login failed';

      if (error.response?.data) {
        const errorData = error.response.data;
        errorMessage = errorData.non_field_errors?.[0] ||
          errorData.error ||
          errorData.detail ||
          errorMessage;
      }

      return {
        success: false,
        error: errorMessage
      };
    }
  };

  const logout = async () => {
    try {
      // Set loading state during logout
      setAuthState(prev => ({ ...prev, isLoading: true }));
      await apiLogout();
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with clearing data even if API call fails
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
      // Even if storage clearing fails, update the state
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
      });
    }
  };

  const refreshAuth = async () => {
    await validateCurrentUser();
  };

  // Force logout - useful for debugging or explicit logout
  const forceLogout = async () => {
    await clearAuthData();
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        refreshAuth,
        forceLogout, // Added for debugging
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