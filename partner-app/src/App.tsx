import { useState, useEffect } from "react";
import {
  PartnerScreen,
  Partner,
  Job,
  JobStatus,
  NavigationProps,
} from "./types";
import { partnerService } from "./services/api";
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
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeJob, setActiveJob] = useState<Job | null>(null);

  const fetchJobs = async () => {
    if (!partner) return;
    try {
      const partnerId = partner.id || partner._id || "";
      if (!partnerId) return;
      const data = await partnerService.getJobs(partnerId);
      // Map back to our view format if needed
      const mappedJobs = data.map((j: any) => ({
        ...j,
        id: j._id, // Ensure frontend uses .id
      }));
      setJobs(mappedJobs);
      // Check for active job
      const active = mappedJobs.find(
        (j: any) =>
          j.status !== "COMPLETED" &&
          j.status !== "CANCELLED" &&
          j.status !== "PENDING",
      );
      if (active) setActiveJob(active);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    }
  };

  // Fetch jobs when partner logs in
  useEffect(() => {
    fetchJobs();
  }, [partner]);

  const refreshJobs = () => fetchJobs();

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

  const login = async (phone: string) => {
    try {
      const userData = await partnerService.login(phone);
      setPartner(userData);
      setCurrentScreen(PartnerScreen.DASHBOARD);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = () => {
    setPartner(null);
    setActiveJob(null);
    setCurrentScreen(PartnerScreen.LOGIN);
  };

  const acceptJob = async (jobId: string) => {
    try {
      const updatedJob = await partnerService.updateJobStatus(
        jobId,
        "PARTNER_ASSIGNED" as any,
      );
      setJobs((prev) =>
        prev.map((job) =>
          job.id === jobId ? { ...job, status: JobStatus.ACCEPTED } : job,
        ),
      );
      if (updatedJob) {
        setActiveJob({
          ...updatedJob,
          id: updatedJob._id,
          status: JobStatus.ACCEPTED,
        });
        navigateTo(PartnerScreen.ACTIVE_JOB);
      }
    } catch (error) {
      console.error("Failed to accept job:", error);
    }
  };

  const rejectJob = async (jobId: string) => {
    if (confirm("Are you sure you want to reject this job?")) {
      // For now, we just filter it out locally to simulate rejection
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
      alert("Job rejected.");
    }
  };

  const updateJobStatus = async (jobId: string, status: JobStatus) => {
    try {
      // Map JobStatus to BookingStatus for API if necessary
      let apiStatus = status as string;
      if (status === JobStatus.COMPLETED) apiStatus = "COMPLETED";
      if (status === JobStatus.IN_PROGRESS) apiStatus = "IN_PROGRESS";

      await partnerService.updateJobStatus(jobId, apiStatus as any);

      setJobs((prev) =>
        prev.map((job) => (job.id === jobId ? { ...job, status } : job)),
      );
      if (activeJob?.id === jobId) {
        setActiveJob({ ...activeJob, status });
        if (status === JobStatus.COMPLETED) {
          setActiveJob(null);
          // Update partner stats locally for immediate feedback
          if (partner) {
            setPartner({
              ...partner,
              completedJobs: (partner.completedJobs || 0) + 1,
              walletBalance:
                (partner.walletBalance || 0) + (activeJob.amount || 0),
              earningsToday:
                (partner.earningsToday || 0) + (activeJob.amount || 0),
            });
          }
          navigateTo(PartnerScreen.DASHBOARD);
        }
      }
    } catch (error) {
      console.error("Failed to update job status:", error);
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
    rejectJob,
    updateJobStatus,
    refreshJobs,
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
