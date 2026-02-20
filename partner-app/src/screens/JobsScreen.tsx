import React, { useState } from "react";
import { PartnerScreen, NavigationProps, JobStatus } from "../types";

export const JobsScreen: React.FC<NavigationProps> = ({
  navigateTo,
  jobs,
  acceptJob,
  rejectJob,
  setActiveJob,
  refreshJobs,
}) => {
  const [filter, setFilter] = useState<"available" | "accepted" | "history">(
    "available",
  );

  const pendingJobs = jobs.filter((j) => j.status === JobStatus.PENDING);
  const acceptedJobs = jobs.filter((j) =>
    [
      JobStatus.ACCEPTED,
      JobStatus.EN_ROUTE,
      JobStatus.ARRIVED,
      JobStatus.IN_PROGRESS,
    ].includes(j.status),
  );
  const completedJobs = jobs.filter((j) => j.status === JobStatus.COMPLETED);

  const displayJobs =
    filter === "available"
      ? pendingJobs
      : filter === "accepted"
        ? acceptedJobs
        : completedJobs;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#121212] pb-20">
      {/* Header */}
      <header className="bg-white dark:bg-[#1a1a1a] px-4 py-4 border-b border-gray-100 dark:border-white/5 sticky top-0 z-30 flex items-center justify-between">
        <h1 className="text-xl font-bold">Jobs</h1>
        <button
          onClick={refreshJobs}
          className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
        >
          <span className="material-symbols-outlined text-primary">
            refresh
          </span>
        </button>
      </header>

      {/* Filter Tabs */}
      <div className="flex gap-2 p-4 bg-white dark:bg-[#1a1a1a] border-b border-gray-100 dark:border-white/5">
        {[
          { key: "available", label: "Available", count: pendingJobs.length },
          { key: "accepted", label: "Accepted", count: acceptedJobs.length },
          { key: "history", label: "History", count: completedJobs.length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as typeof filter)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all ${
              filter === tab.key
                ? "bg-primary text-black"
                : "bg-gray-100 dark:bg-[#252525] text-gray-600 dark:text-gray-400"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Job List */}
      <div className="flex-1 p-4 space-y-3">
        {displayJobs.map((job) => (
          <div
            key={job.id}
            className="bg-white dark:bg-[#1a1a1a] p-4 rounded-xl border border-gray-100 dark:border-white/5"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-bold text-lg">{job.serviceName}</h4>
                <p className="text-gray-500 text-sm">{job.customerName}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-green-600">
                  ₹{job.amount}
                </p>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    job.paymentMethod === "CASH"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {job.paymentMethod}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2 mb-3 text-sm text-gray-600 dark:text-gray-400">
              <span className="material-symbols-outlined text-[18px]">
                location_on
              </span>
              <div>
                <p>{job.address}</p>
                <p className="text-xs">{job.addressLine2}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">
                  directions_walk
                </span>
                {job.distance}
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">
                  schedule
                </span>
                {job.duration}
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">
                  event
                </span>
                {job.scheduledTime}
              </span>
            </div>

            {filter === "available" && (
              <div className="flex gap-2">
                <button
                  onClick={() => rejectJob(job.id || job._id || "")}
                  className="flex-1 border border-gray-200 dark:border-white/20 py-3 rounded-lg text-sm font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={() => acceptJob(job.id || job._id || "")}
                  className="flex-1 bg-green-500 text-white py-3 rounded-lg text-sm font-bold shadow-lg shadow-green-500/20 hover:bg-green-600 transition-colors"
                >
                  Accept
                </button>
              </div>
            )}

            {filter === "accepted" && (
              <button
                onClick={() => {
                  setActiveJob(job);
                  navigateTo(PartnerScreen.ACTIVE_JOB);
                }}
                className="w-full bg-primary text-black py-3 rounded-lg text-sm font-bold hover:bg-primary-dim transition-colors"
              >
                View Details
              </button>
            )}
          </div>
        ))}

        {displayJobs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600 mb-3">
              {filter === "available"
                ? "inbox"
                : filter === "accepted"
                  ? "work_off"
                  : "history"}
            </span>
            <p className="text-gray-500">No {filter} jobs</p>
          </div>
        )}
      </div>
    </div>
  );
};
