import React from "react";

export const CustomSofaIcon: React.FC = () => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full block"
    >
      <defs>
        <linearGradient
          id="gradSofa"
          x1="8"
          y1="24"
          x2="56"
          y2="52"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFAB91" />
          <stop offset="1" stopColor="#FF7043" />
        </linearGradient>
        <linearGradient
          id="gradCushion"
          x1="16"
          y1="36"
          x2="48"
          y2="44"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFFFFF" stopOpacity="0.3" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Symmetrical Sofa Backrest */}
      <path d="M10 28 C10 24 54 24 54 28 V48 H10 V28 Z" fill="url(#gradSofa)" />

      {/* Symmetrical Armrests */}
      <rect x="6" y="36" width="8" height="16" rx="4" fill="#F4511E" />
      <rect x="50" y="36" width="8" height="16" rx="4" fill="#F4511E" />

      {/* Symmetrical Seat / Main Cushion */}
      <rect x="12" y="40" width="40" height="12" rx="4" fill="url(#gradSofa)" />
      <path d="M12 40 H52 V44 H12 V40 Z" fill="url(#gradCushion)" />

      {/* Symmetrical Cushion Division Line */}
      <path d="M32 40 V52" stroke="#F4511E" strokeWidth="1.5" opacity="0.3" />

      {/* Symmetrical Legs */}
      <path
        d="M14 52 L12 58"
        stroke="#FF7043"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M50 52 L52 58"
        stroke="#FF7043"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Animated Sparkles for "Cleanliness" effect */}
      <g className="animate-sparkle-1">
        <path d="M18 20 L20 18 L22 20 L20 22 Z" fill="#FFD54F" />
        <path d="M20 16 V24 M16 20 H24" stroke="#FFD54F" strokeWidth="0.5" />
      </g>
      <g className="animate-sparkle-2">
        <path d="M44 26 L46 24 L48 26 L46 28 Z" fill="#FFFFFF" />
        <path
          d="M46 22 V30 M42 26 H50"
          stroke="#FFFFFF"
          strokeWidth="0.5"
          opacity="0.8"
        />
      </g>
      <g className="animate-sparkle-3">
        <path d="M32 32 L34 30 L36 32 L34 34 Z" fill="#26A69A" />
        <path
          d="M34 28 V36 M30 32 H38"
          stroke="#26A69A"
          strokeWidth="0.5"
          opacity="0.6"
        />
      </g>

      {/* Subtle Fabric Detail */}
      <circle cx="20" cy="46" r="0.5" fill="#FFFFFF" opacity="0.5" />
      <circle cx="44" cy="46" r="0.5" fill="#FFFFFF" opacity="0.5" />
      <circle cx="32" cy="46" r="0.5" fill="#FFFFFF" opacity="0.5" />
    </svg>
  );
};
