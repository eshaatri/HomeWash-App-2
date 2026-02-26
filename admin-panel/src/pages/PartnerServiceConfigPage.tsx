import React, { useState, useEffect, useCallback } from "react";
import { NavigationProps, Partner } from "../types";
import { adminService } from "../services/api";

interface PartnerServiceConfigPageProps extends NavigationProps {
  selectedPartnerId?: string;
  onBack?: () => void;
}

export const PartnerServiceConfigPage: React.FC<
  PartnerServiceConfigPageProps
> = ({ selectedPartnerId, onBack }) => {
  const [partner, setPartner] = useState<Partner | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [partnerConfigs, setPartnerConfigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeAreaId, setActiveAreaId] = useState<string>("");
  const [areas, setAreas] = useState<any[]>([]);

  const fetchData = useCallback(async () => {
    if (!selectedPartnerId) return;
    try {
      setLoading(true);
      const [parts, cats, subCats, servs, configs, allAreas] =
        await Promise.all([
          adminService.getPartners(),
          adminService.getCategories(),
          adminService.getSubCategories(),
          adminService.getServices(),
          adminService.getPartnerConfigs(selectedPartnerId),
          adminService.getAreas(),
        ]);

      const currentPartner = parts.find(
        (p: any) => (p.id || p._id) === selectedPartnerId,
      );
      setPartner(currentPartner);
      setCategories(cats);
      setSubCategories(subCats);
      setServices(servs);
      setPartnerConfigs(configs);

      // Filter areas that this partner is active in
      const partnerAreas = allAreas.filter((a: any) =>
        currentPartner?.activeAreas?.includes(a.name),
      );
      setAreas(partnerAreas);
      if (partnerAreas.length > 0 && !activeAreaId) {
        setActiveAreaId(partnerAreas[0]._id || partnerAreas[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedPartnerId, activeAreaId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleToggleService = async (
    serviceId: string,
    currentState: boolean,
  ) => {
    if (!activeAreaId || !selectedPartnerId) return;
    try {
      const config = partnerConfigs.find(
        (c) => c.serviceId === serviceId && c.areaId === activeAreaId,
      );

      await adminService.updatePartnerConfig({
        partnerId: selectedPartnerId,
        serviceId,
        areaId: activeAreaId,
        isEnabled: !currentState,
        customPrice: config?.customPrice,
      });
      fetchData();
    } catch (error) {
      alert("Failed to update service status");
    }
  };

  const handlePriceChange = async (serviceId: string, newPrice: number) => {
    if (!activeAreaId || !selectedPartnerId) return;
    try {
      const config = partnerConfigs.find(
        (c) => c.serviceId === serviceId && c.areaId === activeAreaId,
      );

      await adminService.updatePartnerConfig({
        partnerId: selectedPartnerId,
        serviceId,
        areaId: activeAreaId,
        isEnabled: config ? config.isEnabled : true,
        customPrice: newPrice,
      });
      fetchData();
    } catch (error) {
      alert("Failed to update price");
    }
  };

  if (loading && !partner) {
    return <div className="p-6">Loading config...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h1 className="text-2xl font-bold dark:text-white">
            Service Pricing: {partner?.name}
          </h1>
          <p className="text-gray-500">
            Configure prices and availability per area
          </p>
        </div>
      </div>

      {/* Area Selector */}
      <div className="flex gap-2 mb-8 bg-white dark:bg-gray-800 p-2 rounded-xl border border-gray-200 dark:border-gray-700 overflow-x-auto">
        {areas.map((area) => (
          <button
            key={area._id || area.id}
            onClick={() => setActiveAreaId(area._id || area.id)}
            className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${
              activeAreaId === (area._id || area.id)
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            {area.name}
          </button>
        ))}
        {areas.length === 0 && (
          <p className="p-2 text-sm text-gray-400 italic">
            No active areas assigned to this partner.
          </p>
        )}
      </div>

      {activeAreaId && (
        <div className="space-y-6">
          {categories.map((category) => (
            <div
              key={category._id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm"
            >
              <div className="bg-gray-50 dark:bg-gray-700/30 p-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">
                  {category.icon}
                </span>
                <h3 className="font-black uppercase tracking-widest text-sm text-gray-700 dark:text-gray-200">
                  {category.name}
                </h3>
              </div>

              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {subCategories
                  .filter((sc) => sc.categoryId === category._id)
                  .map((subCategory) => (
                    <div key={subCategory._id} className="p-4">
                      <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 px-2">
                        {subCategory.name}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {services
                          .filter(
                            (s) =>
                              s.categoryId === category._id &&
                              s.subCategoryId === subCategory.originalId,
                          )
                          .map((service) => {
                            const config = partnerConfigs.find(
                              (c) =>
                                c.serviceId === (service._id || service.id) &&
                                c.areaId === activeAreaId,
                            );
                            const isEnabled = config ? config.isEnabled : true;
                            const price = config?.customPrice ?? service.price;
                            const isOverridden =
                              config?.customPrice !== undefined;

                            return (
                              <div
                                key={service._id}
                                className={`p-4 rounded-xl border transition-all ${
                                  isEnabled
                                    ? "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800"
                                    : "bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 opacity-60"
                                }`}
                              >
                                <div className="flex justify-between items-start mb-3">
                                  <p className="font-bold text-sm leading-tight">
                                    {service.title}
                                  </p>
                                  <button
                                    onClick={() =>
                                      handleToggleService(
                                        service._id,
                                        isEnabled,
                                      )
                                    }
                                    className={`w-10 h-5 rounded-full p-1 transition-colors ${isEnabled ? "bg-green-500" : "bg-gray-400"}`}
                                  >
                                    <div
                                      className={`w-3 h-3 bg-white rounded-full transition-transform ${isEnabled ? "translate-x-5" : ""}`}
                                    />
                                  </button>
                                </div>

                                <div className="mt-4 flex items-center justify-between">
                                  <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase text-gray-400">
                                      Base Price
                                    </span>
                                    <span className="text-xs font-bold text-gray-500">
                                      ₹{service.price}
                                    </span>
                                  </div>
                                  <div className="flex flex-col items-end">
                                    <span
                                      className={`text-[10px] font-black uppercase ${isOverridden ? "text-primary" : "text-gray-400"}`}
                                    >
                                      {isOverridden
                                        ? "Custom Price"
                                        : "Current Price"}
                                    </span>
                                    <div className="flex items-center gap-1">
                                      <span className="text-sm font-black">
                                        ₹
                                      </span>
                                      <input
                                        type="number"
                                        className="w-20 bg-transparent border-b border-gray-200 dark:border-gray-700 focus:border-primary focus:outline-none text-right font-black"
                                        value={price}
                                        onChange={(e) =>
                                          handlePriceChange(
                                            service._id,
                                            Number(e.target.value),
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
