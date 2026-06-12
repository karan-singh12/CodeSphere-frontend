"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  ArrowRight, Zap, ChevronRight, Check, Sparkles,
  Plus, Minus, GitBranch, X, MessageSquare, Mail,
  Shield, Globe, Cpu, TrendingUp, Activity,
  BarChart2, Clock, Hash, FolderOpen, Target,
  Layers, Paintbrush, Blocks,
} from "lucide-react";
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

/* ── Design tokens — UNCHANGED ──────────────────────────────────────────── */
const C = {
  bg: "radial-gradient(circle at 50% 0%, rgba(0, 150, 254, 0.12) 0%, transparent 60%), radial-gradient(ellipse 70% 60% at 50% 100%, rgba(0, 150, 254, 0.22) 0%, transparent 100%)",
  sky: "#0096fe",
  bdrM: "rgba(0, 150, 254, 0.28)",
  grad: "linear-gradient(135deg, #0096fe, #0056b3)",
  glow: "0 0 28px rgba(0, 150, 254, 0.3)",
};

/* ── Static data ─────────────────────────────────────────────────────────── */

// Simple Icons CDN: https://cdn.simpleicons.org/{slug}/{color}
const SI = (slug: string, color = "ffffff") =>
  `https://cdn.simpleicons.org/${slug}/${color}`;

const FRAMEWORKS = [
  { id: "auto",    name: "Auto-Detect", logo: SI("googlegemini", "0096fe"), emoji: null },
  { id: "react",   name: "React",       logo: SI("react",        "61dafb"), emoji: null },
  { id: "nextjs",  name: "Next.js",     logo: SI("nextdotjs",    "ffffff"), emoji: null },
  { id: "vue",     name: "Vue",         logo: SI("vuedotjs",     "42b883"), emoji: null },
  { id: "nuxt",    name: "Nuxt",        logo: SI("nuxtdotjs",    "00dc82"), emoji: null },
  { id: "angular", name: "Angular",     logo: SI("angular",      "dd0031"), emoji: null },
  { id: "svelte",  name: "Svelte",      logo: SI("svelte",       "ff3e00"), emoji: null },
  { id: "static",  name: "Static",      logo: SI("html5",        "e34f26"), emoji: null },
];

const TECH_LOGOS = [
  { name: "React", logo: SI("react", "61dafb") },
  { name: "Next.js", logo: SI("nextdotjs", "ffffff") },
  { name: "Vue", logo: SI("vuedotjs", "42b883") },
  { name: "Nuxt", logo: SI("nuxtdotjs", "00dc82") },
  { name: "Angular", logo: SI("angular", "dd0031") },
  { name: "Svelte", logo: SI("svelte", "ff3e00") },
  { name: "Tailwind", logo: SI("tailwindcss", "06b6d4") },
  { name: "TypeScript", logo: SI("typescript", "3178c6") },
  { name: "Gemini", logo: SI("googlegemini", "8e75b2") },
  { name: "Prisma", logo: SI("prisma", "2d3748") },
  { name: "Node.js", logo: SI("nodedotjs", "5fa04e") },
  { name: "Sandpack", logo: SI("codesandbox", "ffffff") },
];

const STATS = [
  { value: "8+", label: "Frameworks", icon: Globe },
  { value: "~6s", label: "Avg generation", icon: Zap },
  { value: "100%", label: "Live preview", icon: Cpu },
  { value: "10", label: "Free generations", icon: TrendingUp },
  { value: "99.9%", label: "Uptime", icon: Shield },
  { value: "3+", label: "AI providers", icon: Sparkles },
];

const TESTIMONIALS = [
  { name: "Arjun Mehta", role: "Full-stack Developer", text: "CodeSphere saved me 3 days of boilerplate. I describe what I want and get production code instantly. The live preview is insane." },
  { name: "Priya Sharma", role: "Product Designer", text: "I'm not a coder but I prototype real apps now. Angular support was the thing that finally made it click for me." },
  { name: "Lucas Schmidt", role: "Startup Founder", text: "We validated our MVP idea in an afternoon. No engineers needed. CodeSphere writes clean, readable code every time." },
  { name: "Aiko Tanaka", role: "Frontend Engineer", text: "The image-aware prompts are a game changer — paste a Figma screenshot and get matching code. Saves hours of CSS work." },
  { name: "Carlos Rivera", role: "Indie Hacker", text: "Switched from bolt.new after trying the monitoring dashboard. Actually being able to see token usage per project is brilliant." },
  { name: "Sophie Laurent", role: "Tech Lead", text: "Vue + Nuxt support out of the box. The Cline Agent auto-fix is genuinely impressive — it reasons about the code before patching." },
  { name: "Dev Patel", role: "CS Student", text: "Free tier gives 10 generations. I built my entire portfolio website in one session. The code quality beat anything I would have written." },
  { name: "Mia Johnson", role: "UX Engineer", text: "Beautifully designed tool. The dark UI, the live preview, the streaming — it all feels like a proper IDE, not a toy." },
];


const FAQS = [
  {
    q: "What frameworks can CodeSphere generate code for?",
    a: "CodeSphere supports React (Vite), Next.js (App Router), Vue 3, Nuxt 3, Angular 17+, Svelte 4, and Static HTML/JS. Use Auto-Detect to let the AI pick based on your prompt, or choose manually.",
  },
  {
    q: "Is the generated code production-ready?",
    a: "Yes. CodeSphere uses Gemini to produce clean, readable code with proper component structure, Tailwind styling, and validated npm packages. It also filters hallucinated package names against the npm registry.",
  },
  {
    q: "What happens when my preview has an error?",
    a: "An error banner appears in the live preview. One click sends the full error trace back to AI, which auto-fixes the code. For Pro users, the Cline agent can iteratively self-correct across multiple files.",
  },
  {
    q: "Can I use my own design as a reference?",
    a: "Yes. Attach a screenshot or mockup image to your prompt. CodeSphere reads it and generates code that matches your layout and style as closely as possible.",
  },
  {
    q: "How are credits counted?",
    a: "Each generation (or improvement) costs 1 credit. Free plan starts with 10 credits/month. Starter gives 50 and Pro gives 150. Credits reset monthly.",
  },
  {
    q: "What is the Pro Agent (Cline) feature?",
    a: "Pro users get access to the CodeSphere autonomous agent powered by Cline SDK. It self-corrects code across multiple files, applies targeted patches, and explains its reasoning — all streamed live.",
  },
  {
    q: "Can I export or deploy my generated code?",
    a: "Yes. You can open the workspace in CodeSandbox directly, copy all source files, or export to a zip. Full source code is always visible and editable in the built-in editor.",
  },
  {
    q: "Is there a monitoring dashboard?",
    a: "Yes. The Monitoring page tracks inference latency, token usage, request counts, and error rates — per project or across all your workspaces. Great for understanding AI cost per feature.",
  },
];

const FOOTER_LINKS = {
  Product: [
    { label: "Projects", href: "/projects" },
    { label: "Workspace", href: "/workspace" },
    { label: "Monitoring", href: "/monitoring" },
    { label: "Pricing", href: "#pricing" },
  ],

  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};

/* ── Component ───────────────────────────────────────────────────────────── */
export default function LandingPage() {
  const { user } = useAuth();
  const isSignedIn = !!user;
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [prompt, setPrompt] = useState("");
  const [template, setTemplate] = useState("auto");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  };

  const handleSuggestion = (s: string) => {
    setPrompt(s);
    textareaRef.current?.focus();
  };

  return (
    <main className="min-h-screen selection:bg-white/20" style={{ background: C.bg }}>

      {/* ── Ambient orbs — UNCHANGED ─────────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="animate-float-orb absolute -top-40 left-[30%] h-[600px] w-[600px] rounded-full blur-3xl"
          style={{ background: "rgba(0, 150, 254, 0.10)" }} />
        <div className="animate-float-orb-delayed absolute top-1/3 -right-32 h-96 w-96 rounded-full blur-3xl"
          style={{ background: "rgba(0, 150, 254, 0.08)" }} />
        <div className="animate-float-orb-slow absolute bottom-1/4 -left-24 h-80 w-80 rounded-full blur-3xl"
          style={{ background: "rgba(0, 150, 254, 0.07)" }} />
        <div className="dot-pattern absolute inset-0 opacity-[0.35]" />
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════════ */}
      <section className="relative flex flex-col items-center overflow-hidden px-4 pb-24 pt-40 text-center z-10">
        <HoleBackground
          strokeColor="rgba(255,255,255,0.03)"
          className="absolute inset-0 h-full w-full"
          style={{
            maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)",
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
          Describe what you want to build. Code Sphere writes production-ready React, Next.js,
          Vue, Nuxt, Angular, Svelte, or Static code — picks packages and renders a live preview
          all inside your browser.
        </p>

        {/* Prompt box */}
        <div className="relative mx-auto mt-12 w-full max-w-2xl z-10">
          <div
            className={cn(
              "rounded-2xl border duration-200 bg-[#111111]/80 backdrop-blur-md",
              isFocused ? "border-blue-500/50 ring-1 ring-blue-500/20" : "border-white/8"
            )}
            style={{ boxShadow: isFocused ? C.glow : "none" }}
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
              <div className="flex items-center gap-1 bg-white/5 p-0.5 rounded-full border border-white/10 flex-wrap">
                {FRAMEWORKS.map((fw) => (
                  <button key={fw.id} onClick={() => setTemplate(fw.id)}
                    className={cn(
                      "px-2.5 py-0.5 rounded-full text-[10px] font-medium transition-all duration-200 flex items-center gap-1.5 cursor-pointer",
                      template === fw.id
                        ? "bg-[#0096fe] text-white shadow-[0_0_8px_rgba(0,150,254,0.4)]"
                        : "text-white/40 hover:text-white/70 hover:bg-white/5"
                    )}>
                    {fw.logo ? (
                      <img src={fw.logo} alt={fw.name} className="h-3 w-3 object-contain" style={{ filter: template === fw.id ? "brightness(10)" : "brightness(1.5)" }} />
                    ) : (
                      <span>{fw.emoji}</span>
                    )}
                    <span>{fw.name}</span>
                  </button>
                ))}
              </div>
              {isSignedIn ? (
                <button onClick={handleSubmit} disabled={!prompt.trim()}
                  className="inline-flex h-8 items-center gap-1.5 rounded-full px-5 text-xs font-semibold text-white cursor-pointer transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: prompt.trim() ? C.grad : "rgba(255,255,255,0.08)", boxShadow: prompt.trim() ? C.glow : "none" }}>
                  Generate <ArrowRight className="h-3.5 w-3.5" />
                </button>
              ) : (
                <Link href="/sign-in">
                  <button className="inline-flex h-8 items-center gap-1.5 rounded-full px-5 text-xs font-semibold text-white cursor-pointer transition-all active:scale-95"
                    style={{ background: C.grad, boxShadow: C.glow }}>
                    Generate <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </Link>
              )}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => handleSuggestion(s)}
                className="rounded-full border border-white/8 bg-white/4 px-3 py-1.5 text-xs text-white/40 hover:border-white/15 hover:bg-white/8 hover:text-white/70 cursor-pointer">
                {s}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-10 text-xs text-white/20">
          No credit card required · 10 free generations on sign up
        </p>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          STATS BAR
      ══════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 border-y border-white/6 bg-white/[0.015] py-6 px-4">
        <div className="mx-auto max-w-5xl grid grid-cols-3 sm:grid-cols-6 gap-6 text-center">
          {STATS.map(({ value, label, icon: Icon }) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/8 bg-white/4 mb-1">
                <Icon className="h-3.5 w-3.5 text-blue-400/70" />
              </div>
              <p className="font-serif text-2xl font-bold text-white leading-none">{value}</p>
              <p className="text-[10px] text-white/35 uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          TECH LOGOS TICKER
      ══════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 overflow-hidden py-5 border-b border-white/5">
        <div className="flex marquee-container">
          <div className="marquee-wrapper animate-marquee">
            {[...TECH_LOGOS, ...TECH_LOGOS].map((t, i) => (
              <span key={i} className="inline-flex items-center gap-2.5 px-8 text-sm text-white/25 whitespace-nowrap">
                <img src={t.logo} alt={t.name} className="h-5 w-5 object-contain opacity-60" />
                <span className="font-medium">{t.name}</span>
                <span className="text-white/10 mx-1">·</span>
              </span>
            ))}
          </div>
          <div className="marquee-wrapper animate-marquee2" aria-hidden>
            {[...TECH_LOGOS, ...TECH_LOGOS].map((t, i) => (
              <span key={i} className="inline-flex items-center gap-2.5 px-8 text-sm text-white/25 whitespace-nowrap">
                <img src={t.logo} alt={t.name} className="h-5 w-5 object-contain opacity-60" />
                <span className="font-medium">{t.name}</span>
                <span className="text-white/10 mx-1">·</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          BENTO GRID — Features + Browser mockup
      ══════════════════════════════════════════════════════════════════ */}
      <section className="px-4 py-20 z-10 relative">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <SectionLabel>Powerful features</SectionLabel>
            <SectionHeading gray="From idea" blue="to live production." />
          </div>


          {/* Row 1 — rich workspace mockup */}
          <div className="overflow-hidden rounded-2xl border border-white/8 bg-[#0f0f0f] shadow-2xl shadow-black/60 mb-4">

            {/* Browser chrome */}
            <div className="flex items-center gap-2 border-b border-white/6 bg-[#0a0a0a] px-4 py-2.5">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
                <div className="h-3 w-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="mx-auto flex h-6 w-56 items-center justify-center gap-1.5 rounded-md bg-white/5 px-3">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] text-white/30">codesphere.app/workspace</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-white/25">
                <span className="rounded border border-white/8 px-1.5 py-0.5">⌘K</span>
              </div>
            </div>

            {/* Workspace body */}
            <div className="flex" style={{ height: "480px" }}>

              {/* LEFT — chat sidebar */}
              <div className="flex w-[280px] shrink-0 flex-col border-r border-white/6 bg-[#0d0d0d]">

                {/* Chat header */}
                <div className="flex items-center justify-between border-b border-white/6 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded" style={{ background: C.sky }}>
                      <Zap className="h-3 w-3 fill-white text-white" />
                    </div>
                    <span className="text-xs font-semibold text-white/70">CodeSphere</span>
                  </div>
                  <span className="rounded-full border border-white/8 px-2 py-0.5 text-[10px] text-white/30">React</span>
                </div>

                {/* Chat messages */}
                <div className="flex-1 space-y-3 overflow-hidden px-3 py-3">
                  {/* User message */}
                  <div className="flex justify-end">
                    <div className="max-w-[200px] rounded-2xl rounded-br-sm bg-[#0096fe]/20 px-3 py-2 border border-[#0096fe]/20">
                      <p className="text-[11px] text-white/80 leading-relaxed">Build a kanban board with 3 columns, drag-and-drop cards and priority labels</p>
                    </div>
                  </div>

                  {/* AI response */}
                  <div className="flex gap-2">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md" style={{ background: C.sky }}>
                      <Zap className="h-3 w-3 fill-white text-white" />
                    </div>
                    <div className="rounded-2xl rounded-tl-sm bg-white/5 border border-white/6 px-3 py-2.5 max-w-[190px]">
                      <p className="text-[11px] text-white/65 leading-relaxed">
                        Building a Kanban board with <span className="text-blue-400 font-mono text-[10px]">@dnd-kit</span> for drag-and-drop. Adding priority badges and user avatars.
                      </p>
                    </div>
                  </div>

                  {/* Status steps */}
                  <div className="space-y-1.5 pl-8">
                    {[
                      { done: true,  label: "Generating components…" },
                      { done: true,  label: "Validating packages…"  },
                      { done: false, label: "Rendering preview…"    },
                    ].map((s) => (
                      <div key={s.label} className="flex items-center gap-2">
                        <div className={`h-1.5 w-1.5 rounded-full ${s.done ? "bg-emerald-400" : "bg-[#0096fe] animate-pulse"}`} />
                        <span className={`text-[10px] ${s.done ? "text-white/30 line-through" : "text-white/50"}`}>{s.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Second user message */}
                  <div className="flex justify-end">
                    <div className="max-w-[190px] rounded-2xl rounded-br-sm bg-[#0096fe]/20 px-3 py-2 border border-[#0096fe]/20">
                      <p className="text-[11px] text-white/80 leading-relaxed">Add a dark header with a logo and search bar</p>
                    </div>
                  </div>
                </div>

                {/* Input area */}
                <div className="border-t border-white/6 p-3">
                  <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/8 px-3 py-2">
                    <span className="flex-1 text-[11px] text-white/20">Ask AI to modify…</span>
                    <div className="flex h-5 w-5 items-center justify-center rounded-md" style={{ background: C.sky }}>
                      <ArrowRight className="h-2.5 w-2.5 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT — editor area */}
              <div className="flex flex-1 flex-col overflow-hidden">

                {/* Tab bar */}
                <div className="flex items-center border-b border-white/6 bg-[#0c0c0c] px-2">
                  <button className="relative flex items-center gap-1.5 border-b-2 border-[#0096fe] px-4 py-2.5 text-xs font-medium text-white">
                    <div className="h-2 w-2 rounded-full bg-emerald-400" />
                    Preview
                  </button>
                  <button className="flex items-center gap-1.5 px-4 py-2.5 text-xs text-white/30 hover:text-white/60">
                    <div className="h-2 w-2 rounded-full bg-white/15" />
                    Code
                  </button>
                  <div className="ml-auto flex items-center gap-2 pr-2">
                    <span className="rounded border border-white/8 px-2 py-0.5 text-[10px] text-white/30">App.jsx</span>
                    <span className="rounded border border-white/8 px-2 py-0.5 text-[10px] text-white/30">KanbanBoard.jsx</span>
                  </div>
                </div>

                {/* Preview — rich kanban board */}
                <div className="flex-1 overflow-hidden bg-[#f8fafc] p-4">

                  {/* Kanban app header */}
                  <div className="mb-3 flex items-center justify-between rounded-xl bg-[#1e293b] px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded" style={{ background: C.sky }}>
                        <Zap className="h-2.5 w-2.5 fill-white text-white" />
                      </div>
                      <span className="text-xs font-bold text-white">TaskFlow</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-32 items-center gap-1.5 rounded-md bg-white/10 px-2">
                        <svg className="h-2.5 w-2.5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span className="text-[10px] text-white/30">Search tasks…</span>
                      </div>
                      <div className="flex -space-x-1.5">
                        {["#0096fe", "#8b5cf6", "#10b981"].map((c) => (
                          <div key={c} className="h-5 w-5 rounded-full border-2 border-[#1e293b]" style={{ background: c }} />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Kanban columns */}
                  <div className="flex gap-3 h-[calc(100%-52px)]">
                    {[
                      {
                        title: "To Do", color: "#94a3b8", count: 3, dot: "bg-slate-400",
                        cards: [
                          { title: "Design new onboarding", priority: "High", tag: "Design", tagColor: "#8b5cf6", tagBg: "#ede9fe", avatar: "#0096fe" },
                          { title: "Write API documentation", priority: "Med", tag: "Docs", tagColor: "#0891b2", tagBg: "#e0f2fe", avatar: "#10b981" },
                          { title: "Set up CI/CD pipeline", priority: "Low", tag: "DevOps", tagColor: "#65a30d", tagBg: "#f0fdf4", avatar: "#f59e0b" },
                        ]
                      },
                      {
                        title: "In Progress", color: "#0096fe", count: 2, dot: "bg-blue-400",
                        cards: [
                          { title: "Build auth system with JWT", priority: "High", tag: "Backend", tagColor: "#dc2626", tagBg: "#fee2e2", avatar: "#8b5cf6" },
                          { title: "Implement drag-and-drop", priority: "Med", tag: "Frontend", tagColor: "#0096fe", tagBg: "#dbeafe", avatar: "#0096fe" },
                        ]
                      },
                      {
                        title: "Done", color: "#10b981", count: 2, dot: "bg-emerald-400",
                        cards: [
                          { title: "Set up Prisma ORM schema", priority: "Done", tag: "Database", tagColor: "#059669", tagBg: "#d1fae5", avatar: "#f59e0b" },
                          { title: "Create landing page hero", priority: "Done", tag: "Design", tagColor: "#8b5cf6", tagBg: "#ede9fe", avatar: "#10b981" },
                        ]
                      },
                    ].map((col) => (
                      <div key={col.title} className="flex w-1/3 flex-col gap-2">
                        {/* Column header */}
                        <div className="flex items-center justify-between rounded-lg px-2 py-1">
                          <div className="flex items-center gap-1.5">
                            <div className={`h-2 w-2 rounded-full ${col.dot}`} />
                            <span className="text-[11px] font-semibold text-slate-600">{col.title}</span>
                          </div>
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-200 text-[9px] font-bold text-slate-500">{col.count}</span>
                        </div>

                        {/* Cards */}
                        {col.cards.map((card) => (
                          <div key={card.title} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm hover:shadow-md transition-shadow cursor-grab">
                            {/* Tag + priority */}
                            <div className="mb-2 flex items-center justify-between">
                              <span className="rounded-md px-1.5 py-0.5 text-[9px] font-semibold"
                                style={{ color: card.tagColor, background: card.tagBg }}>
                                {card.tag}
                              </span>
                              <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${
                                card.priority === "High" ? "bg-red-100 text-red-500" :
                                card.priority === "Med"  ? "bg-amber-100 text-amber-600" :
                                card.priority === "Done" ? "bg-emerald-100 text-emerald-600" :
                                "bg-slate-100 text-slate-500"
                              }`}>{card.priority}</span>
                            </div>

                            {/* Title */}
                            <p className="mb-2.5 text-[11px] font-semibold leading-tight text-slate-700">{card.title}</p>

                            {/* Progress bar */}
                            <div className="mb-2 h-1 w-full rounded-full bg-slate-100">
                              <div className="h-1 rounded-full"
                                style={{
                                  width: card.priority === "Done" ? "100%" : card.priority === "High" ? "65%" : "30%",
                                  background: card.priority === "Done" ? "#10b981" : col.color,
                                }} />
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between">
                              <div className="h-5 w-5 rounded-full border-2 border-white shadow-sm" style={{ background: card.avatar }} />
                              <span className="text-[9px] text-slate-400">2d ago</span>
                            </div>
                          </div>
                        ))}

                        {/* Add card button */}
                        <button className="flex items-center gap-1.5 rounded-lg border border-dashed border-slate-200 px-3 py-2 text-[10px] text-slate-400 hover:border-slate-300 hover:text-slate-500 transition-colors">
                          <span className="text-base leading-none">+</span> Add task
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2 — big + 2 stacked */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {(() => {
              const HeroIcon = FEATURES[0].icon;
              return (
                <div className="sm:col-span-2 group relative overflow-hidden rounded-2xl border border-white/8 bg-[#0a0a0a]/90 p-7 hover:bg-[#0f0f0f]/90 transition-colors">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: "radial-gradient(circle at 20% 50%, rgba(0,150,254,0.07), transparent 60%)" }} />
                  <div className="absolute bottom-0 right-0 w-40 h-40 opacity-[0.15]"
                    style={{
                      backgroundImage: "linear-gradient(rgba(0,150,254,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,150,254,0.4) 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                      maskImage: "radial-gradient(circle at bottom right, black 20%, transparent 65%)",
                      WebkitMaskImage: "radial-gradient(circle at bottom right, black 20%, transparent 65%)",
                    }} />
                  <div className="relative z-10">
                    <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg border border-white/8 bg-white/4 group-hover:border-white/15 group-hover:bg-white/8 transition-colors">
                      <HeroIcon className="h-4 w-4 text-white/60 group-hover:text-blue-400/70" />
                    </div>
                    <p className="mb-2 text-base font-semibold text-white">{FEATURES[0].label}</p>
                    <p className="text-sm leading-relaxed text-white/40">{FEATURES[0].desc}</p>
                  </div>
                </div>
              );
            })()}
            <div className="flex flex-col gap-4">
              {FEATURES.slice(1, 3).map(({ icon: Icon, label, desc }) => (
                <div key={label} className="group relative overflow-hidden flex-1 rounded-2xl border border-white/8 bg-[#0a0a0a]/90 p-6 hover:bg-[#0f0f0f]/90 transition-colors">
                  <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg border border-white/8 bg-white/4 group-hover:border-white/15 group-hover:bg-white/8 transition-colors">
                    <Icon className="h-3.5 w-3.5 text-white/60 group-hover:text-blue-400/70" />
                  </div>
                  <p className="mb-1.5 text-sm font-semibold text-white">{label}</p>
                  <p className="text-xs leading-relaxed text-white/40">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Row 3 — 3 equal */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {FEATURES.slice(3).map(({ icon: Icon, label, desc }) => (
              <div key={label} className="group relative overflow-hidden rounded-2xl border border-white/8 bg-[#0a0a0a]/90 p-7 hover:bg-[#0f0f0f]/90 transition-colors">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: "radial-gradient(circle at 50% 0%, rgba(0,150,254,0.05), transparent 70%)" }} />
                <div className="relative z-10">
                  <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg border border-white/8 bg-white/4 group-hover:border-white/15 group-hover:bg-white/8 transition-colors">
                    <Icon className="h-4 w-4 text-white/60 group-hover:text-blue-400/70" />
                  </div>
                  <p className="mb-2 text-sm font-semibold text-white">{label}</p>
                  <p className="text-sm leading-relaxed text-white/40">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════════════════════ */}
      <section className="px-4 pb-24 z-10 relative">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <SectionLabel>Seamless workflow</SectionLabel>
            <SectionHeading gray="From prompt" blue="to deployed app in seconds." />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STEPS.map((step) => (
              <div key={step.number} className="group rounded-2xl border border-white/8 bg-[#0a0a0a]/90 p-6 hover:bg-[#0f0f0f]/90 transition-colors hover:border-white/12">
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full border font-mono text-xs font-semibold"
                  style={{ borderColor: "rgba(0,150,254,0.25)", color: "#0096fe", background: "rgba(0,150,254,0.08)" }}>
                  {step.number}
                </div>
                <p className="mb-1.5 text-sm font-semibold text-white">{step.label}</p>
                <p className="text-sm leading-relaxed text-white/40">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          MONITORING SHOWCASE
      ══════════════════════════════════════════════════════════════════ */}
      <section className="px-4 pb-28 z-10 relative">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <SectionLabel>Built-in observability</SectionLabel>
            <SectionHeading gray="Monitor every AI call," blue="per project." />
            <p className="mx-auto mt-4 max-w-lg text-sm text-white/40 leading-relaxed">
              Every generation is logged. Track latency, token usage, error rates, and request
              volume across all your projects — or drill into a single workspace.
            </p>
          </div>

          {/* Main monitoring mockup */}
          <div className="rounded-2xl border border-white/8 bg-[#0f0f0f] overflow-hidden shadow-2xl shadow-black/60 mb-4">

            {/* Top bar */}
            <div className="flex items-center justify-between border-b border-white/6 px-5 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md" style={{ background: "rgba(0,150,254,0.15)" }}>
                  <Zap className="h-3 w-3 text-[#0096fe]" />
                </div>
                <span className="font-serif text-sm font-semibold text-white/80">System <span className="text-[#0096fe]">Diagnostics</span></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 rounded-full border border-white/8 bg-white/4 px-3 py-1 text-[10px] text-white/40">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  All Projects
                </div>
                <div className="flex h-6 items-center gap-1 rounded-full border border-white/8 bg-white/4 px-3 text-[10px] text-white/40">
                  Refresh
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-4 border-b border-white/6">
              {[
                { label: "Total Requests", value: "1,284", color: "text-blue-400", sub: "Across all projects" },
                { label: "Total Tokens", value: "842k", color: "text-violet-400", sub: "Tokens consumed" },
                { label: "Avg Latency", value: "5.2s", color: "text-amber-400", sub: "Avg response time" },
                { label: "System Health", value: "98%", color: "text-emerald-400", sub: "Error rate: 0.2%" },
              ].map((stat) => (
                <div key={stat.label} className="p-5 border-r border-white/6 last:border-r-0">
                  <p className="text-[10px] uppercase tracking-wider text-white/35 mb-2">{stat.label}</p>
                  <p className={`text-2xl font-bold font-serif ${stat.color}`}>{stat.value}</p>
                  <p className="text-[10px] text-white/25 mt-1">{stat.sub}</p>
                </div>
              ))}
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-3 gap-0 divide-x divide-white/6">

              {/* Request volume bar chart */}
              <div className="col-span-2 p-5">
                <p className="text-xs font-semibold text-white/70 mb-1">Request Volume Trends</p>
                <p className="text-[10px] text-white/30 mb-4">Daily prompt count — last 30 days</p>
                <div className="flex items-end gap-1 h-24 border-b border-l border-white/8 pb-1 pl-1">
                  {[4, 7, 5, 9, 6, 11, 8, 14, 10, 13, 9, 16, 12, 18, 15, 20, 14, 17, 11, 19, 16, 22, 18, 24, 20, 17, 23, 21, 26, 28].map((v, i) => (
                    <div key={i} className="flex-1 rounded-t transition-all"
                      style={{
                        height: `${(v / 28) * 100}%`,
                        background: i >= 25
                          ? "linear-gradient(to top, #0056b3, #0096fe)"
                          : "rgba(0,150,254,0.25)",
                        minHeight: "3px",
                      }} />
                  ))}
                </div>
                <div className="flex justify-between text-[9px] text-white/20 mt-1.5">
                  <span>30 days ago</span>
                  <span>Daily Requests</span>
                  <span>Today</span>
                </div>
              </div>

              {/* Provider usage */}
              <div className="p-5">
                <p className="text-xs font-semibold text-white/70 mb-1">Inference Providers</p>
                <p className="text-[10px] text-white/30 mb-4">Share by LLM provider</p>
                <div className="space-y-3">
                  {[
                    { name: "gemini", pct: 78, color: "from-blue-500 to-indigo-500" },
                    { name: "openai", pct: 15, color: "from-emerald-500 to-teal-500" },
                    { name: "claude", pct: 7, color: "from-violet-500 to-purple-500" },
                  ].map((p) => (
                    <div key={p.name}>
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className="text-white/60 capitalize font-medium">{p.name}</span>
                        <span className="text-white/35">{p.pct}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                        <div className={`h-full rounded-full bg-gradient-to-r ${p.color}`} style={{ width: `${p.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Latency trend line chart */}
            <div className="border-t border-white/6 p-5">
              <p className="text-xs font-semibold text-white/70 mb-1">Latency Trends</p>
              <p className="text-[10px] text-white/30 mb-3">Average time to complete generation stream (ms)</p>
              <div className="h-16 relative border-b border-l border-white/8">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="latGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#d97706" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M 0 100 L 0 60 L 10 55 L 20 65 L 30 45 L 40 50 L 50 35 L 60 40 L 70 30 L 80 35 L 90 25 L 100 20 L 100 100 Z" fill="url(#latGrad)" />
                  <path d="M 0 60 L 10 55 L 20 65 L 30 45 L 40 50 L 50 35 L 60 40 L 70 30 L 80 35 L 90 25 L 100 20"
                    fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex justify-between text-[9px] text-white/20 mt-1.5">
                <span>30 days ago</span>
                <span>Avg Latency (max: 8200ms)</span>
                <span>Today</span>
              </div>
            </div>
          </div>

          {/* 3 feature callout cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            {[
              {
                icon: Activity,
                title: "Per-project filtering",
                desc: "Switch between 'All Projects' and any individual workspace. Every chart and metric updates instantly.",
              },
              {
                icon: TrendingUp,
                title: "30-day time series",
                desc: "Request volume and latency trends shown day-by-day. Spot spikes, measure improvement over iterations.",
              },
              {
                icon: Shield,
                title: "Anomaly detection",
                desc: "Critical errors, high latency, and excessive token usage are flagged automatically with a health score.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group rounded-2xl border border-white/8 bg-[#0a0a0a]/90 p-6 hover:bg-[#0f0f0f]/90 hover:border-white/12 transition-colors">
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg border border-white/8 bg-white/4 group-hover:border-white/15 group-hover:bg-white/8 transition-colors">
                  <Icon className="h-4 w-4 text-white/50 group-hover:text-blue-400/70 transition-colors" />
                </div>
                <p className="mb-2 text-sm font-semibold text-white">{title}</p>
                <p className="text-sm leading-relaxed text-white/40">{desc}</p>
              </div>
            ))}
          </div>

          {/* CTA to monitoring */}
          <div className="mt-6 text-center">
            <Link href="/monitoring">
              <button className="inline-flex h-9 items-center gap-1.5 rounded-full px-6 text-xs font-semibold text-white cursor-pointer transition-all active:scale-95"
                style={{ background: C.grad, boxShadow: C.glow }}>
                View live monitoring <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          MONITORING SHOWCASE
      ══════════════════════════════════════════════════════════════════ */}
      <section className="px-4 pb-28 z-10 relative">
        <div className="mx-auto max-w-5xl">

          {/* Heading */}
          <div className="text-center mb-14">
            <SectionLabel>Built-in observability</SectionLabel>
            <SectionHeading gray="Know exactly what your" blue="AI is doing." />
            <p className="mx-auto mt-4 max-w-lg text-sm text-white/35 leading-relaxed">
              Every generation is logged. Track latency, token costs, error rates, and request
              volume — per project or across your entire account.
            </p>
          </div>

          {/* Two-column: left = copy bullets, right = dashboard mockup */}
          <div className="grid lg:grid-cols-5 gap-8 items-start">

            {/* LEFT — feature bullets */}
            <div className="lg:col-span-2 space-y-6 lg:pt-4">
              {[
                {
                  color: "text-blue-400",
                  bg: "rgba(0,150,254,0.08)",
                  border: "rgba(0,150,254,0.2)",
                  Icon: BarChart2,
                  title: "Request volume trends",
                  desc: "Daily bar chart of every AI prompt sent across your workspaces — 30 days at a glance.",
                },
                {
                  color: "text-amber-400",
                  bg: "rgba(217,119,6,0.08)",
                  border: "rgba(217,119,6,0.2)",
                  Icon: Clock,
                  title: "Latency trend line",
                  desc: "Area chart showing average response time per day. Spot slow models or network issues instantly.",
                },
                {
                  color: "text-violet-400",
                  bg: "rgba(139,92,246,0.08)",
                  border: "rgba(139,92,246,0.2)",
                  Icon: Hash,
                  title: "Token consumption",
                  desc: "Total tokens used per project. Compare providers, track costs, and optimise prompts.",
                },
                {
                  color: "text-emerald-400",
                  bg: "rgba(16,185,129,0.08)",
                  border: "rgba(16,185,129,0.2)",
                  Icon: Shield,
                  title: "System health score",
                  desc: "Live health score calculated from error rate, latency anomalies, and token spikes.",
                },
                {
                  color: "text-sky-400",
                  bg: "rgba(14,165,233,0.08)",
                  border: "rgba(14,165,233,0.2)",
                  Icon: FolderOpen,
                  title: "Per-project filtering",
                  desc: "Switch between All Projects or drill into a single workspace to see its specific metrics.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border"
                    style={{ background: item.bg, borderColor: item.border }}>
                    <item.Icon className={`h-4 w-4 ${item.color}`} />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold mb-1 ${item.color}`}>{item.title}</p>
                    <p className="text-xs leading-relaxed text-white/40">{item.desc}</p>
                  </div>
                </div>
              ))}

              <Link href="/monitoring">
                <button
                  className="mt-4 inline-flex h-9 items-center gap-2 rounded-full px-5 text-xs font-semibold text-white cursor-pointer transition-all active:scale-95"
                  style={{ background: C.grad, boxShadow: C.glow }}
                >
                  View monitoring dashboard <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </Link>
            </div>

            {/* RIGHT — static dashboard mockup */}
            <div className="lg:col-span-3">
              <div className="relative rounded-2xl border border-white/8 bg-[#0a0a0a] overflow-hidden shadow-2xl shadow-black/60">

                {/* Glow effect behind mockup */}
                <div className="pointer-events-none absolute -inset-1 rounded-2xl opacity-20 blur-xl"
                  style={{ background: "radial-gradient(ellipse at 60% 0%, rgba(0,150,254,0.5), transparent 70%)" }} />

                {/* Title bar */}
                <div className="relative flex items-center justify-between border-b border-white/6 px-5 py-3.5 bg-[#0d0d0d]">
                  <div>
                    <p className="font-serif text-sm font-bold text-white/80">System <span className="text-[#0096fe]">Diagnostics</span></p>
                    <p className="text-[10px] text-white/25 mt-0.5">AI inference monitoring dashboard</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/8 px-2.5 py-1 text-[10px] text-blue-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                      Live
                    </div>
                  </div>
                </div>

                <div className="relative p-4 space-y-3">

                  {/* Stat cards row */}
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: "Total Requests", value: "1,284", accent: "text-blue-400", icon: "↑" },
                      { label: "Total Tokens", value: "48.2k", accent: "text-violet-400", icon: "⬡" },
                      { label: "Avg Latency", value: "5.34s", accent: "text-amber-400", icon: "⏱" },
                      { label: "Health Score", value: "97%", accent: "text-emerald-400", icon: "✦" },
                    ].map((card) => (
                      <div key={card.label} className="rounded-xl border border-white/8 bg-[#111] p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[9px] font-medium uppercase tracking-wider text-white/30">{card.label}</span>
                          <span className={`text-xs ${card.accent}`}>{card.icon}</span>
                        </div>
                        <p className={`text-lg font-bold ${card.accent}`}>{card.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Charts row */}
                  <div className="grid grid-cols-3 gap-2">

                    {/* Bar chart — request volume */}
                    <div className="col-span-2 rounded-xl border border-white/8 bg-[#111] p-3">
                      <p className="text-[10px] font-semibold text-white/60 mb-1">Request Volume</p>
                      <p className="text-[9px] text-white/25 mb-3">Last 14 days</p>
                      <div className="flex items-end gap-1 h-20 border-b border-l border-white/8 pb-1 pl-1">
                        {[22, 35, 18, 44, 31, 52, 40, 28, 46, 38, 55, 42, 60, 48].map((v, i) => (
                          <div key={i} className="flex-1 rounded-sm"
                            style={{
                              height: `${(v / 60) * 100}%`,
                              background: i === 13
                                ? "linear-gradient(to top, #0096fe, #38bdf8)"
                                : "rgba(0,150,254,0.25)",
                            }} />
                        ))}
                      </div>
                    </div>

                    {/* Provider usage */}
                    <div className="rounded-xl border border-white/8 bg-[#111] p-3">
                      <p className="text-[10px] font-semibold text-white/60 mb-1">Providers</p>
                      <p className="text-[9px] text-white/25 mb-3">Token share</p>
                      <div className="space-y-2.5">
                        {[
                          { name: "Gemini", pct: 78, color: "from-blue-500 to-indigo-500" },
                          { name: "OpenAI", pct: 15, color: "from-violet-500 to-purple-500" },
                          { name: "Claude", pct: 7, color: "from-amber-500 to-orange-500" },
                        ].map((p) => (
                          <div key={p.name}>
                            <div className="flex justify-between text-[9px] mb-0.5">
                              <span className="text-white/50">{p.name}</span>
                              <span className="text-white/30">{p.pct}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                              <div className={`h-full bg-gradient-to-r ${p.color} rounded-full`} style={{ width: `${p.pct}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Latency trend line */}
                  <div className="rounded-xl border border-white/8 bg-[#111] p-3">
                    <p className="text-[10px] font-semibold text-white/60 mb-1">Latency Trends</p>
                    <p className="text-[9px] text-white/25 mb-2">Average response time (ms)</p>
                    <div className="h-14 border-b border-l border-white/8 pb-1 pl-1 relative">
                      <svg className="h-full w-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="latGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#d97706" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        {/* area */}
                        <path d="M0 40 L0 28 L8 24 L16 26 L24 20 L32 22 L40 15 L48 18 L56 14 L64 16 L72 10 L80 12 L88 8 L100 10 L100 40 Z" fill="url(#latGrad)" />
                        {/* line */}
                        <path d="M0 28 L8 24 L16 26 L24 20 L32 22 L40 15 L48 18 L56 14 L64 16 L72 10 L80 12 L88 8 L100 10"
                          fill="none" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          TESTIMONIALS MARQUEE
      ══════════════════════════════════════════════════════════════════ */}
      <section className="pb-24 z-10 relative overflow-hidden">
        <div className="text-center mb-12 px-4">
          <SectionLabel>What builders say</SectionLabel>
          <SectionHeading gray="Loved by developers" blue="worldwide." />
        </div>

        {/* Row 1 — left to right */}
        <div className="flex marquee-container mb-4">
          <div className="marquee-wrapper animate-marquee">
            {[...TESTIMONIALS.slice(0, 4), ...TESTIMONIALS.slice(0, 4)].map((t, i) => (
              <div key={i} className="inline-flex flex-col gap-3 w-72 mx-3 rounded-2xl border border-white/8 bg-[#0d0d0d] p-5 align-top whitespace-normal">
                <p className="text-sm leading-relaxed text-white/55">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-2.5 mt-auto pt-3 border-t border-white/6">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold shrink-0"
                    style={{ background: "rgba(0,150,254,0.15)", color: "#0096fe" }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white/80">{t.name}</p>
                    <p className="text-[10px] text-white/35">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="marquee-wrapper animate-marquee2" aria-hidden>
            {[...TESTIMONIALS.slice(0, 4), ...TESTIMONIALS.slice(0, 4)].map((t, i) => (
              <div key={i} className="inline-flex flex-col gap-3 w-72 mx-3 rounded-2xl border border-white/8 bg-[#0d0d0d] p-5 align-top whitespace-normal">
                <p className="text-sm leading-relaxed text-white/55">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-2.5 mt-auto pt-3 border-t border-white/6">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold shrink-0"
                    style={{ background: "rgba(0,150,254,0.15)", color: "#0096fe" }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white/80">{t.name}</p>
                    <p className="text-[10px] text-white/35">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 — right to left (reverse) */}
        <div className="flex marquee-container" style={{ direction: "rtl" }}>
          <div className="marquee-wrapper animate-marquee" style={{ direction: "ltr" }}>
            {[...TESTIMONIALS.slice(4), ...TESTIMONIALS.slice(4)].map((t, i) => (
              <div key={i} className="inline-flex flex-col gap-3 w-72 mx-3 rounded-2xl border border-white/8 bg-[#0d0d0d] p-5 align-top whitespace-normal">
                <p className="text-sm leading-relaxed text-white/55">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-2.5 mt-auto pt-3 border-t border-white/6">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold shrink-0"
                    style={{ background: "rgba(0,150,254,0.15)", color: "#0096fe" }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white/80">{t.name}</p>
                    <p className="text-[10px] text-white/35">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="marquee-wrapper animate-marquee2" aria-hidden style={{ direction: "ltr" }}>
            {[...TESTIMONIALS.slice(4), ...TESTIMONIALS.slice(4)].map((t, i) => (
              <div key={i} className="inline-flex flex-col gap-3 w-72 mx-3 rounded-2xl border border-white/8 bg-[#0d0d0d] p-5 align-top whitespace-normal">
                <p className="text-sm leading-relaxed text-white/55">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-2.5 mt-auto pt-3 border-t border-white/6">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold shrink-0"
                    style={{ background: "rgba(0,150,254,0.15)", color: "#0096fe" }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white/80">{t.name}</p>
                    <p className="text-[10px] text-white/35">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          PROJECT SPEC BUILDER SHOWCASE
      ══════════════════════════════════════════════════════════════════ */}
      <section className="px-4 pb-28 z-10 relative">
        <div className="mx-auto max-w-5xl">

          {/* Heading */}
          <div className="text-center mb-12">
            <SectionLabel>Smart project setup</SectionLabel>
            <SectionHeading gray="Don't just describe —" blue="architect it." />
            <p className="mx-auto mt-4 max-w-lg text-sm text-white/40 leading-relaxed">
              Before generating, tell CodeSphere your exact stack, theme, architecture, and features.
              We'll build a detailed technical spec and generate production-quality code that actually fits your vision.
            </p>
          </div>

          {/* Two-column layout */}
          <div className="grid lg:grid-cols-2 gap-6 items-start">

            {/* LEFT — interactive spec form mockup */}
            <div className="rounded-2xl border border-white/8 bg-[#0f0f0f] overflow-hidden shadow-2xl shadow-black/50">

              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/6 bg-[#0a0a0a] px-5 py-3.5">
                <div>
                  <p className="text-sm font-semibold text-white/80">Start a <span className="text-[#0096fe]">New Project</span></p>
                  <p className="text-[10px] text-white/30 mt-0.5">Configure your technical stack before generating</p>
                </div>
                <div className="flex h-6 w-6 items-center justify-center rounded-md" style={{ background: "rgba(0,150,254,0.15)" }}>
                  <Zap className="h-3 w-3 text-[#0096fe]" />
                </div>
              </div>

              <div className="p-5 space-y-4">

                {/* Prompt textarea */}
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-white/40 mb-1.5 block">Describe your app</label>
                  <div className="rounded-xl border border-blue-500/30 bg-[#111] p-3" style={{ boxShadow: "0 0 0 2px rgba(0,150,254,0.08)" }}>
                    <p className="text-xs text-white/70 leading-relaxed">A SaaS dashboard for tracking team productivity — with user auth, project cards, activity feed, and charts showing weekly output…</p>
                    <div className="mt-2 flex items-center gap-1">
                      <div className="h-1 w-1 rounded-full bg-[#0096fe] animate-pulse" />
                      <span className="text-[10px] text-[#0096fe]/60">AI reading your spec…</span>
                    </div>
                  </div>
                </div>

                {/* Stack grid */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Frontend", value: "Next.js (App Router)", color: "text-white" },
                    { label: "Backend",  value: "Express.js / Node",    color: "text-white" },
                    { label: "Styling",  value: "Tailwind + Shadcn",    color: "text-white" },
                    { label: "Theme",    value: "Midnight Glassmorphism",color: "text-white" },
                    { label: "Architecture", value: "Multi-page Dashboard", color: "text-white" },
                    { label: "Data",     value: "Mock Data",             color: "text-white" },
                  ].map((field) => (
                    <div key={field.label} className="rounded-xl border border-white/8 bg-[#111] px-3 py-2.5">
                      <p className="text-[9px] uppercase tracking-wider text-white/30 mb-1">{field.label}</p>
                      <p className="text-[11px] font-medium text-white/70">{field.value}</p>
                    </div>
                  ))}
                </div>

                {/* Feature toggles */}
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-white/40 mb-2 block">Core Features</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: "User Auth",       on: true  },
                      { name: "Database",         on: true  },
                      { name: "Charts",           on: true  },
                      { name: "Stripe Billing",   on: false },
                      { name: "Realtime Chat",    on: false },
                    ].map((f) => (
                      <span key={f.name}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium transition-all",
                          f.on
                            ? "border-[#0096fe]/30 bg-[#0096fe]/12 text-[#0096fe] shadow-[0_0_10px_rgba(0,150,254,0.15)]"
                            : "border-white/8 bg-white/4 text-white/35"
                        )}>
                        <span className={`h-1.5 w-1.5 rounded-full ${f.on ? "bg-[#0096fe]" : "bg-white/20"}`} />
                        {f.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Generate button */}
                <button
                  className="w-full inline-flex h-10 items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white cursor-pointer transition-all active:scale-[0.99]"
                  style={{ background: C.grad, boxShadow: C.glow }}
                >
                  <Zap className="h-4 w-4 fill-white" />
                  Generate Workspace
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* RIGHT — generated spec preview + benefits */}
            <div className="space-y-4">

              {/* Generated spec card */}
              <div className="rounded-2xl border border-white/8 bg-[#0a0a0a]/90 p-5 overflow-hidden">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-xs font-semibold text-white/60">AI-generated technical spec</p>
                </div>
                <div className="rounded-xl border border-white/6 bg-[#111] p-4 font-mono text-[11px] leading-relaxed space-y-1">
                  <p><span className="text-[#0096fe]">###</span> <span className="text-white/70">Product Specifications</span></p>
                  <p className="text-white/40">- <span className="text-emerald-400">Frontend:</span> Next.js App Router + React 19</p>
                  <p className="text-white/40">- <span className="text-emerald-400">Backend:</span> Express.js REST API + JWT auth</p>
                  <p className="text-white/40">- <span className="text-emerald-400">Styling:</span> Tailwind CSS + Shadcn/ui</p>
                  <p className="text-white/40">- <span className="text-emerald-400">Theme:</span> Midnight Glassmorphism</p>
                  <p className="text-white/40">- <span className="text-emerald-400">Arch:</span> Multi-page Dashboard Shell</p>
                  <p className="text-white/40">- <span className="text-violet-400">Features:</span> Auth, DB, Charts</p>
                  <p className="text-white/30 mt-2 italic"># Injected into Gemini system prompt →</p>
                </div>
              </div>

              {/* Benefit bullets */}
              <div className="space-y-3">
                {[
                  {
                    icon: "🎯",
                    title: "Precise code, first try",
                    desc: "Your stack choices are injected directly into the AI prompt — no guessing, no generic output.",
                  },
                  {
                    icon: "🏗",
                    title: "Right architecture from the start",
                    desc: "SPA, multi-page dashboard, or wizard flow — the AI scaffolds the correct structure automatically.",
                  },
                  {
                    icon: "⚡",
                    title: "Features baked in, not bolted on",
                    desc: "Toggle auth, DB, charts, billing, or chat — they're wired into the generated components from the start.",
                  },
                  {
                    icon: "🎨",
                    title: "On-brand visual style",
                    desc: "Pick your theme vibe and the AI applies it consistently across every component it generates.",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3 rounded-xl border border-white/6 bg-[#0a0a0a]/70 p-4">
                    <span className="text-lg shrink-0 mt-0.5">{item.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-white/80 mb-1">{item.title}</p>
                      <p className="text-xs leading-relaxed text-white/40">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Link href={isSignedIn ? "/projects" : "/sign-up"}>
                <button
                  className="w-full inline-flex h-10 items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white cursor-pointer transition-all active:scale-[0.99] border border-white/10 bg-white/4 hover:bg-white/8 hover:border-white/15"
                >
                  {isSignedIn ? "Go to my projects" : "Sign up free — start building"}
                  <ChevronRight className="h-4 w-4 text-white/50" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          PRICING
      ══════════════════════════════════════════════════════════════════ */}
      <section id="pricing" className="px-4 pb-32 z-10 relative">
        <div className="mx-auto mb-14 max-w-5xl text-center">
          <SectionLabel>Pricing plans</SectionLabel>
          <SectionHeading gray="Flexible tiers" blue="built for your speed." />
          <p className="mx-auto mt-4 max-w-sm text-sm text-white/35">
            No credit card required. Upgrade or downgrade anytime.
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-3">
          {PRICING_PLANS.map((plan) => {
            const planOrder: Record<string, number> = { free: 0, starter: 1, pro: 2 };
            const activePlanKey = user ? user.plan : null;
            const isActive = isSignedIn && activePlanKey === plan.key;
            const isDowngrade = isSignedIn && activePlanKey !== null && !isActive && planOrder[plan.key] < planOrder[activePlanKey];
            return (
              <div key={plan.key} className={cn(
                "relative flex flex-col rounded-2xl border p-7 transition-colors",
                plan.featured ? "border-blue-500/25 bg-blue-500/4" : "border-white/8 bg-[#0f0f0f]/90"
              )}>
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full border border-blue-500/20 bg-[#0a0a0a] px-3 py-1 text-[11px] font-medium text-blue-400">Most popular</span>
                  </div>
                )}
                <div className="mb-1 flex items-center gap-2">
                  <p className="text-sm font-semibold text-white/90">{plan.label}</p>
                  {isActive && <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-400">Active</span>}
                </div>
                <p className="mb-6 text-xs leading-relaxed text-white/35">{plan.description}</p>
                <div className="mb-1 flex items-baseline gap-1">
                  <span className="font-serif text-4xl">
                    {plan.price === 0 ? <GrayTitle>$0</GrayTitle> : <BlueTitle>${plan.price}</BlueTitle>}
                  </span>
                  {plan.price > 0 && <span className="text-sm text-white/30">/mo</span>}
                </div>
                <p className="mb-6 text-xs text-white/25">{plan.price === 0 ? "Always free" : "Only billed monthly"}</p>
                <div className="mb-8 space-y-3 border-t border-white/6 pt-6">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-center gap-2.5">
                      <div className={cn("flex h-4 w-4 shrink-0 items-center justify-center rounded-full", plan.featured ? "bg-blue-500/15" : "bg-white/8")}>
                        <Check className={cn("h-2.5 w-2.5", plan.featured ? "text-blue-400" : "text-white/50")} />
                      </div>
                      <span className="text-xs text-white/55">{f}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-auto">
                  {isActive ? (
                    <Button disabled className="w-full rounded-full text-sm font-semibold opacity-50 cursor-not-allowed border border-white/10 bg-transparent text-white/60" variant="ghost">✓ Current plan</Button>
                  ) : plan.price === 0 ? (
                    isSignedIn ? (
                      <Button disabled className="w-full rounded-full text-sm font-semibold opacity-50 cursor-not-allowed border border-white/10 bg-transparent text-white/60" variant="ghost">Default plan</Button>
                    ) : (
                      <Link href="/sign-in" className="block w-full">
                        <Button className="w-full rounded-full text-sm font-semibold border border-white/10 bg-transparent text-white/60 hover:bg-white/6 hover:text-white/90 cursor-pointer" variant="ghost">
                          Get started free <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    )
                  ) : isSignedIn ? (
                    <PricingDialog>
                      <button className={cn("inline-flex h-9 items-center justify-center gap-1.5 w-full rounded-full text-xs font-semibold transition-all cursor-pointer active:scale-95", plan.featured ? "text-white" : "border border-white/10 bg-transparent text-white/60 hover:bg-white/6 hover:text-white/90")}
                        style={plan.featured ? { background: C.grad, boxShadow: C.glow } : undefined}>
                        {isDowngrade ? "Downgrade" : "Get started"} <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </PricingDialog>
                  ) : (
                    <Link href="/sign-in" className="block w-full">
                      <button className={cn("inline-flex h-9 items-center justify-center gap-1.5 w-full rounded-full text-xs font-semibold transition-all cursor-pointer active:scale-95", plan.featured ? "text-white" : "border border-white/10 bg-transparent text-white/60 hover:bg-white/6 hover:text-white/90")}
                        style={plan.featured ? { background: C.grad, boxShadow: C.glow } : undefined}>
                        Get started <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════════════════════════════ */}
      <section className="px-4 pb-32 z-10 relative">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <SectionLabel>Got questions?</SectionLabel>
            <SectionHeading gray="Frequently asked" blue="questions." />
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className={cn(
                "rounded-2xl border transition-colors overflow-hidden",
                openFaq === i ? "border-blue-500/20 bg-[#0f0f0f]" : "border-white/8 bg-[#0a0a0a]/90"
              )}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left cursor-pointer group"
                >
                  <span className={cn("text-sm font-semibold transition-colors", openFaq === i ? "text-white" : "text-white/70 group-hover:text-white")}>
                    {faq.q}
                  </span>
                  <span className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all",
                    openFaq === i
                      ? "border-blue-500/30 bg-blue-500/10 text-blue-400"
                      : "border-white/10 bg-white/4 text-white/40"
                  )}>
                    {openFaq === i ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 -mt-1">
                    <p className="text-sm leading-relaxed text-white/45">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════════════════════════════ */}
      <section className="relative mx-auto mb-24 max-w-5xl overflow-hidden rounded-2xl px-10 py-24 text-center z-10 mx-4 sm:mx-auto"
        style={{ border: `1px solid ${C.bdrM}`, background: "rgba(18, 22, 33, 0.75)", boxShadow: "0 0 100px rgba(0, 150, 254, 0.12)" }}>
        <HoleBackground
          strokeColor="rgba(255,255,255,0.05)" numberOfLines={36} numberOfDiscs={36} particleRGBColor={[147, 197, 253]}
          className="absolute inset-0 h-full w-full"
          style={{
            maskImage: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
          }}
        />
        <div className="relative z-10">
          <SectionHeading gray="Step into the future." blue="Start building for free." />
          <p className="mb-8 mt-4 text-sm leading-relaxed text-white/40">
            Get 10 free generations on sign up. No credit card required.<br />Upgrade when you&apos;re ready.
          </p>
          {isSignedIn ? (
            <Link href="/projects">
              <button className="inline-flex h-11 items-center gap-1.5 rounded-full px-8 text-sm font-semibold text-white cursor-pointer transition-all active:scale-95"
                style={{ background: C.grad, boxShadow: C.glow }}>
                Go to dashboard <ChevronRight className="h-4 w-4" />
              </button>
            </Link>
          ) : (
            <Link href="/sign-in">
              <button className="inline-flex h-11 items-center gap-1.5 rounded-full px-8 text-sm font-semibold text-white cursor-pointer transition-all active:scale-95"
                style={{ background: C.grad, boxShadow: C.glow }}>
                Get started free <ChevronRight className="h-4 w-4" />
              </button>
            </Link>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          RICH FOOTER
      ══════════════════════════════════════════════════════════════════ */}
      <footer className="relative z-10 border-t border-white/6 bg-[#080808]/60 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-6 pt-16 pb-10">

          {/* Top row — brand + links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-10 mb-16">
            {/* Brand col — takes 2 cols on lg */}
            <div className="col-span-2 sm:col-span-3 lg:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                  <Zap className="h-4 w-4 text-[#0096fe]" />
                </div>
                <span className="font-serif text-base font-bold text-white">
                  Code <span className="text-[#0096fe]">Sphere</span>
                </span>
              </div>
              <p className="text-xs leading-relaxed text-white/35 max-w-52 mb-6">
                AI-powered application builder. Describe, generate, and ship production-ready code in seconds.
              </p>
              {/* Social icons */}
              <div className="flex items-center gap-3">
                {[
                  { icon: GitBranch, href: "#", label: "GitHub" },
                  { icon: X, href: "#", label: "Twitter" },
                  { icon: MessageSquare, href: "#", label: "Discord" },
                  { icon: Mail, href: "#", label: "Email" },
                ].map(({ icon: Icon, href, label }) => (
                  <a key={label} href={href} aria-label={label}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/8 bg-white/4 text-white/35 hover:border-white/15 hover:bg-white/8 hover:text-white/70 transition-colors">
                    <Icon className="h-3.5 w-3.5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(FOOTER_LINKS).map(([group, links]) => (
              <div key={group}>
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-white/40 mb-4">{group}</p>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href}
                        className="text-xs text-white/40 hover:text-white/70 transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-white/6 mb-8" />

          {/* Bottom row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/25">© 2026 Code Sphere. All rights reserved.</p>



            <div className="flex gap-5 text-xs text-white/25">
              <a href="#" className="hover:text-white/55 transition-colors">Privacy</a>
              <a href="#" className="hover:text-white/55 transition-colors">Terms</a>
              <a href="#" className="hover:text-white/55 transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
