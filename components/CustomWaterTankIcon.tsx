import React from "react";

export const CustomWaterTankIcon: React.FC = () => {
  return (
    <div className="w-full h-full overflow-hidden rounded-[1.25rem]">
      <img
        src="/assets/water-tank-cleaning-premium.png"
        alt="Premium Water Tank Cleaning"
        className="w-full h-full object-cover"
        style={{ filter: "drop-shadow(0 4px 4px rgba(0,0,0,0.1))" }}
      />
    </div>
  );
};
