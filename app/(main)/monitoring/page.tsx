"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { apiGet } from "@/lib/api";
import {
  Zap,
  Activity,
  Clock,
  Loader2,
  Cpu,
  Database,
  RefreshCw,
  ChevronDown,
  FolderOpen,
} from "lucide-react";

interface SummaryData {
  totalRequests: number;
  totalTokens: number;
  averageLatency: number;
  errorRate: number;
  workspaceId: string | null;
}

interface DailyRequest {
  day: string;
  count: number;
}

interface ProviderUsage {
  provider: string;
  totalTokens: number;
  requests: number;
}

interface LatencyTrend {
  day: string;
  avg_latency: number;
}

interface WorkspaceOption {
  id: string;
  title: string | null;
  createdAt: string;
}

function MonitoringPageContent() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [dailyRequests, setDailyRequests] = useState<DailyRequest[]>([]);
  const [providerUsage, setProviderUsage] = useState<ProviderUsage[]>([]);
  const [latencyTrends, setLatencyTrends] = useState<LatencyTrend[]>([]);
  const [workspaces, setWorkspaces] = useState<WorkspaceOption[]>([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Initialise from query param on mount
  useEffect(() => {
    const qw = searchParams.get("workspaceId");
    if (qw) setSelectedWorkspaceId(qw);
  }, [searchParams]);

  const fetchData = useCallback(
    async (workspaceId?: string) => {
      if (!token) return;
      try {
        const qs = workspaceId ? `?workspaceId=${workspaceId}` : "";
        const [sumRes, dailyRes, providerRes, latencyRes] = await Promise.all([
          apiGet(`/api/dashboard/summary${qs}`, { token }),
          apiGet(`/api/dashboard/daily-requests${qs}`, { token }),
          apiGet(`/api/dashboard/provider-usage${qs}`, { token }),
          apiGet(`/api/dashboard/latency-trends${qs}`, { token }),
        ]);

        if (sumRes.ok) setSummary((await sumRes.json()).data);
        if (dailyRes.ok) setDailyRequests((await dailyRes.json()).data || []);
        if (providerRes.ok) setProviderUsage((await providerRes.json()).data || []);
        if (latencyRes.ok) setLatencyTrends((await latencyRes.json()).data || []);
      } catch (err) {
        console.error("Failed to load monitoring data:", err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [token]
  );

  const fetchWorkspaces = useCallback(async () => {
    if (!token) return;
    try {
      const res = await apiGet("/api/dashboard/workspaces", { token });
      if (res.ok) {
        const data = await res.json();
        setWorkspaces(data.data || []);
      }
    } catch {}
  }, [token]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/sign-in");
      return;
    }
    if (token) {
      fetchWorkspaces();
      fetchData(selectedWorkspaceId || undefined);
    }
  }, [user, authLoading, token]);

  const handleWorkspaceChange = (id: string) => {
    setSelectedWorkspaceId(id);
    setDropdownOpen(false);
    setLoading(true);
    fetchData(id || undefined);
    // Update URL param
    const url = id ? `/monitoring?workspaceId=${id}` : "/monitoring";
    window.history.replaceState(null, "", url);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData(selectedWorkspaceId || undefined);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
          <p className="text-xs text-white/40">Loading diagnostic metrics...</p>
        </div>
      </div>
    );
  }

  const maxRequests = Math.max(...dailyRequests.map((r) => r.count), 5);
  const maxLatency = Math.max(...latencyTrends.map((t) => t.avg_latency), 500);
  const healthScore = summary ? Math.round((1 - summary.errorRate) * 100) : 100;
  const healthColor =
    healthScore > 85
      ? "text-emerald-400"
      : healthScore > 60
      ? "text-amber-400"
      : "text-rose-400";

  const selectedWorkspace = workspaces.find((w) => w.id === selectedWorkspaceId);
  const scopeLabel = selectedWorkspace
    ? selectedWorkspace.title || `Project ${selectedWorkspace.id.slice(0, 6)}`
    : "All Projects";

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#0a0a0a] text-white px-4 py-8 select-none">
      <div className="mx-auto max-w-7xl">

        {/* Page Title & Actions */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-white/90">
              System <span className="text-[#0096fe]">Diagnostics</span>
            </h1>
            <p className="text-xs text-white/30 mt-1">
              Realtime monitoring of AI inference latency, token counts, and request reliability.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Project filter dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="inline-flex h-9 items-center gap-2 rounded-full border border-white/10 bg-white/4 px-4 text-xs font-medium hover:bg-white/8 transition-colors cursor-pointer"
              >
                <FolderOpen className="h-3.5 w-3.5 text-blue-400" />
                <span className="text-white/70 max-w-[140px] truncate">{scopeLabel}</span>
                <ChevronDown className={`h-3.5 w-3.5 text-white/30 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {dropdownOpen && (
                <div
                  className="absolute right-0 top-full mt-1.5 z-50 min-w-[220px] rounded-xl border border-white/10 bg-[#141414] shadow-xl overflow-hidden"
                >
                  {/* All projects option */}
                  <button
                    onClick={() => handleWorkspaceChange("")}
                    className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-left hover:bg-white/6 transition-colors ${
                      !selectedWorkspaceId ? "text-blue-400" : "text-white/70"
                    }`}
                  >
                    <Activity className="h-3.5 w-3.5 shrink-0" />
                    All Projects
                  </button>
                  <div className="h-px bg-white/6 mx-3" />
                  {workspaces.length === 0 ? (
                    <p className="px-4 py-3 text-xs text-white/25">No projects yet</p>
                  ) : (
                    workspaces.map((ws) => (
                      <button
                        key={ws.id}
                        onClick={() => handleWorkspaceChange(ws.id)}
                        className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-left hover:bg-white/6 transition-colors truncate ${
                          selectedWorkspaceId === ws.id ? "text-blue-400" : "text-white/70"
                        }`}
                      >
                        <FolderOpen className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">
                          {ws.title || `Project ${ws.id.slice(0, 6)}…`}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/10 bg-white/4 px-4 text-xs font-semibold hover:bg-white/8 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Scope indicator pill */}
        {selectedWorkspaceId && (
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/8 px-3 py-1.5 text-xs text-blue-400">
            <FolderOpen className="h-3 w-3" />
            Filtered: <span className="font-medium">{scopeLabel}</span>
            <button
              onClick={() => handleWorkspaceChange("")}
              className="ml-1 text-white/30 hover:text-white/60 transition-colors"
            >
              ✕
            </button>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="rounded-xl border border-white/8 bg-[#111] p-5">
            <div className="flex items-center justify-between mb-3 text-white/40">
              <span className="text-xs font-medium uppercase tracking-wider">Total Requests</span>
              <Activity className="h-4 w-4 text-blue-400" />
            </div>
            <p className="text-3xl font-bold">{summary?.totalRequests ?? 0}</p>
            <p className="text-[10px] text-white/25 mt-1">
              {selectedWorkspaceId ? "For this project" : "Across all projects"}
            </p>
          </div>

          <div className="rounded-xl border border-white/8 bg-[#111] p-5">
            <div className="flex items-center justify-between mb-3 text-white/40">
              <span className="text-xs font-medium uppercase tracking-wider">Total Tokens</span>
              <Cpu className="h-4 w-4 text-violet-400" />
            </div>
            <p className="text-3xl font-bold">
              {summary?.totalTokens
                ? (summary.totalTokens / 1000).toFixed(1)
                : "0.0"}k
            </p>
            <p className="text-[10px] text-white/25 mt-1">
              {selectedWorkspaceId ? "For this project" : "Across all projects"}
            </p>
          </div>

          <div className="rounded-xl border border-white/8 bg-[#111] p-5">
            <div className="flex items-center justify-between mb-3 text-white/40">
              <span className="text-xs font-medium uppercase tracking-wider">Avg Latency</span>
              <Clock className="h-4 w-4 text-amber-400" />
            </div>
            <p className="text-3xl font-bold">
              {summary?.averageLatency
                ? (summary.averageLatency / 1000).toFixed(2)
                : "0.00"}s
            </p>
            <p className="text-[10px] text-white/25 mt-1">Avg response completion time</p>
          </div>

          <div className="rounded-xl border border-white/8 bg-[#111] p-5">
            <div className="flex items-center justify-between mb-3 text-white/40">
              <span className="text-xs font-medium uppercase tracking-wider">System Health</span>
              <Database className="h-4 w-4 text-emerald-400" />
            </div>
            <p className={`text-3xl font-bold ${healthColor}`}>{healthScore}%</p>
            <p className="text-[10px] text-white/25 mt-1">
              Error rate: {((summary?.errorRate ?? 0) * 100).toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Request Volume */}
          <div className="lg:col-span-2 rounded-xl border border-white/8 bg-[#111] p-5 flex flex-col">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-white/90">Request Volume Trends</h3>
              <p className="text-[10px] text-white/30">
                Daily prompt count — {selectedWorkspaceId ? scopeLabel : "all projects"} — last 30 days
              </p>
            </div>
            <div className="flex-1 min-h-[200px] relative mt-2 flex items-end justify-between border-b border-l border-white/10 pb-2 pl-2">
              {dailyRequests.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center text-xs text-white/20">
                  No request data collected yet.
                </div>
              ) : (
                dailyRequests.map((r, idx) => {
                  const percent = (r.count / maxRequests) * 100;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center group px-0.5 relative">
                      <div className="absolute bottom-[105%] bg-black/90 border border-white/10 px-2 py-1 rounded text-[10px] text-white hidden group-hover:block z-10 pointer-events-none whitespace-nowrap">
                        <p className="font-semibold">{r.count} requests</p>
                        <p className="text-[8px] text-white/45">{r.day}</p>
                      </div>
                      <div
                        className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t group-hover:from-blue-500 group-hover:to-cyan-400 transition-colors"
                        style={{ height: `${Math.max(percent, 4)}%`, minHeight: "4px" }}
                      />
                    </div>
                  );
                })
              )}
            </div>
            <div className="flex justify-between text-[9px] text-white/20 mt-1.5 px-1">
              <span>{dailyRequests[dailyRequests.length - 1]?.day || ""}</span>
              <span>Daily Request Inferences</span>
              <span>{dailyRequests[0]?.day || ""}</span>
            </div>
          </div>

          {/* Provider Usage */}
          <div className="rounded-xl border border-white/8 bg-[#111] p-5 flex flex-col">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-white/90">Inference Providers</h3>
              <p className="text-[10px] text-white/30">Requests and token share by LLM provider</p>
            </div>
            <div className="flex-1 space-y-4">
              {providerUsage.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-white/20">
                  No provider logs found.
                </div>
              ) : (
                providerUsage.map((p, idx) => {
                  const sharePercent = summary?.totalRequests
                    ? (p.requests / summary.totalRequests) * 100
                    : 0;
                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-white/80 capitalize">{p.provider}</span>
                        <span className="text-white/40">
                          {p.requests} calls ({sharePercent.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                          style={{ width: `${sharePercent}%` }}
                        />
                      </div>
                      <p className="text-[9px] text-white/20">
                        {(p.totalTokens / 1000).toFixed(1)}k tokens
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Latency Trends */}
          <div className="lg:col-span-3 rounded-xl border border-white/8 bg-[#111] p-5 flex flex-col">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-white/90">Latency Trends</h3>
              <p className="text-[10px] text-white/30">
                Average time to complete generation stream (ms) — {selectedWorkspaceId ? scopeLabel : "all projects"}
              </p>
            </div>
            <div className="flex-1 min-h-[160px] relative border-b border-l border-white/10 pb-2 pl-2">
              {latencyTrends.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center text-xs text-white/20">
                  No latency records available.
                </div>
              ) : (
                <div className="h-full w-full flex items-end">
                  <svg className="h-full w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#d97706" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d={`M 0 100 ${latencyTrends
                        .map((t, idx) => {
                          const x = (idx / (latencyTrends.length - 1)) * 100;
                          const y = 100 - (t.avg_latency / maxLatency) * 80;
                          return `L ${x} ${y}`;
                        })
                        .join(" ")} L 100 100 Z`}
                      fill="url(#areaGrad)"
                    />
                    <path
                      d={latencyTrends
                        .map((t, idx) => {
                          const x = (idx / (latencyTrends.length - 1)) * 100;
                          const y = 100 - (t.avg_latency / maxLatency) * 80;
                          return `${idx === 0 ? "M" : "L"} ${x} ${y}`;
                        })
                        .join(" ")}
                      fill="none"
                      stroke="#d97706"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex justify-between text-[9px] text-white/20 mt-1.5 px-1">
              <span>{latencyTrends[latencyTrends.length - 1]?.day || ""}</span>
              <span>Avg Latency (max: {maxLatency}ms)</span>
              <span>{latencyTrends[0]?.day || ""}</span>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}

export default function MonitoringPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#0a0a0a]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            <p className="text-xs text-white/40">Loading diagnostic metrics...</p>
          </div>
        </div>
      }
    >
      <MonitoringPageContent />
    </Suspense>
  );
}
