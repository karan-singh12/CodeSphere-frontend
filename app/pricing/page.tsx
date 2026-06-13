"use client";

import { useState } from "react";
import { Check, Mail, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { PRICING_PLANS } from "@/lib/constants";
import { BlueTitle, GrayTitle, SectionHeading, SectionLabel } from "@/components/shared/BrandTypography";
import { toast } from "sonner";
import { AppFooter } from "@/components/layout/AppFooter";

const bgGradient = "radial-gradient(circle at 50% 0%, rgba(0, 150, 254, 0.12) 0%, transparent 60%), radial-gradient(ellipse 70% 60% at 50% 100%, rgba(0, 150, 254, 0.22) 0%, transparent 100%)";

export default function PricingComingSoonPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setTimeout(() => {
      toast.success("Thank you! We'll notify you when subscription plans go live.");
      setEmail("");
      setLoading(false);
    }, 800);
  };

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

      <div className="mx-auto max-w-5xl relative z-10 text-center mb-16">
        <SectionLabel>
          <Sparkles className="h-3 w-3 text-blue-400 fill-blue-400" />
          Subscription Integration
        </SectionLabel>
        <SectionHeading gray="Pricing Plans" blue="Coming Soon" />
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/40">
          We are currently integrating Stripe payment gateways to offer seamless Starter and Pro plans. 
          In the meantime, enjoy your free allocation of credits to build your apps!
        </p>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mt-16 text-left">
          {PRICING_PLANS.map((plan) => {
            const isFree = plan.key === "free";
            return (
              <div
                key={plan.key}
                className={cn(
                  "relative flex flex-col rounded-2xl border p-6 transition-all duration-300 bg-[#0a0a0a]/60 backdrop-blur-md",
                  plan.featured
                    ? "border-blue-500/30 shadow-[0_0_30px_rgba(0,150,254,0.1)]"
                    : "border-white/8"
                )}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full border border-blue-500/20 bg-[#0a0a0a] px-3 py-1 text-[10px] font-medium text-blue-400">
                      Most popular
                    </span>
                  </div>
                )}

                <div className="mb-2">
                  <p className="text-sm font-semibold text-white/80">{plan.label}</p>
                </div>

                <p className="mb-6 text-xs text-white/40 leading-relaxed min-h-[32px]">
                  {plan.description}
                </p>

                <div className="mb-6 flex items-baseline gap-1">
                  <span className="font-serif text-4xl font-bold">
                    {isFree ? <GrayTitle>$0</GrayTitle> : <BlueTitle>${plan.price}</BlueTitle>}
                  </span>
                  {!isFree && <span className="text-xs text-white/30">/mo</span>}
                </div>

                {/* Features */}
                <div className="mb-8 space-y-3 border-t border-white/6 pt-6 flex-1">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-start gap-2.5">
                      <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-500/10 mt-0.5">
                        <Check className="h-2.5 w-2.5 text-blue-400" />
                      </div>
                      <span className="text-xs text-white/60 leading-normal">{f}</span>
                    </div>
                  ))}
                </div>

                {/* Disabled CTA buttons */}
                <div>
                  {isFree ? (
                    <button
                      disabled
                      className="w-full h-10 rounded-full text-xs font-semibold border border-white/8 bg-white/4 text-white/30 cursor-not-allowed"
                    >
                      Active Free Tier
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full h-10 rounded-full text-xs font-semibold border border-white/8 bg-white/4 text-white/30 cursor-not-allowed"
                    >
                      Coming Soon
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Subscription / Waiting List Form */}
        <div className="mx-auto max-w-md mt-20 p-8 rounded-2xl border border-white/8 bg-[#0d0d0d]/80 backdrop-blur-md">
          <div className="flex justify-center mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/5">
              <Mail className="h-5 w-5 text-blue-400" />
            </div>
          </div>
          <h3 className="text-base font-semibold text-white">Get Notified</h3>
          <p className="text-xs text-white/40 mt-1.5 leading-relaxed">
            Subscribe to be the first to know when payment plans go live and receive an exclusive launch discount.
          </p>

          <form onSubmit={handleSubscribe} className="mt-6 flex items-center gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 h-9 rounded-full border border-white/8 bg-white/4 px-4 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50"
            />
            <button
              type="submit"
              disabled={loading}
              className="h-9 inline-flex items-center justify-center gap-1.5 rounded-full px-5 text-xs font-semibold text-white cursor-pointer hover:opacity-90 transition-all active:scale-95 disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, #0096fe, #0056b3)",
                boxShadow: "0 0 20px rgba(0, 150, 254, 0.25)",
              }}
            >
              {loading && <Loader2 className="h-3 w-3 animate-spin" />}
              Notify Me
            </button>
          </form>
        </div>
      </div>

      <AppFooter />
    </div>
  );
}
