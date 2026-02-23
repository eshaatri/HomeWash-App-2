import React, { useState } from "react";
import { NavigationProps, BookingStatus } from "../types";
import {
  MOCK_STATS,
  MOCK_SERVICES,
  MOCK_VENDORS,
  MOCK_BOOKINGS,
  MOCK_PARTNERS,
} from "../mockData";

export const ReportsPage: React.FC<NavigationProps> = ({ isDarkMode }) => {
  const [reportType, setReportType] = useState<
    "services" | "vendors" | "revenue"
  >("services");

  // Calculate Service Performance Stats
  const serviceStats = MOCK_SERVICES.map((service) => {
    const serviceBookings = MOCK_BOOKINGS.filter(
      (b) => b.serviceName === service.name,
    );
    const revenue = serviceBookings.reduce((sum, b) => sum + b.amount, 0);
    const completed = serviceBookings.filter(
      (b) => b.status === BookingStatus.COMPLETED,
    ).length;
    return {
      name: service.name,
      bookings: serviceBookings.length,
      revenue,
      successRate:
        serviceBookings.length > 0
          ? ((completed / serviceBookings.length) * 100).toFixed(1)
          : "0",
    };
  }).sort((a, b) => b.revenue - a.revenue);

  // Calculate Top Performing Vendors
  const vendorStats = MOCK_VENDORS.map((vendor) => {
    // In mock data, we don't have direct link between bookings and vendors,
    // but we can simulate based on their partner count or areas
    const simulatedRevenue =
      vendor.partnersCount * 15000 + Math.random() * 5000;
    const simulatedBookings = Math.floor(simulatedRevenue / 800);
    return {
      name: vendor.name,
      owner: vendor.ownerName,
      bookings: simulatedBookings,
      revenue: Math.floor(simulatedRevenue),
      partners: vendor.partnersCount,
      rating: (4 + Math.random()).toFixed(1),
    };
  }).sort((a, b) => b.revenue - a.revenue);

  // Partner Performance
  const partnerStats = MOCK_PARTNERS.sort(
    (a, b) => b.earnings - a.earnings,
  ).slice(0, 5);

  return (
    <div className="p-6">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
            Advanced Reports & Analytics
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            In-depth analysis of platform performance and entity statistics.
          </p>
        </div>

        <div className="flex bg-gray-200 dark:bg-gray-800 p-1 rounded-xl">
          {(["services", "vendors", "revenue"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setReportType(type)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                reportType === type
                  ? "bg-white dark:bg-gray-700 text-primary shadow-sm"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {reportType === "services" && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-50 dark:border-gray-700">
                <h2 className="text-lg font-black uppercase tracking-tighter">
                  Service Performance Matrix
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-900/50">
                      <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-400">
                        Service Name
                      </th>
                      <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-400 text-center">
                        Bookings
                      </th>
                      <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-400 text-right">
                        Revenue
                      </th>
                      <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-400 text-right">
                        Success Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                    {serviceStats.map((s, i) => (
                      <tr
                        key={i}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                      >
                        <td className="p-4">
                          <span className="font-bold text-sm">{s.name}</span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="text-sm font-medium">
                            {s.bookings}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <span className="text-sm font-black">
                            ₹{s.revenue.toLocaleString()}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-16 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-500"
                                style={{ width: `${s.successRate}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold">
                              {s.successRate}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {reportType === "vendors" && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-50 dark:border-gray-700">
                <h2 className="text-lg font-black uppercase tracking-tighter">
                  Top Performing Franchises
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-900/50">
                      <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-400">
                        Vendor
                      </th>
                      <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-400 text-center">
                        Partners
                      </th>
                      <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-400 text-right">
                        Revenue
                      </th>
                      <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-400 text-right">
                        Rating
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                    {vendorStats.map((v, i) => (
                      <tr
                        key={i}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                      >
                        <td className="p-4">
                          <div>
                            <p className="font-bold text-sm">{v.name}</p>
                            <p className="text-[10px] text-gray-400 uppercase font-bold">
                              {v.owner}
                            </p>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <span className="text-sm font-medium">
                            {v.partners}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <span className="text-sm font-black">
                            ₹{v.revenue.toLocaleString()}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1 text-orange-500">
                            <span className="material-symbols-outlined text-xs">
                              star
                            </span>
                            <span className="text-xs font-bold">
                              {v.rating}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {reportType === "revenue" && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center text-center min-h-[300px]">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                  <span className="material-symbols-outlined text-3xl">
                    insights
                  </span>
                </div>
                <h3 className="text-xl font-black uppercase tracking-tighter italic">
                  Revenue Growth Visualizer
                </h3>
                <p className="text-gray-500 text-sm max-w-sm mt-2 font-medium">
                  Detailed monthly revenue trends and growth projection charts
                  would be displayed here using a charting library.
                </p>
                <div className="mt-8 grid grid-cols-3 gap-8 w-full">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Avg. Ticket
                    </p>
                    <p className="text-xl font-black">₹842</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Growth
                    </p>
                    <p className="text-xl font-black text-green-500">+18%</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                      LTV
                    </p>
                    <p className="text-xl font-black">₹4,250</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Analytics */}
        <div className="space-y-6">
          <div className="bg-black text-white rounded-2xl p-6 shadow-xl">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6 italic">
              Platform Health
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <p className="text-xs font-bold uppercase tracking-widest">
                    Server Load
                  </p>
                  <p className="text-xs font-black">24%</p>
                </div>
                <div className="h-1 bg-white/10 rounded-full">
                  <div className="h-full bg-primary w-[24%] rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-end mb-2">
                  <p className="text-xs font-bold uppercase tracking-widest">
                    Partner Utilization
                  </p>
                  <p className="text-xs font-black">88%</p>
                </div>
                <div className="h-1 bg-white/10 rounded-full">
                  <div className="h-full bg-green-500 w-[88%] rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-end mb-2">
                  <p className="text-xs font-bold uppercase tracking-widest">
                    Customer Retention
                  </p>
                  <p className="text-xs font-black">62%</p>
                </div>
                <div className="h-1 bg-white/10 rounded-full">
                  <div className="h-full bg-blue-500 w-[62%] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">
              Top Partners
            </h3>
            <div className="space-y-4">
              {partnerStats.map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center font-bold text-xs">
                    {p.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{p.name}</p>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">
                      ₹{p.earnings.toLocaleString()} earned
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-primary">
                      {p.rating}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
              View All Leaderboards
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
