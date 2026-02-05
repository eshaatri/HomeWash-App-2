
import React, { useState } from 'react';
import { AppScreen, NavigationProps, Service, CartItem } from '../types';
import { SERVICES, SUB_CATEGORIES_DB, ExtendedService } from '../mockData';

export const ServiceSelectionScreen: React.FC<NavigationProps> = ({ navigateTo, selectedCategory, cart, addToCart, decreaseQuantity, setSelectedService }) => {
  // Use the context of the category from which the user arrived
  const catId = selectedCategory?.id || 'c1';
  const categoryMeta = SUB_CATEGORIES_DB[catId] || SUB_CATEGORIES_DB['c1'];
  
  // State for sub-category selection
  const [activeSubId, setActiveSubId] = useState<string>(categoryMeta.sections[0].items[0].id);

  // Filter services based on category and sub-category
  const filteredServices = SERVICES.filter(s => s.categoryId === catId && s.subCategoryId === activeSubId);

  const cartTotal = cart.reduce((sum, item) => sum + (item.service.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleServiceClick = (service: ExtendedService) => {
    // Check if it's one of the configurable apartment services
    if (service.id === 's1' || service.id === 's1_un') {
        setSelectedService(service);
        navigateTo(AppScreen.SERVICE_DETAIL);
    } else {
        // Default behavior (optional: could also go to detail, but for now we keep add logic for others or just expand)
        // For consistency, let's just use the existing add/remove logic for non-complex items
    }
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden bg-white dark:bg-[#050505] font-display text-onyx dark:text-white antialiased transition-colors duration-300">
      
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white/95 dark:bg-[#050505]/95 backdrop-blur-md border-b border-gray-100 dark:border-white/5">
        <div className="flex items-center p-4 gap-4">
          <button 
            onClick={() => navigateTo(AppScreen.HOME)}
            className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10"
          >
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">search</span>
            <input 
              type="text" 
              placeholder={`Search in ${categoryMeta.title}`}
              className="w-full h-11 bg-gray-50 dark:bg-white/5 rounded-lg pl-10 pr-4 text-sm font-medium border-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      <main className="flex-1 pb-32">
        {/* Category Header */}
        <div className="px-5 py-6 border-b border-gray-100 dark:border-white/5">
          <h1 className="text-3xl font-black tracking-tight mb-2">in {categoryMeta.title}</h1>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center h-5 w-5 rounded-full bg-primary text-black">
              <span className="material-symbols-outlined text-[12px] font-bold fill-1">star</span>
            </div>
            <p className="text-sm font-bold">4.82 <span className="text-gray-400 font-medium">(1.5 M bookings)</span></p>
          </div>
        </div>

        {/* Sub-Category Selector (Horizontal Icons) */}
        <div className="px-5 py-6 bg-gray-50/50 dark:bg-white/[0.02]">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-5">Select a service</p>
          <div className="grid grid-cols-4 gap-3">
            {categoryMeta.sections[0].items.map((item) => {
              const isActive = activeSubId === item.id;
              return (
                <button 
                  key={item.id}
                  onClick={() => setActiveSubId(item.id)}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className={`relative h-16 w-16 rounded-2xl flex items-center justify-center transition-all duration-300 overflow-hidden ${
                    isActive 
                      ? 'bg-white dark:bg-[#1a1a1a] shadow-md ring-2 ring-primary' 
                      : 'bg-white dark:bg-[#111] border border-gray-200 dark:border-white/5 grayscale-[0.5]'
                  }`}>
                    <img src={item.image || `https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=200&h=200`} className="absolute inset-0 w-full h-full object-cover opacity-20" alt="" />
                    <span className={`material-symbols-outlined text-[24px] relative z-10 ${isActive ? 'text-primary' : 'text-gray-400'}`}>
                      {item.icon}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold text-center leading-tight transition-colors ${isActive ? 'text-onyx dark:text-white' : 'text-gray-400'}`}>
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Service Section Heading */}
        <div className="px-5 py-6">
          <h2 className="text-2xl font-black tracking-tight">{categoryMeta.sections[0].items.find(i => i.id === activeSubId)?.name}</h2>
        </div>

        {/* Detailed Service Cards */}
        <div className="space-y-4 px-5">
          {filteredServices.length > 0 ? (
            filteredServices.map((service: ExtendedService) => {
              const cartItem = cart.find(ci => ci.service.id === service.id);
              const qty = cartItem ? cartItem.quantity : 0;
              const isConfigurable = service.id === 's1' || service.id === 's1_un';
              
              return (
                <div key={service.id} className="relative bg-white dark:bg-[#111] rounded-2xl p-5 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <h3 
                        className="text-lg font-black leading-tight mb-1 cursor-pointer hover:text-primary transition-colors"
                        onClick={() => isConfigurable && handleServiceClick(service)}
                      >
                        {service.title}
                      </h3>
                      
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className="flex items-center gap-0.5 text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                          <span className="material-symbols-outlined text-[12px] fill-1">star</span>
                          {service.rating}
                        </div>
                        <span className="text-[11px] text-gray-400 font-medium">({service.reviews})</span>
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-base font-black">Starts at ₹{service.price}</span>
                        <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                        <span className="text-xs text-gray-400 font-medium">{service.duration}</span>
                      </div>

                      {/* Inclusions */}
                      <ul className="space-y-2 mb-4">
                        {service.inclusions?.map((inc, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                            <span className="h-1 w-1 rounded-full bg-gray-400 mt-1.5 shrink-0"></span>
                            {inc}
                          </li>
                        ))}
                      </ul>

                      <button 
                        onClick={() => isConfigurable ? handleServiceClick(service) : null}
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        View details
                      </button>
                    </div>

                    <div className="flex flex-col items-center gap-3">
                      <div className="h-28 w-28 rounded-xl overflow-hidden shadow-inner border border-gray-100 dark:border-white/10">
                        <img src={service.image} className="h-full w-full object-cover" alt={service.title} />
                      </div>
                      
                      {isConfigurable ? (
                        <button 
                            onClick={() => handleServiceClick(service)}
                            className="w-full h-10 bg-white dark:bg-[#1a1a1a] text-primary border border-primary/40 rounded-lg font-black text-xs uppercase tracking-widest shadow-sm active:scale-95 transition-all"
                        >
                            Select
                        </button>
                      ) : (
                        qty === 0 ? (
                            <button 
                            onClick={() => addToCart(service)}
                            className="w-full h-10 bg-white dark:bg-[#1a1a1a] text-primary border border-primary/40 rounded-lg font-black text-xs uppercase tracking-widest shadow-sm active:scale-95 transition-all"
                            >
                            Add
                            </button>
                        ) : (
                            <div className="flex items-center w-full h-10 bg-primary rounded-lg overflow-hidden shadow-lg shadow-primary/20">
                            <button onClick={() => decreaseQuantity(service)} className="flex-1 h-full flex items-center justify-center text-black active:bg-black/10">
                                <span className="material-symbols-outlined text-sm font-bold">remove</span>
                            </button>
                            <span className="px-1 text-black font-black text-xs">{qty}</span>
                            <button onClick={() => addToCart(service)} className="flex-1 h-full flex items-center justify-center text-black active:bg-black/10">
                                <span className="material-symbols-outlined text-sm font-bold">add</span>
                            </button>
                            </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-20 opacity-30">
              <span className="material-symbols-outlined text-[64px]">explore_off</span>
              <p className="font-bold mt-4">No packages found for this sub-category</p>
            </div>
          )}
        </div>

        {/* UC Promise Section */}
        <div className="mt-12 mx-5 p-6 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
          <h3 className="text-lg font-black mb-6">Home Wash Promise</h3>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-white dark:bg-[#1a1a1a] flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-green-500">verified</span>
              </div>
              <div>
                <p className="font-bold text-sm">Verified Professionals</p>
                <p className="text-xs text-gray-400 mt-1">Background checked and trained experts only.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-white dark:bg-[#1a1a1a] flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-blue-500">sanitizer</span>
              </div>
              <div>
                <p className="font-bold text-sm">Safe Chemicals</p>
                <p className="text-xs text-gray-400 mt-1">Eco-friendly and non-toxic cleaning agents.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-white dark:bg-[#1a1a1a] flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-orange-500">cleaning_services</span>
              </div>
              <div>
                <p className="font-bold text-sm">Superior Stain Removal</p>
                <p className="text-xs text-gray-400 mt-1">Advanced machine-driven scrubbing technology.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Cart Indicator */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-[92%] sm:max-w-[400px] z-[60]">
          <button 
            onClick={() => navigateTo(AppScreen.CART)}
            className="w-full flex items-center bg-black dark:bg-white text-white dark:text-black rounded-2xl shadow-2xl overflow-hidden transition-all active:scale-[0.97] h-[64px] border border-white/10"
          >
            <div className="flex-1 flex flex-col items-start justify-center pl-6 text-left">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-0.5">Cart Subtotal</span>
              <span className="text-xl font-black tracking-tight leading-none">₹{cartTotal.toFixed(0)}</span>
            </div>
            
            <div className="h-8 w-[1.5px] bg-white/10 dark:bg-black/10"></div>
            
            <div className="flex items-center gap-2 pr-6 pl-5 h-full">
              <span className="text-[10px] font-black uppercase tracking-widest">Review Order</span>
              <span className="material-symbols-outlined text-lg">shopping_bag</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
