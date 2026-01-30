import React from 'react';
import { AppScreen, NavigationProps } from '../types';

export const DesktopSidebar: React.FC<NavigationProps> = ({ currentScreen, navigateTo, isPremium, user, logout }) => {
  const navItems = [
    { icon: 'home', label: 'Home', screen: AppScreen.HOME },
    { icon: 'calendar_month', label: 'Bookings', screen: AppScreen.BOOKING },
    { icon: 'shopping_bag', label: 'Cart', screen: AppScreen.CART },
    { icon: isPremium ? 'star' : 'upgrade', label: isPremium ? 'Gold Membership' : 'Upgrade to Gold', screen: AppScreen.MEMBERSHIP, isGold: true },
    { icon: 'support_agent', label: 'Support', screen: AppScreen.SUPPORT },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 fixed left-0 top-0 bottom-0 bg-white dark:bg-[#121212] border-r border-gray-200 dark:border-white/5 z-50">
        {/* Logo Area */}
        <div className="p-6">
            <h1 className="text-2xl font-black tracking-tighter text-black dark:text-white cursor-pointer" onClick={() => navigateTo(AppScreen.HOME)}>
                HOME<span className="text-primary">WASH</span>
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mt-1">
                Luxury Services
            </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2 py-4">
            {navItems.map((item) => {
                const isActive = currentScreen === item.screen;
                return (
                    <button
                        key={item.label}
                        onClick={() => navigateTo(item.screen)}
                        className={`flex items-center gap-4 w-full p-3 rounded-xl transition-all ${
                            isActive 
                            ? 'bg-primary text-black font-bold shadow-lg shadow-primary/20' 
                            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-black dark:hover:text-white'
                        }`}
                    >
                         <span className={`material-symbols-outlined ${isActive ? 'fill-1' : ''}`} style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                            {item.icon}
                        </span>
                        <span className="text-sm">{item.label}</span>
                    </button>
                )
            })}
        </nav>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-white/5">
            <div className="flex items-center gap-3 p-2 rounded-xl bg-gray-50 dark:bg-white/5">
                 <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center text-gray-500 font-bold">
                    {user?.name.charAt(0)}
                 </div>
                 <div className="flex-1 min-w-0">
                     <p className="text-sm font-bold truncate text-black dark:text-white">{user?.name}</p>
                     <p className="text-xs text-gray-500 truncate">{user?.phone}</p>
                 </div>
                 <button onClick={logout} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-[20px]">logout</span>
                 </button>
            </div>
        </div>
    </aside>
  );
};