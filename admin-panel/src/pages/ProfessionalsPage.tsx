import React, { useState, useEffect } from "react";
import { NavigationProps, ProfessionalStatus, Partner } from "../types";
import { adminService } from "../services/api";
import { Modal } from "../components/Modal";
import { io, Socket } from "socket.io-client";

export const ProfessionalsPage: React.FC<NavigationProps> = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingProfessionalId, setEditingProfessionalId] = useState<
    string | null
  >(null);
  const [areas, setAreas] = useState<any[]>([]);
  const [formData, setFormData] = useState<{
    name: string;
    phone: string;
    email: string;
    address: string;
    partnerId: string;
    serviceAreaIds: string[];
  }>({
    name: "",
    phone: "",
    email: "",
    address: "",
    partnerId: "",
    serviceAreaIds: [],
  });

  const fetchProfessionals = async () => {
    setLoading(true);
    try {
      const data = await adminService.getProfessionals();
      setProfessionals(data);
    } catch (error) {
      console.error("Failed to fetch professionals:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPartners = async () => {
    try {
      const data = await adminService.getPartners();
      setPartners(data);
    } catch (error) {
      console.error("Failed to fetch partners for professionals:", error);
    }
  };

  const fetchAreas = async () => {
    try {
      const data = await adminService.getAreas();
      setAreas(data);
    } catch (error) {
      console.error("Failed to fetch areas:", error);
    }
  };

  useEffect(() => {
    fetchProfessionals();
    fetchPartners();
    fetchAreas();
  }, []);

  // Realtime status/online updates from backend via WebSocket
  useEffect(() => {
    const socket: Socket = io("http://localhost:5000", {
      transports: ["websocket"],
    });

    socket.on("professional:online", (payload: any) => {
      setProfessionals((prev) =>
        prev.map((p) =>
          (p.id || p._id) === payload.id
            ? { ...p, isOnline: payload.isOnline }
            : p,
        ),
      );
    });

    socket.on("professional:status", (payload: any) => {
      setProfessionals((prev) =>
        prev.map((p) =>
          (p.id || p._id) === payload.id ? { ...p, status: payload.status } : p,
        ),
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const partnerAreas = areas.filter(
    (a) =>
      (a.assignedPartnerId || a.assignedPartner) === formData.partnerId &&
      a.isActive !== false,
  );

  const handleAddProfessional = async () => {
    setEditingProfessionalId(null);
    setFormData({
      name: "",
      phone: "",
      email: "",
      address: "",
      partnerId:
        partners.length > 0
          ? (partners[0].id || (partners[0] as any)._id) ?? ""
          : "",
      serviceAreaIds: [],
    });
    setIsModalOpen(true);
  };

  const handleEditProfessional = (professional: any) => {
    const id = professional.id || professional._id;
    setEditingProfessionalId(id);
    setFormData({
      name: professional.name || "",
      phone: professional.phone || "",
      email: professional.email || "",
      address: professional.address || "",
      partnerId: professional.partnerId || "",
      serviceAreaIds: professional.serviceAreaIds || [],
    });
    setIsModalOpen(true);
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
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Partner
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Areas
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Active
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
                  colSpan={9}
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
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {professional.phone || "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {(() => {
                        const partner = partners.find(
                          (p) =>
                            (p.id || (p as any)._id) === professional.partnerId,
                        );
                        return partner?.name || "Unassigned";
                      })()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {(professional.serviceAreaIds || []).length > 0 ? (
                        (professional.serviceAreaIds || []).map((aid: string) => {
                          const area = areas.find(
                            (a) => (a.id || a._id) === aid,
                          );
                          return area ? (
                            <span
                              key={aid}
                              className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-bold"
                            >
                              {area.name}
                            </span>
                          ) : null;
                        })
                      ) : (
                        <span className="text-xs text-gray-400 italic">
                          —
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide ${
                        professional.isOnline
                          ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                      }`}
                    >
                      {professional.isOnline ? "Online" : "Offline"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={
                        professional.status === ProfessionalStatus.ACTIVE
                      }
                      title={
                        professional.status === ProfessionalStatus.ACTIVE
                          ? "Active (click to deactivate)"
                          : "Inactive (click to activate)"
                      }
                      onClick={() => handleToggleStatus(professional)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                        professional.status === ProfessionalStatus.ACTIVE
                          ? "bg-primary"
                          : "bg-gray-200 dark:bg-gray-600"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ${
                          professional.status === ProfessionalStatus.ACTIVE
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
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
                        onClick={() => handleEditProfessional(professional)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <span className="material-symbols-outlined text-sm text-gray-400 group-hover:text-primary">
                          edit
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProfessionalId(null);
        }}
        title={editingProfessionalId ? "Edit Professional" : "Add Professional"}
      >
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!formData.name || !formData.phone) {
              alert("Please enter name and phone.");
              return;
            }
            if (!formData.partnerId) {
              alert("Please select a partner.");
              return;
            }
            try {
              setIsSaving(true);
              const serviceAreaNames =
                formData.serviceAreaIds.length > 0
                  ? formData.serviceAreaIds
                      .map(
                        (id) =>
                          areas.find(
                            (a) => (a.id || a._id) === id,
                          )?.name,
                      )
                      .filter(Boolean)
                      .join(", ")
                  : undefined;

              if (editingProfessionalId) {
                await adminService.updateUser(editingProfessionalId, {
                  name: formData.name,
                  phone: formData.phone,
                  email: formData.email || undefined,
                  address: formData.address || undefined,
                  partnerId: formData.partnerId,
                  serviceArea: serviceAreaNames,
                  serviceAreaIds:
                    formData.serviceAreaIds.length > 0
                      ? formData.serviceAreaIds
                      : undefined,
                });
              } else {
                await adminService.createUser({
                  name: formData.name,
                  phone: formData.phone,
                  email: formData.email || undefined,
                  address: formData.address || undefined,
                  role: "PROFESSIONAL",
                  partnerId: formData.partnerId,
                  serviceArea: serviceAreaNames,
                  serviceAreaIds:
                    formData.serviceAreaIds.length > 0
                      ? formData.serviceAreaIds
                      : undefined,
                });
              }
              setIsModalOpen(false);
              setEditingProfessionalId(null);
              await fetchProfessionals();
            } catch (error) {
              console.error(
                editingProfessionalId
                  ? "Failed to update professional."
                  : "Failed to add professional.",
                error,
              );
              alert(
                editingProfessionalId
                  ? "Failed to update professional."
                  : "Failed to add professional.",
              );
            } finally {
              setIsSaving(false);
            }
          }}
        >
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Name
            </label>
            <input
              type="text"
              className="w-full h-10 px-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:border-primary"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Phone
            </label>
            <input
              type="tel"
              className="w-full h-10 px-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:border-primary"
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full h-10 px-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:border-primary"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="optional"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Address
            </label>
            <input
              type="text"
              className="w-full h-10 px-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:border-primary"
              value={formData.address}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, address: e.target.value }))
              }
              placeholder="optional"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Partner
            </label>
            <select
              className="w-full h-10 px-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:border-primary"
              value={formData.partnerId}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  partnerId: e.target.value,
                  serviceAreaIds: [],
                }))
              }
              required
            >
              <option value="">Select a partner</option>
              {partners.map((partner) => (
                <option
                  key={partner.id || (partner as any)._id}
                  value={partner.id || (partner as any)._id}
                >
                  {partner.name}
                </option>
              ))}
            </select>
          </div>
          {formData.partnerId && (
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                Assign areas (from partner&apos;s service areas)
              </label>
              {partnerAreas.length === 0 ? (
                <p className="text-sm text-gray-500 italic">
                  No areas assigned to this partner. Assign areas in Service
                  Areas first.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                  {partnerAreas.map((area) => {
                    const aid = area.id || area._id;
                    const checked = formData.serviceAreaIds.includes(aid);
                    return (
                      <label
                        key={aid}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer text-sm font-medium transition-colors ${
                          checked
                            ? "bg-primary/20 text-primary border border-primary/40"
                            : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData((prev) => ({
                                ...prev,
                                serviceAreaIds: [
                                  ...prev.serviceAreaIds,
                                  aid,
                                ],
                              }));
                            } else {
                              setFormData((prev) => ({
                                ...prev,
                                serviceAreaIds: prev.serviceAreaIds.filter(
                                  (id) => id !== aid,
                                ),
                              }));
                            }
                          }}
                          className="sr-only"
                        />
                        {area.name}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary-dim disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving
                ? "Saving..."
                : editingProfessionalId
                  ? "Update"
                  : "Save"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
