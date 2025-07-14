import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
 
  const refreshUser = async (skipSessionExpired = false) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/profile`, {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
        return true;
      } else {
        setUser(null);
        if (!skipSessionExpired) {
          window.dispatchEvent(new Event("session-expired"));
        }
        return false;
      }
    } catch (err) {
      console.error(" AuthContext.js | refreshUser - Failed to fetch user:", err);
      setUser(null);
      if (!skipSessionExpired) {
        window.dispatchEvent(new Event("session-expired"));
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();

    const interval = setInterval(() => refreshUser(), 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
