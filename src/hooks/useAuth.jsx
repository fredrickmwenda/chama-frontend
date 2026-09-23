// src/hooks/useAuth.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // True while checking if user is logged in

  // Check if user is already logged in on initial page load
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      // If token exists, fetch the user profile
      api.get('/auth/profile/')
        .then(res => {
          setUser(res.data);
        })
        .catch(err => {
          // If token is invalid, clear storage
          console.error("Failed to fetch profile", err);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // Login function
  const login = async (username, password) => {
    // 1. Get Tokens
    const res = await api.post('/auth/login/', { username, password });
    localStorage.setItem('access_token', res.data.access);
    localStorage.setItem('refresh_token', res.data.refresh);
    
    // 2. Fetch User Profile immediately so UI can update
    const profileRes = await api.get('/auth/profile/');
    setUser(profileRes.data);
    
    return profileRes.data; // Return user data in case the component needs it
  };

  // Logout function
  const logout = async () => {
    // Optional: Call backend to blacklist the token
    // try { await api.post('/auth/logout/'); } catch(e) { console.error(e); }
    
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  // Update profile locally (useful when user changes their dividend preference)
  const updateUser = (newData) => {
    setUser(prev => ({ ...prev, ...newData }));
  };

  const contextValue = {
    user,
    loading,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access to auth context
export const useAuthContext = () => {
  return useContext(AuthContext);
};