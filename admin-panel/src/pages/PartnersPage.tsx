import React, { useState } from "react";
import { NavigationProps, PartnerStatus } from "../types";
import { MOCK_PARTNERS } from "../mockData";

export const PartnersPage: React.FC<NavigationProps> = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredPartners = MOCK_PARTNERS.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: PartnerStatus) => {
    switch (status) {
      case PartnerStatus.ACTIVE:
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case PartnerStatus.SUSPENDED:
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case PartnerStatus.ONBOARDING:
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    }
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "PLATINUM":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      case "GOLD":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Partners
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage service partners
          </p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dim transition-colors">
          <span className="material-symbols-outlined text-lg">person_add</span>
          Add Partner
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Total Partners",
            value: MOCK_PARTNERS.length,
            color: "blue",
          },
          {
            label: "Active",
            value: MOCK_PARTNERS.filter(
              (p) => p.status === PartnerStatus.ACTIVE,
            ).length,
            color: "green",
          },
          {
            label: "Onboarding",
            value: MOCK_PARTNERS.filter(
              (p) => p.status === PartnerStatus.ONBOARDING,
            ).length,
            color: "yellow",
          },
          {
            label: "Suspended",
            value: MOCK_PARTNERS.filter(
              (p) => p.status === PartnerStatus.SUSPENDED,
            ).length,
            color: "red",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {stat.label}
            </p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              search
            </span>
            <input
              type="text"
              placeholder="Search partners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:border-primary"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-4 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:border-primary"
          >
            <option value="all">All Status</option>
            <option value={PartnerStatus.ACTIVE}>Active</option>
            <option value={PartnerStatus.ONBOARDING}>Onboarding</option>
            <option value={PartnerStatus.SUSPENDED}>Suspended</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Partner
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Jobs
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Earnings
              </th>
              <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredPartners.map((partner) => (
              <tr
                key={partner.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {partner.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{partner.name}</p>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${getTierBadge(partner.tier)}`}
                        >
                          {partner.tier}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{partner.phone}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded ${getStatusBadge(partner.status)}`}
                  >
                    {partner.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {partner.rating > 0 ? (
                    <div className="flex items-center gap-1">
                      <span
                        className="material-symbols-outlined text-yellow-500 text-sm"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                      <span className="font-medium">{partner.rating}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="font-medium">{partner.completedJobs}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-medium text-green-600">
                    ₹{partner.earnings.toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
