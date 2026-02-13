import React, { useState } from "react";
import { adminService } from "../services/api";

interface Category {
  _id: string;
  name: string;
  icon: string;
  color: string;
}

interface SubCategory {
  _id: string;
  name: string;
  categoryId: string;
  sectionTitle: string;
  originalId: string;
}

interface Service {
  _id: string;
  title: string;
  price: number;
  categoryId: string;
  subCategoryId?: string;
}

interface ServiceTreeProps {
  categories: Category[];
  subCategories: SubCategory[];
  services: Service[];
  onUpdate: () => void;
}

export const ServiceTree: React.FC<ServiceTreeProps> = ({
  categories,
  subCategories,
  services,
  onUpdate,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<any>({});

  const handleEdit = (
    item: any,
    type: "category" | "subcategory" | "service",
  ) => {
    setEditingId(item._id);
    setEditValues({ ...item, type });
  };

  const handleSave = async () => {
    try {
      if (editValues.type === "category") {
        await adminService.updateCategory(editingId!, {
          name: editValues.name,
        });
      } else if (editValues.type === "subcategory") {
        await adminService.updateSubCategory(editingId!, {
          name: editValues.name,
        });
      } else if (editValues.type === "service") {
        await adminService.updateService(editingId!, {
          title: editValues.title,
          price: Number(editValues.price),
        });
      }
      setEditingId(null);
      setEditValues({});
      onUpdate();
    } catch (error) {
      console.error("Failed to update item:", error);
      alert("Failed to update item");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({});
  };

  const handleChange = (field: string, value: any) => {
    setEditValues((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <div
          key={category._id}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          {/* Level 1: Category Header */}
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-gray-500">
                {category.icon}
              </span>
              {editingId === category._id ? (
                <input
                  type="text"
                  value={editValues.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
                />
              ) : (
                <h3 className="font-bold text-lg">{category.name}</h3>
              )}
            </div>
            <div className="flex gap-2">
              {editingId === category._id ? (
                <>
                  <button
                    onClick={handleSave}
                    className="text-green-600 hover:text-green-700"
                  >
                    <span className="material-symbols-outlined">check</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="text-red-600 hover:text-red-700"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleEdit(category, "category")}
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">
                    edit
                  </span>
                </button>
              )}
            </div>
          </div>

          <div className="p-4">
            {/* Level 2: SubCategories (grouped by sectionTitle conceptually, but flat list per category for now) */}
            {subCategories
              .filter((sc) => sc.categoryId === category._id)
              .map((subCategory) => (
                <div
                  key={subCategory._id}
                  className="ml-6 mb-6 border-l-2 border-gray-100 dark:border-gray-700 pl-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                        {subCategory.sectionTitle}
                      </span>
                      {editingId === subCategory._id ? (
                        <input
                          type="text"
                          value={editValues.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
                        />
                      ) : (
                        <h4 className="font-semibold text-gray-700 dark:text-gray-300">
                          {subCategory.name}
                        </h4>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {editingId === subCategory._id ? (
                        <>
                          <button
                            onClick={handleSave}
                            className="text-green-600"
                          >
                            <span className="material-symbols-outlined text-lg">
                              check
                            </span>
                          </button>
                          <button
                            onClick={handleCancel}
                            className="text-red-600"
                          >
                            <span className="material-symbols-outlined text-lg">
                              close
                            </span>
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleEdit(subCategory, "subcategory")}
                          className="text-gray-400 hover:text-primary"
                        >
                          <span className="material-symbols-outlined text-sm">
                            edit
                          </span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Level 3: Services */}
                  <div className="space-y-2 ml-4">
                    {services
                      .filter(
                        (s) =>
                          s.categoryId === category._id &&
                          s.subCategoryId === subCategory.originalId,
                      )
                      .map((service) => (
                        <div
                          key={service._id}
                          className="flex items-center justify-between bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors group"
                        >
                          <div className="flex-1">
                            {editingId === service._id ? (
                              <input
                                type="text"
                                value={editValues.title}
                                onChange={(e) =>
                                  handleChange("title", e.target.value)
                                }
                                className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 mb-1"
                              />
                            ) : (
                              <p className="font-medium text-sm">
                                {service.title}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-4 ml-4">
                            <div className="w-24 text-right">
                              {editingId === service._id ? (
                                <input
                                  type="number"
                                  value={editValues.price}
                                  onChange={(e) =>
                                    handleChange("price", e.target.value)
                                  }
                                  className="w-full text-right bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
                                />
                              ) : (
                                <span className="font-bold text-sm">
                                  ₹{service.price}
                                </span>
                              )}
                            </div>
                            <div className="w-8 flex justify-end">
                              {editingId === service._id ? (
                                <>
                                  <button
                                    onClick={handleSave}
                                    className="text-green-600 mr-1"
                                  >
                                    <span className="material-symbols-outlined text-lg">
                                      check
                                    </span>
                                  </button>
                                  <button
                                    onClick={handleCancel}
                                    className="text-red-600"
                                  >
                                    <span className="material-symbols-outlined text-lg">
                                      close
                                    </span>
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => handleEdit(service, "service")}
                                  className="text-gray-300 group-hover:text-primary transition-colors"
                                >
                                  <span className="material-symbols-outlined text-lg">
                                    edit
                                  </span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    {services.filter(
                      (s) =>
                        s.categoryId === category._id &&
                        s.subCategoryId === subCategory.originalId,
                    ).length === 0 && (
                      <p className="text-xs text-gray-400 italic px-3">
                        No services found
                      </p>
                    )}
                  </div>
                </div>
              ))}
            {subCategories.filter((sc) => sc.categoryId === category._id)
              .length === 0 && (
              <div className="p-4 text-center text-gray-400">
                No subcategories found.
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
