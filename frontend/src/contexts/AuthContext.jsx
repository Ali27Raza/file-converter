import React, { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("admin_token"));
  const [user, setUser] = useState(() => localStorage.getItem("admin_user"));

  const login = useCallback(async (username, password) => {
    const res = await axios.post("/api/auth/login", { username, password });
    const { token: t, username: u } = res.data;
    localStorage.setItem("admin_token", t);
    localStorage.setItem("admin_user", u);
    setToken(t);
    setUser(u);
    return true;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    setToken(null);
    setUser(null);
  }, []);

  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  return (
    <AuthContext.Provider value={{ token, user, login, logout, authHeader, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
