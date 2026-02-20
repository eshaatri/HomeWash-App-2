import React from "react";
import { NavigationProps } from "../types";
import { MOCK_EARNINGS_HISTORY } from "../mockData";

export const WalletScreen: React.FC<NavigationProps> = ({ partner }) => {
  const handleWithdraw = async () => {
    if ((partner?.walletBalance || 0) < 500) {
      alert("Minimum withdrawal amount is ₹500.");
      return;
    }
    const amount = prompt(
      "Enter amount to withdraw:",
      partner?.walletBalance.toString(),
    );
    if (amount && Number(amount) > 0) {
      if (Number(amount) > (partner?.walletBalance || 0)) {
        alert("Insufficient balance.");
        return;
      }
      alert(
        `Withdrawal request of ₹${amount} submitted! It will be credited to your bank account within 24-48 hours.`,
      );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#121212] pb-20">
      {/* Header */}
      <header className="bg-white dark:bg-[#1a1a1a] px-4 py-4 border-b border-gray-100 dark:border-white/5 sticky top-0 z-30 flex items-center justify-between">
        <h1 className="text-xl font-bold">Wallet</h1>
      </header>

      {/* Balance Card */}
      <div className="p-4">
        <div className="bg-gradient-to-br from-primary to-primary-dim rounded-2xl p-6 text-black shadow-lg">
          <p className="text-sm font-bold opacity-80 uppercase tracking-wide">
            Available Balance
          </p>
          <p className="text-4xl font-black mt-2">
            ₹{partner?.walletBalance.toLocaleString()}
          </p>
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleWithdraw}
              className="flex-1 bg-black text-white py-3 rounded-xl font-bold text-sm hover:bg-black/80 transition-colors"
            >
              Withdraw
            </button>
            <button
              onClick={() => alert("Transaction history coming soon!")}
              className="flex-1 bg-white/20 backdrop-blur py-3 rounded-xl font-bold text-sm hover:bg-white/30 transition-colors"
            >
              History
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-4 grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white dark:bg-[#1a1a1a] p-3 rounded-xl border border-gray-100 dark:border-white/5 text-center">
          <p className="text-xs text-gray-500 font-bold">Today</p>
          <p className="text-lg font-black text-green-600">
            ₹{partner?.earningsToday}
          </p>
        </div>
        <div className="bg-white dark:bg-[#1a1a1a] p-3 rounded-xl border border-gray-100 dark:border-white/5 text-center">
          <p className="text-xs text-gray-500 font-bold">This Week</p>
          <p className="text-lg font-black">₹8,420</p>
        </div>
        <div className="bg-white dark:bg-[#1a1a1a] p-3 rounded-xl border border-gray-100 dark:border-white/5 text-center">
          <p className="text-xs text-gray-500 font-bold">This Month</p>
          <p className="text-lg font-black">₹32,150</p>
        </div>
      </div>

      {/* Earnings History */}
      <div className="px-4 flex-1">
        <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-3">
          Recent Earnings
        </h3>
        <div className="space-y-2">
          {MOCK_EARNINGS_HISTORY.map((entry, i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#1a1a1a] p-4 rounded-xl border border-gray-100 dark:border-white/5 flex items-center justify-between"
            >
              <div>
                <p className="font-bold">{entry.date}</p>
                <p className="text-sm text-gray-500">
                  {entry.jobs} jobs completed
                </p>
              </div>
              <p className="text-lg font-bold text-green-600">
                +₹{entry.amount}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Payout Info */}
      <div className="p-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-blue-600">
              info
            </span>
            <div>
              <p className="font-bold text-sm">Next Payout: Feb 10</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Payouts are processed every Monday to your linked bank account
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
