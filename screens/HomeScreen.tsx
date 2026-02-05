
import React, { useState, useEffect } from 'react';
import { AppScreen, NavigationProps } from '../types';
import { BottomNav } from '../components/BottomNav';
import { CATEGORIES, MOCK_BOOKINGS } from '../mockData';

export const HomeScreen: React.FC<NavigationProps> = (props) => {
  const { navigateTo, isPremium, togglePremium, isDarkMode, toggleDarkMode, user, currentLocation, currentLocationLabel, setCurrentLocation, setSelectedCategory } = props;

  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [buttonStyle, setButtonStyle] = useState<'3D' | 'GLASS' | 'NEU'>('3D');

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

  // Variant 1: 3D "Pillowy" Pop (Requested Style)
  const get3DStyle = (id: string) => {
    // Base styles with specialized shadows for "Squishy" look
    const base = "relative overflow-hidden transition-transform active:scale-95 duration-200 border-b-4 border-r-4 rounded-[24px]";
    
    switch(id) {
      case 'c1': // Home Cleaning - Blue
        return `${base} bg-[#4facfe] border-[#0072ff]/20 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.4),inset_-4px_-4px_8px_rgba(0,0,0,0.1),0_8px_20px_rgba(79,172,254,0.3)]`;
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

  // Variant 2: Modern Glassmorphism
  const getGlassStyle = (id: string) => {
    return `relative bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[20px] shadow-sm active:scale-95 transition-all`;
  };

  // Variant 3: Soft Neumorphism
  const getNeuStyle = (id: string) => {
    return `relative bg-[#f8f7f6] dark:bg-[#1a1a1a] rounded-[24px] shadow-[6px_6px_12px_#d1d1cf,-6px_-6px_12px_#ffffff] dark:shadow-[5px_5px_10px_#0b0b0b,-5px_-5px_10px_#292929] active:shadow-[inset_6px_6px_12px_#d1d1cf,inset_-6px_-6px_12px_#ffffff] dark:active:shadow-[inset_5px_5px_10px_#0b0b0b,inset_-5px_-5px_10px_#292929] border border-white/20 dark:border-white/5 transition-all`;
  };

  const getButtonStyle = (id: string) => {
    if (buttonStyle === '3D') return get3DStyle(id);
    if (buttonStyle === 'GLASS') return getGlassStyle(id);
    return getNeuStyle(id);
  };

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

      {/* Style Playground Control (Hidden in Prod) */}
      <div className="px-6 mt-4 flex gap-2 overflow-x-auto no-scrollbar">
          {['3D', 'GLASS', 'NEU'].map((style) => (
             <button
                key={style}
                onClick={() => setButtonStyle(style as any)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border transition-all ${
                    buttonStyle === style 
                    ? 'bg-onyx text-white dark:bg-white dark:text-onyx border-onyx dark:border-white' 
                    : 'bg-transparent text-gray-400 border-gray-200 dark:border-white/10'
                }`}
             >
                {style === '3D' ? '3D Pop' : style === 'GLASS' ? 'Glass' : 'Neumorph'}
             </button>
          ))}
      </div>

      {/* 3D Categories Grid */}
      <section className="px-6 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-6">
            {CATEGORIES.map(cat => (
                <button 
                    key={cat.id} 
                    onClick={() => {
                        setSelectedCategory(cat);
                        navigateTo(AppScreen.SUB_CATEGORY);
                    }}
                    className="flex flex-col items-center group"
                >
                    {/* The Button Container */}
                    <div className={`w-full aspect-square flex items-center justify-center mb-3 ${getButtonStyle(cat.id)}`}>
                        {/* Icon Styling based on mode */}
                        <div className={`
                            relative z-10 flex items-center justify-center transition-transform group-hover:scale-110 duration-300
                            ${buttonStyle === '3D' ? 'drop-shadow-[0_4px_4px_rgba(0,0,0,0.15)]' : ''}
                        `}>
                             {/* Icon Circle (Optional based on style) */}
                             {buttonStyle === 'GLASS' ? (
                                 <div className={`h-12 w-12 rounded-full flex items-center justify-center bg-white text-black shadow-lg`}>
                                     <span className="material-symbols-outlined text-[24px]">{cat.icon}</span>
                                 </div>
                             ) : (
                                <span className={`material-symbols-outlined text-[42px] ${buttonStyle === '3D' ? 'text-white' : 'text-primary'}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                                    {cat.icon}
                                </span>
                             )}
                             
                             {/* Gloss Reflection for 3D Mode */}
                             {buttonStyle === '3D' && (
                                <div className="absolute -top-6 -right-6 w-12 h-12 bg-white/20 rounded-full blur-md"></div>
                             )}
                        </div>
                    </div>
                    
                    {/* Label */}
                    <span className="text-[12px] font-bold text-center leading-tight text-onyx dark:text-gray-300 w-full px-1 tracking-tight group-hover:text-primary transition-colors">
                      {cat.name}
                    </span>
                </button>
            ))}
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
