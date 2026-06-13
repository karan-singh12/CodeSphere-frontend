"use client";

import Link from "next/link";
import { Zap, GitBranch, X, MessageSquare, Mail } from "lucide-react";

const FOOTER_LINKS = {
  Product: [
    { label: "Projects", href: "/projects" },
    { label: "Workspace", href: "/workspace" },
    { label: "Monitoring", href: "/monitoring" },
    { label: "Pricing", href: "/pricing" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "#" },
  ],
};

export function AppFooter() {
  return (
    <footer className="relative z-10 border-t border-white/6 bg-[#080808]/60 backdrop-blur-sm w-full font-sans mt-24">
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
                { icon: Mail, href: "mailto:support@codesphere.app", label: "Email" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/8 bg-white/4 text-white/35 hover:border-white/15 hover:bg-white/8 hover:text-white/70 transition-colors"
                >
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
                    <Link href={link.href} className="text-xs text-white/40 hover:text-white/70 transition-colors">
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
            <Link href="/privacy" className="hover:text-white/55 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white/55 transition-colors">
              Terms
            </Link>
            <a href="#" className="hover:text-white/55 transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
