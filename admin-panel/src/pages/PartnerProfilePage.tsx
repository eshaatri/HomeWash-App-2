import React, { useState, useEffect, useCallback } from "react";
import { NavigationProps, Partner } from "../types";
import { adminService, partnerService } from "../services/api";

interface PartnerProfilePageProps extends NavigationProps {
  selectedPartnerId?: string;
  onBack?: () => void;
}

export const PartnerProfilePage: React.FC<PartnerProfilePageProps> = ({
  selectedPartnerId,
  onBack,
}) => {
  const [partner, setPartner] = useState<Partner | null>(null);
  const [assignedAreas, setAssignedAreas] = useState<any[]>([]);
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [partnerConfigs, setPartnerConfigs] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!selectedPartnerId) return;
    try {
      setLoading(true);
      const [partnersList, allAreas, profs, servs, configs] = await Promise.all([
        adminService.getPartners(),
        adminService.getAreas(),
        partnerService.getProfessionals(selectedPartnerId),
        adminService.getServices(),
        adminService.getPartnerConfigs(selectedPartnerId),
      ]);

      const pid = selectedPartnerId;
      const currentPartner = partnersList.find(
        (p: any) => (p.id || p._id) === pid,
      );
      setPartner(currentPartner || null);
      setAreas(allAreas);
      setAssignedAreas(
        allAreas.filter(
          (a: any) => (a.assignedPartnerId || a.assignedPartner) === pid,
        ),
      );
      setProfessionals(profs);
      setServices(servs);
      setPartnerConfigs(configs);
    } catch (error) {
      console.error("Failed to fetch partner profile:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedPartnerId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getServiceTitle = (serviceId: string) => {
    const s = services.find((x: any) => (x.id || x._id) === serviceId);
    return s?.title || serviceId;
  };

  const getAreaName = (areaId: string) => {
    const a = areas.find((x: any) => (x.id || x._id) === areaId);
    return a?.name || areaId;
  };

  const getServicePrice = (serviceId: string) => {
    const s = services.find((x: any) => (x.id || x._id) === serviceId);
    return s?.price ?? 0;
  };

  if (loading && !partner) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[200px]">
        <p className="text-gray-500">Loading partner profile...</p>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="p-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors mb-4"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <p className="text-gray-500">Partner not found.</p>
      </div>
    );
  }

  const partnerId = (partner as any).id || (partner as any)._id;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h1 className="text-2xl font-bold dark:text-white">
            Partner Profile: {partner.name}
          </h1>
          <p className="text-gray-500">
            Details, areas, professionals & services
          </p>
        </div>
      </div>

      {/* Partner details */}
      <section className="mb-8">
        <h2 className="text-sm font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4">
          Partner details
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Name</p>
            <p className="font-bold dark:text-white">{partner.name}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">
              Owner / Manager
            </p>
            <p className="font-bold dark:text-white">{partner.ownerName}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Email</p>
            <p className="dark:text-white">{partner.email || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Phone</p>
            <p className="dark:text-white">{partner.phone || "—"}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs font-bold text-gray-400 uppercase">Address</p>
            <p className="dark:text-white">{partner.address || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">
              Commission
            </p>
            <p className="font-black dark:text-white">
              {(partner as any).commissionRate ?? partner.commissionRate}%
            </p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Status</p>
            <span
              className={`text-xs font-black px-2 py-1 rounded-full uppercase ${
                partner.isActive
                  ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
              }`}
            >
              {partner.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </section>

      {/* Assigned areas */}
      <section className="mb-8">
        <h2 className="text-sm font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4">
          Assigned areas
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          {assignedAreas.length === 0 ? (
            <p className="text-gray-500 italic">No areas assigned</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {assignedAreas.map((area) => (
                <span
                  key={area.id || area._id}
                  className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-bold text-sm"
                >
                  {area.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Professionals */}
      <section className="mb-8">
        <h2 className="text-sm font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4">
          Professionals ({professionals.length})
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {professionals.length === 0 ? (
            <div className="p-6">
              <p className="text-gray-500 italic">No professionals under this partner</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-4 py-3 text-xs font-black uppercase text-gray-500 dark:text-gray-400">
                    Name
                  </th>
                  <th className="px-4 py-3 text-xs font-black uppercase text-gray-500 dark:text-gray-400">
                    Email
                  </th>
                  <th className="px-4 py-3 text-xs font-black uppercase text-gray-500 dark:text-gray-400">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-xs font-black uppercase text-gray-500 dark:text-gray-400">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {professionals.map((pro: any) => (
                  <tr key={pro.id || pro._id}>
                    <td className="px-4 py-3 font-medium dark:text-white">
                      {pro.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      {pro.email || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      {pro.phone || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded ${
                          pro.isVerified
                            ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                        }`}
                      >
                        {pro.isVerified ? "Verified" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Services & prices */}
      <section>
        <h2 className="text-sm font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4">
          Services & prices
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {partnerConfigs.length === 0 ? (
            <div className="p-6">
              <p className="text-gray-500 italic">
                No service configs. Use &quot;Manage Services&quot; from Partners to set prices per area.
              </p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-4 py-3 text-xs font-black uppercase text-gray-500 dark:text-gray-400">
                    Service
                  </th>
                  <th className="px-4 py-3 text-xs font-black uppercase text-gray-500 dark:text-gray-400">
                    Area
                  </th>
                  <th className="px-4 py-3 text-xs font-black uppercase text-gray-500 dark:text-gray-400">
                    Price (₹)
                  </th>
                  <th className="px-4 py-3 text-xs font-black uppercase text-gray-500 dark:text-gray-400">
                    Enabled
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {partnerConfigs.map((c: any, i: number) => {
                  const price =
                    c.customPrice !== undefined && c.customPrice !== null
                      ? c.customPrice
                      : getServicePrice(c.serviceId);
                  return (
                    <tr key={c._id || `${c.serviceId}-${c.areaId}-${i}`}>
                      <td className="px-4 py-3 font-medium dark:text-white">
                        {getServiceTitle(c.serviceId)}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                        {getAreaName(c.areaId)}
                      </td>
                      <td className="px-4 py-3 font-bold dark:text-white">
                        ₹{price}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded ${
                            c.isEnabled
                              ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                              : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                          }`}
                        >
                          {c.isEnabled ? "Yes" : "No"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
};
