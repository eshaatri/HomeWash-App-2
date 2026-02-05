
import React from 'react';
import { AppScreen, NavigationProps } from '../types';
import { BottomNav } from '../components/BottomNav';

export const ProfileScreen: React.FC<NavigationProps> = (props) => {
  const { navigateTo, user, logout, isDarkMode, toggleDarkMode, isPremium, togglePremium } = props;

  return (
    <div className="bg-alabaster dark:bg-[#0f0f0f] min-h-screen flex flex-col font-display antialiased transition-colors duration-300 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white/95 dark:bg-[#0f0f0f]/95 backdrop-blur-md border-b border-gray-200 dark:border-white/5">
        <button
          onClick={() => navigateTo(AppScreen.HOME)}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
        >
          <span className="material-symbols-outlined text-onyx dark:text-white">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold text-onyx dark:text-white">My Profile</h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 px-6 py-6 space-y-6">
        {/* Profile Info */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-white dark:border-[#1a1a1a] shadow-lg">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFK0Fz8B0V8pQ3JrplcKD15JYgq3Cl8REYDUeN_qpGXmcLMshGFME5GoGxZROWR1SSaovL3PHRMzm-vOitRuzsbp9zWBAWyQzgY_ZnKzT9U-VqculLggQXOWyl2_hU8dadTv8DtwcEEpUU3PMtc0YJKYgXDxdLyoUM72UJRwT3e5bwlltq17PCqYwpToIJLdFQNjCJpMmPLY_DmQ4l488SzICvGQSFIwleL36Ge0lXezGBHQ3SHeUOpqT9B_5TppuEFDAsfH6rJ-0"
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </div>
            {isPremium && (
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-[#ffd633] to-[#e6c229] text-black text-[10px] font-black uppercase px-2 py-1 rounded-full border-2 border-white dark:border-[#0f0f0f]">
                    Gold
                </div>
            )}
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-black text-onyx dark:text-white">{user?.name || 'Guest User'}</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium">{user?.phone || '+91 00000 00000'}</p>
          </div>
        </div>

        {/* Wallet Card */}
        <div className="bg-gradient-to-br from-onyx to-[#2a2a2a] dark:from-[#1a1a1a] dark:to-[#000] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Wallet Balance</p>
                <h3 className="text-3xl font-black tracking-tight mb-4">₹{user?.walletBalance.toFixed(2)}</h3>
                <button className="bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-bold uppercase tracking-wide px-4 py-2 rounded-lg transition-colors">
                    + Add Money
                </button>
            </div>
            <span className="material-symbols-outlined absolute -bottom-8 -right-8 text-[120px] opacity-[0.05] rotate-[-15deg]">account_balance_wallet</span>
        </div>

        {/* Menu Items */}
        <div className="space-y-3">
             {/* Account Settings */}
             <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-100 dark:border-white/5 overflow-hidden">
                 <button onClick={() => navigateTo(AppScreen.BOOKING)} className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-100 dark:border-white/5">
                     <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center">
                         <span className="material-symbols-outlined">calendar_month</span>
                     </div>
                     <div className="text-left flex-1">
                         <h4 className="font-bold text-onyx dark:text-white">My Bookings</h4>
                         <p className="text-xs text-gray-500">Track active & past jobs</p>
                     </div>
                     <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                 </button>

                 <button onClick={() => navigateTo(AppScreen.ADDRESSES)} className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-100 dark:border-white/5">
                     <div className="h-10 w-10 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-600 flex items-center justify-center">
                         <span className="material-symbols-outlined">location_on</span>
                     </div>
                     <div className="text-left flex-1">
                         <h4 className="font-bold text-onyx dark:text-white">Saved Addresses</h4>
                         <p className="text-xs text-gray-500">Manage home & work locations</p>
                     </div>
                     <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                 </button>

                 <button onClick={() => navigateTo(AppScreen.MEMBERSHIP)} className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                     <div className="h-10 w-10 rounded-full bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 flex items-center justify-center">
                         <span className="material-symbols-outlined">workspace_premium</span>
                     </div>
                     <div className="text-left flex-1">
                         <h4 className="font-bold text-onyx dark:text-white">Membership</h4>
                         <p className="text-xs text-gray-500">Manage Gold benefits</p>
                     </div>
                     <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                 </button>
             </div>

             {/* App Preferences */}
             <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-100 dark:border-white/5 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 flex items-center justify-center">
                            <span className="material-symbols-outlined">dark_mode</span>
                        </div>
                        <div className="text-left">
                            <h4 className="font-bold text-onyx dark:text-white">Dark Mode</h4>
                        </div>
                    </div>
                    <button 
                        onClick={toggleDarkMode}
                        className={`w-12 h-7 rounded-full transition-colors relative ${isDarkMode ? 'bg-primary' : 'bg-gray-200 dark:bg-white/20'}`}
                    >
                        <div className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow-sm transition-transform ${isDarkMode ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </button>
                </div>

                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 flex items-center justify-center">
                            <span className="material-symbols-outlined">star</span>
                        </div>
                        <div className="text-left">
                            <h4 className="font-bold text-onyx dark:text-white">Demo: Gold Mode</h4>
                        </div>
                    </div>
                    <button 
                        onClick={togglePremium}
                        className={`w-12 h-7 rounded-full transition-colors relative ${isPremium ? 'bg-primary' : 'bg-gray-200 dark:bg-white/20'}`}
                    >
                        <div className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow-sm transition-transform ${isPremium ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </button>
                </div>
             </div>

             <button onClick={logout} className="w-full bg-red-50 dark:bg-red-900/10 text-red-600 font-bold p-4 rounded-xl border border-red-100 dark:border-red-900/20 active:scale-[0.98] transition-transform">
                 Log Out
             </button>
        </div>

        <div className="text-center pt-4">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Version 2.0.1 (Build 420)</p>
        </div>
      </main>

      <BottomNav {...props} />
    </div>
  );
};
