import { createContext } from "react";
import type { User, Role } from "../types";

export interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => void;
  logout: () => void;
  canAccess: (allowedRoles: Role[]) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
