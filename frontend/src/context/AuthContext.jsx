import { createContext, useContext, useState, useCallback } from "react";
import api from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("ee_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  // Called by Login/Signup pages after a successful Google OAuth token response
  const loginWithGoogle = useCallback(async (tokenResponse) => {
    setLoading(true);
    try {
      // Exchange the access token for user info, then send to backend
      const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      });
      const googleUser = await userInfoRes.json();

      const res = await api.post("/auth/google", {
        token: tokenResponse.access_token,
        googleUser,
      });

      const { token, user: userData } = res.data;
      localStorage.setItem("ee_token", token);
      localStorage.setItem("ee_user", JSON.stringify(userData));
      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      console.error("Auth error:", err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const mockLogin = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.post("/auth/mock");
      const { token, user: userData } = res.data;
      localStorage.setItem("ee_token", token);
      localStorage.setItem("ee_user", JSON.stringify(userData));
      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      console.error("Mock login error:", err);
      return { success: false, error: err.response?.data?.message || err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("ee_token");
    localStorage.removeItem("ee_user");
    setUser(null);
  }, []);

  const updateUser = useCallback((updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem("ee_user", JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        loginWithGoogle,
        mockLogin,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}
