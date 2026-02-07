import React from "react";
import { AppScreen, NavigationProps } from "../types";
import { SUB_CATEGORIES_DB } from "../mockData";

export const SubCategoryScreen: React.FC<NavigationProps> = ({
  navigateTo,
  selectedCategory,
  setSelectedSubCategoryId,
}) => {
  // Use selectedCategory ID to fetch data, fallback to Home Cleaning ('c1') if not found/null
  const categoryData =
    selectedCategory && SUB_CATEGORIES_DB[selectedCategory.id]
      ? SUB_CATEGORIES_DB[selectedCategory.id]
      : SUB_CATEGORIES_DB["c1"];

  return (
    <div className="fixed inset-0 flex flex-col justify-end z-[70] font-display antialiased">
      {/* Backdrop */}
      <div
        onClick={() => navigateTo(AppScreen.HOME)}
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] fade-in-enter"
      ></div>

      {/* Pop-up Drawer */}
      <div className="relative w-full bg-white dark:bg-[#121212] rounded-t-[32px] shadow-[0_-8px_40px_rgba(0,0,0,0.15)] overflow-hidden slide-up-enter max-h-[75vh] flex flex-col transition-colors">
        {/* Grabber Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-200 dark:bg-white/10"></div>
        </div>

        {/* Header with Back Button and Title */}
        <div className="flex items-center gap-3 p-4 bg-white/90 dark:bg-[#121212]/90 backdrop-blur-md border-b border-gray-100 dark:border-white/5">
          <button
            onClick={() => navigateTo(AppScreen.HOME)}
            className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">
              arrow_back
            </span>
          </button>
          <h1 className="text-xl font-bold tracking-tight text-onyx dark:text-white">
            {categoryData.title}
          </h1>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-5 space-y-8 overflow-y-auto no-scrollbar pb-10">
          {categoryData.sections.map((section, idx) => (
            <div key={idx}>
              <h2 className="text-lg font-bold mb-5 text-onyx dark:text-white">
                {section.title}
              </h2>
              <div className="grid grid-cols-4 gap-x-2 gap-y-8">
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedSubCategoryId(item.id);
                      navigateTo(AppScreen.SERVICE_SELECTION);
                    }}
                    className="flex flex-col items-center gap-3 group w-full"
                  >
                    {/* Premium Button Container */}
                    <div
                      className={`
                        relative w-[72px] h-[72px] rounded-[24px] flex items-center justify-center 
                        shadow-[0_10px_20px_-8px_rgba(0,0,0,0.1),_inset_0_-2px_4px_rgba(0,0,0,0.02)] 
                        transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)]
                        group-hover:-translate-y-1 group-hover:shadow-[0_20px_30px_-12px_rgba(0,0,0,0.15)]
                        active:scale-95 active:shadow-none
                        border border-gray-100 dark:border-white/10
                        overflow-hidden
                        ${item.image ? "bg-white" : item.color.split(" ")[0] || "bg-gray-50"}
                    `}
                    >
                      {item.image ? (
                        <>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              e.currentTarget.nextElementSibling?.classList.remove(
                                "hidden",
                              );
                            }}
                          />
                          {/* Fallback Icon (Hidden by default) */}
                          <span
                            className={`hidden material-symbols-outlined text-[32px] ${item.color.split(" ")[1] || "text-gray-600"}`}
                          >
                            {item.icon}
                          </span>
                        </>
                      ) : (
                        <span
                          className={`material-symbols-outlined text-[32px] drop-shadow-sm ${item.color.split(" ")[1] || "text-gray-600"}`}
                        >
                          {item.icon}
                        </span>
                      )}

                      {/* Gloss Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 pointer-events-none opacity-50"></div>
                    </div>

                    {/* Label */}
                    <span className="text-[12px] font-semibold text-center leading-[1.3] text-gray-700 dark:text-gray-300 w-full px-1 break-words line-clamp-2 tracking-tight group-hover:text-black dark:group-hover:text-white transition-colors">
                      {item.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
