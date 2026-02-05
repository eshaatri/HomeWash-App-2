
import React from 'react';
import { AppScreen, NavigationProps } from '../types';
import { SUB_CATEGORIES_DB } from '../mockData';

export const SubCategoryScreen: React.FC<NavigationProps> = ({ navigateTo, selectedCategory, setSelectedSubCategoryId }) => {
  // Use selectedCategory ID to fetch data, fallback to Home Cleaning ('c1') if not found/null
  const categoryData = selectedCategory && SUB_CATEGORIES_DB[selectedCategory.id] 
    ? SUB_CATEGORIES_DB[selectedCategory.id] 
    : SUB_CATEGORIES_DB['c1'];

  return (
    <div className="fixed inset-0 flex flex-col justify-end z-[70] font-display antialiased">
      {/* Backdrop */}
      <div 
        onClick={() => navigateTo(AppScreen.HOME)}
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-300"
      ></div>

      {/* Pop-up Drawer */}
      <div className="relative w-full bg-white dark:bg-[#121212] rounded-t-[32px] shadow-[0_-8px_40px_rgba(0,0,0,0.15)] overflow-hidden animate-in slide-in-from-bottom duration-500 max-h-[75vh] flex flex-col transition-colors">
        
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
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <h1 className="text-xl font-bold tracking-tight text-onyx dark:text-white">{categoryData.title}</h1>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-5 space-y-8 overflow-y-auto no-scrollbar pb-10">
          {categoryData.sections.map((section, idx) => (
            <div key={idx}>
              <h2 className="text-lg font-bold mb-5 text-onyx dark:text-white">{section.title}</h2>
              <div className="grid grid-cols-4 gap-x-2 gap-y-8">
                {section.items.map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => {
                      setSelectedSubCategoryId(item.id);
                      navigateTo(AppScreen.SERVICE_SELECTION);
                    }}
                    className="flex flex-col items-center gap-2.5 group w-full"
                  >
                    <div className={`h-16 w-16 rounded-[20px] flex items-center justify-center shadow-sm transition-all duration-300 active:scale-90 group-hover:shadow-md overflow-hidden ${item.image ? 'bg-white border border-gray-100 dark:border-white/10' : (item.color.split(' ')[0] || 'bg-gray-50')}`}>
                      {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                          <span className={`material-symbols-outlined text-[28px] ${item.color.split(' ')[1] || 'text-gray-600'}`}>
                            {item.icon}
                          </span>
                      )}
                    </div>
                    <span className="text-[11px] font-bold text-center leading-tight text-onyx dark:text-gray-300 w-full px-1 break-words">
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
