import React from 'react';
import { AppScreen, NavigationProps } from '../types';

export const BottomNav: React.FC<NavigationProps> = ({ currentScreen, navigateTo, isPremium }) => {
  const navItems = [
    { icon: 'home', label: 'Home', screen: AppScreen.HOME },
    { icon: 'calendar_month', label: 'Bookings', screen: AppScreen.BOOKING },
    { icon: isPremium ? 'star' : 'upgrade', label: isPremium ? 'Gold' : 'Upgrade', screen: AppScreen.MEMBERSHIP, isGold: true },
    { icon: 'support_agent', label: 'Support', screen: AppScreen.SUPPORT },
  ];

  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full border-t border-gray-200 dark:border-white/5 bg-white/90 dark:bg-onyx/90 pb-safe backdrop-blur-xl max-w-md mx-auto right-0 transition-colors duration-300">
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = currentScreen === item.screen;
          const colorClass = isActive 
            ? 'text-onyx dark:text-white' 
            : item.isGold 
              ? 'text-primary' 
              : 'text-gray-400 dark:text-white/40 hover:text-onyx dark:hover:text-white';
          
          const iconFill = isActive || item.isGold ? 1 : 0;

          return (
            <button
              key={item.label}
              onClick={() => navigateTo(item.screen)}
              className={`flex flex-1 flex-col items-center justify-center gap-1 transition-colors ${colorClass}`}
            >
              <span 
                className="material-symbols-outlined text-[24px]" 
                style={{ fontVariationSettings: `'FILL' ${iconFill}` }}
              >
                {item.icon}
              </span>
              <span className={`text-[10px] ${isActive ? 'font-medium' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
      {/* iOS Home Indicator Spacing */}
      <div className="h-4 w-full"></div>
    </nav>
  );
};
