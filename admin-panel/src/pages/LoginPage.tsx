import React, { useState } from "react";
import { NavigationProps } from "../types";

interface LoginPageProps extends NavigationProps {
  onLogin: (role: "ADMIN" | "PARTNER") => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"ADMIN" | "PARTNER">("ADMIN");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-gray-900 to-gray-900 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
            <span
              className="material-symbols-outlined text-4xl text-white"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              local_laundry_service
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white">HomeWash Admin</h1>
          <p className="text-gray-400 text-sm mt-1">
            Sign in to manage your business
          </p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl"
        >
          <div className="flex p-1 bg-gray-100 dark:bg-gray-700 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setRole("ADMIN")}
              className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                role === "ADMIN"
                  ? "bg-white dark:bg-gray-600 text-primary shadow-sm"
                  : "text-gray-500"
              }`}
            >
              Admin Portal
            </button>
            <button
              type="button"
              onClick={() => setRole("PARTNER")}
              className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                role === "PARTNER"
                  ? "bg-white dark:bg-gray-600 text-primary shadow-sm"
                  : "text-gray-500"
              }`}
            >
              Partner Portal
            </button>
          </div>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@homewash.com"
                className="w-full h-12 px-4 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full h-12 px-4 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                Remember me
              </label>
              <button type="button" className="text-primary hover:underline">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-primary text-white font-bold rounded-xl hover:bg-primary-dim transition-colors shadow-lg shadow-primary/30"
            >
              Sign In
            </button>
          </div>

          <p className="text-center text-xs text-gray-500 mt-6">
            Demo: Click Sign In to enter the dashboard
          </p>
        </form>
      </div>
    </div>
  );
};
