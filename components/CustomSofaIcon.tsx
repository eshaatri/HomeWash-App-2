import React from "react";

export const CustomSofaIcon: React.FC = () => {
  return (
    <div className="w-full h-full overflow-hidden rounded-[1.25rem]">
      <img
        src="/assets/sofa-cleaning-premium.jpg"
        alt="Premium Sofa Cleaning"
        className="w-full h-full object-cover"
        style={{ filter: "drop-shadow(0 4px 4px rgba(0,0,0,0.1))" }}
      />
    </div>
  );
};
