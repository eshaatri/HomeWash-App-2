import React from "react";
import { NavigationProps } from "../types";

interface ProfileScreenProps extends NavigationProps {
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  partner,
  isDarkMode,
  toggleDarkMode,
  onLogout,
}) => {
  const menuItems = [
    {
      icon: "account_circle",
      label: "Personal Details",
      action: () => alert("User profile editing coming soon!"),
    },
    {
      icon: "description",
      label: "Documents",
      action: () => alert("KYC documents are verified."),
    },
    {
      icon: "account_balance",
      label: "Bank Details",
      action: () =>
        alert(
          "Primary Bank: HDFC Bank State Bank of India\nAccount: **** 4920",
        ),
    },
    {
      icon: "notifications",
      label: "Notifications",
      action: () => alert("No new notifications."),
    },
    {
      icon: "help",
      label: "Help & Support",
      action: () =>
        alert("Contact support at help@homewash.com or call 1800-XXX-XXXX"),
    },
    {
      icon: "policy",
      label: "Terms & Conditions",
      action: () => alert("Opening Terms and Conditions document..."),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#121212] pb-20">
      {/* Header */}
      <header className="bg-white dark:bg-[#1a1a1a] px-4 py-4 border-b border-gray-100 dark:border-white/5 sticky top-0 z-30">
        <h1 className="text-xl font-bold">Profile</h1>
      </header>

      {/* Profile Card */}
      <div className="p-4">
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 border border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full flex items-center justify-center bg-primary/20 text-primary font-black text-2xl ring-4 ring-primary/30">
              {partner?.name
                ? partner.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
                : "?"}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{partner?.name}</h2>
              <p className="text-gray-500 text-sm">{partner?.phone}</p>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={`text-xs font-bold px-2 py-1 rounded ${
                    partner?.tier === "GOLD"
                      ? "bg-yellow-100 text-yellow-700"
                      : partner?.tier === "PLATINUM"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {partner?.tier}
                </span>
                <span className="flex items-center gap-1 text-sm">
                  <span
                    className="material-symbols-outlined text-primary text-[14px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  {partner?.rating}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white dark:bg-[#1a1a1a] p-4 rounded-xl border border-gray-100 dark:border-white/5 text-center">
          <p className="text-2xl font-black">{partner?.completedJobs}</p>
          <p className="text-xs text-gray-500 font-bold">Jobs Completed</p>
        </div>
        <div className="bg-white dark:bg-[#1a1a1a] p-4 rounded-xl border border-gray-100 dark:border-white/5 text-center">
          <p className="text-2xl font-black">98%</p>
          <p className="text-xs text-gray-500 font-bold">Acceptance Rate</p>
        </div>
      </div>

      {/* Dark Mode Toggle */}
      <div className="px-4 mb-4">
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-100 dark:border-white/5 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-gray-600 dark:text-gray-400">
              {isDarkMode ? "dark_mode" : "light_mode"}
            </span>
            <span className="font-medium">Dark Mode</span>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`w-12 h-7 rounded-full transition-colors relative ${
              isDarkMode ? "bg-primary" : "bg-gray-300"
            }`}
          >
            <div
              className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                isDarkMode ? "left-6" : "left-1"
              }`}
            ></div>
          </button>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 flex-1">
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-100 dark:border-white/5 overflow-hidden">
          {menuItems.map((item, i) => (
            <button
              key={i}
              onClick={item.action}
              className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-100 dark:border-white/5 last:border-0"
            >
              <span className="material-symbols-outlined text-gray-600 dark:text-gray-400">
                {item.icon}
              </span>
              <span className="flex-1 text-left font-medium">{item.label}</span>
              <span className="material-symbols-outlined text-gray-400">
                chevron_right
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Logout Button */}
      <div className="p-4">
        <button
          onClick={onLogout}
          className="w-full bg-red-500/10 text-red-500 py-4 rounded-xl font-bold hover:bg-red-500/20 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};
