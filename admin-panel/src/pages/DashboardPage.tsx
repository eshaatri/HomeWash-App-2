import React, { useEffect, useState } from "react";
import { AdminPage, NavigationProps } from "../types";
import { adminService } from "../services/api";

interface DashboardStats {
  totalRevenue: number;
  totalBookings: number;
  activeProfessionals: number;
  activeUsers: number;
}

export const DashboardPage: React.FC<NavigationProps> = ({ navigateTo }) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalBookings: 0,
    activeProfessionals: 0,
    activeUsers: 0,
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [activity, setActivity] = useState<
    { type: "booking" | "professional" | "payment" | "alert"; message: string; time: string }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookings, professionals, users] = await Promise.all([
          adminService.getBookings(),
          adminService.getProfessionals(),
          adminService.getUsers(),
        ]);

        const totalRevenue = bookings.reduce(
          (sum: number, b: any) => sum + (b.amount || 0),
          0,
        );

        setStats({
          totalRevenue,
          totalBookings: bookings.length,
          activeProfessionals: professionals.length,
          activeUsers: users.length,
        });

        const sortedBookings = [...bookings].sort((a: any, b: any) => {
          const aDate = new Date(a.createdAt || a.date || 0).getTime();
          const bDate = new Date(b.createdAt || b.date || 0).getTime();
          return bDate - aDate;
        });

        setRecentBookings(sortedBookings.slice(0, 4));

        setActivity(
          sortedBookings.slice(0, 5).map((b: any) => ({
            type: "booking" as const,
            message: `Booking for ${b.serviceName || "Service"} by ${
              b.customerName || "Customer"
            }`,
            time: b.createdAt
              ? new Date(b.createdAt).toLocaleString()
              : b.date || "",
          })),
        );
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    {
      label: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      change: 0,
      icon: "payments",
      color: "green",
    },
    {
      label: "Total Bookings",
      value: stats.totalBookings.toLocaleString(),
      change: 0,
      icon: "calendar_month",
      color: "blue",
    },
    {
      label: "Active Professionals",
      value: stats.activeProfessionals.toString(),
      change: 0,
      icon: "engineering",
      color: "purple",
    },
    {
      label: "Active Users",
      value: stats.activeUsers.toLocaleString(),
      change: 0,
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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
            System Overview
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Real-time platform status and key performance indicators.
          </p>
        </div>
        <button
          onClick={() => navigateTo(AdminPage.REPORTS)}
          className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:opacity-90 transition-all"
        >
          <span className="material-symbols-outlined text-sm">analytics</span>
          Detailed Reports
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
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
            <p className="text-2xl font-black text-gray-900 dark:text-white">
              {stat.value}
            </p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Snapshot / Recent Sales */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-50 dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-lg font-black uppercase tracking-tighter">
              Today's Performance
            </h2>
            <div className="flex gap-2">
              <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full font-black uppercase tracking-wider shadow-sm">
                Online
              </span>
              <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-black uppercase tracking-wider shadow-sm">
                {stats.activeProfessionals} Active Professionals
              </span>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                <p className="text-[10px] font-black uppercase text-gray-400 mb-1 tracking-widest">
                  Avg. Response
                </p>
                <p className="text-xl font-black">14.2 min</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                <p className="text-[10px] font-black uppercase text-gray-400 mb-1 tracking-widest">
                  Conversion
                </p>
                <p className="text-xl font-black">8.4%</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                <p className="text-[10px] font-black uppercase text-gray-400 mb-1 tracking-widest">
                  Retention
                </p>
                <p className="text-xl font-black">32%</p>
              </div>
            </div>

            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-4 italic">
              Latest Service Requests
            </h3>
            <div className="space-y-3">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 rounded-2xl border border-gray-50 dark:border-gray-700/50 hover:border-primary/50 hover:bg-primary/5 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors">
                        {booking.serviceName.toLowerCase().includes("clean")
                          ? "cleaning_services"
                          : "home_repair_service"}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-sm tracking-tight">
                        {booking.serviceName}
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        {booking.customerName || "Customer"} •{" "}
                        {booking.scheduledTime || booking.time || ""}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-gray-900 dark:text-white">
                      ₹{booking.amount}
                    </p>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${getStatusColor(booking.status)}`}
                    >
                      {booking.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigateTo(AdminPage.BOOKINGS)}
              className="w-full mt-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all border border-transparent hover:shadow-lg"
            >
              Access All Bookings
            </button>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden h-fit">
          <div className="p-6 border-b border-gray-50 dark:border-gray-700">
            <h2 className="text-lg font-black uppercase tracking-tighter text-gray-400">
              Live Activity
            </h2>
          </div>
          <div className="p-4 space-y-2">
            {activity.map((activity, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                    activity.type === "booking"
                      ? "bg-blue-50 text-blue-600"
                      : activity.type === "professional"
                        ? "bg-purple-50 text-purple-600"
                        : activity.type === "payment"
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-600"
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {activity.type === "booking"
                      ? "calendar_month"
                      : activity.type === "professional"
                        ? "person"
                        : activity.type === "payment"
                          ? "payments"
                          : "warning"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold leading-relaxed">
                    {activity.message}
                  </p>
                  <p className="text-[10px] font-black uppercase text-gray-400 mt-1 tracking-wider">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
