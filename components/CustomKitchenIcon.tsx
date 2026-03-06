import React from "react";

export const CustomKitchenIcon: React.FC = () => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full block"
    >
      <defs>
        <linearGradient
          id="gradChimney"
          x1="20"
          y1="4"
          x2="44"
          y2="18"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#7BE0E0" />
          <stop offset="1" stopColor="#009a9a" />
        </linearGradient>
        <linearGradient
          id="gradCounter"
          x1="8"
          y1="48"
          x2="56"
          y2="52"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FDFDFD" />
          <stop offset="1" stopColor="#E2E8F0" />
        </linearGradient>
        <linearGradient
          id="gradPot"
          x1="20"
          y1="28"
          x2="44"
          y2="42"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#7BE0E0" />
          <stop offset="1" stopColor="#009a9a" />
        </linearGradient>
      </defs>

      {/* Symmetrical Table Top / Counter (Base) */}
      <path
        d="M4 48 H60 V56 H4 Z"
        fill="url(#gradCounter)"
        stroke="#009a9a"
        strokeWidth="0.5"
        opacity="0.8"
      />
      <path d="M8 48 H56 V50 H8 Z" fill="#009a9a" opacity="0.1" />

      {/* Symmetrical Chimney / Range Hood (Top) */}
      <path d="M18 4 H46 L42 18 H22 L18 4 Z" fill="url(#gradChimney)" />
      <path d="M22 18 H42 V20 H22 V18 Z" fill="#009a9a" opacity="0.5" />

      {/* Symmetrical Cooking Pot on the Stove */}
      <rect x="22" y="34" width="20" height="14" rx="3" fill="url(#gradPot)" />
      <path d="M22 34 H42 L40 32 H24 L22 34 Z" fill="#F4511E" />

      {/* Symmetrical Knobs on Counter edge */}
      <circle cx="20" cy="52" r="2" fill="#009a9a" opacity="0.4" />
      <circle cx="44" cy="52" r="2" fill="#009a9a" opacity="0.4" />
      <circle cx="32" cy="52" r="2" fill="#009a9a" opacity="0.6" />

      {/* Animated Steam (Handled via CSS classes in the parent) */}
      <g className="animate-steam-1">
        <path
          d="M28 26 Q30 22 32 26 T36 26"
          stroke="#FFFFFF"
          strokeOpacity="0.8"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      </g>
      <g className="animate-steam-2">
        <path
          d="M24 22 Q26 18 28 22 T32 22"
          stroke="#FFFFFF"
          strokeOpacity="0.5"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      </g>
      <g className="animate-steam-3">
        <path
          d="M32 22 Q34 18 36 22 T40 22"
          stroke="#FFFFFF"
          strokeOpacity="0.5"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* Subtle Reflection on Pot */}
      <rect
        x="25"
        y="38"
        width="14"
        height="1.5"
        rx="0.75"
        fill="#FFFFFF"
        opacity="0.2"
      />
    </svg>
  );
};
