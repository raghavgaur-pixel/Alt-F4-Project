import { createContext, useEffect, useMemo, useState } from "react";
import type { PropsWithChildren } from "react";
import type { User } from "@/types/api";

interface AuthContextValue {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setSession: (session: { token: string; user: User }) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const storageKey = "qrguard-session";

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const raw = window.localStorage.getItem(storageKey);

    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as { token: string; user: User };
      setToken(parsed.token);
      setUser(parsed.user);
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      setSession: (session) => {
        setToken(session.token);
        setUser(session.user);
        window.localStorage.setItem(storageKey, JSON.stringify(session));
      },
      logout: () => {
        setToken(null);
        setUser(null);
        window.localStorage.removeItem(storageKey);
      }
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

