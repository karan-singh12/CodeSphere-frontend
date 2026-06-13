"use client";

import { Shield, Lock } from "lucide-react";
import { SectionHeading, SectionLabel } from "@/components/shared/BrandTypography";
import { AppFooter } from "@/components/layout/AppFooter";

const bgGradient = "radial-gradient(circle at 50% 0%, rgba(0, 150, 254, 0.12) 0%, transparent 60%), radial-gradient(ellipse 70% 60% at 50% 100%, rgba(0, 150, 254, 0.22) 0%, transparent 100%)";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen px-4 pt-32 pb-16 relative overflow-hidden" style={{ background: bgGradient }}>
      {/* Ambient backgrounds */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="animate-float-orb absolute -top-40 left-[30%] h-[600px] w-[600px] rounded-full blur-3xl"
          style={{ background: "rgba(0, 150, 254, 0.10)" }} />
        <div className="animate-float-orb-delayed absolute top-1/3 -right-32 h-96 w-96 rounded-full blur-3xl"
          style={{ background: "rgba(0, 150, 254, 0.08)" }} />
        <div className="dot-pattern absolute inset-0 opacity-[0.35]" />
      </div>

      <div className="mx-auto max-w-3xl relative z-10">
        <div className="text-center mb-16">
          <SectionLabel>
            <Lock className="h-3 w-3 text-blue-400" />
            Security & Trust
          </SectionLabel>
          <SectionHeading gray="Privacy" blue="Policy" />
          <p className="text-xs text-white/30 mt-2">Last Updated: June 13, 2026</p>
        </div>

        <div className="rounded-2xl border border-white/8 bg-[#0a0a0a]/60 backdrop-blur-md p-8 md:p-12 text-white/70 space-y-8 text-sm leading-relaxed">
          <section className="space-y-3">
            <h3 className="font-serif text-lg font-bold text-white/90 flex items-center gap-2.5">
              <span className="text-blue-400 text-xs">01 /</span> Information We Collect
            </h3>
            <p>
              We collect information that you directly provide to us, including your name, email address, password hashes, and profile images. We also collect the text/image prompts you write to generate applications and track dynamic usage logs (including model type, token usage, latency).
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-lg font-bold text-white/90 flex items-center gap-2.5">
              <span className="text-blue-400 text-xs">02 /</span> How We Use Your Information
            </h3>
            <p>
              The gathered data is processed to deliver the app generation services, handle account security, customize coding workspaces, track project metrics on your Monitoring tab, and offer prompt fixes.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-lg font-bold text-white/90 flex items-center gap-2.5">
              <span className="text-blue-400 text-xs">03 /</span> Data Storage & Safety
            </h3>
            <p>
              Your personal profile details, workspaces, and logs are safely stored using encrypted databases. Cryptographic mechanisms protect authorization tokens and user passwords against unauthorized access or disclosure.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-lg font-bold text-white/90 flex items-center gap-2.5">
              <span className="text-blue-400 text-xs">04 /</span> Third-Party Service Providers
            </h3>
            <p>
              Code Sphere shares prompt input text and reference images with AI inference services (including Google Gemini API, OpenAI API) to create your sandboxes. No personal credentials or emails are transmitted to external AI providers.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-lg font-bold text-white/90 flex items-center gap-2.5">
              <span className="text-blue-400 text-xs">05 /</span> Cookies & State
            </h3>
            <p>
              We utilize browser cookies to keep you signed in securely across different tabs and sessions. You can choose to disable cookies in your browser settings, but please note that some dashboard features may cease to function correctly.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-lg font-bold text-white/90 flex items-center gap-2.5">
              <span className="text-blue-400 text-xs">06 /</span> Your Privacy Rights
            </h3>
            <p>
              You have the right to request deletion of your account, download a copy of all generated workspace code databases, or update your profile data. To invoke these rights, please contact our support team at support@codesphere.app.
            </p>
          </section>
        </div>
      </div>

      <AppFooter />
    </div>
  );
}
