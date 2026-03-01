"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export interface BirthData {
  date: string;
  time: string;
  city: string;
}

export interface User {
  username: string;
  displayName: string;
  birthData?: BirthData;
}

interface AuthCtx {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<string | null>;
  logout: () => void;
  saveBirthData: (data: BirthData) => void;
}

const AuthContext = createContext<AuthCtx>({
  user: null,
  isLoading: true,
  login: async () => "Not initialized",
  logout: () => {},
  saveBirthData: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("astroyou_user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem("astroyou_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<string | null> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem("astroyou_user", JSON.stringify(data.user));
        return null; // no error
      }
      return data.error || "Login failed";
    } catch {
      return "Network error";
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("astroyou_user");
  };

  // Save birth data for the current user (persists to localStorage)
  const saveBirthData = (data: BirthData) => {
    if (!user) return;
    const updated = { ...user, birthData: data };
    setUser(updated);
    localStorage.setItem("astroyou_user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, saveBirthData }}>
      {children}
    </AuthContext.Provider>
  );
}
