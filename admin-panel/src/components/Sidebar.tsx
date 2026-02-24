import React from "react";
import { AdminPage, NavigationProps } from "../types";

interface SidebarProps extends NavigationProps {
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  navigateTo,
  admin,
  sidebarCollapsed,
  setSidebarCollapsed,
  isDarkMode,
  toggleDarkMode,
  onLogout,
}) => {
  const allMenuItems = [
    {
      page: AdminPage.DASHBOARD,
      icon: "dashboard",
      label: "Dashboard",
      roles: ["SUPER_ADMIN", "ADMIN"],
    },
    {
      page: AdminPage.PARTNER_DASHBOARD,
      icon: "dashboard",
      label: "Dashboard",
      roles: ["PARTNER"],
    },
    {
      page: AdminPage.BOOKINGS,
      icon: "calendar_month",
      label: "All Bookings",
      roles: ["SUPER_ADMIN", "ADMIN"],
    },
    {
      page: AdminPage.PARTNER_BOOKINGS,
      icon: "calendar_month",
      label: "My Bookings",
      roles: ["PARTNER"],
    },
    {
      page: AdminPage.USERS,
      icon: "people",
      label: "Customers",
      roles: ["SUPER_ADMIN", "ADMIN"],
    },
    {
      page: AdminPage.PARTNERS,
      icon: "storefront",
      label: "Partners",
      roles: ["SUPER_ADMIN", "ADMIN"],
    },
    {
      page: AdminPage.AREAS,
      icon: "map",
      label: "Service Areas",
      roles: ["SUPER_ADMIN", "ADMIN"],
    },
    {
      page: AdminPage.PROFESSIONALS,
      icon: "engineering",
      label: "Professionals",
      roles: ["SUPER_ADMIN", "ADMIN"],
    },
    {
      page: AdminPage.PARTNER_PROFESSIONALS,
      icon: "engineering",
      label: "My Professionals",
      roles: ["PARTNER"],
    },
    {
      page: AdminPage.SERVICES,
      icon: "home_repair_service",
      label: "Services",
      roles: ["SUPER_ADMIN", "ADMIN"],
    },
    {
      page: AdminPage.REPORTS,
      icon: "analytics",
      label: "Reports",
      roles: ["SUPER_ADMIN", "ADMIN", "PARTNER"],
    },
    {
      page: AdminPage.SETTINGS,
      icon: "settings",
      label: "Settings",
      roles: ["SUPER_ADMIN", "ADMIN", "PARTNER"],
    },
  ];

  const menuItems = allMenuItems.filter((item) =>
    item.roles.includes(admin?.role || ""),
  );

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-black text-white flex flex-col transition-all duration-300 z-50 ${
        sidebarCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-lg">
                local_laundry_service
              </span>
            </div>
            <span className="font-bold text-lg">HomeWash</span>
          </div>
        )}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <span className="material-symbols-outlined">
            {sidebarCollapsed ? "menu" : "menu_open"}
          </span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = currentPage === item.page;
          return (
            <button
              key={item.page}
              onClick={() => navigateTo(item.page)}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                isActive
                  ? "bg-primary text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                {item.icon}
              </span>
              {!sidebarCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 p-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center gap-3 px-2 py-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <span className="material-symbols-outlined">
            {isDarkMode ? "light_mode" : "dark_mode"}
          </span>
          {!sidebarCollapsed && (
            <span className="font-medium text-sm">
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </span>
          )}
        </button>

        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
            {admin?.name.charAt(0)}
          </div>
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{admin?.name}</p>
              <p className="text-xs text-gray-400 truncate">{admin?.role}</p>
            </div>
          )}
          {!sidebarCollapsed && (
            <button
              onClick={onLogout}
              className="p-2 text-gray-400 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
