import React from "react";

export const CustomCarWashIcon: React.FC = () => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full block"
    >
      <defs>
        <linearGradient
          id="gradCar"
          x1="12"
          y1="20"
          x2="52"
          y2="52"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#7BE0E0" />
          <stop offset="1" stopColor="#009a9a" />
        </linearGradient>
        <linearGradient
          id="gradGlass"
          x1="20"
          y1="28"
          x2="44"
          y2="36"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#03A9F4" stopOpacity="0.4" />
          <stop offset="1" stopColor="#03A9F4" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Symmetrical Car Structure (Sleek Front View) */}
      {/* Main Body Lower */}
      <path
        d="M10 42 C10 38 14 34 20 34 H44 C50 34 54 38 54 42 V50 C54 52 10 52 10 50 V42 Z"
        fill="url(#gradCar)"
      />

      {/* Cabin / Roofline */}
      <path
        d="M18 34 C18 24 46 24 46 34"
        stroke="url(#gradCar)"
        strokeWidth="2"
        fill="none"
      />
      <path d="M20 34 C20 26 44 26 44 34 H20 Z" fill="url(#gradCar)" />

      {/* Windshield */}
      <path
        d="M22 27 C22 27 32 24 42 27 L44 34 H20 L22 27 Z"
        fill="url(#gradGlass)"
      />

      {/* Symmetrical Headlights (Modern Dual-Bar) */}
      <rect
        x="12"
        y="38"
        width="10"
        height="3"
        rx="1.5"
        fill="#FFFFFF"
        fillOpacity="0.9"
      />
      <rect
        x="42"
        y="38"
        width="10"
        height="3"
        rx="1.5"
        fill="#FFFFFF"
        fillOpacity="0.9"
      />
      <rect
        x="13"
        y="42"
        width="6"
        height="1"
        rx="0.5"
        fill="#FFFFFF"
        fillOpacity="0.5"
      />
      <rect
        x="45"
        y="42"
        width="6"
        height="1"
        rx="0.5"
        fill="#FFFFFF"
        fillOpacity="0.5"
      />

      {/* Symmetrical Side Mirrors */}
      <path d="M10 36 L6 34 V38 L10 39" fill="#F4511E" />
      <path d="M54 36 L58 34 V38 L54 39" fill="#F4511E" />

      {/* Lower Grille / Intake */}
      <rect
        x="22"
        y="44"
        width="20"
        height="4"
        rx="2"
        fill="#F4511E"
        opacity="0.4"
      />

      {/* Sliding "Clean Shimmer" Lines Animation */}
      <g className="animate-shimmer-1">
        <rect
          x="10"
          y="24"
          width="24"
          height="2"
          rx="1"
          fill="#FFFFFF"
          fillOpacity="0.5"
        />
      </g>
      <g className="animate-shimmer-2">
        <rect
          x="0"
          y="38"
          width="20"
          height="2"
          rx="1"
          fill="#FFFFFF"
          fillOpacity="0.4"
        />
      </g>
      <g className="animate-shimmer-3">
        <rect
          x="35"
          y="48"
          width="18"
          height="2"
          rx="1"
          fill="#FFFFFF"
          fillOpacity="0.5"
        />
      </g>

      {/* Under-car Shadow */}
      <ellipse
        cx="32"
        cy="54"
        rx="22"
        ry="2"
        fill="#000000"
        fillOpacity="0.05"
      />
    </svg>
  );
};
