import { useState, useEffect } from "react";
import {
  ProfessionalScreen,
  Professional,
  Job,
  JobStatus,
  NavigationProps,
} from "./types";
import { professionalService } from "./services/api";
import { LoginScreen } from "./screens/LoginScreen";
import { DashboardScreen } from "./screens/DashboardScreen";
import { JobsScreen } from "./screens/JobsScreen";
import { ActiveJobScreen } from "./screens/ActiveJobScreen";
import { WalletScreen } from "./screens/WalletScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import { BottomNav } from "./components/BottomNav";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ProfessionalScreen>(
    ProfessionalScreen.LOGIN,
  );
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeJob, setActiveJob] = useState<Job | null>(null);

  const fetchJobs = async () => {
    if (!professional) return;
    try {
      const professionalId = professional.id || professional._id || "";
      if (!professionalId) return;
      const data = await professionalService.getJobs(professionalId);
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

  // Fetch jobs when professional logs in
  useEffect(() => {
    fetchJobs();
  }, [professional]);

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

  const navigateTo = (screen: ProfessionalScreen) => {
    window.scrollTo(0, 0);
    setCurrentScreen(screen);
  };

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const login = async (phone: string) => {
    try {
      const userData = await professionalService.login(phone);
      setProfessional(userData);
      setCurrentScreen(ProfessionalScreen.DASHBOARD);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = () => {
    setProfessional(null);
    setActiveJob(null);
    setCurrentScreen(ProfessionalScreen.LOGIN);
  };

  const acceptJob = async (jobId: string) => {
    try {
      const updatedJob = await professionalService.updateJobStatus(
        jobId,
        "PROFESSIONAL_ASSIGNED" as any,
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
        navigateTo(ProfessionalScreen.ACTIVE_JOB);
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

      await professionalService.updateJobStatus(jobId, apiStatus as any);

      setJobs((prev) =>
        prev.map((job) => (job.id === jobId ? { ...job, status } : job)),
      );
      if (activeJob?.id === jobId) {
        setActiveJob({ ...activeJob, status });
        if (status === JobStatus.COMPLETED) {
          setActiveJob(null);
          // Update stats locally for immediate feedback
          if (professional) {
            setProfessional({
              ...professional,
              completedJobs: (professional.completedJobs || 0) + 1,
              walletBalance:
                (professional.walletBalance || 0) + (activeJob.amount || 0),
              earningsToday:
                (professional.earningsToday || 0) + (activeJob.amount || 0),
            });
          }
          navigateTo(ProfessionalScreen.DASHBOARD);
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
    professional,
    setProfessional,
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
      case ProfessionalScreen.LOGIN:
        return <LoginScreen {...commonProps} onLogin={login} />;
      case ProfessionalScreen.DASHBOARD:
        return <DashboardScreen {...commonProps} onLogout={logout} />;
      case ProfessionalScreen.JOBS:
        return <JobsScreen {...commonProps} />;
      case ProfessionalScreen.ACTIVE_JOB:
        return <ActiveJobScreen {...commonProps} />;
      case ProfessionalScreen.WALLET:
        return <WalletScreen {...commonProps} />;
      case ProfessionalScreen.PROFILE:
        return <ProfileScreen {...commonProps} onLogout={logout} />;
      default:
        return <DashboardScreen {...commonProps} onLogout={logout} />;
    }
  };

  const showBottomNav =
    professional && currentScreen !== ProfessionalScreen.LOGIN;

  return (
    <div className="flex min-h-screen bg-gray-200 dark:bg-[#050505] justify-center transition-colors duration-300">
      <div className="w-full max-w-md h-full min-h-screen bg-white dark:bg-black shadow-2xl overflow-hidden relative">
        {renderScreen()}
        {showBottomNav && <BottomNav {...commonProps} />}
      </div>
    </div>
  );
}
