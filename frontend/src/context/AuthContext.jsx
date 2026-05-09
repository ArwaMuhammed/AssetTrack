import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (savedUser && savedUser !== 'undefined' && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password, role) => {
    try {
      console.log('Sending login request:', { email, role }); // Don't log password
      const response = await api.post('/auth/login', { email, password, role });
      const { token, role: userRole } = response.data;
      const userData = { 
        id: response.data.id || 1, 
        email, 
        role: userRole, 
        name: response.data.name || email.split('@')[0]
      };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Login failed';
      console.error(`Login failed: ${errorMsg}`, error.response?.data);
      return { success: false, error: errorMsg };
    }
  };

  const signup = async (userData) => {
    try {
      await api.post('/auth/signup', userData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Signup failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
