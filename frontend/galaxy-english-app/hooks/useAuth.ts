// hooks/useAuth.ts — JWT Auth management
"use client";
import { useState, useEffect, useCallback } from "react";
import type { User, LoginRequest, RegisterRequest, AuthResponse } from "@/types";

const API_BASE = "/api/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const checkAuth = useCallback(() => {
    const stored = localStorage.getItem("galaxy_token");
    if (stored) {
      setToken(stored);
      verifyToken(stored);
    } else {
      setUser(null);
      setToken(null);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
    
    // Listen to local storage changes to sync across tabs
    const handleStorage = () => checkAuth();
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [checkAuth]);

  const verifyToken = async (t: string) => {
    try {
      const res = await fetch(`${API_BASE}/verify`, {
        method: "POST",
        headers: { Authorization: `Bearer ${t}` },
      });
      if (res.ok) {
        const data: AuthResponse = await res.json();
        setUser(data.user);
      } else {
        localStorage.removeItem("galaxy_token");
        setToken(null);
      }
    } catch {
      // offline – keep token, show cached state
    } finally {
      setLoading(false);
    }
  };

  const login = useCallback(async (req: LoginRequest): Promise<AuthResponse> => {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    const data: AuthResponse = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem("galaxy_token", data.token);
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  }, []);

  const register = useCallback(async (req: RegisterRequest & { role?: string; teacherId?: string; specialization?: string }): Promise<AuthResponse> => {
    const endpoint = req.role === "TEACHER" ? `${API_BASE}/teacher/register` : `${API_BASE}/register`;
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    return res.json();
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("galaxy_token");
    setToken(null);
    setUser(null);
  }, []);

  return { user, token, loading, login, register, logout, checkAuth, isAuthenticated: !!user };
}
