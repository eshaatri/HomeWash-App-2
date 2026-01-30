import React, { useState, useRef } from 'react';
import { AppScreen, NavigationProps } from '../types';
import { SERVICES, CATEGORIES } from '../mockData';

export const ServiceSelectionScreen: React.FC<NavigationProps> = ({ navigateTo, cart, addToCart, decreaseQuantity }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  
  // Drag to scroll refs and state
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const cartTotal = cart.reduce((sum, item) => sum + (item.service.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Combine Active Categories with "Coming Soon" ones
  const MENU_ITEMS = [
    { id: 'ALL', name: 'All Services', isComingSoon: false },
    ...CATEGORIES.map(c => ({ id: c.id, name: c.name, isComingSoon: false })),
    { id: 'cs1', name: 'Solar Panel', isComingSoon: true },
    { id: 'cs2', name: 'Pest Control', isComingSoon: true },
    { id: 'cs3', name: 'AC Service', isComingSoon: true },
    { id: 'cs4', name: 'Washing Machine', isComingSoon: true },
  ];

  const filteredServices = selectedCategory === 'ALL' 
    ? SERVICES 
    : SERVICES.filter(s => s.categoryId === selectedCategory);

  const currentCategoryName = MENU_ITEMS.find(i => i.id === selectedCategory)?.name || 'All Services';
  const isSelectedComingSoon = MENU_ITEMS.find(i => i.id === selectedCategory)?.isComingSoon;

  // Mouse Events for Drag Scrolling
  const onMouseDown = (e: React.MouseEvent) => {
    setIsDown(true);
    if(scrollRef.current) {
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    }
  };

  const onMouseLeave = () => {
    setIsDown(false);
    setIsDragging(false);
  };

  const onMouseUp = () => {
    setIsDown(false);
    setTimeout(() => setIsDragging(false), 0);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDown) return;
    e.preventDefault();
    if(scrollRef.current) {
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Scroll speed multiplier
        scrollRef.current.scrollLeft = scrollLeft - walk;
        if (Math.abs(walk) > 5) {
            setIsDragging(true);
        }
    }
  };

  const handleCategoryClick = (id: string) => {
      if (isDragging) return;
      setSelectedCategory(id);
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden pb-24 bg-alabaster dark:bg-black font-display text-onyx dark:text-white antialiased transition-colors duration-300">
      
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors">
          <div className="flex items-center p-4 justify-between">
            <div 
              onClick={() => navigateTo(AppScreen.HOME)}
              className="text-onyx dark:text-white flex size-12 shrink-0 items-center justify-start cursor-pointer hover:opacity-80"
            >
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </div>
            <h2 className="text-onyx dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Select Service</h2>
            <div className="flex w-12 items-center justify-end">
              <button 
                onClick={() => navigateTo(AppScreen.CART)}
                className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-transparent text-onyx dark:text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0 relative"
              >
                <span className="material-symbols-outlined text-2xl">shopping_bag</span>
                {cartItemCount > 0 && (
                    <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                    </span>
                )}
              </button>
            </div>
          </div>

          {/* Horizontally Scrollable Menu */}
          <div 
            ref={scrollRef}
            onMouseDown={onMouseDown}
            onMouseLeave={onMouseLeave}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
            className="flex w-full overflow-x-auto gap-2 pb-3 px-4 no-scrollbar cursor-grab active:cursor-grabbing"
          >
              {MENU_ITEMS.map((item) => {
                  const isActive = selectedCategory === item.id;
                  return (
                      <button
                          key={item.id}
                          onClick={() => handleCategoryClick(item.id)}
                          className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border select-none ${
                              isActive 
                              ? 'bg-primary border-primary text-black shadow-md shadow-primary/20' 
                              : 'bg-transparent border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-white/30'
                          }`}
                      >
                          {item.name}
                          {item.isComingSoon && <span className="ml-1 text-[9px] opacity-70">(Soon)</span>}
                      </button>
                  );
              })}
          </div>
      </div>

      <div className="w-full">
        <h2 className="text-onyx dark:text-white tracking-tight text-[28px] font-extrabold leading-tight px-4 text-left pb-2 pt-6">
            {selectedCategory === 'ALL' ? 'All Services' : currentCategoryName}
        </h2>
        <p className="px-4 text-gray-500 dark:text-gray-400 text-sm font-medium mb-4">
            {isSelectedComingSoon ? 'We are working on this!' : 'Customize your home refresh.'}
        </p>
      </div>

      {isSelectedComingSoon ? (
          <div className="flex flex-col items-center justify-center py-12 px-6 opacity-60">
              <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">construction</span>
              <p className="text-center text-gray-500 dark:text-gray-400 font-medium">
                  {currentCategoryName} services will be available in your area shortly.
              </p>
          </div>
      ) : (
          <div className="space-y-4 pb-4">
            {filteredServices.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-6 opacity-60">
                    <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">search_off</span>
                    <p className="text-center text-gray-500 dark:text-gray-400 font-medium">
                        No active services found for this category.
                    </p>
                </div>
            ) : (
                filteredServices.map((service) => {
                    const cartItem = cart.find(item => item.service.id === service.id);
                    const quantity = cartItem ? cartItem.quantity : 0;
                    
                    return (
                        <div key={service.id} className="px-4 py-2 @container">
                        <div className="flex flex-col items-stretch justify-start rounded-xl bg-white dark:bg-[#121212] shadow-sm ring-1 ring-gray-200 dark:ring-gray-800 overflow-hidden transition-all">
                            <div 
                            className="w-full bg-center bg-no-repeat aspect-video bg-cover" 
                            style={{ backgroundImage: `url("${service.image}")` }}
                            ></div>
                            <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-1 p-4">
                            <div className="flex justify-between items-start">
                                <p className="text-onyx dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">{service.title}</p>
                                <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 text-xl">info</span>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal mb-3">{service.description}</p>
                            <div className="flex items-center gap-3 justify-between mt-auto">
                                <p className="text-onyx dark:text-white text-lg font-bold leading-normal">₹{service.price}</p>
                                
                                {quantity === 0 ? (
                                <button 
                                    onClick={() => addToCart(service)}
                                    className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-white dark:bg-[#121212] border border-primary text-primary hover:bg-primary hover:text-black transition-colors text-sm font-bold leading-normal active:scale-95"
                                >
                                    Add
                                </button>
                                ) : (
                                    <div className="flex items-center justify-between min-w-[100px] h-9 rounded-lg bg-primary/10 border border-primary overflow-hidden">
                                        <button 
                                            onClick={() => decreaseQuantity(service)}
                                            className="w-8 h-full flex items-center justify-center text-primary hover:bg-primary hover:text-black transition-colors active:bg-primary/80"
                                        >
                                            <span className="material-symbols-outlined text-lg">remove</span>
                                        </button>
                                        <span className="font-bold text-sm text-primary w-8 text-center">{quantity}</span>
                                        <button 
                                            onClick={() => addToCart(service)}
                                            className="w-8 h-full flex items-center justify-center text-primary hover:bg-primary hover:text-black transition-colors active:bg-primary/80"
                                        >
                                            <span className="material-symbols-outlined text-lg">add</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                            </div>
                        </div>
                        </div>
                    );
                })
            )}
          </div>
      )}

      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white/95 dark:bg-black/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3)] z-50 transition-colors">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Total</span>
              <span className="text-xl font-bold text-onyx dark:text-white">
                ₹{cartTotal.toFixed(2)}
              </span>
            </div>
            <button 
              onClick={() => navigateTo(AppScreen.CART)}
              className="flex-1 bg-onyx dark:bg-white hover:opacity-90 text-white dark:text-black font-bold rounded-lg h-12 px-6 flex items-center justify-center shadow-lg shadow-black/10 dark:shadow-white/10 transition-all active:scale-95"
            >
              Go to Cart ({cartItemCount})
            </button>
          </div>
        </div>
      )}
    </div>
  );
};