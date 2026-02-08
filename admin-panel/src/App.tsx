import React, { useState, useEffect } from "react";
import { AdminPage, Admin, NavigationProps } from "./types";
import { MOCK_ADMIN } from "./mockData";
import { adminService } from "./services/api";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { UsersPage } from "./pages/UsersPage";
import { PartnersPage } from "./pages/PartnersPage";
import { BookingsPage } from "./pages/BookingsPage";
import { ServicesPage } from "./pages/ServicesPage";
import { Sidebar } from "./components/Sidebar";

export default function App() {
  const [currentPage, setCurrentPage] = useState<AdminPage>(AdminPage.LOGIN);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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

  const login = async () => {
    // For admin, we can mock it or provide a real login.
    // Usually admin login is handled separately.
    setAdmin(MOCK_ADMIN);
    setCurrentPage(AdminPage.DASHBOARD);
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
      case AdminPage.USERS:
        return <UsersPage {...commonProps} />;
      case AdminPage.PARTNERS:
        return <PartnersPage {...commonProps} />;
      case AdminPage.BOOKINGS:
        return <BookingsPage {...commonProps} />;
      case AdminPage.SERVICES:
        return <ServicesPage {...commonProps} />;
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
