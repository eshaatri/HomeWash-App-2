import React, { useState, useEffect, useRef } from "react";
import { AppScreen, NavigationProps } from "../types";
import { BottomNav } from "../components/BottomNav";
import { CATEGORIES, MOCK_BOOKINGS } from "../mockData";

export const HomeScreen: React.FC<NavigationProps> = (props) => {
  const {
    navigateTo,
    isPremium,
    togglePremium,
    isDarkMode,
    toggleDarkMode,
    user,
    currentLocation,
    currentLocationLabel,
    setCurrentLocation,
    setSelectedCategory,
  } = props;

  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Detect Location on Mount if not already set or is default
  useEffect(() => {
    const detectLocation = () => {
      if (
        currentLocation !== "Detecting location..." &&
        currentLocation !== "Location unavailable"
      ) {
        return;
      }

      setIsLocating(true);

      if (!navigator.geolocation) {
        setCurrentLocation("Location unavailable", "Current Location");
        setIsLocating(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            );
            const data = await response.json();

            if (data && data.address) {
              const suburb =
                data.address.suburb ||
                data.address.neighbourhood ||
                data.address.residential;
              const city =
                data.address.city ||
                data.address.town ||
                data.address.state_district;
              const postcode = data.address.postcode;

              let formatted = "Unknown Location";
              if (suburb && city) {
                formatted = `${suburb}, ${city}`;
              } else if (city) {
                formatted = city;
              } else if (data.display_name) {
                formatted = data.display_name.split(",").slice(0, 2).join(",");
              }

              if (postcode && formatted.length < 25) {
                formatted += ` ${postcode}`;
              }

              setCurrentLocation(formatted, "Current Location");
            } else {
              setCurrentLocation(
                `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
                "Current Location",
              );
            }
          } catch (error) {
            setCurrentLocation(
              `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
              "Current Location",
            );
          } finally {
            setIsLocating(false);
          }
        },
        (error) => {
          console.error("Location access denied or error:", error);
          setCurrentLocation("Mumbai, India", "Current Location");
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
      );
    };

    detectLocation();
  }, []);

  // --- Design System Variants ---

  // Variant: 3D "Pillowy" Pop (Hardcoded Style)
  // Futuristic 3D Interactive Buttons
  const get3DStyle = (id: string) => {
    // 3D Floating Base
    const base =
      "relative w-full aspect-square rounded-[2rem] transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 active:scale-95 active:translate-y-0 group-hover:shadow-[0_20px_35px_-10px_rgba(0,0,0,0.4)] border-t border-white/40 shadow-[0_10px_20px_-5px_rgba(0,0,0,0.2),inset_0_-5px_15px_rgba(0,0,0,0.1)]";

    switch (id) {
      case "c1": // Home - Frosty Blue
        return `${base} bg-gradient-to-b from-cyan-300 via-cyan-400 to-blue-500 shadow-cyan-500/40`;
      case "c2": // Bathroom - Electric Purple
        return `${base} bg-gradient-to-b from-violet-300 via-violet-400 to-purple-600 shadow-violet-500/40`;
      case "c3": // Kitchen - Salmon/Rose
        return `${base} bg-gradient-to-b from-rose-300 via-rose-400 to-red-500 shadow-rose-500/40`;
      case "c4": // Water - Ocean Blue
        return `${base} bg-gradient-to-b from-sky-300 via-sky-400 to-blue-600 shadow-sky-500/40`;
      case "c5": // Sofa - Sunset Gold
        return `${base} bg-gradient-to-b from-amber-200 via-amber-300 to-orange-500 shadow-amber-500/40`;
      case "c6": // Car - Cool Lavender
        return `${base} bg-gradient-to-b from-indigo-200 via-indigo-300 to-indigo-500 shadow-indigo-500/40`;
      default:
        return `${base} bg-gray-100`;
    }
  };

  const PROMO_BANNERS = [
    {
      id: "promo1",
      title: "Sofa Cleaning",
      price: "₹299",
      image:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600",
      tag: "Start @",
      catId: "c5",
    },
    {
      id: "promo2",
      title: "Bathroom Polish",
      price: "₹399",
      image:
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600",
      tag: "Sparkle Deal",
      catId: "c2",
    },
    {
      id: "promo3",
      title: "Full Kitchen",
      price: "₹999",
      image:
        "https://images.pexels.com/photos/2724748/pexels-photo-2724748.jpeg?auto=compress&cs=tinysrgb&w=800",
      tag: "Deep Clean",
      catId: "c3",
    },
    {
      id: "promo4",
      title: "Interior Detail",
      price: "₹1299",
      image:
        "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80&w=600",
      tag: "Premium",
      catId: "c6",
    },
  ];

  // Premium Metallic Styles - Enhanced for "Shiny" Look
  const premiumStyles = {
    background:
      "linear-gradient(135deg, #8A6E2F 0%, #D4AF37 20%, #FFF9E3 50%, #D4AF37 80%, #8A6E2F 100%)",
    boxShadow: `
      0 20px 40px -12px rgba(0, 0, 0, 0.5),
      inset 0 1.5px 0.5px rgba(255, 255, 255, 0.8),
      inset 0 -1.5px 1px rgba(0, 0, 0, 0.3)
    `,
    borderColor: "#C5A059",
  };

  // Freemium Flat Styles
  const freemiumStyles = {
    background: "#FFD633", // Flat yellow as requested
    boxShadow: "0 8px 15px -3px rgba(0, 0, 0, 0.1)",
    borderColor: "transparent",
  };

  const cardStyle = isPremium ? premiumStyles : freemiumStyles;

  // Infinite Scroll Logic with Drag Support
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || isPaused) return;

    let animationId: number;
    const scroll = () => {
      if (el.scrollLeft >= el.scrollWidth / 2) {
        el.scrollLeft = 0;
      } else {
        el.scrollLeft += 1;
      }
      animationId = requestAnimationFrame(scroll);
    };
    animationId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden pb-24 md:pb-8 bg-alabaster dark:bg-onyx text-onyx dark:text-alabaster transition-colors duration-300">
      {/* Top App Bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between bg-white/90 dark:bg-onyx/90 px-6 py-4 backdrop-blur-md border-b border-gray-200 dark:border-white/5 transition-colors duration-300">
        <div
          className="flex flex-col cursor-pointer hover:opacity-80"
          onClick={() => navigateTo(AppScreen.ADDRESSES)}
        >
          <div className="flex items-center gap-1 text-primary">
            <span
              className={`material-symbols-outlined text-[18px] ${isLocating ? "animate-spin" : ""}`}
            >
              {isLocating ? "progress_activity" : "near_me"}
            </span>
            <span className="text-[10px] font-bold tracking-widest uppercase">
              {isLocating ? "Locating..." : currentLocationLabel}
            </span>
            <span className="material-symbols-outlined text-[14px]">
              expand_more
            </span>
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
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {isDarkMode ? "light_mode" : "dark_mode"}
            </span>
          </button>
          <button
            onClick={() => navigateTo(AppScreen.PROFILE)}
            className={`relative flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 dark:border-white/10 bg-primary/10 text-primary font-bold transition-transform active:scale-95`}
          >
            <span className="text-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
            </span>
          </button>
        </div>
      </header>

      {/* Hero / Search */}
      <div className="px-6 pt-6 pb-2 md:pt-10">
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-onyx dark:text-white mb-4">
          Hello,{" "}
          <span className="text-primary">{user?.name.split(" ")[0]}</span>
        </h1>
        <div className="relative max-w-2xl">
          <input
            type="text"
            placeholder="Search for 'AC Repair'"
            className="w-full h-12 rounded-xl pl-12 pr-4 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/5 shadow-sm focus:outline-none focus:border-primary font-medium text-sm"
          />
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            search
          </span>
        </div>
      </div>

      {/* 3-Column Categories Grid */}
      <section className="px-6 py-6">
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-3 gap-y-7">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat);
                navigateTo(AppScreen.SUB_CATEGORY);
              }}
              className="flex flex-col items-center group"
            >
              {/* Conditional Rendering: Custom Images for All Categories */}
              {["c1", "c2", "c3", "c4", "c5", "c6"].includes(cat.id) ? (
                <div className="relative w-full aspect-square mb-3 transition-transform duration-300 group-hover:scale-105 active:scale-95 drop-shadow-[0_10px_15px_rgba(0,0,0,0.2)]">
                  <img
                    src={
                      cat.id === "c1"
                        ? "/assets/home-cleaning-3d.png"
                        : cat.id === "c2"
                          ? "/assets/bathroom-cleaning.png"
                          : cat.id === "c3"
                            ? "/assets/kitchen-cleaning.png"
                            : cat.id === "c4"
                              ? "/assets/water-tank-cleaning.png"
                              : cat.id === "c5"
                                ? "/assets/sofa-cleaning.png"
                                : "/assets/car-wash.png"
                    }
                    alt={cat.name}
                    className="w-full h-full object-cover rounded-[2rem] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)]"
                    onError={(e) => {
                      // Fallback to CSS style if image missing
                      e.currentTarget.style.display = "none";
                      e.currentTarget.parentElement?.classList.add(
                        ...get3DStyle(cat.id).split(" "),
                      );
                      e.currentTarget.parentElement?.classList.add(
                        "flex",
                        "items-center",
                        "justify-center",
                      );
                      const icon = document.createElement("span");
                      icon.className =
                        "material-symbols-outlined text-[36px] text-white drop-shadow-md";
                      icon.innerText = cat.icon;
                      e.currentTarget.parentElement?.appendChild(icon);
                    }}
                  />
                </div>
              ) : (
                <div
                  className={`flex items-center justify-center mb-3 ${get3DStyle(cat.id)}`}
                >
                  {/* Shimmer/Reflection Layer */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-black/10 pointer-events-none"></div>
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-2 bg-white/40 rounded-full blur-[2px]"></div>

                  {/* Icon Styling */}
                  <div className="relative z-10 flex items-center justify-center transition-transform group-hover:scale-110 duration-300 drop-shadow-[0_5px_5px_rgba(0,0,0,0.2)]">
                    <span
                      className="material-symbols-outlined text-[36px] text-white filter drop-shadow-md"
                      style={{ fontVariationSettings: "'FILL' 1, 'wght' 600" }}
                    >
                      {cat.icon}
                    </span>
                  </div>
                </div>
              )}
              <span className="text-[11px] font-bold text-center leading-tight text-onyx/80 dark:text-alabaster/80 group-hover:text-onyx dark:group-hover:text-alabaster transition-colors uppercase tracking-wider">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Promotional Banners (Auto-Scroll + Drag) */}
      <section className="py-4 w-full relative">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto no-scrollbar px-4"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {[...PROMO_BANNERS, ...PROMO_BANNERS].map((banner, index) => (
            <div
              key={`${banner.id}-${index}`}
              onClick={() => {
                const cat = CATEGORIES.find((c) => c.id === banner.catId);
                if (cat) {
                  setSelectedCategory(cat);
                  navigateTo(AppScreen.SUB_CATEGORY);
                }
              }}
              className="shrink-0 w-[280px] h-[150px] rounded-[24px] relative overflow-hidden group cursor-pointer shadow-lg active:scale-95 transition-transform"
            >
              <img
                src={banner.image}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt={banner.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-5 right-5">
                <span className="bg-white/20 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider mb-2 inline-block shadow-sm">
                  {banner.tag}
                </span>
                <div className="flex items-end justify-between">
                  <h3 className="text-white text-lg font-bold leading-tight drop-shadow-md">
                    {banner.title}
                  </h3>
                  <h3 className="text-[#ffd633] text-xl font-black drop-shadow-md">
                    {banner.price}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Active Booking Tracker - HIDDEN */}
      <section className="hidden px-6 mb-6">
        <div
          onClick={() => navigateTo(AppScreen.BOOKING_DETAIL)}
          className={`group relative rounded-xl p-5 overflow-hidden cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] border max-w-2xl ${isPremium ? "border-[#c5a059]/50" : "border-transparent"}`}
          style={cardStyle}
        >
          {/* Premium Specific Effects */}
          {isPremium && (
            <>
              {/* Brushed Metal Texture Layer */}
              <div
                className="absolute inset-0 opacity-[0.15] pointer-events-none mix-blend-overlay"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(90deg, transparent, transparent 1px, #000 1px, #000 2px)",
                  backgroundSize: "2px 100%",
                }}
              ></div>

              {/* High Intensity Shimmer Swipe */}
              <div
                className="absolute inset-0 opacity-40 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(115deg, transparent 40%, #ffffff 48%, #ffffff 52%, transparent 60%)",
                  backgroundSize: "200% 200%",
                  animation: "shimmer 3s infinite ease-out",
                }}
              ></div>

              {/* Soft Ambient Glow Layer */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none animate-pulse-slow"
                style={{
                  background:
                    "radial-gradient(circle at 50% -20%, #ffffff 0%, transparent 70%)",
                }}
              ></div>
            </>
          )}

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <span
                className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest shadow-sm ${isPremium ? "bg-black/90 text-[#f2d27e] border border-[#f2d27e]/40" : "bg-black/10 text-black border border-black/5"}`}
              >
                In Progress
              </span>
              <span
                className={`text-xs font-black flex items-center gap-1 group-hover:gap-2 transition-all ${isPremium ? "text-black/80" : "text-black/60"}`}
              >
                Track{" "}
                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>
              </span>
            </div>

            <h3
              className={`text-2xl font-black tracking-tighter transition-colors ${isPremium ? "text-black drop-shadow-[0_1px_0.5px_rgba(255,255,255,0.5)]" : "text-black/90"}`}
            >
              Deep Home Cleaning
            </h3>
            <p
              className={`text-sm font-bold mb-5 leading-tight ${isPremium ? "text-black/70" : "text-black/50"}`}
            >
              Partner is arriving in 5 mins
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`h-10 w-10 rounded-full border-2 flex items-center justify-center bg-primary/10 text-primary font-bold backdrop-blur-sm shadow-inner ${isPremium ? "border-black/30" : "border-black/10"}`}
                >
                  {MOCK_BOOKINGS[0].partnerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p
                    className={`text-xs font-black ${isPremium ? "text-black" : "text-black/80"}`}
                  >
                    {MOCK_BOOKINGS[0].partnerName}
                  </p>
                  <div
                    className={`flex items-center text-[10px] gap-1 font-black ${isPremium ? "text-black/70" : "text-black/50"}`}
                  >
                    <span className="material-symbols-outlined text-[12px] fill-current">
                      star
                    </span>
                    4.9
                  </div>
                </div>
              </div>

              {/* Contact Button */}
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-sm transition-all ${isPremium ? "bg-black/10 border-black/10 text-black/80 group-hover:bg-black group-hover:text-white" : "bg-white/40 border-black/5 text-black/60 group-hover:bg-white group-hover:text-black"}`}
              >
                <span className="material-symbols-outlined text-lg">call</span>
              </div>
            </div>
          </div>

          {/* Etched Icon Decoration */}
          <span
            className={`material-symbols-outlined absolute -right-6 -bottom-6 text-[140px] pointer-events-none select-none transition-opacity ${isPremium ? "text-black/15" : "text-black/5"}`}
            style={{ transform: "rotate(-15deg)" }}
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
                  {isPremium ? "Membership" : "Upgrade Now"}
                </p>
                <h2 className="text-xl font-bold tracking-tight text-white">
                  HomeWash{" "}
                  <span className="text-primary">
                    {isPremium ? "Gold" : "Basic"}
                  </span>
                </h2>
                <p className="text-gray-400 text-xs mt-1">
                  Get 10% off on all services
                </p>
              </div>
              <span
                className="material-symbols-outlined text-primary/80"
                style={{ fontSize: "32px" }}
              >
                {isPremium ? "workspace_premium" : "lock"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <BottomNav {...props} />
    </div>
  );
};
