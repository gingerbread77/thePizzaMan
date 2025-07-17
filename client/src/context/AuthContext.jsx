import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState("guest");
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const login = ({ token, email, userId }) => {
    setToken(token);
    const userData = { email, _id: userId };
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));

    const userRole = email === "admin@thepizzaman.com" ? "admin" : "user";
    setRole(userRole);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setRole("guest");
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUserStr = localStorage.getItem('user');

    if (savedToken && savedUserStr) {
      const parsedUser = JSON.parse(savedUserStr);
      setToken(savedToken);
      setUser(parsedUser);
      const userRole = parsedUser.email === "admin@thepizzaman.com" ? "admin" : "user";
      setRole(userRole);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ role, token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
