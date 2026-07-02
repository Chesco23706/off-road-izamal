import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("offroad-user");
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      localStorage.removeItem("offroad-user");
      return null;
    }
  });
  const [loading, setLoading] = useState(() => {
    const token = localStorage.getItem("offroad-token");
    const storedUser = localStorage.getItem("offroad-user");
    return Boolean(token && !storedUser);
  });

  useEffect(() => {
    const token = localStorage.getItem("offroad-token");

    if (!token) {
      setLoading(false);
      return;
    }

    if (user) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then(({ data }) => {
        setUser(data.user);
        localStorage.setItem("offroad-user", JSON.stringify(data.user));
      })
      .catch(() => {
        localStorage.removeItem("offroad-token");
        localStorage.removeItem("offroad-user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);
    localStorage.setItem("offroad-token", data.token);
    localStorage.setItem("offroad-user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("offroad-token");
    localStorage.removeItem("offroad-user");
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: Boolean(user)
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
