import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp ? payload.exp * 1000 <= Date.now() : false;
  } catch {
    return true;
  }
};

const clearStoredSession = () => {
  localStorage.removeItem("offroad-token");
  localStorage.removeItem("offroad-user");
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("offroad-token");

    if (token && isTokenExpired(token)) {
      clearStoredSession();
      return null;
    }

    const storedUser = localStorage.getItem("offroad-user");
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      clearStoredSession();
      return null;
    }
  });
  const [loading, setLoading] = useState(() => {
    const token = localStorage.getItem("offroad-token");
    const storedUser = localStorage.getItem("offroad-user");
    return Boolean(token && !storedUser && !isTokenExpired(token));
  });

  useEffect(() => {
    const token = localStorage.getItem("offroad-token");

    if (!token) {
      setLoading(false);
      return;
    }

    if (isTokenExpired(token)) {
      clearStoredSession();
      setUser(null);
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
        clearStoredSession();
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
    clearStoredSession();
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
