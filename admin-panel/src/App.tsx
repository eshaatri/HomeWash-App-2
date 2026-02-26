import { useState, useEffect } from "react";
import { AdminPage, Admin, NavigationProps } from "./types";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { UsersPage } from "./pages/UsersPage";
import { ProfessionalsPage } from "./pages/ProfessionalsPage";
import { BookingsPage } from "./pages/BookingsPage";
import { ServicesPage } from "./pages/ServicesPage";
import { PartnersPage } from "./pages/PartnersPage";
import { AreasPage } from "./pages/AreasPage";
import { PartnerDashboardPage } from "./pages/PartnerDashboardPage";
import { PartnerBookingsPage } from "./pages/PartnerBookingsPage";
import { PartnerProfessionalsPage } from "./pages/PartnerProfessionalsPage";
import { PartnerServiceConfigPage } from "./pages/PartnerServiceConfigPage";
import { ReportsPage } from "./pages/ReportsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { Sidebar } from "./components/Sidebar";

export default function App() {
  const [currentPage, setCurrentPage] = useState<AdminPage>(AdminPage.LOGIN);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState<
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

  const login = async (role: "ADMIN" | "PARTNER" = "ADMIN") => {
    // Lightweight local session without mock/demo identities.
    const baseAdmin: Admin = {
      id: role === "ADMIN" ? "admin" : "partner",
      name: role === "ADMIN" ? "Admin User" : "Partner User",
      email: "",
      role: role,
    };
    setAdmin(baseAdmin);
    setCurrentPage(
      role === "PARTNER" ? AdminPage.PARTNER_DASHBOARD : AdminPage.DASHBOARD,
    );
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
      case AdminPage.PARTNER_DASHBOARD:
        return <PartnerDashboardPage {...commonProps} />;
      case AdminPage.PARTNER_BOOKINGS:
        return <PartnerBookingsPage {...commonProps} />;
      case AdminPage.PARTNER_PROFESSIONALS:
        return <PartnerProfessionalsPage {...commonProps} />;
      case AdminPage.USERS:
        return <UsersPage {...commonProps} />;
      case AdminPage.PROFESSIONALS:
        return <ProfessionalsPage {...commonProps} />;
      case AdminPage.BOOKINGS:
        return <BookingsPage {...commonProps} />;
      case AdminPage.SERVICES:
        return <ServicesPage {...commonProps} />;
      case AdminPage.PARTNERS:
        return (
          <PartnersPage
            {...commonProps}
            onManageServices={(id: string) => {
              setSelectedPartnerId(id);
              navigateTo(AdminPage.PARTNER_SERVICE_CONFIG);
            }}
          />
        );
      case AdminPage.AREAS:
        return <AreasPage {...commonProps} />;
      case AdminPage.REPORTS:
        return <ReportsPage {...commonProps} />;
      case AdminPage.SETTINGS:
        return <SettingsPage {...commonProps} />;
      case AdminPage.PARTNER_SERVICE_CONFIG:
        return (
          <PartnerServiceConfigPage
            {...commonProps}
            selectedPartnerId={selectedPartnerId}
            onBack={() => navigateTo(AdminPage.PARTNERS)}
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
