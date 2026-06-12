"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const WorkspaceContent = dynamic(() => import("./WorkspaceContentComponent"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-white/40" />
    </div>
  ),
});

export default function WorkspacePage() {
  return <WorkspaceContent />;
}
