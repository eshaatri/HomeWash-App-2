import React from "react";

export const CustomWaterTankIcon: React.FC = () => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full block"
    >
      <defs>
        <linearGradient
          id="gradTank"
          x1="12"
          y1="16"
          x2="52"
          y2="52"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#7BE0E0" />
          <stop offset="1" stopColor="#009a9a" />
        </linearGradient>
        <linearGradient
          id="gradWave"
          x1="16"
          y1="36"
          x2="48"
          y2="48"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0288D1" />
          <stop offset="1" stopColor="#03A9F4" />
        </linearGradient>
      </defs>

      {/* Symmetrical Tank Main Body (Cylinder) */}
      <path
        d="M16 16 C16 12 48 12 48 16 V52 C48 56 16 56 16 52 V16 Z"
        fill="url(#gradTank)"
      />

      {/* Symmetrical Tank Lid */}
      <rect x="24" y="10" width="16" height="4" rx="2" fill="#009a9a" />

      {/* Tank Ribs (Details) */}
      <path
        d="M16 26 H48"
        stroke="#FFFFFF"
        strokeOpacity="0.2"
        strokeWidth="2"
      />
      <path
        d="M16 38 H48"
        stroke="#FFFFFF"
        strokeOpacity="0.2"
        strokeWidth="2"
      />

      {/* Symmetrical Rippling Water Highlight (Blue Contrast) */}
      <g className="animate-ripple">
        <ellipse
          cx="32"
          cy="46"
          rx="16"
          ry="4"
          fill="url(#gradWave)"
          opacity="0.6"
        />
      </g>
      <g className="animate-ripple-2">
        <ellipse cx="32" cy="48" rx="12" ry="3" fill="#FFFFFF" opacity="0.2" />
      </g>

      {/* Symmetrical Outlet Pipe representation at bottom */}
      <rect x="30" y="54" width="4" height="4" fill="#009a9a" />
    </svg>
  );
};
