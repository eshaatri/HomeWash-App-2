import React from "react";
import { AdminPage, NavigationProps } from "../types";
import { MOCK_STATS, MOCK_BOOKINGS, RECENT_ACTIVITY } from "../mockData";

export const DashboardPage: React.FC<NavigationProps> = ({ navigateTo }) => {
  const stats = [
    {
      label: "Total Revenue",
      value: `₹${MOCK_STATS.totalRevenue.toLocaleString()}`,
      change: MOCK_STATS.revenueChange,
      icon: "payments",
      color: "green",
    },
    {
      label: "Total Bookings",
      value: MOCK_STATS.totalBookings.toLocaleString(),
      change: MOCK_STATS.bookingsChange,
      icon: "calendar_month",
      color: "blue",
    },
    {
      label: "Active Partners",
      value: MOCK_STATS.activePartners.toString(),
      change: MOCK_STATS.partnersChange,
      icon: "engineering",
      color: "purple",
    },
    {
      label: "Active Users",
      value: MOCK_STATS.activeUsers.toLocaleString(),
      change: MOCK_STATS.usersChange,
      icon: "people",
      color: "orange",
    },
  ];

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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  stat.color === "green"
                    ? "bg-green-100 dark:bg-green-900/30 text-green-600"
                    : stat.color === "blue"
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600"
                      : stat.color === "purple"
                        ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600"
                        : "bg-orange-100 dark:bg-orange-900/30 text-orange-600"
                }`}
              >
                <span className="material-symbols-outlined">{stat.icon}</span>
              </div>
              <span
                className={`text-sm font-bold ${stat.change >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {stat.change >= 0 ? "+" : ""}
                {stat.change}%
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-lg font-bold">Recent Bookings</h2>
            <button
              onClick={() => navigateTo(AdminPage.BOOKINGS)}
              className="text-primary text-sm font-medium hover:underline"
            >
              View All
            </button>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {MOCK_BOOKINGS.slice(0, 5).map((booking) => (
              <div
                key={booking.id}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono text-gray-500">
                      #{booking.id}
                    </span>
                    <span className="font-medium">{booking.serviceName}</span>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded ${getStatusColor(booking.status)}`}
                  >
                    {booking.status.replace("_", " ")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>{booking.customerName}</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ₹{booking.amount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold">Recent Activity</h2>
          </div>
          <div className="p-4 space-y-4">
            {RECENT_ACTIVITY.map((activity, i) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    activity.type === "booking"
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600"
                      : activity.type === "partner"
                        ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600"
                        : activity.type === "payment"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-600"
                          : "bg-red-100 dark:bg-red-900/30 text-red-600"
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {activity.type === "booking"
                      ? "calendar_month"
                      : activity.type === "partner"
                        ? "person"
                        : activity.type === "payment"
                          ? "payments"
                          : "warning"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
