import React, { useState, useEffect } from "react";
import {
  PartnerScreen,
  Partner,
  Job,
  JobStatus,
  NavigationProps,
} from "./types";
import { MOCK_PARTNER, MOCK_JOBS } from "./mockData";
import { LoginScreen } from "./screens/LoginScreen";
import { DashboardScreen } from "./screens/DashboardScreen";
import { JobsScreen } from "./screens/JobsScreen";
import { ActiveJobScreen } from "./screens/ActiveJobScreen";
import { WalletScreen } from "./screens/WalletScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import { BottomNav } from "./components/BottomNav";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<PartnerScreen>(
    PartnerScreen.LOGIN,
  );
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [activeJob, setActiveJob] = useState<Job | null>(null);

  // Apply Dark Mode class
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  const navigateTo = (screen: PartnerScreen) => {
    window.scrollTo(0, 0);
    setCurrentScreen(screen);
  };

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const login = () => {
    setPartner(MOCK_PARTNER);
    setCurrentScreen(PartnerScreen.DASHBOARD);
  };

  const logout = () => {
    setPartner(null);
    setActiveJob(null);
    setCurrentScreen(PartnerScreen.LOGIN);
  };

  const acceptJob = (jobId: string) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, status: JobStatus.ACCEPTED } : job,
      ),
    );
    const accepted = jobs.find((j) => j.id === jobId);
    if (accepted) {
      setActiveJob({ ...accepted, status: JobStatus.ACCEPTED });
      navigateTo(PartnerScreen.ACTIVE_JOB);
    }
  };

  const updateJobStatus = (jobId: string, status: JobStatus) => {
    setJobs((prev) =>
      prev.map((job) => (job.id === jobId ? { ...job, status } : job)),
    );
    if (activeJob?.id === jobId) {
      setActiveJob({ ...activeJob, status });
      if (status === JobStatus.COMPLETED) {
        setActiveJob(null);
        navigateTo(PartnerScreen.DASHBOARD);
      }
    }
  };

  const commonProps: NavigationProps = {
    currentScreen,
    navigateTo,
    isDarkMode,
    toggleDarkMode,
    partner,
    setPartner,
    jobs,
    activeJob,
    setActiveJob,
    acceptJob,
    updateJobStatus,
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case PartnerScreen.LOGIN:
        return <LoginScreen {...commonProps} onLogin={login} />;
      case PartnerScreen.DASHBOARD:
        return <DashboardScreen {...commonProps} onLogout={logout} />;
      case PartnerScreen.JOBS:
        return <JobsScreen {...commonProps} />;
      case PartnerScreen.ACTIVE_JOB:
        return <ActiveJobScreen {...commonProps} />;
      case PartnerScreen.WALLET:
        return <WalletScreen {...commonProps} />;
      case PartnerScreen.PROFILE:
        return <ProfileScreen {...commonProps} onLogout={logout} />;
      default:
        return <DashboardScreen {...commonProps} onLogout={logout} />;
    }
  };

  const showBottomNav = partner && currentScreen !== PartnerScreen.LOGIN;

  return (
    <div className="flex min-h-screen bg-gray-200 dark:bg-[#050505] justify-center transition-colors duration-300">
      <div className="w-full max-w-md h-full min-h-screen bg-white dark:bg-black shadow-2xl overflow-hidden relative">
        {renderScreen()}
        {showBottomNav && <BottomNav {...commonProps} />}
      </div>
    </div>
  );
}
