import React, { useState } from "react";
import { PartnerScreen, NavigationProps, JobStatus } from "../types";
import MapComponent from "../components/MapComponent";

export const ActiveJobScreen: React.FC<NavigationProps> = ({
  navigateTo,
  activeJob,
  updateJobStatus,
}) => {
  const [otpInput, setOtpInput] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);

  if (!activeJob) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#121212] items-center justify-center">
        <span className="material-symbols-outlined text-5xl text-gray-400 mb-4">
          work_off
        </span>
        <p className="text-gray-500">No active job</p>
        <button
          onClick={() => navigateTo(PartnerScreen.JOBS)}
          className="mt-4 text-primary font-bold"
        >
          View Available Jobs
        </button>
      </div>
    );
  }

  const getNextStatus = () => {
    switch (activeJob.status) {
      case JobStatus.ACCEPTED:
        return JobStatus.EN_ROUTE;
      case JobStatus.EN_ROUTE:
        return JobStatus.ARRIVED;
      case JobStatus.ARRIVED:
        return JobStatus.IN_PROGRESS;
      case JobStatus.IN_PROGRESS:
        return JobStatus.COMPLETED;
      default:
        return null;
    }
  };

  const getActionText = () => {
    switch (activeJob.status) {
      case JobStatus.ACCEPTED:
        return "Start Navigation";
      case JobStatus.EN_ROUTE:
        return "Mark as Arrived";
      case JobStatus.ARRIVED:
        return "Start Service";
      case JobStatus.IN_PROGRESS:
        return "Complete Job";
      default:
        return "Update Status";
    }
  };

  const handleAction = () => {
    const nextStatus = getNextStatus();
    if (nextStatus === JobStatus.IN_PROGRESS) {
      setShowOtpModal(true);
    } else if (nextStatus) {
      updateJobStatus(activeJob.id, nextStatus);
    }
  };

  const handleOtpVerify = () => {
    if (otpInput === activeJob.otpStart) {
      updateJobStatus(activeJob.id, JobStatus.IN_PROGRESS);
      setShowOtpModal(false);
      setOtpInput("");
    }
  };

  const statusSteps = [
    { status: JobStatus.ACCEPTED, label: "Accepted", icon: "check_circle" },
    { status: JobStatus.EN_ROUTE, label: "En Route", icon: "directions_car" },
    { status: JobStatus.ARRIVED, label: "Arrived", icon: "location_on" },
    {
      status: JobStatus.IN_PROGRESS,
      label: "In Progress",
      icon: "cleaning_services",
    },
    { status: JobStatus.COMPLETED, label: "Completed", icon: "task_alt" },
  ];

  const currentStepIndex = statusSteps.findIndex(
    (s) => s.status === activeJob.status,
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#121212] pb-20">
      {/* Header */}
      <header className="bg-white dark:bg-[#1a1a1a] px-4 py-4 border-b border-gray-100 dark:border-white/5 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo(PartnerScreen.DASHBOARD)}
            className="p-2 -ml-2"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="font-bold">Active Job</h1>
            <p className="text-xs text-gray-500">#{activeJob.id}</p>
          </div>
        </div>
      </header>

      {/* Status Progress */}
      <div className="bg-white dark:bg-[#1a1a1a] p-4 border-b border-gray-100 dark:border-white/5">
        <div className="flex justify-between">
          {statusSteps.slice(0, 4).map((step, i) => (
            <div
              key={step.status}
              className="flex flex-col items-center flex-1"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                  i <= currentStepIndex
                    ? "bg-primary text-black"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                }`}
              >
                <span
                  className="material-symbols-outlined text-[16px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {step.icon}
                </span>
              </div>
              <span
                className={`text-[10px] font-bold ${i <= currentStepIndex ? "text-primary" : "text-gray-400"}`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Job Details */}
      <div className="p-4 space-y-4">
        {/* Service Info */}
        <div className="bg-white dark:bg-[#1a1a1a] p-4 rounded-xl border border-gray-100 dark:border-white/5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold">{activeJob.serviceName}</h2>
              <p className="text-gray-500 text-sm">{activeJob.duration}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">
                ₹{activeJob.amount}
              </p>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded ${
                  activeJob.paymentMethod === "CASH"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {activeJob.paymentMethod}
              </span>
            </div>
          </div>

          {activeJob.otpStart && activeJob.status === JobStatus.ARRIVED && (
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 mb-4">
              <p className="text-xs font-bold text-primary uppercase tracking-wide mb-1">
                Start OTP
              </p>
              <p className="text-2xl font-black tracking-[0.2em]">
                {activeJob.otpStart}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Ask customer for this OTP to start service
              </p>
            </div>
          )}
        </div>

        {/* Customer Info */}
        <div className="bg-white dark:bg-[#1a1a1a] p-4 rounded-xl border border-gray-100 dark:border-white/5">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
            Customer
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold">{activeJob.customerName}</p>
              <p className="text-sm text-gray-500">{activeJob.customerPhone}</p>
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center">
                <span className="material-symbols-outlined">call</span>
              </button>
              <button className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
                <span className="material-symbols-outlined">chat</span>
              </button>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white dark:bg-[#1a1a1a] p-4 rounded-xl border border-gray-100 dark:border-white/5">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
            Location
          </h3>
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-primary">
              location_on
            </span>
            <div>
              <p className="font-bold">{activeJob.address}</p>
              <p className="text-sm text-gray-500">{activeJob.addressLine2}</p>
            </div>
          </div>
          <div className="h-48 w-full mt-4 rounded-xl overflow-hidden shadow-sm">
            <MapComponent
              destLat={activeJob.lat || 19.076}
              destLng={activeJob.lng || 72.8777}
            />
          </div>
        </div>
      </div>

      {/* Action Button */}
      {activeJob.status !== JobStatus.COMPLETED && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-md px-4">
          <button
            onClick={handleAction}
            className="w-full bg-primary text-black py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/30 hover:bg-primary-dim transition-colors"
          >
            {getActionText()}
          </button>
        </div>
      )}

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-xl font-bold mb-2">Enter Start OTP</h3>
            <p className="text-sm text-gray-500 mb-4">
              Ask the customer for the OTP to start the service
            </p>
            <input
              type="text"
              value={otpInput}
              onChange={(e) =>
                setOtpInput(e.target.value.replace(/\D/g, "").slice(0, 4))
              }
              placeholder="Enter 4-digit OTP"
              className="w-full h-14 px-4 rounded-xl bg-gray-100 dark:bg-[#252525] border border-gray-200 dark:border-white/10 focus:outline-none focus:border-primary font-medium text-center text-2xl tracking-[0.5em] mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowOtpModal(false)}
                className="flex-1 border border-gray-200 dark:border-white/20 py-3 rounded-lg font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleOtpVerify}
                className="flex-1 bg-primary text-black py-3 rounded-lg font-bold"
              >
                Verify
              </button>
            </div>
            <p className="text-xs text-center text-gray-500 mt-3">
              Demo OTP: {activeJob.otpStart}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
