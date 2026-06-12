import React from "react";

export const GrayTitle = ({ children }: { children: React.ReactNode }) => (
  <span className="text-white/90">{children}</span>
);

export const BlueTitle = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span
    className={`font-serif ${className}`}
    style={{
      background: "linear-gradient(135deg, #e0f2fe, #0096fe, #38bdf8)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      filter: "drop-shadow(0 0 20px rgba(0, 150, 254, 0.38))",
      display: "inline-block",
    }}
  >
    {children}
  </span>
);

export const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p
    className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.14em] uppercase mb-4"
    style={{ color: "#0096fe" }}
  >
    <span className="w-4 h-px" style={{ background: "linear-gradient(90deg, transparent, #0096fe)" }} />
    {children}
    <span className="w-4 h-px" style={{ background: "linear-gradient(90deg, #0096fe, transparent)" }} />
  </p>
);

export const SectionHeading = ({ gray, blue }: { gray: string; blue: string }) => (
  <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] leading-[1.1] tracking-tight">
    <GrayTitle>{gray}</GrayTitle>
    <br />
    <BlueTitle>{blue}</BlueTitle>
  </h2>
);
