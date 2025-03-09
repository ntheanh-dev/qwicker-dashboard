import Cookies from 'js-cookie';
import React, { useState, createContext } from 'react';

import api, { authAPI, END_POINTS } from 'src/configs/api';

export const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
    try {
      const res = await api.post(END_POINTS.token, { username, password });
      console.log('res: ', res);
      setUser(res.data.result);
      Cookies.set('token', res.data.result.token, { expires: 7 });
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
    }
  };

  const logout = async () => {
    try {
      await authAPI.post('/logout');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error.response?.data || error.message);
    }
  };

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
  );
};
