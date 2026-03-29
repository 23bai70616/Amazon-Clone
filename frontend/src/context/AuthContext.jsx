import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('amazon_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const loginUser = (userData, token) => {
    setUser(userData);
    localStorage.setItem('amazon_user', JSON.stringify(userData));
    if (token) {
      localStorage.setItem('amazon_token', token);
    }
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('amazon_user');
    localStorage.removeItem('amazon_token');
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
