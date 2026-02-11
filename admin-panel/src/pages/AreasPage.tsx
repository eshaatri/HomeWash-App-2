import React, { useState, useEffect } from "react";
import { NavigationProps, Area } from "../types";
import { adminService } from "../services/api";
import { Modal } from "../components/Modal";
import MapComponent from "../components/MapComponent";

export const AreasPage: React.FC<NavigationProps> = () => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArea, setEditingArea] = useState<Area | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    city: "Mumbai",
    zipCodes: "",
    isActive: true,
    lat: 19.076,
    lng: 72.8777,
  });

  const fetchAreas = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAreas();
      setAreas(data);
    } catch (error) {
      console.error("Failed to fetch areas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  const handleOpenModal = (area?: Area) => {
    if (area) {
      setEditingArea(area);
      setFormData({
        name: area.name,
        city: area.city,
        zipCodes: (area.zipCodes || []).join(", "),
        isActive: area.isActive,
        lat: area.lat || 19.076,
        lng: area.lng || 72.8777,
      });
    } else {
      setEditingArea(null);
      setFormData({
        name: "",
        city: "Mumbai",
        zipCodes: "",
        isActive: true,
        lat: 19.076,
        lng: 72.8777,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingArea(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      zipCodes: formData.zipCodes
        .split(",")
        .map((z) => z.trim())
        .filter((z) => z !== ""),
    };

    try {
      if (editingArea) {
        await adminService.updateArea(
          editingArea.id || (editingArea as any)._id,
          payload,
        );
      } else {
        await adminService.createArea(payload);
      }
      fetchAreas();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to save area:", error);
      alert("Failed to save area.");
    }
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this area? This might affect existing vendor associations.",
      )
    ) {
      try {
        await adminService.deleteArea(id);
        fetchAreas();
      } catch (error) {
        console.error("Failed to delete area:", error);
        alert("Failed to delete area.");
      }
    }
  };

  const filteredAreas = areas.filter(
    (a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.zipCodes || []).some((z) => z.includes(searchTerm)),
  );

  if (loading && areas.length === 0) {
    return (
      <div className="p-6 text-center font-display">
        Loading service areas...
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
            Service Areas
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage geographic zones and coverage
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dim transition-colors shadow-lg shadow-primary/20"
        >
          <span className="material-symbols-outlined text-lg">
            add_location_alt
          </span>
          Add Area
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Areas", value: areas.length },
          {
            label: "Active Areas",
            value: areas.filter((a) => a.isActive).length,
          },
          {
            label: "Total ZipCodes",
            value: areas.reduce((acc, a) => acc + (a.zipCodes || []).length, 0),
          },
          { label: "Partner Coverage", value: "85%" },
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

      {/* Search & Toggle */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              search
            </span>
            <input
              type="text"
              placeholder="Search areas or zip codes..."
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:border-primary font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700 flex shadow-sm">
          <button
            onClick={() => setViewMode("grid")}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all ${viewMode === "grid" ? "bg-primary text-white shadow-lg" : "text-gray-400 hover:text-gray-600"}`}
          >
            <span className="material-symbols-outlined text-lg">grid_view</span>
            Grid
          </button>
          <button
            onClick={() => setViewMode("map")}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all ${viewMode === "map" ? "bg-primary text-white shadow-lg" : "text-gray-400 hover:text-gray-600"}`}
          >
            <span className="material-symbols-outlined text-lg">map</span>
            Map
          </button>
        </div>
      </div>

      {viewMode === "map" && (
        <div className="h-[600px] mb-8 relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800">
          <MapComponent
            markers={filteredAreas.map((a) => ({
              id: a.id || (a as any)._id,
              lat: a.lat || 19.076,
              lng: a.lng || 72.8777,
              title: a.name,
              details: `${a.zipCodes?.length || 0} Zip Codes served in ${a.city}`,
            }))}
          />
        </div>
      )}

      {/* Grid */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAreas.map((area) => (
            <div
              key={area.id || (area as any)._id}
              className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/5"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                    <span className="material-symbols-outlined">
                      location_on
                    </span>
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-sm">
                      {area.name}
                    </h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                      {area.city}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${
                    area.isActive
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800"
                  }`}
                >
                  {area.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-2 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">
                      pin_drop
                    </span>
                    Serving Zip Codes
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {(area.zipCodes || []).map((zip, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-black"
                      >
                        {zip}
                      </span>
                    ))}
                    {(area.zipCodes || []).length === 0 && (
                      <span className="text-xs text-gray-400 italic">
                        No zip codes
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                    <span className="material-symbols-outlined text-sm">
                      storefront
                    </span>
                    <span>{area.vendorsCount || 0} Vendors</span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenModal(area)}
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-400 hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">
                        edit
                      </span>
                    </button>
                    <button
                      onClick={() => handleDelete(area.id || (area as any)._id)}
                      className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">
                        delete
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingArea ? "Edit Area" : "Add New Area"}
      >
        <form onSubmit={handleSubmit} className="space-y-4 font-display">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
              Area Name
            </label>
            <input
              required
              type="text"
              placeholder="e.g. Bandra West"
              className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-primary focus:outline-none font-bold placeholder:font-normal"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
              City
            </label>
            <input
              required
              type="text"
              className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-primary focus:outline-none font-bold"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
              Select Center on Map
            </label>
            <div className="h-48 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 mb-2">
              <MapComponent
                zoom={14}
                markers={[
                  {
                    id: "temp",
                    lat: formData.lat || 19.076,
                    lng: formData.lng || 72.8777,
                    title: "Selected Center",
                  },
                ]}
                onMapClick={(lat, lng) =>
                  setFormData({ ...formData, lat, lng })
                }
              />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="number"
                  step="any"
                  className="w-full px-3 py-1 text-xs rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none"
                  value={formData.lat}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      lat: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  step="any"
                  className="w-full px-3 py-1 text-xs rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none"
                  value={formData.lng}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      lng: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
              Zip Codes (Comma separated)
            </label>
            <textarea
              required
              placeholder="400050, 400051"
              rows={3}
              className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-primary focus:outline-none font-bold text-sm placeholder:font-normal"
              value={formData.zipCodes}
              onChange={(e) =>
                setFormData({ ...formData, zipCodes: e.target.value })
              }
            />
          </div>
          <div className="flex items-center gap-2 cursor-pointer group py-2">
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
              {formData.isActive ? "Operational" : "Paused"}
            </span>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={handleCloseModal}
              className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-primary text-white font-black uppercase tracking-widest hover:bg-primary-dim transition-colors shadow-lg shadow-primary/20"
            >
              {editingArea ? "Save Area" : "Create Area"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
