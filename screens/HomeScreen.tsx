import React from 'react';
import { AppScreen, NavigationProps } from '../types';
import { BottomNav } from '../components/BottomNav';
import { CATEGORIES, MOCK_BOOKINGS } from '../mockData';

export const HomeScreen: React.FC<NavigationProps> = (props) => {
  const { navigateTo, isPremium, togglePremium, isDarkMode, toggleDarkMode, user } = props;

  // Premium Metallic Styles - Enhanced for "Shiny" Look
  const premiumStyles = {
    background: 'linear-gradient(135deg, #8A6E2F 0%, #D4AF37 20%, #FFF9E3 50%, #D4AF37 80%, #8A6E2F 100%)',
    boxShadow: `
      0 20px 40px -12px rgba(0, 0, 0, 0.5),
      inset 0 1.5px 0.5px rgba(255, 255, 255, 0.8),
      inset 0 -1.5px 1px rgba(0, 0, 0, 0.3)
    `,
    borderColor: '#C5A059'
  };

  // Freemium Flat Styles
  const freemiumStyles = {
    background: '#FFD633', // Flat yellow as requested
    boxShadow: '0 8px 15px -3px rgba(0, 0, 0, 0.1)',
    borderColor: 'transparent'
  };

  const cardStyle = isPremium ? premiumStyles : freemiumStyles;

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden pb-24 md:pb-8 bg-alabaster dark:bg-onyx text-onyx dark:text-alabaster transition-colors duration-300">
      {/* Top App Bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between bg-white/90 dark:bg-onyx/90 px-6 py-4 backdrop-blur-md border-b border-gray-200 dark:border-white/5 transition-colors duration-300">
        <div className="flex flex-col cursor-pointer hover:opacity-80" onClick={() => navigateTo(AppScreen.ADDRESSES)}>
          <div className="flex items-center gap-1 text-primary">
            <span className="material-symbols-outlined text-[18px]">near_me</span>
            <span className="text-[10px] font-bold tracking-widest uppercase">Current Location</span>
            <span className="material-symbols-outlined text-[14px]">expand_more</span>
          </div>
          <p className="text-sm font-bold truncate max-w-[160px] text-onyx dark:text-white">Bandra West, Mumbai 400050</p>
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
      <div className="px-6 pt-6 pb-2 md:pt-10">
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-onyx dark:text-alabaster mb-4">
          Hello, <span className="text-primary">{user?.name.split(' ')[0]}</span>
        </h1>
        <div className="relative max-w-2xl">
            <input 
                type="text" 
                placeholder="Search for 'AC Repair'" 
                className="w-full h-12 rounded-xl pl-12 pr-4 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/5 shadow-sm focus:outline-none focus:border-primary font-medium text-sm"
            />
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
        </div>
      </div>

      {/* Categories Grid - Responsive */}
      <section className="px-6 py-4">
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {CATEGORIES.map(cat => (
                <button 
                    key={cat.id} 
                    onClick={() => navigateTo(AppScreen.SUB_CATEGORY)}
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/5 shadow-sm active:scale-95 transition-transform h-28 hover:shadow-md hover:border-gray-200 dark:hover:border-white/10"
                >
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 ${cat.color}`}>
                        <span className="material-symbols-outlined text-[22px]">{cat.icon}</span>
                    </div>
                    <span className="text-[10px] font-bold text-center leading-tight dark:text-gray-300 w-full px-1">{cat.name}</span>
                </button>
            ))}
        </div>
      </section>

      {/* Active Booking Tracker */}
      <section className="px-6 mb-6">
          <div 
            onClick={() => navigateTo(AppScreen.BOOKING_DETAIL)}
            className={`group relative rounded-xl p-5 overflow-hidden cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] border max-w-2xl ${isPremium ? 'border-[#c5a059]/50' : 'border-transparent'}`}
            style={cardStyle}
          >
              {/* Premium Specific Effects */}
              {isPremium && (
                <>
                  {/* Brushed Metal Texture Layer */}
                  <div 
                    className="absolute inset-0 opacity-[0.15] pointer-events-none mix-blend-overlay"
                    style={{ 
                      backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 1px, #000 1px, #000 2px)',
                      backgroundSize: '2px 100%'
                    }}
                  ></div>

                  {/* High Intensity Shimmer Swipe */}
                  <div 
                    className="absolute inset-0 opacity-40 pointer-events-none"
                    style={{ 
                      background: 'linear-gradient(115deg, transparent 40%, #ffffff 48%, #ffffff 52%, transparent 60%)',
                      backgroundSize: '200% 200%',
                      animation: 'shimmer 3s infinite ease-out'
                    }}
                  ></div>

                  {/* Soft Ambient Glow Layer */}
                  <div 
                    className="absolute inset-0 opacity-20 pointer-events-none animate-pulse-slow"
                    style={{ 
                      background: 'radial-gradient(circle at 50% -20%, #ffffff 0%, transparent 70%)'
                    }}
                  ></div>
                </>
              )}

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest shadow-sm ${isPremium ? 'bg-black/90 text-[#f2d27e] border border-[#f2d27e]/40' : 'bg-black/10 text-black border border-black/5'}`}>
                      In Progress
                    </span>
                    <span className={`text-xs font-black flex items-center gap-1 group-hover:gap-2 transition-all ${isPremium ? 'text-black/80' : 'text-black/60'}`}>
                      Track <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </span>
                </div>
                
                <h3 className={`text-2xl font-black tracking-tighter transition-colors ${isPremium ? 'text-black drop-shadow-[0_1px_0.5px_rgba(255,255,255,0.5)]' : 'text-black/90'}`}>
                  Deep Home Cleaning
                </h3>
                <p className={`text-sm font-bold mb-5 leading-tight ${isPremium ? 'text-black/70' : 'text-black/50'}`}>Partner is arriving in 5 mins</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full border-2 overflow-hidden bg-white/40 backdrop-blur-sm shadow-inner ${isPremium ? 'border-black/30' : 'border-black/10'}`}>
                           <img src={MOCK_BOOKINGS[0].partnerImage} className="w-full h-full object-cover" alt="Partner"/>
                      </div>
                      <div>
                          <p className={`text-xs font-black ${isPremium ? 'text-black' : 'text-black/80'}`}>{MOCK_BOOKINGS[0].partnerName}</p>
                          <div className={`flex items-center text-[10px] gap-1 font-black ${isPremium ? 'text-black/70' : 'text-black/50'}`}>
                              <span className="material-symbols-outlined text-[12px] fill-current">star</span>
                              4.9
                          </div>
                      </div>
                  </div>
                  
                  {/* Contact Button */}
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-sm transition-all ${isPremium ? 'bg-black/10 border-black/10 text-black/80 group-hover:bg-black group-hover:text-white' : 'bg-white/40 border-black/5 text-black/60 group-hover:bg-white group-hover:text-black'}`}>
                    <span className="material-symbols-outlined text-lg">call</span>
                  </div>
                </div>
              </div>

              {/* Etched Icon Decoration */}
              <span 
                className={`material-symbols-outlined absolute -right-6 -bottom-6 text-[140px] pointer-events-none select-none transition-opacity ${isPremium ? 'text-black/15' : 'text-black/5'}`}
                style={{ transform: 'rotate(-15deg)' }}
              >
                cleaning_services
              </span>
          </div>
      </section>

      {/* Membership Card */}
      <section className="px-6 py-2">
        <div 
          onClick={() => navigateTo(AppScreen.MEMBERSHIP)}
          className="group relative overflow-hidden rounded-xl border border-primary/40 bg-onyx-gradient p-1 shadow-lg cursor-pointer max-w-2xl"
        >
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
          <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
        </div>
      </section>

      {/* Coming Soon Section - Responsive Grid */}
      <section className="px-6 mt-6">
        <div className="flex items-center justify-between pb-4">
          <h3 className="text-lg font-bold tracking-tight text-onyx dark:text-white">Coming Soon</h3>
          <span 
            className="text-xs font-medium text-gray-400 dark:text-white/40 cursor-default"
          >
            Stay Tuned
          </span>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {[
            { icon: 'solar_power', title: 'Solar', sub: 'Panel', color: 'bg-yellow-50 text-yellow-600' },
            { icon: 'pest_control', title: 'Pest', sub: 'Control', color: 'bg-green-50 text-green-600' },
            { icon: 'ac_unit', title: 'AC', sub: 'Service', color: 'bg-blue-50 text-blue-600' },
            { icon: 'local_laundry_service', title: 'Washing', sub: 'Machine', color: 'bg-purple-50 text-purple-600' },
          ].map((service) => (
            <div 
              key={service.title} 
              className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 dark:border-white/5 bg-white dark:bg-onyx-light p-2 py-3 shadow-sm opacity-60 grayscale-[0.5]"
            >
              <div className={`h-8 w-8 items-center justify-center flex rounded-full ${service.color} dark:bg-opacity-10`}>
                <span className="material-symbols-outlined text-[18px]">{service.icon}</span>
              </div>
              <div className="text-center w-full leading-none">
                <h4 className="text-[9px] font-bold text-onyx dark:text-alabaster">{service.title}</h4>
                <h4 className="text-[9px] font-bold text-onyx dark:text-alabaster mt-0.5">{service.sub}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <BottomNav {...props} />
    </div>
  );
};