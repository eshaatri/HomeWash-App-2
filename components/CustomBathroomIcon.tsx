import React from "react";

export const CustomBathroomIcon: React.FC = () => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full block"
    >
      <defs>
        <linearGradient
          id="gradTub"
          x1="8"
          y1="36"
          x2="56"
          y2="56"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFAB91" />
          <stop offset="1" stopColor="#FF7043" />
        </linearGradient>
        <linearGradient
          id="gradWater"
          x1="12"
          y1="36"
          x2="52"
          y2="44"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#80DEEA" />
          <stop offset="1" stopColor="#4DD0E1" />
        </linearGradient>
      </defs>

      {/* The Bathtub Rim (Symmetrical) */}
      <path
        d="M8 36 C8 32 12 32 14 32 H50 C52 32 56 32 56 36 V48 C56 52 52 56 48 56 H16 C12 56 8 52 8 48 V36 Z"
        fill="url(#gradTub)"
      />

      {/* The Water Surface */}
      <path d="M14 38 H50 V42 H14 Z" fill="url(#gradWater)" opacity="0.6" />

      {/* Symmetrical Faucet Head */}
      <path d="M24 12 H40 V16 H24 Z" fill="#FF7043" />

      {/* Animated Droplets (Handled via CSS classes in the parent) */}
      <g className="animate-droplet-1">
        <circle cx="32" cy="18" r="1.5" fill="#4DD0E1" />
      </g>
      <g className="animate-droplet-2">
        <circle cx="28" cy="22" r="1.5" fill="#4DD0E1" />
      </g>
      <g className="animate-droplet-3">
        <circle cx="36" cy="22" r="1.5" fill="#4DD0E1" />
      </g>

      {/* Subtle Shine */}
      <rect
        x="14"
        y="48"
        width="12"
        height="2"
        rx="1"
        fill="#FFFFFF"
        opacity="0.3"
      />
      <rect
        x="38"
        y="48"
        width="12"
        height="2"
        rx="1"
        fill="#FFFFFF"
        opacity="0.3"
      />
    </svg>
  );
};
