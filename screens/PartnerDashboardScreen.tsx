import React from "react";
import { AppScreen, NavigationProps } from "../types";
import { MOCK_PARTNER } from "../mockData";

export const PartnerDashboardScreen: React.FC<NavigationProps> = ({
  navigateTo,
  logout,
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#121212] font-display text-onyx dark:text-white pb-safe">
      {/* Header */}
      <header className="bg-white dark:bg-[#1a1a1a] p-4 shadow-sm border-b border-gray-100 dark:border-white/5 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
              {MOCK_PARTNER.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-bold text-sm">Hi, {MOCK_PARTNER.name}</h2>
              <div className="flex items-center gap-1">
                <span
                  className="material-symbols-outlined text-primary text-[14px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span className="text-xs font-medium">
                  {MOCK_PARTNER.rating} Rating
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="text-xs font-bold text-red-500 uppercase tracking-wide border border-red-500/20 px-3 py-1 rounded-full"
          >
            Offline
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="p-4 grid grid-cols-2 gap-3">
        <div className="bg-white dark:bg-[#1a1a1a] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-white/5">
          <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">
            Today's Earnings
          </p>
          <p className="text-2xl font-bold mt-1">
            ₹{MOCK_PARTNER.earningsToday}
          </p>
        </div>
        <div className="bg-white dark:bg-[#1a1a1a] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-white/5">
          <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">
            Jobs Done
          </p>
          <p className="text-2xl font-bold mt-1">3</p>
        </div>
      </div>

      {/* Active Job */}
      <div className="px-4 mb-6">
        <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-3">
          Active Job
        </h3>
        <div className="bg-primary text-black rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <span className="material-symbols-outlined text-6xl">
              navigation
            </span>
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="bg-black/20 text-xs font-bold px-2 py-1 rounded uppercase">
                  En Route
                </span>
                <h2 className="text-xl font-bold mt-2">Deep Home Cleaning</h2>
                <p className="text-sm opacity-80">Booking #8292</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">₹1499.00</p>
                <p className="text-xs font-medium">Cash on Delivery</p>
              </div>
            </div>

            <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm mb-4">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined">location_on</span>
                <div>
                  <p className="font-bold text-sm">Flat 402, Oberoi Springs</p>
                  <p className="text-xs opacity-80">Bandra West, Mumbai</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 bg-black text-white py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]">
                  map
                </span>
                Navigate
              </button>
              <button className="flex-1 bg-white text-black py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]">
                  call
                </span>
                Call User
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Leads / Upcoming */}
      <div className="px-4 flex-1">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500">
            New Leads (2)
          </h3>
          <button className="text-primary text-xs font-bold">Refresh</button>
        </div>

        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#1a1a1a] p-4 rounded-xl border border-gray-100 dark:border-white/5"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-lg">Sofa Cleaning</h4>
                <span className="text-sm font-bold">₹499.00</span>
              </div>
              <p className="text-gray-500 text-sm mb-3">
                3.5 km away • 45 mins duration
              </p>
              <div className="flex gap-2">
                <button className="flex-1 border border-gray-200 dark:border-white/20 py-2 rounded-lg text-sm font-bold">
                  Reject
                </button>
                <button className="flex-1 bg-green-500 text-white py-2 rounded-lg text-sm font-bold shadow-lg shadow-green-500/20">
                  Accept
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Nav for Partner */}
      <div className="bg-white dark:bg-[#1a1a1a] border-t border-gray-100 dark:border-white/5 p-2 flex justify-around sticky bottom-0">
        <button className="flex flex-col items-center p-2 text-primary">
          <span className="material-symbols-outlined">work</span>
          <span className="text-[10px] font-bold mt-1">Jobs</span>
        </button>
        <button className="flex flex-col items-center p-2 text-gray-400">
          <span className="material-symbols-outlined">payments</span>
          <span className="text-[10px] font-bold mt-1">Wallet</span>
        </button>
        <button className="flex flex-col items-center p-2 text-gray-400">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-bold mt-1">Profile</span>
        </button>
      </div>
    </div>
  );
};
