
import React, { useState, useEffect } from 'react';
import { AppScreen, NavigationProps } from '../types';
import { BottomNav } from '../components/BottomNav';
import { CATEGORIES, MOCK_BOOKINGS } from '../mockData';

export const HomeScreen: React.FC<NavigationProps> = (props) => {
  const { navigateTo, isPremium, togglePremium, isDarkMode, toggleDarkMode, user, currentLocation, currentLocationLabel, setCurrentLocation, setSelectedCategory } = props;

  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Detect Location on Mount if not already set or is default
  useEffect(() => {
    const detectLocation = () => {
        if (currentLocation !== 'Detecting location...' && currentLocation !== 'Location unavailable') {
            return; 
        }

        setIsLocating(true);

        if (!navigator.geolocation) {
            setCurrentLocation('Location unavailable', 'Current Location');
            setIsLocating(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await response.json();
                    
                    if (data && data.address) {
                        const suburb = data.address.suburb || data.address.neighbourhood || data.address.residential;
                        const city = data.address.city || data.address.town || data.address.state_district;
                        const postcode = data.address.postcode;
                        
                        let formatted = 'Unknown Location';
                        if (suburb && city) {
                            formatted = `${suburb}, ${city}`;
                        } else if (city) {
                             formatted = city;
                        } else if (data.display_name) {
                            formatted = data.display_name.split(',').slice(0, 2).join(',');
                        }
                        
                        if (postcode && formatted.length < 25) {
                            formatted += ` ${postcode}`;
                        }
                        
                        setCurrentLocation(formatted, 'Current Location');
                    } else {
                        setCurrentLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`, 'Current Location');
                    }
                } catch (error) {
                    setCurrentLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`, 'Current Location');
                } finally {
                    setIsLocating(false);
                }
            },
            (error) => {
                console.error("Location access denied or error:", error);
                setCurrentLocation('Mumbai, India', 'Current Location'); 
                setIsLocating(false);
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    };

    detectLocation();
  }, []);

  // --- Design System Variants ---

  // Variant: 3D "Pillowy" Pop (Hardcoded Style)
  const get3DStyle = (id: string) => {
    // Base styles with specialized shadows for "Squishy" look
    const base = "relative overflow-hidden transition-transform active:scale-95 duration-200 border-b-4 border-r-4 rounded-[20px]";
    
    switch(id) {
      case 'c1':// Home Cleaning - Now using your custom image
        return `${base} bg-[url('/assets/floor-scrubbing.png')] bg-cover bg-center border-[#0072ff]/20 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.4),inset_-4px_-4px_8px_rgba(0,0,0,0.1),0_8px_20px_rgba(79,172,254,0.3)]`;
      case 'c2': // Bathroom - Purple
        return `${base} bg-[#a18cd1] border-[#fbc2eb]/20 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.4),inset_-4px_-4px_8px_rgba(0,0,0,0.1),0_8px_20px_rgba(161,140,209,0.3)]`;
      case 'c3': // Kitchen - Orange
        return `${base} bg-[#ff9a9e] border-[#fecfef]/20 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.4),inset_-4px_-4px_8px_rgba(0,0,0,0.1),0_8px_20px_rgba(255,154,158,0.3)]`;
      case 'c4': // Water - Cyan
        return `${base} bg-[#00c6fb] border-[#005bea]/20 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.4),inset_-4px_-4px_8px_rgba(0,0,0,0.1),0_8px_20px_rgba(0,198,251,0.3)]`;
      case 'c5': // Sofa - Yellow/Amber
        return `${base} bg-[#f6d365] border-[#fda085]/20 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.6),inset_-4px_-4px_8px_rgba(0,0,0,0.1),0_8px_20px_rgba(246,211,101,0.3)]`;
      case 'c6': // Car - Grey/White
        return `${base} bg-[#e0c3fc] border-[#8ec5fc]/20 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.4),inset_-4px_-4px_8px_rgba(0,0,0,0.1),0_8px_20px_rgba(224,195,252,0.3)]`;
      default:
        return `${base} bg-white`;
    }
  };

  const PROMO_BANNERS = [
      { 
          id: 'promo1', 
          title: 'Sofa Cleaning', 
          price: '₹299', 
          image: 'https://images.unsplash.com/photo-1629249767355-2d447d2f8319?auto=format&fit=crop&q=80&w=600',
          tag: 'Start @',
          catId: 'c5' 
      },
      { 
          id: 'promo2', 
          title: 'Bathroom Polish', 
          price: '₹399', 
          image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600',
          tag: 'Sparkle Deal',
          catId: 'c2'
      },
      { 
          id: 'promo3', 
          title: 'Full Kitchen', 
          price: '₹999', 
          image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=600',
          tag: 'Deep Clean',
          catId: 'c3'
      }
  ];

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
            <span className={`material-symbols-outlined text-[18px] ${isLocating ? 'animate-spin' : ''}`}>
                {isLocating ? 'progress_activity' : 'near_me'}
            </span>
            <span className="text-[10px] font-bold tracking-widest uppercase">
                {isLocating ? 'Locating...' : currentLocationLabel}
            </span>
            <span className="material-symbols-outlined text-[14px]">expand_more</span>
          </div>
          <p className="text-sm font-bold truncate max-w-[200px] text-onyx dark:text-white transition-all duration-300">
              {currentLocation}
          </p>
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
            onClick={() => navigateTo(AppScreen.PROFILE)}
            className={`relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-onyx-light transition-transform active:scale-95`}
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
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-onyx dark:text-white mb-4">
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

      {/* 3-Column Categories Grid */}
      <section className="px-6 py-6">
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-3 gap-y-7">
            {CATEGORIES.map(cat => (
                <button 
                    key={cat.id} 
                    onClick={() => {
                        setSelectedCategory(cat);
                        navigateTo(AppScreen.SUB_CATEGORY);
                    }}
                    className="flex flex-col items-center group"
                >
                    {/* The Button Container - Fixed to 3D Style */}
                    <div className={`w-full aspect-square flex items-center justify-center mb-2.5 ${get3DStyle(cat.id)}`}>
                        {/* Icon Styling */}
                        <div className="relative z-10 flex items-center justify-center transition-transform group-hover:scale-110 duration-300 drop-shadow-[0_3px_3px_rgba(0,0,0,0.12)]">
                            <span className="material-symbols-outlined text-[32px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                                {cat.icon}
                            </span>
                             
                             {/* Gloss Reflection for 3D Mode */}
                             <div className="absolute -top-4 -right-4 w-10 h-10 bg-white/20 rounded-full blur-md"></div>
                        </div>
                    </div>
                    
                    {/* Label */}
                    <span className="text-[11px] font-bold text-center leading-[1.2] text-onyx dark:text-gray-300 w-full px-0.5 tracking-tight group-hover:text-primary transition-colors line-clamp-2">
                      {cat.name}
                    </span>
                </button>
            ))}
        </div>
      </section>

      {/* Promotional Banners */}
      <section className="px-6 py-2">
         <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x">
            {PROMO_BANNERS.map(banner => (
                <div 
                   key={banner.id} 
                   onClick={() => {
                       const cat = CATEGORIES.find(c => c.id === banner.catId);
                       if (cat) {
                           setSelectedCategory(cat);
                           navigateTo(AppScreen.SUB_CATEGORY);
                       }
                   }}
                   className="snap-center shrink-0 w-[260px] h-[140px] rounded-2xl relative overflow-hidden group cursor-pointer shadow-md"
                >
                    <img src={banner.image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={banner.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-3 left-4 right-4">
                        <span className="bg-white/20 backdrop-blur-md border border-white/10 text-white text-[9px] font-black px-2 py-0.5 rounded-[4px] uppercase tracking-widest mb-1 inline-block">
                          {banner.tag}
                        </span>
                        <div className="flex items-end justify-between">
                            <h3 className="text-white text-lg font-bold leading-tight">{banner.title}</h3>
                            <h3 className="text-[#ffd633] text-xl font-black">{banner.price}</h3>
                        </div>
                    </div>
                </div>
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
                <p className="text-gray-400 text-xs mt-1">Get 10% off on all services</p>
              </div>
              <span className="material-symbols-outlined text-primary/80" style={{ fontSize: '32px' }}>
                {isPremium ? 'workspace_premium' : 'lock'}
              </span>
            </div>
          </div>
        </div>
      </section>
      
      <BottomNav {...props} />
    </div>
  );
};
