import React from "react";
import { PartnerScreen, NavigationProps } from "../types";

export const BottomNav: React.FC<NavigationProps> = ({
  currentScreen,
  navigateTo,
  activeJob,
}) => {
  const tabs = [
    { screen: PartnerScreen.DASHBOARD, icon: "dashboard", label: "Home" },
    { screen: PartnerScreen.JOBS, icon: "work", label: "Jobs" },
    { screen: PartnerScreen.WALLET, icon: "payments", label: "Wallet" },
    { screen: PartnerScreen.PROFILE, icon: "person", label: "Profile" },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white dark:bg-[#1a1a1a] border-t border-gray-100 dark:border-white/5 p-2 flex justify-around z-50">
      {tabs.map((tab) => {
        const isActive = currentScreen === tab.screen;
        const hasActiveJob = tab.screen === PartnerScreen.JOBS && activeJob;

        return (
          <button
            key={tab.screen}
            onClick={() => navigateTo(tab.screen)}
            className={`flex flex-col items-center p-2 relative transition-colors ${
              isActive
                ? "text-primary"
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              {tab.icon}
            </span>
            <span className="text-[10px] font-bold mt-1">{tab.label}</span>
            {hasActiveJob && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            )}
          </button>
        );
      })}
    </div>
  );
};
