import React from "react";

export const CustomCarWashIcon: React.FC = () => {
  return (
    <div className="w-full h-full overflow-hidden rounded-[1.25rem]">
      <img
        src="/assets/car-wash-premium-v2.png"
        alt="Premium Car Wash"
        className="w-full h-full object-cover"
        style={{ filter: "drop-shadow(0 4px 4px rgba(0,0,0,0.1))" }}
      />
    </div>
  );
};
