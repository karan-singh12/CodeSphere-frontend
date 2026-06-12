"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { ArrowRight, Zap, ChevronRight, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { HoleBackground } from "@/components/animate-ui/components/backgrounds/hole";
import { Badge } from "@/components/ui/badge";
import { FEATURES, PLACEHOLDERS, STEPS, SUGGESTIONS } from "@/lib/data";
import { PRICING_PLANS } from "@/lib/constants";
import { PricingDialog } from "@/components/billing/PricingDialog";
import Link from "next/link";
import {
  BlueTitle,
  GrayTitle,
  SectionHeading,
  SectionLabel,
} from "@/components/shared/BrandTypography";

/* ── Design tokens ───────────────────────────────────────────────────────── */
const C = {
  bg:   "radial-gradient(circle at 50% 0%, rgba(0, 150, 254, 0.12) 0%, transparent 60%), radial-gradient(ellipse 70% 60% at 50% 100%, rgba(0, 150, 254, 0.22) 0%, transparent 100%)",
  s1:   "oklch(0.12 0.022 232)",
  s2:   "oklch(0.14 0.025 232)",
  s3:   "oklch(0.17 0.028 232)",
  sky:  "#0096fe",
  ice:  "oklch(0.85 0.14 205)",
  bdr:  "rgba(0, 150, 254, 0.15)",
  bdrM: "rgba(0, 150, 254, 0.28)",
  grad: "linear-gradient(135deg, #0096fe, #0056b3)",
  glow: "0 0 28px rgba(0, 150, 254, 0.3)",
};

const skyGradStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, #e0f2fe, #0096fe, #38bdf8)",
  backgroundSize: "300% 300%",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  filter: "drop-shadow(0 0 20px rgba(0, 150, 254, 0.38))",
};

export default function LandingPage() {
  const { user } = useAuth();
  const isSignedIn = !!user;
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [prompt, setPrompt] = useState("");
  const [template, setTemplate] = useState("auto");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (isFocused || prompt) return;
    const t = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(t);
  }, [isFocused, prompt]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }, [prompt]);

  const handleSubmit = () => {
    if (!prompt.trim() || !isSignedIn) return;
    router.push(`/workspace?prompt=${encodeURIComponent(prompt.trim())}&template=${template}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestion = (s: string) => {
    setPrompt(s);
    textareaRef.current?.focus();
  };

  return (
    <main className="min-h-screen selection:bg-white/20" style={{ background: C.bg }}>
      {/* ── Fixed ambient orbs ───────────────────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="animate-float-orb absolute -top-40 left-[30%] h-[600px] w-[600px] rounded-full blur-3xl"
          style={{ background: "rgba(0, 150, 254, 0.10)" }} />
        <div className="animate-float-orb-delayed absolute top-1/3 -right-32 h-96 w-96 rounded-full blur-3xl"
          style={{ background: "rgba(0, 150, 254, 0.08)" }} />
        <div className="animate-float-orb-slow absolute bottom-1/4 -left-24 h-80 w-80 rounded-full blur-3xl"
          style={{ background: "rgba(0, 150, 254, 0.07)" }} />
        <div className="dot-pattern absolute inset-0 opacity-[0.35]" />
      </div>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center overflow-hidden px-4 pb-24 pt-40 text-center z-10">
        <HoleBackground
          strokeColor="rgba(255,255,255,0.03)" // blur
          className="absolute inset-0 h-full w-full"
          style={{
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)",
          }}
        />

        <Badge variant="outline" className="gap-2 p-4 backdrop-blur-sm"
          style={{ borderColor: "rgba(0, 150, 254, 0.15)", background: "rgba(0, 150, 254, 0.05)" }}>
          <div className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: C.sky }} />
          Powered by Agentic AI
        </Badge>

        <h1 className="mx-auto max-w-4xl text-balance font-serif text-5xl leading-tight tracking-tight sm:text-6xl lg:text-7xl z-10 mt-6">
          <GrayTitle>Turn Your Next Big Idea</GrayTitle>
          <br />
          <GrayTitle>into Reality with </GrayTitle>
          <BlueTitle>Code Sphere</BlueTitle>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-balance text-base leading-relaxed text-white/40 z-10">
          Describe what you want to build. Code Sphere writes production-ready React, Vue, Svelte, or HTML/JS code, picks packages,
          and renders a live preview all inside your browser.
        </p>

        <div className="relative mx-auto mt-12 w-full max-w-2xl z-10">
          <div
            className={cn(
              "rounded-2xl border duration-200 bg-[#111111]/80 backdrop-blur-md",
              isFocused
                ? "border-blue-500/50 ring-1 ring-blue-500/20"
                : "border-white/8"
            )}
            style={{
              boxShadow: isFocused ? C.glow : "none",
            }}
          >
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={PLACEHOLDERS[placeholderIndex]}
              rows={1}
              className="w-full resize-none bg-transparent px-5 pb-4 pt-5 text-sm placeholder:text-white/20 focus:outline-none sm:text-base text-white"
              style={{ minHeight: 56, maxHeight: 200 }}
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/6 px-4 py-2.5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs text-white/20 whitespace-nowrap">
                  Press ⏎ to generate · Shift+⏎ for new line
                </span>
                <div className="flex items-center gap-1 bg-white/5 p-0.5 rounded-full border border-white/10">
                  {[
                    { id: "auto", name: "Auto-Detect", icon: "✨" },
                    { id: "react", name: "React", icon: "⚛️" },
                    { id: "vue", name: "Vue", icon: "🟢" },
                    { id: "svelte", name: "Svelte", icon: "🟠" },
                    { id: "static", name: "Static", icon: "🌐" },
                  ].map(fw => (
                    <button
                      key={fw.id}
                      onClick={() => setTemplate(fw.id)}
                      className={cn(
                        "px-2.5 py-0.5 rounded-full text-[10px] font-medium transition-all duration-200 flex items-center gap-1 cursor-pointer",
                        template === fw.id
                          ? "bg-[#0096fe] text-white shadow-[0_0_8px_rgba(0,150,254,0.4)]"
                          : "text-white/40 hover:text-white/70 hover:bg-white/5"
                      )}
                    >
                      <span>{fw.icon}</span>
                      <span>{fw.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {isSignedIn ? (
                <button
                  onClick={handleSubmit}
                  disabled={!prompt.trim()}
                  className="inline-flex h-8 items-center gap-1.5 rounded-full px-5 text-xs font-semibold text-white cursor-pointer transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: prompt.trim() ? C.grad : "rgba(255, 255, 255, 0.08)", boxShadow: prompt.trim() ? C.glow : "none" }}
                >
                  Generate
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              ) : (
                <Link href="/sign-in">
                  <button
                    className="inline-flex h-8 items-center gap-1.5 rounded-full px-5 text-xs font-semibold text-white cursor-pointer transition-all active:scale-95"
                    style={{ background: C.grad, boxShadow: C.glow }}
                  >
                    Generate
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </Link>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => handleSuggestion(s)}
                className="rounded-full border border-white/8 bg-white/4 px-3 py-1.5 text-xs text-white/40 hover:border-white/15 hover:bg-white/8 hover:text-white/70 cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-10 text-xs text-white/20">
          No credit card required · 10 free generations on sign up
        </p>
      </section>

      {/* BROWSER MOCKUP */}
      <section className="px-4 pb-32 z-10 relative">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-white/8 bg-[#0f0f0f] shadow-2xl shadow-black/60">
          <div className="flex items-center gap-2 border-b border-white/6 px-4 py-3">
            <div className="flex gap-1.5">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-3 w-3 rounded-full bg-white/10" />
              ))}
            </div>

            <div className="mx-auto flex h-6 w-64 items-center justify-center rounded-md bg-white/5 px-3">
              <span className="text-xs text-white/25">codesphere.app/workspace</span>
            </div>
          </div>

          <div className="flex h-105">
            {/* Chat panel */}
            <div className="flex w-80 flex-col border-r border-white/6 bg-[#0d0d0d]">
              <div className="border-b border-white/6 px-4 py-3">
                <p className="text-xs uppercase tracking-wider text-white/30 font-semibold">
                  Chat
                </p>
              </div>

              <div className="flex-1 space-y-4 px-4 py-4">
                <div className="flex justify-end">
                  <div className="max-w-55 rounded-2xl rounded-br-sm bg-white/10 px-3.5 py-2.5">
                    <p className="text-xs text-white/80">
                      Build a kanban board with 3 columns and drag-and-drop
                    </p>
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md"
                    style={{ background: C.sky }}>
                    <Zap className="h-3 w-3 fill-white text-white" />
                  </div>

                  <div className="rounded-2xl rounded-tl-sm bg-white/5 px-3.5 py-2.5">
                    <p className="text-xs text-white/60">
                      I&apos;ll build a Kanban board with Todo, In Progress, and
                      Done columns. I&apos;ll use{" "}
                      <code className="text-blue-400/80">@dnd-kit/core</code>{" "}
                      for smooth drag-and-drop…
                    </p>
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md"
                    style={{ background: C.sky }}>
                    <Zap className="h-3 w-3 fill-white text-white" />
                  </div>
                  <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-white/5 px-3.5 py-3">
                    {[0, 0.15, 0.3].map((delay) => (
                      <span
                        key={delay}
                        className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/40"
                        style={{ animationDelay: `${delay}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-white/6 px-3 py-3">
                <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
                  <span className="flex-1 text-xs text-white/20">
                    Ask AI to modify…
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-white/20" />
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col">
              <div className="flex items-center gap-1 border-b border-white/6 px-4">
                <button className="border-b-2 border-blue-400 px-3 py-2.5 text-xs text-white">
                  Preview
                </button>
                <button className="px-3 py-2.5 text-xs text-white/30">
                  Code
                </button>
              </div>

              <div className="flex flex-1 gap-3 overflow-hidden bg-[#141414] p-5">
                {["Todo", "In Progress", "Done"].map((col, ci) => (
                  <div key={col} className="flex w-1/3 flex-col gap-2">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wider text-white/40">
                        {col}
                      </span>

                      <span className="rounded-full bg-white/8 px-1.5 py-0.5 text-xs text-white/30">
                        {[3, 2, 1][ci]}
                      </span>
                    </div>

                    {Array.from({ length: [3, 2, 1][ci] }).map((_, i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-white/8 bg-[#1a1a1a] p-2.5"
                      >
                        <div
                          className="mb-1.5 h-2 rounded-full bg-white/15"
                          style={{ width: `${60 + i * 15}%` }}
                        />
                        <div className="h-1.5 w-3/4 rounded-full bg-white/8" />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────────────── */}
      <section className="px-4 pb-32 z-10 relative">
        <div className="mx-auto mb-14 max-w-5xl text-center">
          <SectionLabel>Powerful features</SectionLabel>
          <SectionHeading gray="From idea" blue="to live production." />
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/6 bg-white/6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="group bg-[#0a0a0a]/90 p-7 hover:bg-[#0f0f0f]/90 transition-colors"
            >
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg border border-white/8 bg-white/4 group-hover:border-white/15 group-hover:bg-white/8 transition-colors">
                <Icon className="h-4 w-4 text-white/60 group-hover:text-blue-400/70" />
              </div>
              <p className="mb-2 text-sm font-semibold text-white">{label}</p>
              <p className="text-sm leading-relaxed text-white/40">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-4 pb-32 z-10 relative">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <SectionLabel>Seamless workflow</SectionLabel>
          <SectionHeading gray="From prompt" blue="to deployed app in seconds." />
        </div>

        <div className="mx-auto max-w-3xl">
          {STEPS.map((step, i) => (
            <div key={step.number} className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/4">
                  <span className="font-mono text-xs font-semibold text-white/50">
                    {step.number}
                  </span>
                </div>

                {i < STEPS.length - 1 && (
                  <div className="mt-2 h-full w-px bg-white/6" />
                )}
              </div>

              <div className="pb-10 pt-1.5">
                <p className="mb-1.5 text-sm font-semibold sm:text-base text-white">
                  {step.label}
                </p>

                <p className="text-sm leading-relaxed text-white/40">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="px-4 pb-32 z-10 relative">
        <div className="mx-auto mb-14 max-w-5xl text-center">
          <SectionLabel>Pricing plans</SectionLabel>
          <SectionHeading gray="Flexible tiers" blue="built for your speed." />

          <p className="mx-auto mt-4 max-w-sm text-sm text-white/35">
            No credit card required. Upgrade or downgrade anytime.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-3">
          {PRICING_PLANS.map((plan) => {
            const planOrder: Record<string, number> = {
              free: 0,
              starter: 1,
              pro: 2,
            };
            const activePlanKey = user ? user.plan : null;
            const isActive = isSignedIn && activePlanKey === plan.key;
            const isDowngrade =
              isSignedIn &&
              activePlanKey !== null &&
              !isActive &&
              planOrder[plan.key] < planOrder[activePlanKey];

            return (
              <div
                key={plan.key}
                className={cn(
                  "relative flex flex-col rounded-2xl border p-7 transition-colors",
                  plan.featured
                    ? "border-blue-500/25 bg-blue-500/4"
                    : "border-white/8 bg-[#0f0f0f]/90"
                )}
              >
                {/* Most popular pill */}
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full border border-blue-500/20 bg-[#0a0a0a] px-3 py-1 text-[11px] font-medium text-blue-400">
                      Most popular
                    </span>
                  </div>
                )}

                {/* Plan name + active badge */}
                <div className="mb-1 flex items-center gap-2">
                  <p className="text-sm font-semibold text-white/90">
                    {plan.label}
                  </p>
                  {isActive && (
                    <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-400">
                      Active
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="mb-6 text-xs leading-relaxed text-white/35">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-1 flex items-baseline gap-1">
                  <span className="font-serif text-4xl">
                    {plan.price === 0 ? (
                      <GrayTitle>$0</GrayTitle>
                    ) : (
                      <BlueTitle>${plan.price}</BlueTitle>
                    )}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-sm text-white/30">/mo</span>
                  )}
                </div>
                <p className="mb-6 text-xs text-white/25">
                  {plan.price === 0 ? "Always free" : "Only billed monthly"}
                </p>

                {/* Feature list */}
                <div className="mb-8 space-y-3 border-t border-white/6 pt-6">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-center gap-2.5">
                      <div
                        className={cn(
                          "flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                          plan.featured ? "bg-blue-500/15" : "bg-white/8"
                        )}
                      >
                        <Check
                          className={cn(
                            "h-2.5 w-2.5",
                            plan.featured ? "text-blue-400" : "text-white/50"
                          )}
                        />
                      </div>
                      <span className="text-xs text-white/55">{f}</span>
                    </div>
                  ))}
                </div>

                {/* CTA button */}
                <div className="mt-auto">
                  {isActive ? (
                    <Button
                      disabled
                      className="w-full rounded-full text-sm font-semibold opacity-50 cursor-not-allowed border border-white/10 bg-transparent text-white/60"
                      variant="ghost"
                    >
                      ✓ Current plan
                    </Button>
                  ) : plan.price === 0 ? (
                    isSignedIn ? (
                      <Button
                        disabled
                        className="w-full rounded-full text-sm font-semibold opacity-50 cursor-not-allowed border border-white/10 bg-transparent text-white/60"
                        variant="ghost"
                      >
                        Default plan
                      </Button>
                    ) : (
                      <Link href="/sign-in" className="block w-full">
                        <Button
                          className="w-full rounded-full text-sm font-semibold border border-white/10 bg-transparent text-white/60 hover:bg-white/6 hover:text-white/90 cursor-pointer"
                          variant="ghost"
                        >
                          Get started free
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    )
                  ) : isSignedIn ? (
                    <PricingDialog>
                      <button
                        className={cn(
                          "inline-flex h-9 items-center justify-center gap-1.5 w-full rounded-full text-xs font-semibold transition-all cursor-pointer active:scale-95",
                          plan.featured
                            ? "text-white"
                            : "border border-white/10 bg-transparent text-white/60 hover:bg-white/6 hover:text-white/90"
                        )}
                        style={plan.featured ? { background: C.grad, boxShadow: C.glow } : undefined}
                      >
                        {isDowngrade ? "Downgrade" : "Get started"}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </PricingDialog>
                  ) : (
                    <Link href="/sign-in" className="block w-full">
                      <button
                        className={cn(
                          "inline-flex h-9 items-center justify-center gap-1.5 w-full rounded-full text-xs font-semibold transition-all cursor-pointer active:scale-95",
                          plan.featured
                            ? "text-white"
                            : "border border-white/10 bg-transparent text-white/60 hover:bg-white/6 hover:text-white/90"
                        )}
                        style={plan.featured ? { background: C.grad, boxShadow: C.glow } : undefined}
                      >
                        Get started
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────────────────── */}
      <section className="relative mx-auto mb-32 max-w-5xl overflow-hidden rounded-2xl border border-white/8 px-10 py-24 text-center z-10"
        style={{
          border: `1px solid ${C.bdrM}`,
          background: "rgba(18, 22, 33, 0.75)",
          boxShadow: `0 0 100px rgba(0, 150, 254, 0.12)`,
        }}>
        <HoleBackground
          strokeColor="rgba(255,255,255,0.05)" // blur
          numberOfLines={36}
          numberOfDiscs={36}
          particleRGBColor={[147, 197, 253]}
          className="absolute inset-0 h-full w-full"
          style={{
            maskImage:
              "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
          }}
        />

        <SectionHeading gray="Step into the future." blue="Start building for free." />

        <p className="mb-8 text-sm leading-relaxed text-white/40">
          Get 10 free generations on sign up. No credit card required.
          <br />
          Upgrade when you&apos;re ready.
        </p>

        {isSignedIn ? (
          <Link href="/projects">
            <button
              className="inline-flex h-11 items-center gap-1.5 rounded-full px-8 text-sm font-semibold text-white cursor-pointer transition-all active:scale-95"
              style={{ background: C.grad, boxShadow: C.glow }}
            >
              Go to dashboard
              <ChevronRight className="h-4 w-4" />
            </button>
          </Link>
        ) : (
          <Link href="/sign-in">
            <button
              className="inline-flex h-11 items-center gap-1.5 rounded-full px-8 text-sm font-semibold text-white cursor-pointer transition-all active:scale-95"
              style={{ background: C.grad, boxShadow: C.glow }}
            >
              Get started free
              <ChevronRight className="h-4 w-4" />
            </button>
          </Link>
        )}
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="relative z-10 py-10 px-6" style={{ borderTop: "1px solid oklch(1 0 0 / 6%)" }}>
        <div className="mx-auto max-w-5xl flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-white/25">© 2026 Code Sphere</p>
          <div className="flex gap-6 text-xs text-white/25">
            <a href="#" className="hover:text-white/60 transition-colors">Privacy</a>
            <a href="#" className="hover:text-white/60 transition-colors">Terms</a>
            <a href="#" className="hover:text-white/60 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
