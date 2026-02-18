import React, { createContext, useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const GeneralContext = createContext();

const GeneralContextProvider = ({ children }) => {
  const navigate = useNavigate();

  // Auth states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usertype, setUsertype] = useState('');
  
  // Cart state
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // API Base URL
  const API_BASE = 'http://localhost:6001';

  // Fetch cart count on mount and when user changes
  useEffect(() => {
    fetchCartCount();
  }, []);

  const fetchCartCount = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setCartCount(0);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE}/fetch-cart/${userId}`);
      if (response.data.success) {
        setCartCount(response.data.data.length);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const login = async () => {
    if (!email || !password) {
      alert('Please fill all fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE}/login`, { email, password });
      
      if (response.data.success) {
        const user = response.data.data;
        localStorage.setItem('userId', user._id);
        localStorage.setItem('userType', user.usertype);
        localStorage.setItem('username', user.username);
        localStorage.setItem('email', user.email);

        // Fetch cart count after login
        await fetchCartCount();

        if (user.usertype === 'customer') {
          navigate('/');
        } else if (user.usertype === 'admin') {
          navigate('/admin');
        }
      } else {
        alert(response.data.message || 'Login failed!');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert(error.response?.data?.message || 'Login failed!');
    } finally {
      setLoading(false);
    }
  };

  const register = async () => {
    if (!username || !email || !password) {
      alert('Please fill all fields');
      return;
    }

    if (password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE}/register`, {
        username, email, usertype: usertype || 'customer', password
      });

      if (response.data.success) {
        const user = response.data.data;
        localStorage.setItem('userId', user._id);
        localStorage.setItem('userType', user.usertype);
        localStorage.setItem('username', user.username);
        localStorage.setItem('email', user.email);

        await fetchCartCount();

        if (user.usertype === 'customer') {
          navigate('/');
        } else if (user.usertype === 'admin') {
          navigate('/admin');
        }
      } else {
        alert(response.data.message || 'Registration failed!');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert(error.response?.data?.message || 'Registration failed!');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    setCartCount(0);
    navigate('/');
  };

  const refreshCartCount = async () => {
    await fetchCartCount();
  };

  return (
    <GeneralContext.Provider value={{
      // Auth
      login, register, logout,
      username, setUsername,
      email, setEmail,
      password, setPassword,
      usertype, setUsertype,
      
      // Cart
      cartCount, refreshCartCount,
      
      // UI states
      loading, error
    }}>
      {children}
    </GeneralContext.Provider>
  );
};

export default GeneralContextProvider;