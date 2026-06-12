"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import Link from "next/link";
import { Zap, Loader2, Eye, EyeOff } from "lucide-react";

const sky  = "#0096fe";
const ice  = "#e0f2fe";
const grad = "linear-gradient(135deg, #0096fe, #0056b3)";
const glow = "0 0 20px rgba(0, 150, 254, 0.25)";

const inputBase: React.CSSProperties = {
  border: "1px solid rgba(255, 255, 255, 0.08)",
  background: "rgba(18, 22, 33, 0.80)",
};
const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
  e.currentTarget.style.border = "1px solid rgba(0, 150, 254, 0.45)";
  e.currentTarget.style.boxShadow = "0 0 0 2px rgba(0, 150, 254, 0.10)";
};
const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
  e.currentTarget.style.border = "1px solid rgba(255, 255, 255, 0.08)";
  e.currentTarget.style.boxShadow = "none";
};

export default function SignInPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    if (!email.trim()) return setError("Email is required.");
    if (!password) return setError("Password is required.");
    setLoading(true);
    try {
      const ok = await login(email.trim(), password);
      if (!ok) setError("Invalid email or password. Please try again.");
    } catch { setError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) handleLogin();
  };

  return (
    <div className="w-full max-w-md px-6 py-8 rounded-2xl"
      style={{
        border: "1px solid rgba(0, 150, 254, 0.16)",
        background: "rgba(18, 22, 33, 0.95)",
        boxShadow: `0 40px 80px rgba(10, 15, 28, 0.80), ${glow}`,
      }}>
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl mb-4"
          style={{ border: "1px solid rgba(0, 150, 254, 0.28)", background: "rgba(0, 150, 254, 0.10)", boxShadow: glow }}>
          <Zap className="h-5 w-5" style={{ fill: sky, color: sky }} />
        </div>

        {/* Two-tone heading: white + sky blue */}
        <h2 className="text-2xl font-serif tracking-tight">
          <span className="text-white">Welcome back to </span>
          <span style={{
            background: `linear-gradient(135deg, ${ice}, ${sky}, #0056b3)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Code Sphere
          </span>
        </h2>
        <p className="mt-2 text-xs text-white/40">Enter your details below to sign in</p>
      </div>

      {error && (
        <div className="mb-5 rounded-lg px-4 py-3 text-sm text-red-400"
          style={{ border: "1px solid oklch(0.65 0.22 25 / 30%)", background: "oklch(0.65 0.22 25 / 10%)" }}>
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5">Email Address</label>
          <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }}
            onKeyDown={handleKeyDown} placeholder="you@example.com" disabled={loading}
            autoComplete="email"
            className="w-full h-10 rounded-lg px-3.5 text-sm placeholder:text-white/20 focus:outline-none transition-all text-white disabled:opacity-50"
            style={inputBase} onFocus={onFocus} onBlur={onBlur} />
        </div>

        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5">Password</label>
          <div className="relative">
            <input type={showPassword ? "text" : "password"} value={password}
              onChange={e => { setPassword(e.target.value); setError(""); }}
              onKeyDown={handleKeyDown} placeholder="••••••••" disabled={loading}
              autoComplete="current-password"
              className="w-full h-10 rounded-lg px-3.5 pr-10 text-sm placeholder:text-white/20 focus:outline-none transition-all text-white disabled:opacity-50"
              style={inputBase} onFocus={onFocus} onBlur={onBlur} />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button type="button" onClick={handleLogin} disabled={loading}
          className="w-full h-10 font-semibold rounded-lg mt-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all active:scale-[0.98] text-white"
          style={{ background: grad, boxShadow: glow }}>
          {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Signing in…</> : "Sign In"}
        </button>
      </div>

      <div className="mt-6 text-center text-xs text-white/45">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="font-medium" style={{ color: sky }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = ice}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = sky}>
          Sign up
        </Link>
      </div>
    </div>
  );
}
