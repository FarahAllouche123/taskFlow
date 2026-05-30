import React, { createContext, useContext, useState, useCallback } from "react";
import api from "../utils/api";

const ADMIN_EMAIL = process.env.REACT_APP_ADMIN_EMAIL || "admin@taskflow.io";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(() => JSON.parse(localStorage.getItem("user") || "null"));
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const saveSession = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const isAdmin = (email) => email === ADMIN_EMAIL;

  const register = useCallback(async (name, email, password) => {
    setLoading(true); setError("");
    try {
      const { data } = await api.post("/auth/register", { name, email, password });
      saveSession(data.token, data.user);
      return { success: true, isAdmin: isAdmin(data.user.email) };
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      setError(msg);
      return { success: false, message: msg };
    } finally { setLoading(false); }
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true); setError("");
    try {
      const { data } = await api.post("/auth/login", { email, password });
      saveSession(data.token, data.user);
      return { success: true, isAdmin: isAdmin(data.user.email) };
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      setError(msg);
      return { success: false, message: msg };
    } finally { setLoading(false); }
  }, []);

  const updateUser = useCallback((updatedUser) => {
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  const clearError = () => setError("");

  return (
    <AuthContext.Provider value={{ user, loading, error, register, login, logout, updateUser, clearError, isAdmin: isAdmin(user?.email) }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};