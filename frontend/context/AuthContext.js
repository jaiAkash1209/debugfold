import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = window.localStorage.getItem("caresync-token");
    if (!token) {
      setLoading(false);
      return;
    }

    apiFetch("/auth/me")
      .then((data) => setUser(data))
      .catch(() => window.localStorage.removeItem("caresync-token"))
      .finally(() => setLoading(false));
  }, []);

  function persistAuth(data) {
    window.localStorage.setItem("caresync-token", data.token);
    window.localStorage.setItem("caresync-user", JSON.stringify(data.user));
    setUser(data.user);
  }

  function logout() {
    window.localStorage.removeItem("caresync-token");
    window.localStorage.removeItem("caresync-user");
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, setUser, persistAuth, logout, loading }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}