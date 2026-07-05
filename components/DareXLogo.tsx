import React from "react";

export default function DareXLogo({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} transition-transform duration-300 hover:scale-105`}
    >
      {/* Outer Hexagon with glow styling */}
      <polygon
        points="16,3 29,10 29,22 16,29 3,22 3,10"
        stroke="#7ef29c"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="rgba(126, 242, 156, 0.04)"
        style={{ filter: "drop-shadow(0 0 4px rgba(126, 242, 156, 0.3))" }}
      />
      
      {/* Inner Circuit Pathways */}
      <path
        d="M16 3V12M29 22L20 18M3 22L12 18"
        stroke="#7ef29c"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      
      {/* Glowing AI Central Core Node */}
      <circle cx="16" cy="16" r="3.5" fill="#7ef29c" />
      <circle cx="16" cy="16" r="6" stroke="#7ef29c" strokeWidth="1" strokeDasharray="3 3" className="animate-spin" style={{ transformOrigin: "16px 16px", animationDuration: "10s" }} />
    </svg>
  );
}
