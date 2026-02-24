import React, { useState } from "react";
import { NavigationProps } from "../types";

interface LoginScreenProps extends NavigationProps {
  onLogin: (phone: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);

  const handleSendOtp = () => {
    if (phone.length >= 10) {
      setShowOtp(true);
    }
  };

  const handleVerify = () => {
    if (otp.length === 4) {
      onLogin(phone);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-primary/20 via-black to-black p-6">
      {/* Logo Section */}
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="w-24 h-24 rounded-2xl bg-primary flex items-center justify-center mb-6 shadow-lg shadow-primary/30">
          <span
            className="material-symbols-outlined text-5xl text-black"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            local_shipping
          </span>
        </div>
        <h1 className="text-3xl font-black text-white mb-2">
          HomeWash Professional
        </h1>
        <p className="text-gray-400 text-sm">Earn money on your own schedule</p>
      </div>

      {/* Login Form */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold mb-6 text-onyx dark:text-white">
          {showOtp ? "Enter OTP" : "Login as Professional"}
        </h2>

        {!showOtp ? (
          <>
            <div className="relative mb-4">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                +91
              </span>
              <input
                type="tel"
                placeholder="Mobile Number"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                className="w-full h-14 pl-14 pr-4 rounded-xl bg-gray-100 dark:bg-[#252525] border border-gray-200 dark:border-white/10 focus:outline-none focus:border-primary font-medium"
              />
            </div>
            <button
              onClick={handleSendOtp}
              disabled={phone.length < 10}
              className="w-full h-14 bg-primary text-black font-bold rounded-xl transition-all hover:bg-primary-dim disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Get OTP
            </button>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              OTP sent to +91 {phone}
              <button
                onClick={() => setShowOtp(false)}
                className="text-primary ml-2"
              >
                Change
              </button>
            </p>
            <input
              type="text"
              placeholder="Enter 4-digit OTP"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))
              }
              className="w-full h-14 px-4 rounded-xl bg-gray-100 dark:bg-[#252525] border border-gray-200 dark:border-white/10 focus:outline-none focus:border-primary font-medium text-center text-2xl tracking-[0.5em] mb-4"
            />
            <button
              onClick={handleVerify}
              disabled={otp.length < 4}
              className="w-full h-14 bg-primary text-black font-bold rounded-xl transition-all hover:bg-primary-dim disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Verify & Login
            </button>
            <p className="text-center text-sm text-gray-500 mt-4">
              Demo: Enter any 4 digits
            </p>
          </>
        )}
      </div>

      <p className="text-center text-xs text-gray-500 mt-6">
        By logging in, you agree to our Terms & Conditions
      </p>
    </div>
  );
};
