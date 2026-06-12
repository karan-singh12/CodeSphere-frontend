"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const sky = "#0096fe";

export function AppHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full p-2 pb-0 transition-all duration-300 font-sans">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6 backdrop-blur-md transition-all duration-200 ease-in rounded-[18px] border border-white/8 bg-[#0a0a0a]/40">
        <Link href="/" className="flex items-center gap-2.5 select-none transition-all duration-300 hover:opacity-90">
          <Image src="/logo.png" alt="Code Sphere Logo" width={28} height={28} className="h-7 w-7 rounded-lg object-cover" />
          <span className="font-serif text-md font-bold tracking-tight text-white">
            Code <span className="text-[#0096fe]">Sphere</span>
          </span>
        </Link>

        {user && (
          <div className="hidden sm:flex items-center gap-6">
            <Link href="/projects" className="text-[13px] font-semibold uppercase tracking-[0.05em] text-white/45 transition-colors hover:text-white/90">
              Projects
            </Link>
            <Link href="/monitoring" className="text-[13px] font-semibold uppercase tracking-[0.05em] text-white/45 transition-colors hover:text-white/90">
              Monitoring
            </Link>
          </div>
        )}

        <div className="flex items-center gap-4">
          {user ? (
            <>

              <DropdownMenu>
                <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold cursor-pointer border border-blue-500/20 bg-blue-500/5 text-[#0096fe] hover:bg-blue-500/12 focus:outline-none">
                  {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="h-4 w-4" />}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 text-white/90"
                  style={{ background: "oklch(0.13 0.024 232)", border: "1px solid oklch(0.72 0.18 220 / 15%)" }}>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name || "User"}</p>
                      <p className="text-xs leading-none text-white/40">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator style={{ background: "oklch(1 0 0 / 6%)" }} />
                  <DropdownMenuItem className="focus:text-white cursor-pointer">
                    <Link href="/projects" className="w-full flex items-center">My Projects</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator style={{ background: "oklch(1 0 0 / 6%)" }} />
                  <DropdownMenuItem onClick={logout}
                    className="focus:text-red-400 text-red-400/90 cursor-pointer flex items-center gap-2">
                    <LogOut className="h-4 w-4" />Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/sign-in" className="group relative overflow-hidden h-9 font-medium rounded-[14px] transition-all duration-350 opacity-100 text-[13px] px-4 bg-transparent border border-white/10 text-white/50 hover:text-black justify-center items-center gap-2 flex shrink-0 select-none">
                <span className="relative z-20 flex justify-center items-center gap-2 font-semibold">SIGN IN</span>
                <span className="!w-full !max-w-full duration-[350ms] absolute inset-0 z-10 translate-y-[50%] scale-0 rounded-full transition-transform group-hover:scale-x-[150%] group-hover:scale-y-[220%] bg-white flex justify-center items-center gap-2 shrink-0"></span>
              </Link>
              <Link href="/sign-up" className="group relative overflow-hidden h-9 font-medium rounded-[14px] transition-all duration-350 opacity-100 text-[13px] px-4 bg-white text-black hover:text-white hover:bg-transparent hover:[transition:background-color_0ms_300ms] justify-center items-center gap-2 flex select-none">
                <span className="relative z-20 flex justify-center items-center gap-1.5 font-semibold">
                  GET STARTED <ArrowRight className="h-3 w-3 opacity-70 transition-transform group-hover:translate-x-0.5" />
                </span>
                <span className="!w-full !max-w-full duration-[350ms] absolute inset-0 z-10 translate-y-[50%] scale-0 rounded-full transition-transform group-hover:scale-x-[150%] group-hover:scale-y-[220%] bg-[#0096fe] text-white flex justify-center items-center gap-2 flex"></span>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
