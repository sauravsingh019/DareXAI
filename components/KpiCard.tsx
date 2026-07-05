import React from "react";

export default function KpiCard({
  label,
  value,
  accent = "signal",
  icon,
}: {
  label: string;
  value: string;
  accent?: "signal" | "amber";
  icon?: React.ReactNode;
}) {
  return (
    <div className="glass-panel rounded-lg px-5 py-5 flex justify-between items-center transition-all duration-300 transform hover:-translate-y-0.5">
      <div>
        <div className="text-[11px] uppercase tracking-widest text-mute font-semibold">{label}</div>
        <div
          className={`font-mono text-2xl font-bold mt-2 tracking-tight ${
            accent === "signal" ? "text-signal glow-text-signal" : "text-amber glow-text-amber"
          }`}
        >
          {value}
        </div>
      </div>
      {icon && (
        <div className="p-2.5 border border-line bg-canvas/40 rounded-lg shrink-0">
          {icon}
        </div>
      )}
    </div>
  );
}
