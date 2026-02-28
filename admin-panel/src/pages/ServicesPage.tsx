import React, { useState, useEffect } from "react";
import { NavigationProps } from "../types";
import { adminService } from "../services/api";

export const ServicesPage: React.FC<NavigationProps> = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Tree State
  const [expandedCategories, setExpandedCategories] =
    useState<Record<string, boolean>>({});

  // Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [editingService, setEditingService] = useState<any>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [cats, servs] = await Promise.all([
        adminService.getCategories(),
        adminService.getServices(),
      ]);
      // Normalise IDs from backend (which exposes `id` in toJSON)
      setCategories(
        cats.map((c: any) => ({
          ...c,
          _id: c._id || c.id,
        })),
      );
      setServices(
        servs.map((s: any) => ({
          ...s,
          _id: s._id || s.id,
        })),
      );
    } catch (error) {
      console.error("Failed to fetch services data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  // --- Category Actions ---
  const handleOpenCategoryModal = (category: any = null) => {
    setEditingCategory(category || { name: "", icon: "", color: "" });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory._id) {
        await adminService.updateCategory(editingCategory._id, editingCategory);
      } else {
        await adminService.createCategory(editingCategory);
      }
      setIsCategoryModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Failed to save category", error);
      alert("Failed to save category. Please ensure the backend server is running.");
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await adminService.deleteCategory(categoryId);
        fetchData();
      } catch (error) {
        console.error("Failed to delete category", error);
        alert("Failed to delete category. Please ensure the backend server is running.");
      }
    }
  };

  // --- Service Actions ---
  const handleOpenServiceModal = (service: any = null, categoryId?: string) => {
    setEditingService(
      service || {
        title: "",
        price: 0,
        duration: "",
        description: "",
        image: "",
        categoryId:
          categoryId || (categories.length > 0 ? categories[0]._id : ""),
      },
    );
    setIsServiceModalOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingService._id) {
        await adminService.updateService(editingService._id, editingService);
      } else {
        await adminService.createService(editingService);
      }
      setIsServiceModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Failed to save service", error);
      alert("Failed to save service. Please ensure the backend server is running.");
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await adminService.deleteService(serviceId);
        fetchData();
      } catch (error) {
        console.error("Failed to delete service", error);
        alert("Failed to delete service. Please ensure the backend server is running.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Services & Categories
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage service catalog and pricing in a hierarchical view
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => handleOpenCategoryModal()}
            className="flex items-center gap-2 border border-gray-200 dark:border-gray-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Add Category
          </button>
          <button
            onClick={() => handleOpenServiceModal()}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dim transition-colors"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Add Service
          </button>
        </div>
      </div>

      {/* Tree View */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {categories.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No categories found. Create one to get started.</div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {categories.map((category) => {
              const categoryServices = services.filter(s => s.categoryId === category._id);
              const isExpanded = !!expandedCategories[category._id];

              return (
                <div key={category._id} className="flex flex-col">
                  {/* Category Row */}
                  <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div
                      className="flex items-center gap-3 cursor-pointer flex-1"
                      onClick={() => toggleCategory(category._id)}
                    >
                      <span className="material-symbols-outlined text-gray-400">
                        {isExpanded ? 'expand_more' : 'chevron_right'}
                      </span>
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary">
                          {category.icon || 'category'}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{category.name}</h3>
                        <p className="text-sm text-gray-500">{categoryServices.length} services</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenServiceModal(null, category._id)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors text-primary"
                        title="Add Service to Category"
                      >
                        <span className="material-symbols-outlined text-lg">add_circle</span>
                      </button>
                      <button
                        onClick={() => handleOpenCategoryModal(category)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                        title="Edit Category"
                      >
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category._id)}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-lg transition-colors"
                        title="Delete Category"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Services List (Children) */}
                  {isExpanded && (
                    <div className="bg-gray-50/50 dark:bg-gray-800/50 pl-14 pr-4 py-2 divide-y divide-gray-100 dark:divide-gray-700/50">
                      {categoryServices.length === 0 ? (
                        <p className="text-sm text-gray-500 py-3 italic">No services in this category.</p>
                      ) : (
                        categoryServices.map((service) => (
                          <div key={service._id} className="flex items-center justify-between py-3">
                            <div className="flex items-center gap-4">
                              {service.image ? (
                                <img src={service.image} alt={service.title} className="w-12 h-12 rounded object-cover" />
                              ) : (
                                <div className="w-12 h-12 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                  <span className="material-symbols-outlined text-gray-400">image</span>
                                </div>
                              )}
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">{service.title}</h4>
                                <div className="flex gap-4 text-sm text-gray-500 mt-1">
                                  <span>₹{service.price}</span>
                                  <span>•</span>
                                  <span>{service.duration}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleOpenServiceModal(service, category._id)}
                                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                                title="Edit Service"
                              >
                                <span className="material-symbols-outlined text-lg">edit</span>
                              </button>
                              <button
                                onClick={() => handleDeleteService(service._id)}
                                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-lg transition-colors"
                                title="Delete Service"
                              >
                                <span className="material-symbols-outlined text-lg">delete</span>
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Category Modal */}
      {isCategoryModalOpen && editingCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">{editingCategory._id ? "Edit Category" : "Add Category"}</h2>
            <form onSubmit={handleSaveCategory}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={editingCategory.name}
                    onChange={e => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Icon (Material Symbol)</label>
                  <input
                    type="text"
                    required
                    value={editingCategory.icon}
                    onChange={e => setEditingCategory({ ...editingCategory, icon: e.target.value })}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-transparent"
                    placeholder="e.g., cleaning_services"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Color (Hex/Tailwind class)</label>
                  <input
                    type="text"
                    required
                    value={editingCategory.color}
                    onChange={e => setEditingCategory({ ...editingCategory, color: e.target.value })}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-transparent"
                    placeholder="e.g., #3b82f6 or blue-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg font-medium"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Service Modal */}
      {isServiceModalOpen && editingService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editingService._id ? "Edit Service" : "Add Service"}</h2>
            <form onSubmit={handleSaveService}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    required
                    value={editingService.categoryId}
                    onChange={e => setEditingService({ ...editingService, categoryId: e.target.value })}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-800"
                  >
                    <option value="" disabled>Select Category</option>
                    {categories.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={editingService.title}
                    onChange={e => setEditingService({ ...editingService, title: e.target.value })}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-transparent"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={editingService.price}
                      onChange={e => setEditingService({ ...editingService, price: Number(e.target.value) })}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-transparent"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Duration</label>
                    <input
                      type="text"
                      required
                      value={editingService.duration}
                      onChange={e => setEditingService({ ...editingService, duration: e.target.value })}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-transparent"
                      placeholder="e.g., 2 hrs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={editingService.description}
                    onChange={e => setEditingService({ ...editingService, description: e.target.value })}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Image URL</label>
                  <input
                    type="text"
                    required
                    value={editingService.image}
                    onChange={e => setEditingService({ ...editingService, image: e.target.value })}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg font-medium"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
