import React, { useState, useEffect } from "react";
import { NavigationProps } from "../types";
import { adminService } from "../services/api";

export const ServicesPage: React.FC<NavigationProps> = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, servs] = await Promise.all([
          adminService.getCategories(),
          adminService.getServices(),
        ]);
        setCategories(cats);
        setServices(servs);
      } catch (error) {
        console.error("Failed to fetch services data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Services
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage service catalog and pricing
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

      {/* Categories Grid */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <div
              key={category._id}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:border-primary/50 transition-colors cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-primary text-2xl">
                  {category.icon}
                </span>
              </div>
              <h3 className="font-bold">{category.name}</h3>
              <p className="text-sm text-gray-500">
                {services.filter((s) => s.categoryId === category._id).length}{" "}
                services
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Services Table */}
      <div>
        <h2 className="text-lg font-bold mb-4">All Services</h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {services.map((service) => {
                const category = categories.find(
                  (c) => c._id === service.categoryId,
                );
                return (
                  <tr
                    key={service._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium">{service.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-gray-400 text-lg">
                          {category?.icon}
                        </span>
                        <span className="text-sm">{category?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold">₹{service.price}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {service.duration}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded ${
                          service.isActive
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                        }`}
                      >
                        {service.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-lg">
                            edit
                          </span>
                        </button>
                        <button
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                          title="Toggle Status"
                        >
                          <span className="material-symbols-outlined text-lg">
                            {service.isActive ? "visibility_off" : "visibility"}
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
