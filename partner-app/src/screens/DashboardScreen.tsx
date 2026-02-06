import React, { useState } from "react";
import { PartnerScreen, NavigationProps, JobStatus } from "../types";

interface DashboardScreenProps extends NavigationProps {
  onLogout: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  navigateTo,
  partner,
  activeJob,
  jobs,
  onLogout,
}) => {
  const [isOnline, setIsOnline] = useState(true);
  const pendingJobs = jobs.filter((j) => j.status === JobStatus.PENDING);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#121212] pb-20">
      {/* Header */}
      <header className="bg-white dark:bg-[#1a1a1a] p-4 shadow-sm border-b border-gray-100 dark:border-white/5 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden ring-2 ring-primary/50">
              <img
                src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=200&h=200"
                alt="Partner"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-bold text-lg">
                Hi, {partner?.name.split(" ")[0]}
              </h2>
              <div className="flex items-center gap-1">
                <span
                  className="material-symbols-outlined text-primary text-[14px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {partner?.rating} • {partner?.tier}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`text-xs font-bold uppercase tracking-wide px-4 py-2 rounded-full transition-all ${
              isOnline
                ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
                : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
            }`}
          >
            {isOnline ? "Online" : "Offline"}
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="p-4 grid grid-cols-2 gap-3">
        <div className="bg-white dark:bg-[#1a1a1a] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-white/5">
          <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">
            Today's Earnings
          </p>
          <p className="text-2xl font-black mt-1 text-green-600">
            ₹{partner?.earningsToday}
          </p>
        </div>
        <div className="bg-white dark:bg-[#1a1a1a] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-white/5">
          <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">
            Completed
          </p>
          <p className="text-2xl font-black mt-1">{partner?.completedJobs}</p>
        </div>
      </div>

      {/* Active Job Card */}
      {activeJob && (
        <div className="px-4 mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-3">
            Active Job
          </h3>
          <div
            onClick={() => navigateTo(PartnerScreen.ACTIVE_JOB)}
            className="bg-primary text-black rounded-xl p-5 shadow-lg cursor-pointer relative overflow-hidden hover:scale-[1.02] transition-transform"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="material-symbols-outlined text-6xl">
                navigation
              </span>
            </div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="bg-black/20 text-xs font-bold px-2 py-1 rounded uppercase">
                    {activeJob.status.replace("_", " ")}
                  </span>
                  <h2 className="text-xl font-bold mt-2">
                    {activeJob.serviceName}
                  </h2>
                  <p className="text-sm opacity-80">{activeJob.address}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">₹{activeJob.amount}</p>
                  <p className="text-xs font-medium">
                    {activeJob.paymentMethod}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>
                <span className="text-sm font-bold">Tap to view details</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Leads */}
      {pendingJobs.length > 0 && (
        <div className="px-4 flex-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500">
              New Leads ({pendingJobs.length})
            </h3>
            <button className="text-primary text-xs font-bold">Refresh</button>
          </div>
          <div className="space-y-3">
            {pendingJobs.slice(0, 3).map((job) => (
              <div
                key={job.id}
                onClick={() => navigateTo(PartnerScreen.JOBS)}
                className="bg-white dark:bg-[#1a1a1a] p-4 rounded-xl border border-gray-100 dark:border-white/5 cursor-pointer hover:border-primary/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-lg">{job.serviceName}</h4>
                  <span className="text-lg font-bold text-green-600">
                    ₹{job.amount}
                  </span>
                </div>
                <p className="text-gray-500 text-sm">
                  {job.distance} away • {job.duration}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {pendingJobs.length === 0 && !activeJob && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">
            work_off
          </span>
          <h3 className="font-bold text-lg mb-2">No jobs available</h3>
          <p className="text-gray-500 text-sm">
            Stay online to receive new job requests
          </p>
        </div>
      )}
    </div>
  );
};
