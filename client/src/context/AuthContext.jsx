import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState("guest");
  const [token, setToken] = useState(null);
  const [user,setUser] = useState(null);

  const login = ({ token, email,userId }) => {
    setToken(token);
    setUser({email,_id:userId});
    localStorage.setItem('token', token);
    localStorage.setItem('user',JSON.stringify({email,_id:userId}));

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
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      const userRole = JSON.parse(savedUser).email === "admin@thepizzaman.com" ? "admin" : "user";
      setRole(userRole);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ role, token, user,login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
