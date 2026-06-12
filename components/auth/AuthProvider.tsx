"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiGet, apiPost } from "@/lib/api";

interface User {
  id: string;
  email: string;
  name: string | null;
  imageUrl: string;
  credits: number;
  plan: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Helper to extract cookie value
  const getCookie = (name: string): string | null => {
    if (typeof window === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null;
    return null;
  };

  const clearAuthState = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setToken(null);
    setUser(null);
  };

  const fetchProfile = async (authToken: string) => {
    try {
      const res = await apiGet("/api/auth/profile", { token: authToken });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setUser(data.data);
          setToken(authToken);
        } else {
          clearAuthState();
        }
      } else {
        clearAuthState();
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      clearAuthState();
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (token) {
      await fetchProfile(token);
    }
  };

  useEffect(() => {
    const storedToken = getCookie("token");
    if (storedToken) {
      fetchProfile(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("Logging in...", email);
      const res = await apiPost("/api/auth/login", { email, password });

      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.message || "Login failed");
        return false;
      }

      const { token: jwtToken, user: userData } = data.data;

      // Set cookie client-side
      document.cookie = `token=${jwtToken}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;

      setToken(jwtToken);
      setUser(userData);

      toast.success("Welcome back!");
      router.replace("/projects");
      return true;
    } catch (err) {
      console.error("Login API error:", err);
      toast.error("Login failed. Check your connection.");
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      console.log("Signing up...", email);
      const res = await apiPost("/api/auth/signup", { name, email, password });

      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.message || "Signup failed");
        return false;
      }

      const { token: jwtToken, user: userData } = data.data;

      // Set cookie client-side
      document.cookie = `token=${jwtToken}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;

      setToken(jwtToken);
      setUser(userData);

      toast.success("Account created successfully!");
      router.replace("/projects");
      return true;
    } catch (err) {
      console.error("Signup API error:", err);
      toast.error("Signup failed. Check your connection.");
      return false;
    }
  };

  const logout = () => {
    clearAuthState();
    router.replace("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
