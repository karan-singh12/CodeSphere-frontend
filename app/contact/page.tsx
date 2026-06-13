"use client";

import { useState } from "react";
import { Mail, MessageSquare, GitBranch, X, MapPin, Send, Loader2 } from "lucide-react";
import { BlueTitle, SectionHeading, SectionLabel } from "@/components/shared/BrandTypography";
import { toast } from "sonner";
import { AppFooter } from "@/components/layout/AppFooter";

const bgGradient = "radial-gradient(circle at 50% 0%, rgba(0, 150, 254, 0.12) 0%, transparent 60%), radial-gradient(ellipse 70% 60% at 50% 100%, rgba(0, 150, 254, 0.22) 0%, transparent 100%)";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      toast.success("Thank you for reaching out! Your message has been sent successfully.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setLoading(false);
    }, 1000);
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

      <div className="mx-auto max-w-5xl relative z-10">
        <div className="text-center mb-16">
          <SectionLabel>
            <Mail className="h-3 w-3 text-blue-400" />
            Support Center
          </SectionLabel>
          <SectionHeading gray="Get in" blue="Touch" />
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/40">
            Have a question, encountered a bug, or want to discuss enterprise licensing? 
            Our team is here to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mt-12 mb-20 items-stretch">
          {/* Contact Details Sidebar */}
          <div className="md:col-span-2 flex flex-col justify-between rounded-2xl border border-white/8 bg-[#0a0a0a]/60 backdrop-blur-md p-8">
            <div>
              <h3 className="font-serif text-xl font-bold text-white/90">Contact Details</h3>
              <p className="text-xs text-white/35 mt-1">Feel free to contact us via form or email.</p>
              
              <div className="mt-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/8 bg-white/4">
                    <Mail className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/25">Email Support</p>
                    <a href="mailto:support@codesphere.app" className="text-xs text-white/70 hover:text-blue-400 transition-colors">
                      support@codesphere.app
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/8 bg-white/4">
                    <MapPin className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/25">HQ Location</p>
                    <p className="text-xs text-white/70">Bangalore, Karnataka, India</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-white/6 pt-8">
              <p className="text-[10px] uppercase tracking-wider text-white/25 mb-4">Join our community</p>
              <div className="flex items-center gap-3">
                {[
                  { icon: GitBranch, href: "#", label: "GitHub" },
                  { icon: X, href: "#", label: "Twitter" },
                  { icon: MessageSquare, href: "#", label: "Discord" },
                ].map(({ icon: Icon, href, label }) => (
                  <a key={label} href={href} aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/8 bg-white/4 text-white/35 hover:border-white/15 hover:bg-white/8 hover:text-white/70 transition-colors">
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-3 rounded-2xl border border-white/8 bg-[#0a0a0a]/60 backdrop-blur-md p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-white/50">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full h-10 rounded-xl border border-white/8 bg-[#161616] px-4 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-white/50">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email"
                    className="w-full h-10 rounded-xl border border-white/8 bg-[#161616] px-4 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-white/50">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="What is this request about?"
                  className="w-full h-10 rounded-xl border border-white/8 bg-[#161616] px-4 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-white/50">Message *</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Write your support details here..."
                  className="w-full resize-none rounded-xl border border-white/8 bg-[#161616] p-4 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50"
                />
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="h-10 inline-flex items-center justify-center gap-2 rounded-full px-6 text-xs font-semibold text-white cursor-pointer hover:opacity-90 transition-all active:scale-95 disabled:opacity-50"
                  style={{
                    background: "linear-gradient(135deg, #0096fe, #0056b3)",
                    boxShadow: "0 0 20px rgba(0, 150, 254, 0.25)",
                  }}
                >
                  {loading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Send className="h-3.5 w-3.5" />
                  )}
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <AppFooter />
    </div>
  );
}
