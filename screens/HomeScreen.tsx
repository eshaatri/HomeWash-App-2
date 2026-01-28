import React from 'react';
import { AppScreen, NavigationProps } from '../types';
import { BottomNav } from '../components/BottomNav';
import { CATEGORIES, MOCK_BOOKINGS } from '../mockData';

export const HomeScreen: React.FC<NavigationProps> = (props) => {
  const { navigateTo, isPremium, togglePremium, isDarkMode, toggleDarkMode, user } = props;

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden pb-24 bg-alabaster dark:bg-onyx text-onyx dark:text-alabaster transition-colors duration-300">
      {/* Top App Bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between bg-white/90 dark:bg-onyx/90 px-6 py-4 backdrop-blur-md border-b border-gray-200 dark:border-white/5 transition-colors duration-300">
        <div className="flex flex-col cursor-pointer hover:opacity-80" onClick={() => navigateTo(AppScreen.ADDRESSES)}>
          <div className="flex items-center gap-1 text-primary">
            <span className="material-symbols-outlined text-[18px]">near_me</span>
            <span className="text-[10px] font-bold tracking-widest uppercase">Current Location</span>
            <span className="material-symbols-outlined text-[14px]">expand_more</span>
          </div>
          <p className="text-sm font-bold truncate max-w-[160px] text-onyx dark:text-white">New York, NY 10019</p>
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

      {/* Hero / Search */}
      <div className="px-6 pt-6 pb-2">
        <h1 className="text-3xl font-black tracking-tighter text-onyx dark:text-alabaster mb-4">
          Hello, <span className="text-primary">{user?.name.split(' ')[0]}</span>
        </h1>
        <div className="relative">
            <input 
                type="text" 
                placeholder="Search for 'AC Repair'" 
                className="w-full h-12 rounded-xl pl-12 pr-4 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/5 shadow-sm focus:outline-none focus:border-primary font-medium text-sm"
            />
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
        </div>
      </div>

      {/* Categories Grid (Urban Company Style) */}
      <section className="px-6 py-4">
        <div className="grid grid-cols-3 gap-3">
            {CATEGORIES.map(cat => (
                <button 
                    key={cat.id} 
                    onClick={() => navigateTo(AppScreen.SERVICE_SELECTION)}
                    className="flex flex-col items-center p-3 rounded-xl bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/5 shadow-sm active:scale-95 transition-transform"
                >
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-2 ${cat.color} bg-opacity-20`}>
                        <span className="material-symbols-outlined">{cat.icon}</span>
                    </div>
                    <span className="text-[10px] font-bold text-center leading-tight dark:text-gray-300">{cat.name}</span>
                </button>
            ))}
        </div>
      </section>

      {/* Active Booking Tracker (New!) */}
      <section className="px-6 mb-6">
          <div 
            onClick={() => navigateTo(AppScreen.BOOKING_DETAIL)}
            className="bg-primary rounded-xl p-4 shadow-[0_10px_20px_-5px_rgba(var(--primary-r),var(--primary-g),var(--primary-b),0.3)] relative overflow-hidden cursor-pointer"
          >
              <div className="flex items-center justify-between mb-2">
                  <span className="bg-black/20 text-black text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">In Progress</span>
                  <span className="text-black text-xs font-bold">Track &rarr;</span>
              </div>
              <h3 className="text-lg font-black text-black">Deep Home Cleaning</h3>
              <p className="text-sm font-medium text-black/80 mb-3">Partner is arriving in 5 mins</p>
              
              <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full border-2 border-black/10 overflow-hidden bg-white">
                       <img src={MOCK_BOOKINGS[0].partnerImage} className="w-full h-full object-cover"/>
                  </div>
                  <div>
                      <p className="text-xs font-bold text-black">{MOCK_BOOKINGS[0].partnerName}</p>
                      <div className="flex text-black/60 text-[10px] gap-1">
                          <span className="material-symbols-outlined text-[10px]">star</span>
                          4.9
                      </div>
                  </div>
              </div>

              {/* Decorative BG */}
              <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-8xl text-black opacity-10">cleaning_services</span>
          </div>
      </section>

      {/* Membership Card */}
      <section className="px-6 py-2">
        <div 
          onClick={() => navigateTo(AppScreen.MEMBERSHIP)}
          className="group relative overflow-hidden rounded-xl border border-primary/40 bg-onyx-gradient p-1 shadow-lg cursor-pointer"
        >
          {/* Inner Card Container */}
          <div className="relative z-10 flex flex-col justify-between rounded-lg bg-[#121212] p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">
                  {isPremium ? 'Membership' : 'Upgrade Now'}
                </p>
                <h2 className="text-xl font-bold tracking-tight text-white">
                  HomeWash <span className="text-primary">{isPremium ? 'Gold' : 'Basic'}</span>
                </h2>
                <p className="text-gray-400 text-xs mt-1">Get 20% off on all services</p>
              </div>
              <span className="material-symbols-outlined text-primary/80" style={{ fontSize: '32px' }}>
                {isPremium ? 'workspace_premium' : 'lock'}
              </span>
            </div>
          </div>
          
          {/* Decorative Glow */}
          <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
        </div>
      </section>

      {/* Recommended Services */}
      <section className="px-6 mt-6">
        <div className="flex items-center justify-between pb-4">
          <h3 className="text-lg font-bold tracking-tight text-onyx dark:text-white">Bestsellers</h3>
          <span 
            className="text-xs font-medium text-gray-400 dark:text-white/40 cursor-pointer"
            onClick={() => navigateTo(AppScreen.SERVICE_SELECTION)}
          >
            View All
          </span>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
          {[
            { icon: 'ac_unit', title: 'AC Service', price: 'From $15', color: 'bg-blue-50 text-blue-600' },
            { icon: 'pest_control', title: 'Pest Control', price: 'From $30', color: 'bg-green-50 text-green-600' },
            { icon: 'plumbing', title: 'Plumbing', price: 'From $10', color: 'bg-gray-50 text-gray-600' },
          ].map((service) => (
            <div 
              key={service.title} 
              onClick={() => navigateTo(AppScreen.SERVICE_SELECTION)}
              className="min-w-[140px] flex flex-col gap-3 rounded-xl border border-gray-200 dark:border-white/5 bg-white dark:bg-onyx-light p-4 shadow-sm"
            >
              <div className={`h-10 w-10 items-center justify-center flex rounded-lg ${service.color} dark:bg-opacity-10`}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{service.icon}</span>
              </div>
              <div>
                <h4 className="text-sm font-bold leading-tight text-onyx dark:text-alabaster">{service.title}</h4>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-gray-400 dark:text-white/40">{service.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <BottomNav {...props} />
    </div>
  );
};
