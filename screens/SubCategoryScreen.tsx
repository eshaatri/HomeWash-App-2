import React from 'react';
import { AppScreen, NavigationProps } from '../types';
import { SUB_CATEGORIES_DATA } from '../mockData';

export const SubCategoryScreen: React.FC<NavigationProps> = ({ navigateTo }) => {
  return (
    <div className="bg-white dark:bg-[#121212] min-h-screen flex flex-col font-display text-onyx dark:text-white pb-safe transition-colors duration-300">
      {/* Header with Title and Close */}
      <div className="sticky top-0 z-40 flex items-center justify-between p-5 bg-white/90 dark:bg-[#121212]/90 backdrop-blur-md border-b border-gray-100 dark:border-white/5">
        <h1 className="text-xl font-bold tracking-tight">{SUB_CATEGORIES_DATA.title}</h1>
        <button 
          onClick={() => navigateTo(AppScreen.HOME)}
          className="h-9 w-9 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      <div className="p-5 space-y-8">
        {SUB_CATEGORIES_DATA.sections.map((section, idx) => (
          <div key={idx}>
            <h2 className="text-lg font-bold mb-4">{section.title}</h2>
            <div className="grid grid-cols-4 gap-x-2 gap-y-6">
              {section.items.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => navigateTo(AppScreen.SERVICE_SELECTION)}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className={`h-16 w-16 rounded-2xl flex items-center justify-center shadow-sm transition-transform active:scale-95 group-hover:shadow-md ${item.color.split(' ')[0] || 'bg-gray-50'}`}>
                    <span className={`material-symbols-outlined text-[28px] ${item.color.split(' ')[1] || 'text-gray-600'}`}>
                      {item.icon}
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-center leading-tight text-gray-700 dark:text-gray-300 max-w-[64px]">
                    {item.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Bottom padding for scrolling comfort */}
      <div className="h-10"></div>
    </div>
  );
};
