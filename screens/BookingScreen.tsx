import React, { useState } from "react";
import { AppScreen, Booking, BookingStatus, NavigationProps } from "../types";
import { BottomNav } from "../components/BottomNav";

interface BookingScreenProps extends NavigationProps {
  onSelectBooking?: (booking: Booking) => void;
}

export const BookingScreen: React.FC<BookingScreenProps> = (props) => {
  const { navigateTo, onSelectBooking, bookings, isPremium } = props;
  const [activeTab, setActiveTab] = useState<
    "ACTIVE" | "HISTORY" | "CANCELLED"
  >("ACTIVE");

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === "ACTIVE") {
      return [
        BookingStatus.PENDING,
        BookingStatus.CONFIRMED,
        BookingStatus.PROFESSIONAL_ASSIGNED,
        BookingStatus.PROFESSIONAL_EN_ROUTE,
        BookingStatus.IN_PROGRESS,
      ].includes(b.status);
    } else if (activeTab === "HISTORY") {
      return b.status === BookingStatus.COMPLETED;
    } else {
      return b.status === BookingStatus.CANCELLED;
    }
  });

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.PROFESSIONAL_EN_ROUTE:
        return "text-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400";
      case BookingStatus.CONFIRMED:
        return "text-purple-500 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400";
      case BookingStatus.COMPLETED:
        return "text-green-500 bg-green-50 dark:bg-green-900/20 dark:text-green-400";
      case BookingStatus.CANCELLED:
        return "text-red-500 bg-red-50 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "text-gray-500 bg-gray-50 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getStatusText = (status: BookingStatus) => {
    return status.replace(/_/g, " ");
  };

  const premiumStyles = {
    background:
      "linear-gradient(135deg, #8A6E2F 0%, #D4AF37 20%, #FFF9E3 50%, #D4AF37 80%, #8A6E2F 100%)",
    boxShadow:
      "0 20px 40px -12px rgba(0, 0, 0, 0.5), inset 0 1.5px 0.5px rgba(255, 255, 255, 0.8), inset 0 -1.5px 1px rgba(0, 0, 0, 0.3)",
    borderColor: "#C5A059",
  };

  const freemiumStyles = {
    background: "#FFD633",
    boxShadow: "0 8px 15px -3px rgba(0, 0, 0, 0.1)",
    borderColor: "transparent",
  };

  const cardStyle = isPremium ? premiumStyles : freemiumStyles;

  const heroBooking =
    activeTab === "ACTIVE" && filteredBookings.length > 0
      ? filteredBookings[0]
      : null;
  const listBookings =
    activeTab === "ACTIVE" && heroBooking
      ? filteredBookings.slice(1)
      : filteredBookings;

  return (
    <div className="bg-alabaster dark:bg-[#0f0f0f] min-h-screen flex flex-col font-display antialiased transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-30 flex flex-col bg-white/95 dark:bg-[#0f0f0f]/95 backdrop-blur-md border-b border-gray-200 dark:border-white/5">
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold text-onyx dark:text-white">
            My Bookings
          </h1>
          <button className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20">
            <span className="material-symbols-outlined text-[20px] text-gray-600 dark:text-white">
              search
            </span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-6 gap-6">
          {["ACTIVE", "HISTORY", "CANCELLED"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-3 text-sm font-bold tracking-wide transition-all relative ${
                activeTab === tab
                  ? "text-primary"
                  : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></div>
              )}
            </button>
          ))}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-6 pb-32 md:pb-8 space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-20 opacity-50">
            <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-700 mb-4">
              calendar_today
            </span>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              No {activeTab.toLowerCase()} bookings found
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Featured Hero Card for Active Booking */}
            {heroBooking && (
              <div
                onClick={() => {
                  if (onSelectBooking) {
                    onSelectBooking(heroBooking);
                  } else {
                    navigateTo(AppScreen.BOOKING_DETAIL);
                  }
                }}
                className={`group relative rounded-xl p-5 overflow-hidden cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] border max-w-2xl w-full mb-6 ${isPremium ? "border-[#c5a059]/50" : "border-transparent"}`}
                style={cardStyle}
              >
                {isPremium && (
                  <>
                    <div
                      className="absolute inset-0 opacity-[0.15] pointer-events-none mix-blend-overlay"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(90deg, transparent, transparent 1px, #000 1px, #000 2px)",
                        backgroundSize: "2px 100%",
                      }}
                    ></div>
                    <div
                      className="absolute inset-0 opacity-40 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(115deg, transparent 40%, #ffffff 48%, #ffffff 52%, transparent 60%)",
                        backgroundSize: "200% 200%",
                        animation: "shimmer 3s infinite ease-out",
                      }}
                    ></div>
                  </>
                )}

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest shadow-sm ${isPremium ? "bg-black/90 text-[#f2d27e] border border-[#f2d27e]/40" : "bg-black/10 text-black border border-black/5"}`}
                    >
                      {getStatusText(heroBooking.status)}
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
                    {heroBooking.serviceName}
                  </h3>
                  <p
                    className={`text-sm font-bold mb-5 leading-tight ${isPremium ? "text-black/70" : "text-black/50"}`}
                  >
                    {heroBooking.status === BookingStatus.PROFESSIONAL_EN_ROUTE
                      ? "Professional is arriving in 5 mins"
                      : `${heroBooking.date} • ${heroBooking.time}`}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-10 w-10 rounded-full border-2 flex items-center justify-center bg-primary/10 text-primary font-bold overflow-hidden backdrop-blur-sm shadow-inner ${isPremium ? "border-black/30" : "border-black/10"}`}
                      >
                        {heroBooking.professionalName
                          ? heroBooking.professionalName.charAt(0).toUpperCase()
                          : "P"}
                      </div>
                      <div>
                        <p
                          className={`text-xs font-black ${isPremium ? "text-black" : "text-black/80"}`}
                        >
                          {heroBooking.professionalName ||
                            "Assigning Professional"}
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
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-sm transition-all ${isPremium ? "bg-black/10 border-black/10 text-black/80 group-hover:bg-black group-hover:text-white" : "bg-white/40 border-black/5 text-black/60 group-hover:bg-white group-hover:text-black"}`}
                    >
                      <span className="material-symbols-outlined text-lg">
                        call
                      </span>
                    </div>
                  </div>
                </div>

                <span
                  className={`material-symbols-outlined absolute -right-6 -bottom-6 text-[140px] pointer-events-none select-none transition-opacity ${isPremium ? "text-black/15" : "text-black/5"}`}
                  style={{ transform: "rotate(-15deg)" }}
                >
                  cleaning_services
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {listBookings.map((booking) => (
                <div
                  key={booking.id}
                  onClick={() => {
                    if (booking.status !== BookingStatus.CANCELLED) {
                      if (onSelectBooking) {
                        onSelectBooking(booking);
                      } else {
                        navigateTo(AppScreen.BOOKING_DETAIL);
                      }
                    }
                  }}
                  className="group bg-white dark:bg-[#1a1a1a] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-white/5 active:scale-[0.99] transition-all cursor-pointer hover:shadow-md hover:border-primary/20 h-full flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 dark:text-gray-400">
                          <span className="material-symbols-outlined">
                            cleaning_services
                          </span>
                        </div>
                        <div>
                          <h3 className="font-bold text-onyx dark:text-white leading-tight">
                            {booking.serviceName}
                          </h3>
                          <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-0.5">
                            {booking.date} • {booking.time}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide ${getStatusColor(booking.status)}`}
                      >
                        {getStatusText(booking.status)}
                      </span>
                    </div>

                    <div className="h-px bg-gray-100 dark:bg-white/5 w-full my-3"></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {booking.professionalName && (
                        <>
                          <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold overflow-hidden">
                            {booking.professionalName
                              ? booking.professionalName.charAt(0).toUpperCase()
                              : "P"}
                          </div>
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                            {booking.professionalName}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-onyx dark:text-white">
                        ₹{booking.amount}
                      </span>
                      {booking.status === BookingStatus.COMPLETED && (
                        <button className="flex items-center gap-1 text-xs font-bold text-primary border border-primary/20 px-2 py-1 rounded hover:bg-primary/10 transition-colors">
                          <span className="material-symbols-outlined text-[14px]">
                            refresh
                          </span>
                          Rebook
                        </button>
                      )}
                      {activeTab === "ACTIVE" && (
                        <button className="flex items-center gap-1 text-xs font-bold text-onyx dark:text-white bg-gray-100 dark:bg-white/10 px-3 py-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-white/20 transition-colors">
                          Track
                          <span className="material-symbols-outlined text-[14px]">
                            arrow_forward
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <BottomNav {...props} />
    </div>
  );
};
