
import React, { createContext, useEffect, useMemo, useState } from "react";
import { getSessionUser, loginUser, logoutUser, registerUser } from "../services/authService";
import { ensureSeedData } from "../utils/helpers";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    ensureSeedData();
    setUser(getSessionUser());
  }, []);

  // Auto-logout when session expires (15 min)
  useEffect(() => {
    const t = setInterval(() => {
      const s = getSessionUser();
      // getSessionUser() already clears LS if expired
      if (!s) {
        setUser(null);
      }
    }, 3000);
    return () => clearInterval(t);
  }, []);

  const value = useMemo(() => ({
    user,
    isAuthed: !!user,
    isAdmin: user?.role === "admin",
    login: async (payload) => {
      const { user: u } = loginUser(payload);
      setUser(u);
      return u;
    },
    register: async (payload) => {
      const u = registerUser(payload);
      // auto-login after register
      loginUser({ email: payload.email, password: payload.password });
      setUser(u);
      return u;
    },
    logout: () => {
      logoutUser();
      setUser(null);
    },
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
