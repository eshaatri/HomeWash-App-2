import React, { useState, useEffect } from "react";
import { NavigationProps, Vendor } from "../types";
import { adminService } from "../services/api";
import { Modal } from "../components/Modal";

interface VendorsPageProps extends NavigationProps {
  onManageServices?: (id: string) => void;
}

export const VendorsPage: React.FC<VendorsPageProps> = ({
  onManageServices,
}) => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    commissionRate: 15,
    isActive: true,
  });

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const data = await adminService.getVendors();
      setVendors(data);
    } catch (error) {
      console.error("Failed to fetch vendors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleOpenModal = (vendor?: Vendor) => {
    if (vendor) {
      setEditingVendor(vendor);
      setFormData({
        name: vendor.name,
        ownerName: vendor.ownerName,
        email: vendor.email,
        phone: vendor.phone,
        address: vendor.address,
        commissionRate: vendor.commissionRate,
        isActive: vendor.isActive,
      });
    } else {
      setEditingVendor(null);
      setFormData({
        name: "",
        ownerName: "",
        email: "",
        phone: "",
        address: "",
        commissionRate: 15,
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingVendor(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingVendor) {
        await adminService.updateVendor(
          editingVendor.id || (editingVendor as any)._id,
          formData,
        );
      } else {
        await adminService.createVendor(formData);
      }
      fetchVendors();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to save vendor:", error);
      alert("Failed to save vendor. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      try {
        await adminService.deleteVendor(id);
        fetchVendors();
      } catch (error) {
        console.error("Failed to delete vendor:", error);
        alert("Failed to delete vendor.");
      }
    }
  };

  const filteredVendors = vendors.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.ownerName.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === "active") return matchesSearch && v.isActive;
    if (statusFilter === "inactive") return matchesSearch && !v.isActive;
    return matchesSearch;
  });

  if (loading && vendors.length === 0) {
    return <div className="p-6 text-center">Loading vendors...</div>;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">
            Vendors
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage franchises and contractors
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dim transition-colors shadow-lg shadow-primary/20"
        >
          <span className="material-symbols-outlined text-lg">
            add_business
          </span>
          Add Vendor
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Vendors", value: vendors.length },
          { label: "Active", value: vendors.filter((v) => v.isActive).length },
          {
            label: "Total Partners",
            value: vendors.reduce((acc, v) => acc + (v.partnersCount || 0), 0),
          },
          {
            label: "Avg. Commission",
            value: `${Math.round(vendors.length > 0 ? vendors.reduce((acc, v) => acc + (v.commissionRate || 0), 0) / vendors.length : 0)}%`,
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
              {stat.label}
            </p>
            <p className="text-2xl font-black text-gray-900 dark:text-white">
              {stat.value}
            </p>
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
              placeholder="Search vendors or owners..."
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:border-primary transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="h-10 px-4 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:border-primary font-medium"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="all">All Vendors</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Vendor
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Areas
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Comm.
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Status
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 font-display">
            {filteredVendors.map((vendor) => (
              <tr
                key={vendor.id || (vendor as any)._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black text-lg">
                      {vendor.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white leading-none">
                        {vendor.name}
                      </p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-tighter mt-1 font-medium">
                        Owner: {vendor.ownerName}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {(vendor.activeAreas || []).map((area, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-bold uppercase"
                      >
                        {area}
                      </span>
                    ))}
                    {(vendor.activeAreas || []).length === 0 && (
                      <span className="text-xs text-gray-400 italic">
                        No areas
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-black text-gray-900 dark:text-white uppercase tracking-wider">
                    {vendor.commissionRate}%
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${
                      vendor.isActive
                        ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 border border-green-200 dark:border-green-800"
                        : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 border border-red-200 dark:border-red-800"
                    }`}
                  >
                    {vendor.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() =>
                        onManageServices?.(vendor.id || (vendor as any)._id)
                      }
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group"
                      title="Manage Services"
                    >
                      <span className="material-symbols-outlined text-lg text-gray-400 group-hover:text-primary">
                        settings_applications
                      </span>
                    </button>
                    <button
                      onClick={() => handleOpenModal(vendor)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group"
                    >
                      <span className="material-symbols-outlined text-lg text-gray-400 group-hover:text-primary">
                        edit
                      </span>
                    </button>
                    <button
                      onClick={() =>
                        handleDelete(vendor.id || (vendor as any)._id)
                      }
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors group"
                    >
                      <span className="material-symbols-outlined text-lg text-gray-400 group-hover:text-red-500">
                        delete
                      </span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingVendor ? "Edit Vendor" : "Add New Vendor"}
      >
        <form onSubmit={handleSubmit} className="space-y-4 font-display">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                Business Name
              </label>
              <input
                required
                type="text"
                className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-primary focus:outline-none font-bold"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                Owner Name
              </label>
              <input
                required
                type="text"
                className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-primary focus:outline-none font-bold text-sm"
                value={formData.ownerName}
                onChange={(e) =>
                  setFormData({ ...formData, ownerName: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                Commission (%)
              </label>
              <input
                required
                type="number"
                className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-primary focus:outline-none font-black"
                value={formData.commissionRate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    commissionRate: parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div className="col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                Email Address
              </label>
              <input
                required
                type="email"
                className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-primary focus:outline-none text-sm"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="col-span-1">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                Phone Number
              </label>
              <input
                required
                type="tel"
                className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-primary focus:outline-none text-sm"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
            <div className="flex items-end pb-1 px-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="hidden"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                />
                <div
                  className={`w-10 h-5 rounded-full p-1 transition-colors ${formData.isActive ? "bg-primary" : "bg-gray-300"}`}
                >
                  <div
                    className={`w-3 h-3 bg-white rounded-full transition-transform ${formData.isActive ? "translate-x-5" : "translate-x-0"}`}
                  ></div>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-gray-400">
                  {formData.isActive ? "Active" : "Inactive"}
                </span>
              </label>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={handleCloseModal}
              className="flex-1 py-2 rounded-xl border border-gray-200 dark:border-gray-700 font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-xl bg-primary text-white font-black uppercase tracking-widest hover:bg-primary-dim transition-colors shadow-lg shadow-primary/20"
            >
              {editingVendor ? "Save Changes" : "Create Vendor"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
