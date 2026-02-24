import React, { useState, useEffect } from "react";
import { NavigationProps, ProfessionalStatus } from "../types";
import { adminService } from "../services/api";

export const ProfessionalsPage: React.FC<NavigationProps> = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfessionals = async () => {
    setLoading(true);
    try {
      const data = await adminService.getProfessionals(); // Corrected to fetch professionals
      setProfessionals(data);
    } catch (error) {
      console.error("Failed to fetch professionals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const handleAddProfessional = async () => {
    const name = prompt("Enter professional name:");
    const phone = prompt("Enter professional phone:");
    if (name && phone) {
      try {
        await adminService.createUser({ name, phone, role: "PROFESSIONAL" });
        alert("Professional added successfully!");
        fetchProfessionals();
      } catch (error) {
        alert("Failed to add professional.");
      }
    }
  };

  const handleDeleteProfessional = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete professional ${name}?`)) {
      try {
        await adminService.deleteUser(id);
        alert("Professional deleted successfully!");
        fetchProfessionals();
      } catch (error) {
        alert("Failed to delete professional.");
      }
    }
  };

  const handleToggleStatus = async (professional: any) => {
    const newStatus =
      professional.status === ProfessionalStatus.ACTIVE
        ? ProfessionalStatus.SUSPENDED
        : ProfessionalStatus.ACTIVE;
    try {
      await adminService.updateUser(professional.id || professional._id, {
        status: newStatus,
      });
      alert(`Professional status updated to ${newStatus}`);
      fetchProfessionals();
    } catch (error) {
      alert("Failed to update status.");
    }
  };

  const filteredProfessionals = professionals.filter((p) => {
    const name = p.name || "";
    const phone = p.phone || "";
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getStatusBadge = (status: ProfessionalStatus) => {
    switch (status) {
      case ProfessionalStatus.ACTIVE:
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case ProfessionalStatus.SUSPENDED:
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case ProfessionalStatus.ONBOARDING:
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
            Professionals
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage service professionals
          </p>
        </div>
        <button
          onClick={handleAddProfessional}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dim transition-colors"
        >
          <span className="material-symbols-outlined text-lg">person_add</span>
          Add Professional
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Total Professionals",
            value: professionals.length,
            color: "blue",
          },
          {
            label: "Active",
            value: professionals.filter(
              (p) => p.status === ProfessionalStatus.ACTIVE,
            ).length,
            color: "green",
          },
          {
            label: "Onboarding",
            value: professionals.filter(
              (p) => p.status === ProfessionalStatus.ONBOARDING,
            ).length,
            color: "yellow",
          },
          {
            label: "Suspended",
            value: professionals.filter(
              (p) => p.status === ProfessionalStatus.SUSPENDED,
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
              placeholder="Search professionals..."
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
            <option value={ProfessionalStatus.ACTIVE}>Active</option>
            <option value={ProfessionalStatus.ONBOARDING}>Onboarding</option>
            <option value={ProfessionalStatus.SUSPENDED}>Suspended</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Professional
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
            {filteredProfessionals.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No professionals found matching your search.
                </td>
              </tr>
            ) : (
              filteredProfessionals.map((professional) => (
                <tr
                  key={professional.id || professional._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {(professional.name || "?").charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">
                            {professional.name || "Unknown"}
                          </p>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${getTierBadge(professional.tier || "")}`}
                          >
                            {professional.tier || "N/A"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {professional.phone || "N/A"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded ${getStatusBadge(professional.status)}`}
                    >
                      {professional.status || "UNKNOWN"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {(professional.rating || 0) > 0 ? (
                      <div className="flex items-center gap-1">
                        <span
                          className="material-symbols-outlined text-yellow-500 text-sm"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                        <span className="font-medium">
                          {professional.rating}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium">
                      {professional.completedJobs || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-green-600">
                      ₹{(professional.earnings || 0).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleToggleStatus(professional)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                        title={
                          professional.status === ProfessionalStatus.ACTIVE
                            ? "Suspend"
                            : "Activate"
                        }
                      >
                        <span className="material-symbols-outlined text-sm">
                          {professional.status === ProfessionalStatus.ACTIVE
                            ? "block"
                            : "check_circle"}
                        </span>
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteProfessional(
                            professional.id || professional._id,
                            professional.name,
                          )
                        }
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 rounded-lg transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">
                          delete
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
