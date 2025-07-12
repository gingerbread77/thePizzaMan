import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState("guest");
  const [token, setToken] = useState(null);

  const login = ({ token, email }) => {
    setToken(token);
    localStorage.setItem('token', token);
    localStorage.setItem('email', email);

    const userRole = email === "admin@thepizzaman.com" ? "admin" : "user";
    setRole(userRole);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setRole("guest");
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedEmail = localStorage.getItem('email');

    if (savedToken && savedEmail) {
      setToken(savedToken);

      const userRole = savedEmail === "admin@thepizzaman.com" ? "admin" : "user";
      setRole(userRole);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ role, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
