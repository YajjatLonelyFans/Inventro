import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configure axios defaults
  axios.defaults.baseURL = 'http://localhost:3000/api';
  axios.defaults.withCredentials = true;

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('/users/loggedin');
      if (response.data.loggedIn) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.log('User not logged in');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/users/login', { email, password });
      setUser(response.data.user);
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/users/register', userData);
      setUser(response.data.user);
      toast.success('Registration successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await axios.get('/users/logout');
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (userData) => {
    try {
      const response = await axios.put('/users/update', userData);
      setUser(response.data.user);
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const changePassword = async (passwordData) => {
  try {
    await axios.put('/users/changepassword', passwordData, { withCredentials: true });
    toast.success('Password changed successfully!');
    return { success: true };
  } catch (error) {
    const message = error.response?.data?.message || 'Password change failed';
    toast.error(message);
    return { success: false, message };
  }
};


  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
