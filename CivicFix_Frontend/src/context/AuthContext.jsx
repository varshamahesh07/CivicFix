import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user && !currentUser) {
      setCurrentUser(user);
    }
  }, []);

  const loginCitizen = async (identifier, password) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const user = await authService.loginCitizen(identifier, password);
      setCurrentUser(user);
      return user;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const registerCitizen = async (formData) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const user = await authService.registerCitizen(formData);
      setCurrentUser(user);
      return user;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loginAuthority = async (identifier, password) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const user = await authService.loginAuthority(identifier, password);
      setCurrentUser(user);
      return user;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const registerAuthority = async (formData) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const user = await authService.registerAuthority(formData);
      setCurrentUser(user);
      return user;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = (updatedFields) => {
    const updated = authService.updateCitizenProfile(updatedFields);
    if (updated) setCurrentUser(updated);
    return updated;
  };

  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
    setAuthError(null);
  };

  const quickDemoSwitch = async (role) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const user = await authService.quickDemoLogin(role);
      setCurrentUser(user);
      return user;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    isCitizen: currentUser?.role === 'citizen',
    isAuthority: currentUser?.role === 'authority',
    isLoading,
    authError,
    loginCitizen,
    registerCitizen,
    loginAuthority,
    registerAuthority,
    updateProfile,
    logout,
    quickDemoSwitch
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
