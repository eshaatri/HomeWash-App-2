import React from 'react';
import { AppScreen, NavigationProps } from '../types';
import { BottomNav } from '../components/BottomNav';

export const HomeScreen: React.FC<NavigationProps> = (props) => {
  const { navigateTo, isPremium, togglePremium, isDarkMode, toggleDarkMode } = props;

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden pb-24 bg-alabaster dark:bg-onyx text-onyx dark:text-alabaster transition-colors duration-300">
      {/* Top App Bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between bg-white/90 dark:bg-onyx/90 px-6 py-4 backdrop-blur-md border-b border-gray-200 dark:border-white/5 transition-colors duration-300">
        <div className="flex items-center gap-2 text-gray-600 dark:text-alabaster/80" onClick={() => navigateTo(AppScreen.ADDRESSES)}>
          <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>location_on</span>
          <span className="text-xs font-medium tracking-widest uppercase cursor-pointer hover:text-black dark:hover:text-white">MUMBAI • Bandra West</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleDarkMode}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-onyx-light text-gray-600 dark:text-white transition-all active:scale-95"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          <button 
            onClick={togglePremium}
            className={`relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-onyx-light transition-transform active:scale-95 ${!isPremium ? 'grayscale' : ''}`}
          >
            <img 
              alt="Profile" 
              className="h-full w-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFK0Fz8B0V8pQ3JrplcKD15JYgq3Cl8REYDUeN_qpGXmcLMshGFME5GoGxZROWR1SSaovL3PHRMzm-vOitRuzsbp9zWBAWyQzgY_ZnKzT9U-VqculLggQXOWyl2_hU8dadTv8DtwcEEpUU3PMtc0YJKYgXDxdLyoUM72UJRwT3e5bwlltq17PCqYwpToIJLdFQNjCJpMmPLY_DmQ4l488SzICvGQSFIwleL36Ge0lXezGBHQ3SHeUOpqT9B_5TppuEFDAsfH6rJ-0" 
            />
          </button>
        </div>
      </header>

      {/* Hero Typography */}
      <div className="px-6 pt-6 pb-2">
        <h1 className="flex flex-col text-[4rem] font-black leading-[0.85] tracking-tighter text-onyx dark:text-alabaster">
          <span>HOME</span>
          <span className="text-black/10 dark:text-white/20">WASH</span>
        </h1>
        {!isPremium && (
          <p className="mt-2 text-sm text-primary font-semibold tracking-wide uppercase animate-pulse">
            Free Plan Active
          </p>
        )}
      </div>

      {/* Membership Card */}
      <section className="px-6 py-6">
        <div 
          onClick={() => navigateTo(AppScreen.MEMBERSHIP)}
          className="group relative overflow-hidden rounded-xl border border-primary/40 bg-onyx-gradient p-1 shadow-[0_10px_40px_-10px_rgba(var(--primary-r),var(--primary-g),var(--primary-b),0.15)] transition-all hover:border-primary/60 hover:shadow-[0_10px_40px_-10px_rgba(var(--primary-r),var(--primary-g),var(--primary-b),0.25)] cursor-pointer"
        >
          {/* Inner Card Container */}
          <div className="relative z-10 flex flex-col justify-between rounded-lg bg-[#121212] p-5 h-48">
            {/* Card Top */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">
                  {isPremium ? 'Membership' : 'Upgrade Now'}
                </p>
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  Home Wash <span className="text-primary">{isPremium ? 'Gold' : 'Basic'}</span>
                </h2>
              </div>
              <span className="material-symbols-outlined text-primary/80" style={{ fontSize: '32px' }}>
                {isPremium ? 'workspace_premium' : 'lock'}
              </span>
            </div>
            
            {/* Card Bottom */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className={`relative flex h-2 w-2 ${isPremium ? '' : 'hidden'}`}>
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                </span>
                <span className="text-sm font-medium text-alabaster/80">
                  {isPremium ? 'Active • 2 Priority Slots Available' : 'Limited Access • Upgrade for Priority'}
                </span>
              </div>
              <div className="h-px w-full bg-white/10"></div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/40 font-mono">
                  {isPremium ? 'ID: 8829-GOLD' : 'ID: 8829-FREE'}
                </span>
                <button className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary hover:text-white transition-colors">
                  {isPremium ? 'View Benefits' : 'Unlock Gold'}
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Decorative Glow */}
          <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
          <div className="pointer-events-none absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-primary/5 blur-2xl"></div>
        </div>
      </section>

      {/* Quick Actions (Horizontal Scroll) */}
      <div className="w-full overflow-x-auto no-scrollbar pb-6 pl-6">
        <div className="flex gap-4 pr-6">
          <button 
            onClick={() => navigateTo(AppScreen.SERVICE_SELECTION)}
            className="whitespace-nowrap rounded-full border border-gray-200 dark:border-white/10 bg-white dark:bg-onyx-light px-5 py-2.5 text-sm font-medium text-onyx dark:text-white transition-colors hover:bg-gray-100 dark:hover:bg-white dark:hover:text-onyx active:scale-95 shadow-sm"
          >
            Book Now
          </button>
          <button className="whitespace-nowrap rounded-full border border-gray-200 dark:border-white/10 bg-white dark:bg-onyx-light px-5 py-2.5 text-sm font-medium text-onyx dark:text-white transition-colors hover:bg-gray-100 dark:hover:bg-white dark:hover:text-onyx active:scale-95 shadow-sm">
            Recent Orders
          </button>
          <button 
            onClick={() => navigateTo(AppScreen.SUPPORT)}
            className="whitespace-nowrap rounded-full border border-gray-200 dark:border-white/10 bg-white dark:bg-onyx-light px-5 py-2.5 text-sm font-medium text-onyx dark:text-white transition-colors hover:bg-gray-100 dark:hover:bg-white dark:hover:text-onyx active:scale-95 shadow-sm"
          >
            Support
          </button>
        </div>
      </div>

      {/* Services Grid */}
      <section className="px-6">
        <div className="flex items-center justify-between pb-4 pt-2">
          <h3 className="text-lg font-bold tracking-tight text-onyx dark:text-white">Concierge Services</h3>
          <span 
            className="text-xs font-medium text-gray-400 dark:text-white/40 cursor-pointer hover:text-black dark:hover:text-white"
            onClick={() => navigateTo(AppScreen.SERVICE_SELECTION)}
          >
            View All
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: 'cleaning_services', title: 'Deep Clean', price: 'From $49' },
            { icon: 'directions_car', title: 'Auto Spa', price: 'From $25' },
            { icon: 'local_laundry_service', title: 'Laundry', price: 'Kg & Pc' },
            { icon: 'sanitizer', title: 'Sanitize', price: 'Home/Office' }
          ].map((service) => (
            <div 
              key={service.title} 
              onClick={() => navigateTo(AppScreen.SERVICE_SELECTION)}
              className="group flex cursor-pointer flex-col justify-between gap-4 rounded-xl border border-gray-200 dark:border-white/5 bg-white dark:bg-onyx-light p-4 transition-all hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] active:scale-[0.98] shadow-sm dark:shadow-none"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 text-onyx dark:text-alabaster group-hover:bg-primary group-hover:text-onyx transition-colors">
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{service.icon}</span>
              </div>
              <div>
                <h4 className="text-base font-bold leading-tight text-onyx dark:text-alabaster">{service.title}</h4>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-gray-400 dark:text-white/40">{service.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* New Arrivals / Promo Banner */}
      <section className="mt-8 px-6">
        <div 
          onClick={() => navigateTo(AppScreen.SERVICE_SELECTION)}
          className="relative overflow-hidden rounded-xl bg-gray-100 dark:bg-[#e5e5e5] p-6 text-onyx shadow-lg cursor-pointer"
        >
          {/* Abstract geometric background */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-onyx/60">New Service</p>
              <h3 className="mt-1 text-xl font-bold tracking-tight">Sofa Revival</h3>
              <p className="mt-1 text-sm font-medium opacity-80">Restore your leather & fabric.</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-onyx text-white shadow-xl">
              <span className="material-symbols-outlined">chair</span>
            </div>
          </div>
        </div>
      </section>
      
      <BottomNav {...props} />
    </div>
  );
};
