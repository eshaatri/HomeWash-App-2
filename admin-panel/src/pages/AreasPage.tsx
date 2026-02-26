import React, { useState, useEffect } from "react";
import { NavigationProps, Area, Partner } from "../types";
import { adminService } from "../services/api";
import { Modal } from "../components/Modal";
import MapComponent from "../components/MapComponent";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import { union } from "@turf/union";
import booleanIntersects from "@turf/boolean-intersects";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
const LIBRARIES: any = ["places", "geometry", "drawing"];

export const AreasPage: React.FC<NavigationProps> = () => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [partners, setPartners] = useState<Partner[]>([]);
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
    assignedPartnerId: "",
    assignedPartnerName: "",
  });
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const geoJsonRef = React.useRef<any>(null);
  const [isBoundaryLoading, setIsBoundaryLoading] = useState(false);
  const [isManualEdit, setIsManualEdit] = useState(false);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);

  const onLoadAutocomplete = (
    autocompleteInst: google.maps.places.Autocomplete,
  ) => {
    setAutocomplete(autocompleteInst);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();

      let newCity = formData.city;
      let newZip = formData.zipCodes;

      const cityComp = place.address_components?.find((c: any) =>
        c.types.includes("locality"),
      );
      if (cityComp) newCity = cityComp.long_name;

      const zipComp = place.address_components?.find((c: any) =>
        c.types.includes("postal_code"),
      );
      if (zipComp) newZip = zipComp.long_name;

      setFormData({
        ...formData,
        name: place.name || formData.name,
        city: newCity,
        zipCodes: newZip,
        lat: place.geometry?.location?.lat() || formData.lat,
        lng: place.geometry?.location?.lng() || formData.lng,
      });
    }
  };

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [areasData, partnersData] = await Promise.all([
        adminService.getAreas(),
        adminService.getPartners(),
      ]);
      setAreas(areasData);
      setPartners(partnersData);
    } catch (error) {
      console.error("Failed to fetch initial data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
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
        assignedPartnerId: area.assignedPartnerId || "",
        assignedPartnerName: area.assignedPartnerName || "",
      });
      setGeoJsonData(area.geoJson || null);
      geoJsonRef.current = area.geoJson || null;
      setIsManualEdit(Boolean(area.geoJson)); // If it has geoJson, treat as manual/fixed initially
    } else {
      setEditingArea(null);
      setFormData({
        name: "",
        city: "Mumbai",
        zipCodes: "",
        isActive: true,
        lat: 19.076,
        lng: 72.8777,
        assignedPartnerId: "",
        assignedPartnerName: "",
      });
      setGeoJsonData(null);
      geoJsonRef.current = null;
      setIsManualEdit(false);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingArea(null);
  };

  const handleMergeShapes = () => {
    if (
      !geoJsonData ||
      geoJsonData.type !== "FeatureCollection" ||
      !geoJsonData.features ||
      geoJsonData.features.length < 2
    )
      return;

    try {
      // Turf v7 union takes a FeatureCollection or array of features
      const merged = union(geoJsonData);
      if (merged) {
        setGeoJsonData(merged);
        geoJsonRef.current = merged;
        setIsManualEdit(true);
      }
    } catch (error) {
      console.error("Merge error:", error);
      alert("Failed to merge shapes. Ensure the boundaries overlap slightly.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = {
      ...formData,
      zipCodes: formData.zipCodes
        .split(",")
        .map((z) => z.trim())
        .filter((z) => z !== ""),
    };

    // Use the latest data from the ref to avoid stale state issues during rapid saving
    const currentGeoJson = geoJsonRef.current || geoJsonData;

    if (currentGeoJson) {
      payload.geoJson = currentGeoJson;
    } else {
      payload.geoJson = null; // Clear if empty
    }

    // Overlap validation: Prevent saving if it overlaps with an existing partner-assigned area
    if (payload.geoJson) {
      try {
        const overlappingArea = areas.find((area) => {
          // Skip if comparing against self (editing)
          const areaId = area.id || (area as any)._id;
          const currentId = editingArea
            ? editingArea.id || (editingArea as any)._id
            : null;
          if (currentId && areaId === currentId) return false;

          // Check for overlap if the existing area has an assigned partner
          if (area.assignedPartnerId && area.geoJson) {
            return booleanIntersects(payload.geoJson, area.geoJson);
          }
          return false;
        });

        if (overlappingArea) {
          alert(
            `OVERLAP DETECTED: This area overlaps with "${overlappingArea.name}", which is already assigned to a partner (${overlappingArea.assignedPartnerName}). Please adjust the boundaries to avoid overlap.`,
          );
          return;
        }
      } catch (err) {
        console.warn("Overlap check failed (likely invalid geometry):", err);
      }
    }

    try {
      if (editingArea) {
        await adminService.updateArea(
          editingArea.id || (editingArea as any)._id,
          payload,
        );
      } else {
        await adminService.createArea(payload);
      }
      fetchInitialData();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to save area:", error);
      alert("Failed to save area.");
    }
  };

  const [areaToDelete, setAreaToDelete] = useState<string | null>(null);

  const confirmDelete = async () => {
    if (!areaToDelete) return;
    try {
      await adminService.deleteArea(areaToDelete);
      fetchInitialData();
      setAreaToDelete(null);
    } catch (error) {
      console.error("Failed to delete area:", error);
      alert("Failed to delete area.");
      setAreaToDelete(null);
    }
  };

  const handleDelete = (id: string) => {
    setAreaToDelete(id);
  };

  // Debounced effect to fetch GeoJSON overlay
  const [initialModalZip, setInitialModalZip] = useState("");

  useEffect(() => {
    if (isModalOpen) {
      setInitialModalZip(
        formData.zipCodes ? formData.zipCodes.split(",")[0].trim() : "",
      );
    }
  }, [isModalOpen, editingArea]);

  useEffect(() => {
    if (!isModalOpen) return;

    let isCurrentRequest = true;

    const fetchOverlay = async () => {
      // DON'T fetch if the user has manually drawn or edited the shape
      if (isManualEdit) return;
      const currentZipQuery = formData.zipCodes
        ? formData.zipCodes.split(",")[0].trim()
        : "";
      const query = currentZipQuery || formData.name;

      if (!query || query.length < 3) {
        if (isCurrentRequest) setGeoJsonData(null);
        return;
      }

      // Skip fetching if this is an editing area and zip hasn't changed,
      // preserving their custom drawn geometry.
      if (
        editingArea &&
        editingArea.geoJson &&
        currentZipQuery === initialModalZip
      ) {
        return;
      }

      try {
        setIsBoundaryLoading(true);
        const data = await adminService.getBoundary({
          zipcode: currentZipQuery,
          city: formData.city,
          name: formData.name,
        });

        if (!isCurrentRequest) return;

        if (data && data.source) {
          if (data.geojson) {
            console.log(
              `Boundary Match Found via ${data.source}:`,
              data.display_name || query,
            );
            setGeoJsonData(data.geojson);
          } else {
            console.log(
              `No boundary geometry found. Panning to ${data.source}:`,
              data.display_name || query,
            );
            setGeoJsonData(null);
          }

          if (!editingArea && data.lat && data.lon) {
            setFormData((prev) => ({
              ...prev,
              lat: parseFloat(data.lat),
              lng: parseFloat(data.lon),
            }));
          }
        } else {
          setGeoJsonData(null);
        }
      } catch (error) {
        console.error("Failed to fetch boundary via proxy:", error);
        if (isCurrentRequest) setGeoJsonData(null);
      } finally {
        if (isCurrentRequest) setIsBoundaryLoading(false);
      }
    };

    const timer = setTimeout(fetchOverlay, 1000);
    return () => {
      isCurrentRequest = false;
      clearTimeout(timer);
    };
  }, [
    formData.name,
    formData.zipCodes,
    formData.city,
    isModalOpen,
    editingArea,
    initialModalZip, // Added dependency
  ]);

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

                <div className="flex items-center gap-2 py-2 px-3 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/30">
                  <span className="material-symbols-outlined text-orange-500 text-sm">
                    storefront
                  </span>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-orange-400">
                      Assigned Partner
                    </p>
                    <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                      {area.assignedPartnerName || "No Partner Assigned"}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div />
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenModal(area);
                      }}
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-400 hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">
                        edit
                      </span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(area.id || (area as any)._id);
                      }}
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
        fullScreen={true}
        title={editingArea ? "Edit Area Details" : "Create New Service Area"}
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-col lg:flex-row h-full min-h-[500px] font-display"
        >
          {/* Left Column: Form Details */}
          <div className="w-full lg:w-[400px] p-8 space-y-6 border-r border-gray-100 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm overflow-y-auto">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                  Area Name
                </label>
                {isLoaded ? (
                  <Autocomplete
                    onLoad={onLoadAutocomplete}
                    onPlaceChanged={onPlaceChanged}
                    options={{
                      types: ["(regions)"],
                      componentRestrictions: { country: "in" },
                    }}
                  >
                    <input
                      required
                      type="text"
                      placeholder="e.g. Bandra West"
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-primary focus:outline-none font-bold placeholder:font-normal"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </Autocomplete>
                ) : (
                  <input
                    required
                    type="text"
                    placeholder="e.g. Bandra West"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-primary focus:outline-none font-bold placeholder:font-normal"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                )}
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                  City
                </label>
                <input
                  required
                  type="text"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-primary focus:outline-none font-bold"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                  Assign Partner
                </label>
                <select
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-primary focus:outline-none font-bold text-sm"
                  value={formData.assignedPartnerId}
                  onChange={(e) => {
                    const partner = partners.find(
                      (p) => (p.id || (p as any)._id) === e.target.value,
                    );
                    setFormData({
                      ...formData,
                      assignedPartnerId: e.target.value,
                      assignedPartnerName: partner ? partner.name : "",
                    });
                  }}
                >
                  <option value="">Select Partner</option>
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

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                  Zip Codes (Comma separated)
                </label>
                <textarea
                  placeholder="400050, 400051 (Optional if drawing area)"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-primary focus:outline-none font-bold text-sm placeholder:font-normal"
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
            </div>

            <div className="pt-6 flex gap-3">
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
                {editingArea ? "Save" : "Create"}
              </button>
            </div>
          </div>

          {/* Right Column: Large Interactive Map */}
          <div className="flex-1 min-h-[400px] relative bg-gray-100 dark:bg-black/20 overflow-hidden">
            <div className="absolute top-4 left-4 z-[1000] flex gap-2 items-center">
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-0.5">
                  Pinning Area
                </p>
                <div className="flex gap-4">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">
                      LATITUDE
                    </span>
                    <span className="text-sm font-black text-gray-900 dark:text-white">
                      {formData.lat.toFixed(6)}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">
                      LONGITUDE
                    </span>
                    <span className="text-sm font-black text-gray-900 dark:text-white">
                      {formData.lng.toFixed(6)}
                    </span>
                  </div>
                </div>
              </div>

              {geoJsonData && (
                <div className="flex gap-2">
                  {geoJsonData.type === "FeatureCollection" &&
                    geoJsonData.features?.length > 1 && (
                      <button
                        type="button"
                        onClick={handleMergeShapes}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white shadow-xl px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-colors flex items-center gap-2 h-fit"
                      >
                        <span className="material-symbols-outlined text-sm">
                          merge
                        </span>
                        Merge Shapes
                      </button>
                    )}
                  <button
                    type="button"
                    onClick={() => {
                      setGeoJsonData(null);
                      setIsManualEdit(false);
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white shadow-xl px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-colors flex items-center gap-2 h-fit"
                  >
                    <span className="material-symbols-outlined text-sm">
                      delete
                    </span>
                    Clear Shape
                  </button>
                </div>
              )}

              {isBoundaryLoading && (
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                    Fetching Boundary...
                  </span>
                </div>
              )}
            </div>

            <MapComponent
              zoom={14}
              center={{
                lat: formData.lat || 19.076,
                lng: formData.lng || 72.8777,
              }}
              geoJsonData={geoJsonData}
              pincode={
                formData.zipCodes ? formData.zipCodes.split(",")[0].trim() : ""
              }
              isEditable={true}
              onGeoJsonChange={(data) => {
                setGeoJsonData(data);
                geoJsonRef.current = data;
              }}
              onManualEdit={() => setIsManualEdit(true)}
              markers={[
                {
                  id: "temp",
                  lat: formData.lat || 19.076,
                  lng: formData.lng || 72.8777,
                  title: formData.name || "Selected Center",
                  details:
                    "Drag this pin to manually adjust the center coordinate.",
                  draggable: true,
                  onDragEnd: (lat, lng) =>
                    setFormData({ ...formData, lat, lng }),
                },
              ]}
            />

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] bg-black/60 backdrop-blur-md text-white px-6 py-2.5 rounded-full border border-white/10 shadow-2xl pointer-events-none">
              <p className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-primary">
                  pan_tool
                </span>
                Drag the pin to adjust area center
              </p>
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!areaToDelete}
        onClose={() => setAreaToDelete(null)}
        title="Delete Area"
      >
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-300 mb-8 font-medium">
            Are you sure you want to delete this specific operational area? This
            will unassign any partners operating silently within its geometry
            boundaries.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => setAreaToDelete(null)}
              className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="flex-1 py-3 rounded-xl bg-red-500 text-white font-black uppercase tracking-widest hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
            >
              Confirm Deletion
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
