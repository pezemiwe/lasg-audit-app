import React, { useState } from "react";
import type { User, Role } from "../types";
import { MOCK_USERS } from "../mock/data";
import { AuthContext } from "./AuthContextData";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      // Use sessionStorage instead of localStorage to allow different users in different tabs for demo purposes
      const stored = sessionStorage.getItem("audit_user");
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.error("Failed to parse stored user", e);
      return null;
    }
  });

  const login = (email: string) => {
    const foundUser = MOCK_USERS.find((u) => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      sessionStorage.setItem("audit_user", JSON.stringify(foundUser));
    } else {
      console.warn("User not found");
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("audit_user");
  };

  const canAccess = (allowedRoles: Role[]) => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, canAccess }}>
      {children}
    </AuthContext.Provider>
  );
};
