import React, { useState, useEffect } from "react";
import { NavigationProps } from "../types";

interface NotificationConfig {
  push: boolean;
  email: boolean;
  sms: boolean;
}

interface SettingsState {
  appName: string;
  supportEmail: string;
  commission: number;
  minBooking: number;
  advancePayment: boolean;
  opHoursStart: string;
  opHoursEnd: string;
  peakSurcharge: boolean;
  instantBooking: boolean;
  twoFactor: boolean;
  sessionTimeout: string;
  notifications: Record<string, NotificationConfig>;
}

const DEFAULT_SETTINGS: SettingsState = {
  appName: "HomeWash Luxury",
  supportEmail: "support@homewash.com",
  commission: 20,
  minBooking: 499,
  advancePayment: true,
  opHoursStart: "08:00",
  opHoursEnd: "20:00",
  peakSurcharge: false,
  instantBooking: true,
  twoFactor: false,
  sessionTimeout: "1 Hour",
  notifications: {
    "Booking Confirmation": { push: true, email: true, sms: false },
    "Partner Assignment": { push: true, email: true, sms: false },
    "In-Route Alerts": { push: true, email: false, sms: false },
    "Feedback Requests": { push: true, email: true, sms: false },
  },
};

export const SettingsPage: React.FC<NavigationProps> = () => {
  const [activeTab, setActiveTab] = useState<
    "platform" | "business" | "notifications" | "security"
  >("platform");
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [showToast, setShowToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleToggle = (key: keyof SettingsState) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (key: keyof SettingsState, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleNotificationChange = (
    item: string,
    type: keyof NotificationConfig,
  ) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [item]: {
          ...prev.notifications[item],
          [type]: !prev.notifications[item][type],
        },
      },
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setShowToast(true);
    }, 800);
  };

  const handleDiscard = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <div className="p-6 relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-8 right-8 z-[100] bg-black text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce-subtle border border-white/10">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-sm">
              done_all
            </span>
          </div>
          <span className="text-xs font-black uppercase tracking-widest">
            Settings saved successfully
          </span>
        </div>
      )}

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
            System Settings
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Configure platform-wide parameters, business rules, and security
            policies.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation Tabs */}
        <div className="lg:w-64 shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
            {(
              ["platform", "business", "notifications", "security"] as const
            ).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-bold uppercase tracking-widest transition-all border-l-4 ${
                  activeTab === tab
                    ? "bg-primary/10 text-primary border-primary"
                    : "text-gray-400 border-transparent hover:bg-gray-50 dark:hover:bg-gray-700/50"
                }`}
              >
                <span className="material-symbols-outlined text-lg">
                  {tab === "platform"
                    ? "settings_applications"
                    : tab === "business"
                      ? "schedule"
                      : tab === "notifications"
                        ? "notifications"
                        : "shield"}
                </span>
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 max-w-3xl">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="p-8">
              {activeTab === "platform" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-black uppercase tracking-tighter mb-6">
                    Platform Configuration
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Application Name
                      </label>
                      <input
                        type="text"
                        value={settings.appName}
                        onChange={(e) =>
                          handleChange("appName", e.target.value)
                        }
                        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-primary transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Support Email
                      </label>
                      <input
                        type="email"
                        value={settings.supportEmail}
                        onChange={(e) =>
                          handleChange("supportEmail", e.target.value)
                        }
                        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-primary transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Default Commission (%)
                      </label>
                      <input
                        type="number"
                        value={settings.commission}
                        onChange={(e) =>
                          handleChange("commission", parseInt(e.target.value))
                        }
                        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-primary transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Min. Booking Amount (₹)
                      </label>
                      <input
                        type="number"
                        value={settings.minBooking}
                        onChange={(e) =>
                          handleChange("minBooking", parseInt(e.target.value))
                        }
                        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-primary transition-all"
                      />
                    </div>
                  </div>

                  <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 mt-8">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
                        <span className="material-symbols-outlined text-xl">
                          payments
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm">
                          Advance Payment Policy
                        </p>
                        <p className="text-xs text-gray-500 mt-1 font-medium">
                          Force mandatory 30% advance payment for all premium
                          category bookings.
                        </p>
                        <div className="mt-4 flex items-center gap-3">
                          <button
                            onClick={() => handleToggle("advancePayment")}
                            className={`w-12 h-6 rounded-full relative transition-all shadow-inner ${settings.advancePayment ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"}`}
                          >
                            <div
                              className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all ${settings.advancePayment ? "right-1" : "left-1"}`}
                            />
                          </button>
                          <span
                            className={`text-[10px] font-black uppercase ${settings.advancePayment ? "text-primary" : "text-gray-400"}`}
                          >
                            {settings.advancePayment ? "Enabled" : "Disabled"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "business" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-black uppercase tracking-tighter mb-6">
                    Business Operations
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm">
                      <div>
                        <p className="font-bold text-sm">Operation Hours</p>
                        <p className="text-xs text-gray-400 font-bold uppercase mt-1 tracking-widest">
                          Platform-wide window
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="time"
                          value={settings.opHoursStart}
                          onChange={(e) =>
                            handleChange("opHoursStart", e.target.value)
                          }
                          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-xs font-black shadow-sm"
                        />
                        <span className="text-[10px] font-black uppercase text-gray-400">
                          to
                        </span>
                        <input
                          type="time"
                          value={settings.opHoursEnd}
                          onChange={(e) =>
                            handleChange("opHoursEnd", e.target.value)
                          }
                          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-xs font-black shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm">
                      <div>
                        <p className="font-bold text-sm">
                          Peak Hours Surcharge
                        </p>
                        <p className="text-xs text-gray-400 font-bold uppercase mt-1 tracking-widest">
                          +15% extra during 6PM - 8PM
                        </p>
                      </div>
                      <button
                        onClick={() => handleToggle("peakSurcharge")}
                        className={`w-12 h-6 rounded-full relative transition-all shadow-inner ${settings.peakSurcharge ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"}`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all ${settings.peakSurcharge ? "right-1" : "left-1"}`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm">
                      <div>
                        <p className="font-bold text-sm">Instant Booking</p>
                        <p className="text-xs text-gray-400 font-bold uppercase mt-1 tracking-widest">
                          Allow bookings within 2 hours
                        </p>
                      </div>
                      <button
                        onClick={() => handleToggle("instantBooking")}
                        className={`w-12 h-6 rounded-full relative transition-all shadow-inner ${settings.instantBooking ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"}`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all ${settings.instantBooking ? "right-1" : "left-1"}`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-black uppercase tracking-tighter mb-6">
                    Communication Channels
                  </h3>

                  <div className="grid grid-cols-1 gap-4">
                    {Object.keys(settings.notifications).map((item) => (
                      <div
                        key={item}
                        className="flex flex-col md:flex-row md:items-center justify-between p-6 border border-gray-50 dark:border-gray-700 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all group"
                      >
                        <p className="font-bold text-sm mb-4 md:mb-0">{item}</p>
                        <div className="flex gap-6">
                          {(["push", "email", "sms"] as const).map((type) => (
                            <label
                              key={type}
                              className="flex items-center gap-2 cursor-pointer group/label"
                            >
                              <input
                                type="checkbox"
                                checked={settings.notifications[item][type]}
                                onChange={() =>
                                  handleNotificationChange(item, type)
                                }
                                className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary accent-primary"
                              />
                              <span
                                className={`text-[10px] font-black uppercase tracking-widest transition-colors ${settings.notifications[item][type] ? "text-primary" : "text-gray-400 group-hover/label:text-gray-600"}`}
                              >
                                {type}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-black uppercase tracking-tighter mb-6">
                    Security & Access
                  </h3>

                  <div className="space-y-6">
                    <div
                      className={`p-6 rounded-2xl border transition-all ${settings.twoFactor ? "bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900/20" : "bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/20"}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p
                          className={`font-bold text-sm ${settings.twoFactor ? "text-green-600" : "text-red-600"}`}
                        >
                          Two-Factor Authentication (2FA)
                        </p>
                        {!settings.twoFactor && (
                          <span className="text-[10px] font-black uppercase bg-red-600 text-white px-2 py-1 rounded shadow-sm tracking-widest">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-xs font-medium mb-6 ${settings.twoFactor ? "text-green-500" : "text-red-400"}`}
                      >
                        {settings.twoFactor
                          ? "Your account is protected with secondary authentication."
                          : "Enhance security by requiring a secondary code for all logins."}
                      </p>
                      <button
                        onClick={() => handleToggle("twoFactor")}
                        className={`w-12 h-6 rounded-full relative transition-all shadow-inner ${settings.twoFactor ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"}`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all ${settings.twoFactor ? "right-1" : "left-1"}`}
                        />
                      </button>
                    </div>

                    <div className="p-6 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm">
                      <p className="font-bold text-sm mb-6">
                        Session Management
                      </p>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                            Auto Logout After
                          </span>
                          <select
                            value={settings.sessionTimeout}
                            onChange={(e) =>
                              handleChange("sessionTimeout", e.target.value)
                            }
                            className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-2 text-xs font-black outline-none focus:border-primary transition-all"
                          >
                            <option>30 Minutes</option>
                            <option>1 Hour</option>
                            <option>24 Hours</option>
                            <option>Never</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-8 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 flex items-center justify-end gap-4">
              <button
                onClick={handleDiscard}
                className="px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors"
              >
                Discard
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`px-10 py-4 rounded-2xl bg-black text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-black/10 flex items-center gap-2 ${isSaving ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02] hover:shadow-black/20 active:scale-[0.98]"}`}
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <span className="material-symbols-outlined text-sm">
                    save
                  </span>
                )}
                {isSaving ? "Saving..." : "Save Implementation"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
