import React, { useState, useEffect, useCallback } from "react";
import { NavigationProps } from "../types";
import { adminService } from "../services/api";
import { ServiceTree } from "../components/ServiceTree";

export const ServicesPage: React.FC<NavigationProps> = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [cats, subCats, servs] = await Promise.all([
        adminService.getCategories(),
        adminService.getSubCategories(),
        adminService.getServices(),
      ]);
      setCategories(cats);
      setSubCategories(subCats);
      setServices(servs);
    } catch (error) {
      console.error("Failed to fetch services data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Services Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage categories, sub-categories, and service pricing
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 border border-gray-200 dark:border-gray-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <span className="material-symbols-outlined text-lg">add</span>
            Add Category
          </button>
          <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dim transition-colors">
            <span className="material-symbols-outlined text-lg">add</span>
            Add Service
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <ServiceTree
          categories={categories}
          subCategories={subCategories}
          services={services}
          onUpdate={fetchData}
        />
      )}
    </div>
  );
};
