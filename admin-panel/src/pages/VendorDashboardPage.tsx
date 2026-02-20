import React, { useState, useEffect } from "react";
import { NavigationProps, Booking, AdminPage } from "../types";
import { vendorService } from "../services/api";

export const VendorDashboardPage: React.FC<NavigationProps> = ({
  admin,
  navigateTo,
}) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (admin?.vendorId) {
        try {
          const data = await vendorService.getStats(admin.vendorId);
          setStats(data);
        } catch (error) {
          console.error("Failed to fetch vendor stats:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchStats();
  }, [admin?.vendorId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "CANCELLED":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading dashboard...</div>;
  }

  const statCards = [
    {
      label: "Total Revenue",
      value: `₹${stats?.totalRevenue?.toLocaleString() || 0}`,
      icon: "payments",
      color: "green",
    },
    {
      label: "Total Bookings",
      value: stats?.totalBookings || 0,
      icon: "calendar_month",
      color: "blue",
    },
    {
      label: "Active Partners",
      value: stats?.activePartners || 0,
      icon: "engineering",
      color: "purple",
    },
    {
      label: "Vendor Commission",
      value: `${admin?.role === "VENDOR" ? "20%" : "N/A"}`,
      icon: "percent",
      color: "orange",
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
          Franchise Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Welcome back, {admin?.name}. Here's your performance summary.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  stat.color === "green"
                    ? "bg-green-50 text-green-600"
                    : stat.color === "blue"
                      ? "bg-blue-50 text-blue-600"
                      : stat.color === "purple"
                        ? "bg-purple-50 text-purple-600"
                        : "bg-orange-50 text-orange-600"
                }`}
              >
                <span className="material-symbols-outlined">{stat.icon}</span>
              </div>
            </div>
            <p className="text-3xl font-black text-gray-900 dark:text-white">
              {stat.value}
            </p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-50 dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-lg font-black uppercase tracking-tighter">
              Recent Assigned Bookings
            </h2>
            <button
              onClick={() => navigateTo(AdminPage.VENDOR_BOOKINGS)}
              className="text-primary text-xs font-bold uppercase tracking-widest hover:underline"
            >
              View All
            </button>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-700">
            {stats?.recentBookings?.length > 0 ? (
              stats.recentBookings.map((booking: Booking) => (
                <div
                  key={booking.id}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-500">
                        #{booking.id}
                      </span>
                      <span className="font-bold text-sm tracking-tight">
                        {booking.serviceName}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${getStatusColor(booking.status)}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">
                        person
                      </span>
                      <span className="font-medium">
                        {booking.customerName}
                      </span>
                    </div>
                    <span className="font-black text-gray-900 dark:text-white text-sm">
                      ₹{booking.amount}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                No recent bookings found
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-lg font-black uppercase tracking-tighter mb-6">
            Quick Actions
          </h2>
          <div className="grid gap-3">
            <button
              onClick={() => navigateTo(AdminPage.VENDOR_PARTNERS)}
              className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <span className="material-symbols-outlined">engineering</span>
              </div>
              <div>
                <p className="font-black uppercase tracking-widest text-[10px] text-gray-400">
                  Team
                </p>
                <p className="font-bold text-sm">Manage Partners</p>
              </div>
            </button>
            <button className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-primary/50 hover:bg-primary/5 transition-all text-left">
              <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                <span className="material-symbols-outlined">analytics</span>
              </div>
              <div>
                <p className="font-black uppercase tracking-widest text-[10px] text-gray-400">
                  Reports
                </p>
                <p className="font-bold text-sm">View Earnings</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
