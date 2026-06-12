"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { apiGet } from "@/lib/api";
import { Loader2 } from "lucide-react";
import type { WorkspaceData } from "@/types/workspace";

export default function WorkspaceContentComponent() {
  const { user, token, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const prompt = searchParams.get("prompt");
  const id = searchParams.get("id");
  const template = searchParams.get("template") || "react";

  const [workspace, setWorkspace] = useState<WorkspaceData | null>(null);
  const [loadingWorkspace, setLoadingWorkspace] = useState(false);

  // Client-side authentication check
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/sign-in");
    }
  }, [user, authLoading, router]);

  // Load workspace details if an ID is present
  useEffect(() => {
    if (!token || !id) {
      setWorkspace(null);
      return;
    }

    const fetchWorkspace = async () => {
      setLoadingWorkspace(true);
      try {
        const res = await apiGet(`/api/workspaces/${id}`, { token });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
            setWorkspace(data.data);
          }
        }
      } catch (err) {
        console.error("Failed to load workspace:", err);
      } finally {
        setLoadingWorkspace(false);
      }
    };

    fetchWorkspace();
  }, [id, token]);

  if (authLoading || (!user && authLoading) || loadingWorkspace) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white/40" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div>
      <WorkspaceShell
        initialPrompt={prompt}
        workspace={workspace}
        userCredits={user.credits}
        userId={user.id}
        userPlan={user.plan}
        initialTemplate={template}
      />
    </div>
  );
}
