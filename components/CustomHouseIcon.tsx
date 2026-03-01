import React from "react";

export const CustomHouseIcon: React.FC = () => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full block"
    >
      <defs>
        <linearGradient
          id="gradRoof"
          x1="8"
          y1="12"
          x2="56"
          y2="34"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFAB91" />
          <stop offset="1" stopColor="#FF7043" />
        </linearGradient>
        <linearGradient
          id="gradBody"
          x1="16"
          y1="32"
          x2="48"
          y2="54"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF8A65" />
          <stop offset="1" stopColor="#F4511E" />
        </linearGradient>
      </defs>

      {/* Main House Body (Flat Base) */}
      <path d="M16 32 H48 V54 H16 Z" fill="url(#gradBody)" />

      {/* Centered Door Cutout */}
      <path d="M28 42 H36 V54 H28 Z" fill="#FFFFFF" opacity="0.3" />

      {/* Symmetrical Windows */}
      <rect x="20" y="36" width="6" height="6" fill="#FFFFFF" opacity="0.4" />
      <rect x="38" y="36" width="6" height="6" fill="#FFFFFF" opacity="0.4" />

      {/* Classic Pitched Roof with Overhang */}
      <path d="M8 32 L32 8 L56 32 Z" fill="url(#gradRoof)" />

      {/* Subtle Roof Detail (Right Shade) */}
      <path d="M32 8 L56 32 H32 Z" fill="#000000" opacity="0.08" />
    </svg>
  );
};
