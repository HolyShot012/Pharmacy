import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import api, { login as apiLogin, logout as apiLogout } from './api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // You can store user info here
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On mount, try to load token from storage
    (async () => {
      const storedToken = await SecureStore.getItemAsync('jwt');
      if (storedToken) {
        setToken(storedToken);
        // Optionally, fetch user info with the token
      }
      setLoading(false);
    })();
  }, []);

  const login = async (jwt, userInfo = null) => {
    setToken(jwt);
    await SecureStore.setItemAsync('jwt', jwt);
    setUser(userInfo);
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    await SecureStore.deleteItemAsync('jwt');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
