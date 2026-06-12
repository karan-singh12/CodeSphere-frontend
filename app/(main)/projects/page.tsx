"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { Zap, Loader2, ArrowRight } from "lucide-react";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import Link from "next/link";
import { BlueTitle } from "@/components/shared/BrandTypography";
import { apiGet } from "@/lib/api";
import type { ProjectSummary } from "@/types/project";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const bgGradient = "radial-gradient(circle at 50% 0%, rgba(0, 150, 254, 0.12) 0%, transparent 60%), radial-gradient(ellipse 70% 60% at 50% 100%, rgba(0, 150, 254, 0.22) 0%, transparent 100%)";

function EmptyState({ onStartClick }: { onStartClick: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-white/8 bg-white/4">
        <Zap className="h-5 w-5 text-white/20" />
      </div>
      <p className="mb-1 text-sm font-medium text-white/40">No projects yet</p>
      <p className="mb-6 text-xs text-white/20">
        Start generating your custom application directly.
      </p>
      <button
        onClick={onStartClick}
        className="inline-flex h-8 items-center gap-1.5 rounded-full px-4 text-[13px] font-semibold text-white transition-all active:scale-95 cursor-pointer"
        style={{
          background: "linear-gradient(135deg, #0096fe, #0056b3)",
          boxShadow: "0 0 20px rgba(0, 150, 254, 0.25)",
        }}
      >
        Start building
      </button>
    </div>
  );
}

export default function ProjectsPage() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [frontend, setFrontend] = useState("auto");
  const [backend, setBackend] = useState("express");
  const [styling, setStyling] = useState("tailwind-shadcn");
  const [theme, setTheme] = useState("midnight");
  const [architecture, setArchitecture] = useState("spa");
  const [mocking, setMocking] = useState("mock-data");
  const [features, setFeatures] = useState({
    auth: false,
    db: false,
    charts: false,
    billing: false,
    chat: false,
  });

  const handleStartProject = () => {
    if (!prompt.trim()) return;

    // Construct enriched structural prompt
    let enrichedPrompt = prompt.trim();

    const specs = [];
    specs.push(`- **Frontend**: ${
      frontend === "react" ? "React (Vite)" :
      frontend === "nextjs" ? "Next.js (App Router)" :
      frontend === "vue" ? "Vue 3" :
      frontend === "nuxt" ? "Nuxt 3" :
      frontend === "angular" ? "Angular 17+" :
      frontend === "svelte" ? "Svelte 4" :
      frontend === "static" ? "Static HTML/JS" : "Auto-Detect"
    }`);
    specs.push(`- **Backend Services**: ${
      backend === "express" ? "Express.js / Node.js API" :
      backend === "fastapi" ? "Python FastAPI REST Server" :
      backend === "go" ? "Go Fiber API Server" :
      backend === "nestjs" ? "NestJS Enterprise Server" : "Serverless / None (Pure Frontend Client)"
    }`);
    specs.push(`- **Styling Solution**: ${
      styling === "tailwind-shadcn" ? "Tailwind CSS + Shadcn UI components" :
      styling === "tailwind-plain" ? "Tailwind CSS utility classes" :
      styling === "vanilla" ? "Custom CSS Modules / Vanilla CSS" : "Bootstrap"
    }`);
    specs.push(`- **Theme & Vibe**: ${
      theme === "midnight" ? "Midnight Glassmorphism (Vibrant blue highlights, dark transparent panes)" :
      theme === "cyberpunk" ? "Cyberpunk Neon (Futuristic dark aesthetic, neon purple/cyan accents)" :
      theme === "amber" ? "Amber Warmth (Soft dark mode, warm amber/yellow typography highlights)" :
      theme === "light" ? "Clean Modern Light Mode (High contrast, minimalist white grids)" : "Stark Minimalist (Stark monochromatic black/white look)"
    }`);
    specs.push(`- **App Architecture**: ${
      architecture === "spa" ? "Single Page Application (SPA)" :
      architecture === "dashboard" ? "Multi-page Dashboard Shell (Sidebar + Subpages)" : "Multi-step Flow / Wizard Form"
    }`);
    specs.push(`- **Data & State Management**: ${
      mocking === "mock-data" ? "Pre-populated Rich Mock Data (Realistic arrays/objects)" :
      mocking === "localstorage" ? "LocalStorage state persistence (changes persist on page reload)" : "Empty / Minimal placeholder state"
    }`);

    const selectedFeatures = [];
    if (features.auth) selectedFeatures.push("User Authentication & Sessions (sign-in/sign-up components, JWT protection)");
    if (features.db) selectedFeatures.push("Database & Persistent Storage (Mocked/Prisma integration ready, data persistence)");
    if (features.charts) selectedFeatures.push("Interactive Charts & Data Analytics (visual data charts using Recharts)");
    if (features.billing) selectedFeatures.push("Stripe Billing (pricing cards, checkout simulation, billing plans)");
    if (features.chat) selectedFeatures.push("Realtime Messaging & Live Chat Sidebar");

    if (selectedFeatures.length > 0) {
      specs.push(`- **Required Key Features**: \n  ${selectedFeatures.map(f => `  * ${f}`).join("\n")}`);
    }

    enrichedPrompt += `\n\n### Product Specifications & Technical Stack:\n${specs.join("\n")}`;

    // Pass frontend template to workspace query
    const workspaceTemplate = frontend === "auto" ? "react" : frontend;

    router.push(`/workspace?prompt=${encodeURIComponent(enrichedPrompt)}&template=${workspaceTemplate}`);
  };

  // Client-side authentication check
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/sign-in");
    }
  }, [user, authLoading, router]);

  // Client-side data fetching
  useEffect(() => {
    if (!token) return;

    const fetchProjects = async () => {
      try {
        const res = await apiGet("/api/workspaces", { token });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
            setProjects(data.data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [token]);

  if (authLoading || (!user && authLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "rgba(10, 15, 28, 0.95)" }}>
        <Loader2 className="h-8 w-8 animate-spin text-white/40" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <main className="min-h-screen px-4 py-10 selection:bg-white/20 relative overflow-hidden" style={{ background: bgGradient }}>
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

      <div className="mx-auto max-w-5xl relative z-10">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <BlueTitle className="text-6xl">Projects</BlueTitle>
            <p className="mt-3 text-sm text-white/30">
              All your AI-generated apps in one place.
            </p>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="inline-flex h-8 items-center gap-1.5 rounded-full px-4 text-xs font-semibold text-white cursor-pointer transition-all active:scale-95"
            style={{
              background: "linear-gradient(135deg, #0096fe, #0056b3)",
              boxShadow: "0 0 20px rgba(0, 150, 254, 0.25)",
            }}
          >
            <Zap className="h-3 w-3 fill-current text-white" />
            New project
          </button>
        </div>

        {/* Loading / Grid */}
        {loading ? (
          <div className="flex justify-center py-32">
            <Loader2 className="h-8 w-8 animate-spin text-white/20" />
          </div>
        ) : projects.length === 0 ? (
          <EmptyState onStartClick={() => setIsOpen(true)} />
        ) : (
          <ProjectGrid projects={projects} onDelete={(id) => setProjects(prev => prev.filter(p => p.id !== id))} />
        )}
      </div>

      {/* New Project Dialog Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="border-white/8 bg-[#0f0f0f] text-white sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl tracking-tight text-white/90">
              Start a <span className="text-[#0096fe]">New Project</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-white/45">
              Specify your project specifications below to easily auto-generate your premium codebase workspace.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/50">Describe your application</label>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="e.g. A Spotify stats dashboard with charts..."
                className="w-full min-h-[90px] max-h-[120px] resize-y rounded-xl border border-white/8 bg-[#161616] p-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50"
              />
            </div>

            {/* Tech Stack Grids */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/50">Frontend Framework</label>
                <select
                  value={frontend}
                  onChange={(e) => setFrontend(e.target.value)}
                  className="w-full h-10 rounded-xl border border-white/8 bg-[#161616] px-3 text-sm text-white focus:outline-none focus:border-blue-500/50 cursor-pointer"
                >
                  <option value="auto">Auto-Detect</option>
                  <option value="react">React (Vite)</option>
                  <option value="nextjs">Next.js (App Router)</option>
                  <option value="vue">Vue 3</option>
                  <option value="nuxt">Nuxt 3</option>
                  <option value="angular">Angular 17+</option>
                  <option value="svelte">Svelte 4</option>
                  <option value="static">Static HTML/JS</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/50">Backend Framework</label>
                <select
                  value={backend}
                  onChange={(e) => setBackend(e.target.value)}
                  className="w-full h-10 rounded-xl border border-white/8 bg-[#161616] px-3 text-sm text-white focus:outline-none focus:border-blue-500/50 cursor-pointer"
                >
                  <option value="express">Express.js / Node</option>
                  <option value="fastapi">Python FastAPI</option>
                  <option value="go">Go Fiber</option>
                  <option value="nestjs">NestJS</option>
                  <option value="none">Pure Client / None</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/50">UI & Styling</label>
                <select
                  value={styling}
                  onChange={(e) => setStyling(e.target.value)}
                  className="w-full h-10 rounded-xl border border-white/8 bg-[#161616] px-3 text-sm text-white focus:outline-none focus:border-blue-500/50 cursor-pointer"
                >
                  <option value="tailwind-shadcn">Tailwind + Shadcn</option>
                  <option value="tailwind-plain">Plain Tailwind</option>
                  <option value="vanilla">Custom/Vanilla CSS</option>
                  <option value="bootstrap">Bootstrap</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/50">Design Theme & Vibe</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full h-10 rounded-xl border border-white/8 bg-[#161616] px-3 text-sm text-white focus:outline-none focus:border-blue-500/50 cursor-pointer"
                >
                  <option value="midnight">Midnight Glassmorphism</option>
                  <option value="cyberpunk">Cyberpunk Neon</option>
                  <option value="amber">Amber Warmth</option>
                  <option value="light">Clean Modern Light Mode</option>
                  <option value="minimal-dark">Stark Monochromatic</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/50">App Architecture</label>
                <select
                  value={architecture}
                  onChange={(e) => setArchitecture(e.target.value)}
                  className="w-full h-10 rounded-xl border border-white/8 bg-[#161616] px-3 text-sm text-white focus:outline-none focus:border-blue-500/50 cursor-pointer"
                >
                  <option value="spa">Single Page App</option>
                  <option value="dashboard">Multi-page Dashboard</option>
                  <option value="wizard">Multi-step Wizard Flow</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/50">State & Mocking</label>
                <select
                  value={mocking}
                  onChange={(e) => setMocking(e.target.value)}
                  className="w-full h-10 rounded-xl border border-white/8 bg-[#161616] px-3 text-sm text-white focus:outline-none focus:border-blue-500/50 cursor-pointer"
                >
                  <option value="mock-data">Pre-populated Mock Data</option>
                  <option value="localstorage">LocalStorage Persistence</option>
                  <option value="empty">Empty / Minimal State</option>
                </select>
              </div>
            </div>

            {/* Checkbox badge toggles for product features */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white/50">Core Product Features</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "auth", name: "User Auth" },
                  { id: "db", name: "Database Storage" },
                  { id: "charts", name: "Charts & Analytics" },
                  { id: "billing", name: "Stripe Billing" },
                  { id: "chat", name: "Realtime Chat" },
                ].map((feature) => {
                  const isActive = features[feature.id as keyof typeof features];
                  return (
                    <button
                      key={feature.id}
                      onClick={() =>
                        setFeatures((prev) => ({
                          ...prev,
                          [feature.id]: !isActive,
                        }))
                      }
                      className={cn(
                        "px-3.5 py-2 rounded-full text-xs font-medium border cursor-pointer transition-all duration-200 active:scale-95",
                        isActive
                          ? "border-[#0096fe] bg-[#0096fe]/15 text-white shadow-[0_0_12px_rgba(0,150,254,0.25)]"
                          : "border-white/8 bg-white/4 text-white/55 hover:border-white/15 hover:bg-white/6 hover:text-white/80"
                      )}
                    >
                      {feature.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-white/6">
            <button
              onClick={() => setIsOpen(false)}
              className="inline-flex h-9 items-center justify-center rounded-full px-5 text-xs font-medium border border-white/10 bg-transparent text-white/60 hover:bg-white/6 hover:text-white/90 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleStartProject}
              disabled={!prompt.trim()}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full px-6 text-xs font-semibold text-white cursor-pointer transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #0096fe, #0056b3)",
                boxShadow: "0 0 20px rgba(0, 150, 254, 0.25)",
              }}
            >
              Generate Workspace
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
