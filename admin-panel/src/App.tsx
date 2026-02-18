import { useState, useEffect } from "react";
import { AdminPage, Admin, NavigationProps } from "./types";
import { MOCK_ADMIN, MOCK_VENDOR_ADMIN } from "./mockData";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { UsersPage } from "./pages/UsersPage";
import { PartnersPage } from "./pages/PartnersPage";
import { BookingsPage } from "./pages/BookingsPage";
import { ServicesPage } from "./pages/ServicesPage";
import { VendorsPage } from "./pages/VendorsPage";
import { AreasPage } from "./pages/AreasPage";
import { VendorDashboardPage } from "./pages/VendorDashboardPage";
import { VendorBookingsPage } from "./pages/VendorBookingsPage";
import { VendorPartnersPage } from "./pages/VendorPartnersPage";
import { VendorServiceConfigPage } from "./pages/VendorServiceConfigPage";
import { Sidebar } from "./components/Sidebar";

export default function App() {
  const [currentPage, setCurrentPage] = useState<AdminPage>(AdminPage.LOGIN);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState<
    string | undefined
  >();

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  const navigateTo = (page: AdminPage) => {
    setCurrentPage(page);
  };

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const login = async (role: "ADMIN" | "VENDOR" = "ADMIN") => {
    // For testing roles
    if (role === "VENDOR") {
      setAdmin(MOCK_VENDOR_ADMIN);
      setCurrentPage(AdminPage.VENDOR_DASHBOARD);
    } else {
      setAdmin(MOCK_ADMIN);
      setCurrentPage(AdminPage.DASHBOARD);
    }
  };

  const logout = () => {
    setAdmin(null);
    setCurrentPage(AdminPage.LOGIN);
  };

  const commonProps: NavigationProps = {
    currentPage,
    navigateTo,
    isDarkMode,
    toggleDarkMode,
    admin,
    sidebarCollapsed,
    setSidebarCollapsed,
  };

  const renderPage = () => {
    switch (currentPage) {
      case AdminPage.LOGIN:
        return <LoginPage {...commonProps} onLogin={login} />;
      case AdminPage.DASHBOARD:
        return <DashboardPage {...commonProps} />;
      case AdminPage.VENDOR_DASHBOARD:
        return <VendorDashboardPage {...commonProps} />;
      case AdminPage.VENDOR_BOOKINGS:
        return <VendorBookingsPage {...commonProps} />;
      case AdminPage.VENDOR_PARTNERS:
        return <VendorPartnersPage {...commonProps} />;
      case AdminPage.USERS:
        return <UsersPage {...commonProps} />;
      case AdminPage.PARTNERS:
        return <PartnersPage {...commonProps} />;
      case AdminPage.BOOKINGS:
        return <BookingsPage {...commonProps} />;
      case AdminPage.SERVICES:
        return <ServicesPage {...commonProps} />;
      case AdminPage.VENDORS:
        return (
          <VendorsPage
            {...commonProps}
            onManageServices={(id: string) => {
              setSelectedVendorId(id);
              navigateTo(AdminPage.VENDOR_SERVICE_CONFIG);
            }}
          />
        );
      case AdminPage.AREAS:
        return <AreasPage {...commonProps} />;
      case AdminPage.VENDOR_SERVICE_CONFIG:
        return (
          <VendorServiceConfigPage
            {...commonProps}
            selectedVendorId={selectedVendorId}
            onBack={() => navigateTo(AdminPage.VENDORS)}
          />
        );
      default:
        return <DashboardPage {...commonProps} />;
    }
  };

  if (!admin) {
    return <LoginPage {...commonProps} onLogin={login} />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar {...commonProps} onLogout={logout} />
      <main
        className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? "ml-20" : "ml-64"}`}
      >
        {renderPage()}
      </main>
    </div>
  );
}
