"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Trash2, MessageSquare, Clock } from "lucide-react";
import type { ProjectSummary } from "@/types/project";
import { DeleteProjectDialog } from "./DeleteProjectDialog";

interface ProjectGridProps {
  projects: ProjectSummary[];
  onDelete: (id: string) => void;
}

export function ProjectGrid({ projects, onDelete }: ProjectGridProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map(project => {
        const title = project.title ?? "Untitled project";
        const timeAgo = formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true });
        const msgCount = Math.floor(project.messageCount / 2);

        return (
          <div key={project.id}
            className="group relative flex flex-col rounded-xl p-4 transition-all"
            style={{ border: "1px solid oklch(1 0 0 / 7%)", background: "oklch(0.13 0.024 232)" }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.border = "1px solid oklch(0.72 0.18 220 / 22%)";
              el.style.background = "oklch(0.15 0.026 232)";
              el.style.boxShadow = "0 0 20px oklch(0.72 0.18 220 / 8%)";
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.border = "1px solid oklch(1 0 0 / 7%)";
              el.style.background = "oklch(0.13 0.024 232)";
              el.style.boxShadow = "none";
            }}>
            <Link href={`/workspace?id=${project.id}`} className="absolute inset-0 rounded-xl"
              aria-label={`Open ${title}`} />

            <div className="mb-2 flex items-start justify-between gap-2">
              <p className="line-clamp-1 text-sm font-medium leading-snug text-white/80">{title}</p>
              <DeleteProjectDialog project={project} onDelete={onDelete}>
                <button type="button" className="relative z-10 text-white/20 hover:text-red-400 cursor-pointer transition-colors focus:outline-none bg-transparent p-0 border-0 outline-none">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </DeleteProjectDialog>
            </div>

            {project.firstPrompt && (
              <p className="mb-3 line-clamp-2 text-[12px] leading-relaxed text-white/30">{project.firstPrompt}</p>
            )}

            <div className="mt-auto flex items-center gap-3 pt-2"
              style={{ borderTop: "1px solid oklch(1 0 0 / 4%)" }}>
              <span className="flex items-center gap-1 text-[11px]"
                style={{ color: "oklch(0.72 0.18 220 / 55%)" }}>
                <MessageSquare className="h-3 w-3" />
                {msgCount} message{msgCount !== 1 ? "s" : ""}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-white/20" suppressHydrationWarning>
                <Clock className="h-3 w-3" />{timeAgo}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
