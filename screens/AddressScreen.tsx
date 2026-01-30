import React from 'react';
import { AppScreen, NavigationProps } from '../types';

export const AddressScreen: React.FC<NavigationProps> = ({ navigateTo, isPremium }) => {
  return (
    <div className="bg-[#f8f7f6] dark:bg-[#201d12] min-h-screen flex flex-col font-display antialiased transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-[#f8f7f6]/95 dark:bg-[#201d12]/95 backdrop-blur-md border-b border-neutral-200 dark:border-white/5">
        <button 
          onClick={() => navigateTo(AppScreen.HOME)}
          className="flex items-center justify-center size-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors group"
        >
          <span className="material-symbols-outlined text-neutral-900 dark:text-white group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
        </button>
        <h1 className="text-lg font-semibold text-neutral-900 dark:text-white tracking-tight">Family Plan Addresses</h1>
        <button className="flex items-center justify-center size-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
          <span className="material-symbols-outlined text-neutral-900 dark:text-white">help_outline</span>
        </button>
      </header>

      <main className="flex-1 w-full max-w-md mx-auto px-6 py-8 flex flex-col gap-6">
        {/* Status Banner */}
        <div className="flex flex-col items-center justify-center gap-2">
          {isPremium ? (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
              <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              <span className="text-xs font-bold text-primary tracking-wide uppercase">Gold Member</span>
            </div>
          ) : (
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-500/10 border border-gray-500/20">
              <span className="text-xs font-bold text-gray-500 tracking-wide uppercase">Standard Plan</span>
            </div>
          )}
          <p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">3 of 3 slots used</p>
        </div>

        {/* Address List */}
        <div className="flex flex-col gap-4">
          {[
            { icon: 'home', title: 'Primary Residence', address: 'Flat 402, Oberoi Springs, Mumbai' },
            { icon: 'work', title: 'Office', address: 'WeWork Galaxy, Bangalore' },
            { icon: 'favorite', title: "Parents' Home", address: 'Defense Colony, New Delhi' }
          ].map((item) => (
            <div key={item.title} className="group relative overflow-hidden bg-white dark:bg-[#2a261a] rounded-2xl border border-neutral-200 dark:border-white/5 p-5 shadow-sm hover:shadow-md dark:hover:border-primary/30 transition-all duration-300">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center size-12 rounded-xl bg-neutral-100 dark:bg-[#37342a] text-neutral-900 dark:text-white shrink-0 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: item.icon === 'favorite' ? "'FILL' 0" : "'FILL' 1" }}>{item.icon}</span>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-base font-semibold text-neutral-900 dark:text-white">{item.title}</h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">{item.address}</p>
                    {isPremium && (
                      <div className="flex items-center gap-1.5 mt-3">
                        <span className="material-symbols-outlined text-primary text-[16px]">check_circle</span>
                        <span className="text-xs font-semibold text-primary">Gold Coverage Active</span>
                      </div>
                    )}
                  </div>
                </div>
                <button className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
                  <span className="material-symbols-outlined">edit</span>
                </button>
              </div>
            </div>
          ))}

          <button className="group flex items-center justify-center gap-3 w-full py-4 px-6 rounded-2xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-primary dark:hover:border-primary bg-transparent text-neutral-500 dark:text-neutral-400 hover:text-primary dark:hover:text-primary transition-all duration-300">
            <div className="flex items-center justify-center size-8 rounded-full bg-neutral-100 dark:bg-white/5 group-hover:bg-primary/10 transition-colors">
              <span className="material-symbols-outlined text-[20px]">add</span>
            </div>
            <span className="font-medium text-sm">Add New Location</span>
          </button>
        </div>

        {/* Footer Info */}
        <div className="mt-auto pt-6 text-center">
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            Your {isPremium ? 'Gold' : 'Basic'} Plan is valid for properties in Mumbai, Delhi, and Bangalore.
          </p>
        </div>
      </main>

      <div className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] z-0 mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
    </div>
  );
};