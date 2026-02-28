import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
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
  const socketRef = useRef<Socket | null>(null);
  const locationWatchIdRef = useRef<number | null>(null);
  const lastLocationSentRef = useRef<number>(0);
  const LOCATION_THROTTLE_MS = 10000; // send at most every 10s

  const [isProfessionalOnline, setIsProfessionalOnline] = useState(true);

  const setProfessionalOnline = (online: boolean) => {
    setIsProfessionalOnline(online);
    if (socketRef.current) {
      socketRef.current.emit("professional:setOnline", { isOnline: online });
    }
  };

  // When online, send realtime GPS to backend for booking assignment
  useEffect(() => {
    if (!isProfessionalOnline || !professional) {
      if (locationWatchIdRef.current != null) {
        navigator.geolocation.clearWatch(locationWatchIdRef.current);
        locationWatchIdRef.current = null;
      }
      return;
    }
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const now = Date.now();
        if (now - lastLocationSentRef.current < LOCATION_THROTTLE_MS) return;
        lastLocationSentRef.current = now;
        const { latitude, longitude } = position.coords;
        if (socketRef.current) {
          socketRef.current.emit("professional:location", {
            lat: latitude,
            lng: longitude,
          });
        }
      },
      (err) => {
        console.warn("Geolocation error:", err.message);
      },
      { enableHighAccuracy: true, maximumAge: 30000, timeout: 10000 },
    );
    locationWatchIdRef.current = watchId;
    return () => {
      navigator.geolocation.clearWatch(watchId);
      locationWatchIdRef.current = null;
    };
  }, [isProfessionalOnline, professional]);

  // Temporary: set address for testing booking flow (persisted; remove when using live location)
  const [testAddress, setTestAddressState] = useState<string>(() => {
    try {
      return localStorage.getItem("partner_app_test_address") || "";
    } catch {
      return "";
    }
  });
  const [testAddressLine2, setTestAddressLine2State] = useState<string>(() => {
    try {
      return localStorage.getItem("partner_app_test_address_line2") || "";
    } catch {
      return "";
    }
  });
  const [testLat, setTestLat] = useState<number | undefined>(() => {
    try {
      const v = localStorage.getItem("partner_app_test_lat");
      return v ? parseFloat(v) : undefined;
    } catch {
      return undefined;
    }
  });
  const [testLng, setTestLng] = useState<number | undefined>(() => {
    try {
      const v = localStorage.getItem("partner_app_test_lng");
      return v ? parseFloat(v) : undefined;
    } catch {
      return undefined;
    }
  });
  const setTestAddress = (
    address: string,
    addressLine2?: string,
    lat?: number,
    lng?: number,
  ) => {
    setTestAddressState(address);
    setTestAddressLine2State(addressLine2 ?? "");
    setTestLat(lat);
    setTestLng(lng);
    try {
      localStorage.setItem("partner_app_test_address", address);
      localStorage.setItem("partner_app_test_address_line2", addressLine2 ?? "");
      if (lat != null) localStorage.setItem("partner_app_test_lat", String(lat));
      if (lng != null) localStorage.setItem("partner_app_test_lng", String(lng));
    } catch (_) {}
  };

  // Realtime: connect as professional so admin sees online status
  useEffect(() => {
    const id = professional?.id || (professional as any)?._id;
    if (!id) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }
    const socket = io("http://localhost:5000", { transports: ["websocket", "polling"] });
    socketRef.current = socket;
    socket.emit("professional:identify", { professionalId: id });
    socket.emit("professional:setOnline", { isOnline: isProfessionalOnline });

    socket.on("professional:suspended", () => {
      setIsProfessionalOnline(false);
      setProfessional((prev) =>
        prev ? { ...prev, status: "SUSPENDED" } : null,
      );
    });

    socket.on("professional:status", (payload: { id: string; status: string }) => {
      const myId = professional?.id || (professional as any)?._id;
      if (payload?.id === myId && payload?.status === "SUSPENDED") {
        setIsProfessionalOnline(false);
        setProfessional((prev) =>
          prev ? { ...prev, status: "SUSPENDED" } : null,
        );
      }
    });

    return () => {
      socket.off("professional:suspended");
      socket.off("professional:status");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [professional]);

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
      const status = userData.status || "ACTIVE";
      setProfessional({
        ...userData,
        id: userData.id || userData._id,
        rating: userData.rating ?? 0,
        completedJobs: userData.completedJobs ?? 0,
        walletBalance: userData.walletBalance ?? 0,
        earningsToday: userData.earningsToday ?? 0,
        tier: userData.tier || "SILVER",
        status,
      });
      setIsProfessionalOnline(status !== "SUSPENDED");
      setCurrentScreen(ProfessionalScreen.DASHBOARD);
    } catch (error: any) {
      console.error("Login failed:", error);
      const message =
        error.response?.data?.message ||
        "Login failed. This phone may not be registered as a professional.";
      alert(message);
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
    isProfessionalOnline,
    setProfessionalOnline,
    testAddress,
    testAddressLine2,
    testLat,
    testLng,
    setTestAddress,
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
