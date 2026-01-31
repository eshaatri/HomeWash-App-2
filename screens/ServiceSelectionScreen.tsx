import React, { useState, useRef } from 'react';
import { AppScreen, NavigationProps, Service, CartItem } from '../types';
import { SERVICES, CATEGORIES } from '../mockData';

// --- SERVICE CARD COMPONENT ---
// Mobile-optimized: Reduced height, fluid width, no fixed pixels
const ServiceCard: React.FC<{
  service: Service;
  cart: CartItem[];
  addToCart: (s: Service) => void;
  decreaseQuantity: (s: Service) => void;
}> = ({ service, cart, addToCart, decreaseQuantity }) => {
  const cartItem = cart.find(item => item.service.id === service.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  return (
    <div className="flex flex-col w-full bg-white dark:bg-[#1a1a1a] rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/5 transition-all group">
      {/* Reduced Height Image - Fixes "Huge" size issue */}
      <div className="relative w-full h-44 sm:h-52 bg-gray-50 dark:bg-white/5">
        <img 
          src={service.image} 
          alt={service.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        {service.bestseller && (
          <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-md text-black text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shadow-sm">
            Bestseller
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-3 sm:p-4 gap-2">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-onyx dark:text-white leading-tight">
            {service.title}
          </h3>
          <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
            {service.description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex flex-col">
            <span className="text-lg font-black text-onyx dark:text-white tracking-tight">₹{service.price}</span>
            {service.originalPrice && (
              <span className="text-[9px] text-gray-400 line-through">₹{service.originalPrice}</span>
            )}
          </div>

          {quantity === 0 ? (
            <button 
              onClick={() => addToCart(service)}
              className="h-8 min-w-[4.5rem] px-3 rounded-lg bg-onyx dark:bg-white text-white dark:text-black font-bold text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-sm"
            >
              Add
            </button>
          ) : (
            <div className="flex items-center h-8 bg-primary/10 border border-primary/20 rounded-lg overflow-hidden shadow-sm">
              <button 
                onClick={() => decreaseQuantity(service)} 
                className="w-8 h-full flex items-center justify-center text-primary active:bg-primary active:text-black transition-colors"
              >
                <span className="material-symbols-outlined text-sm">remove</span>
              </button>
              <span className="w-5 text-center font-bold text-primary text-[10px]">{quantity}</span>
              <button 
                onClick={() => addToCart(service)} 
                className="w-8 h-full flex items-center justify-center text-primary active:bg-primary active:text-black transition-colors"
              >
                <span className="material-symbols-outlined text-sm">add</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- MAIN SCREEN COMPONENT ---
export const ServiceSelectionScreen: React.FC<NavigationProps> = ({ navigateTo, cart, addToCart, decreaseQuantity }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  
  // Drag scrolling ref
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const isDragging = useRef(false);

  const cartTotal = cart.reduce((sum, item) => sum + (item.service.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

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

  const handleCategoryClick = (id: string) => {
      if (isDragging.current) return;
      setSelectedCategory(id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Header Drag-to-Scroll Handlers ---
  const onMouseDown = (e: React.MouseEvent) => {
    isDown.current = true;
    isDragging.current = false;
    if (scrollRef.current) {
        scrollRef.current.classList.add('cursor-grabbing');
        scrollRef.current.classList.remove('cursor-grab');
        startX.current = e.pageX - scrollRef.current.offsetLeft;
        scrollLeft.current = scrollRef.current.scrollLeft;
    }
  };

  const stopDragging = () => {
    isDown.current = false;
    if (scrollRef.current) {
        scrollRef.current.classList.remove('cursor-grabbing');
        scrollRef.current.classList.add('cursor-grab');
    }
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 2;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
    if (Math.abs(x - startX.current) > 5) isDragging.current = true;
  };

  return (
    // Root container with strict overflow control to prevent horizontal scrolling
    <div className="relative flex min-h-screen w-full max-w-[100vw] flex-col bg-white dark:bg-black font-display antialiased transition-colors duration-300 overflow-x-hidden">
      
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-gray-100 dark:border-white/5 w-full">
          <div className="flex items-center px-4 py-3 justify-between w-full max-w-7xl mx-auto">
            <button 
              onClick={() => navigateTo(AppScreen.HOME)}
              className="flex size-9 items-center justify-start text-black dark:text-white hover:opacity-70 transition-opacity"
            >
              <span className="material-symbols-outlined text-xl font-bold">arrow_back</span>
            </button>
            <div className="flex-1 text-center">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Home Services</span>
            </div>
            <div className="w-9"></div>
          </div>

          <div className="w-full overflow-hidden">
            <div 
                ref={scrollRef}
                onMouseDown={onMouseDown}
                onMouseLeave={stopDragging}
                onMouseUp={stopDragging}
                onMouseMove={onMouseMove}
                className="flex w-full overflow-x-auto gap-2 px-4 pb-3 no-scrollbar cursor-grab active:cursor-grabbing select-none touch-pan-x"
                style={{ WebkitOverflowScrolling: 'touch' }}
            >
                {MENU_ITEMS.map((item) => {
                    const isActive = selectedCategory === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => handleCategoryClick(item.id)}
                            className={`flex-shrink-0 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border ${
                                isActive 
                                ? 'bg-primary border-primary text-black shadow-sm' 
                                : 'bg-white dark:bg-[#111] border-gray-200 dark:border-white/10 text-gray-400'
                            }`}
                        >
                            {item.name}
                        </button>
                    );
                })}
            </div>
          </div>
      </div>

      {/* Main Content - Fluid width with strict containment */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 mb-32 overflow-x-hidden">
        <div className="py-5 sm:py-8">
            <h1 className="text-2xl sm:text-3xl font-black leading-tight tracking-tighter text-black dark:text-white mb-1">
                {selectedCategory === 'ALL' ? 'All Services' : currentCategoryName}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">
                {isSelectedComingSoon ? 'Coming soon to your area.' : 'Customize your home refresh.'}
            </p>
        </div>

        {isSelectedComingSoon ? (
            <div className="flex flex-col items-center justify-center py-20 px-6 opacity-40">
                <span className="material-symbols-outlined text-[48px] mb-3">construction</span>
                <p className="text-sm font-bold text-center tracking-tight">Expansion in Progress</p>
            </div>
        ) : (
            // GRID: STRICT 1-COLUMN MOBILE, 2-COLUMN TABLET
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 pb-12 w-full">
                {filteredServices.map((service) => (
                    <ServiceCard 
                        key={service.id} 
                        service={service} 
                        cart={cart}
                        addToCart={addToCart}
                        decreaseQuantity={decreaseQuantity}
                    />
                ))}
            </div>
        )}
      </main>

      {/* Floating Cart Indicator */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-[92%] sm:max-w-[400px] z-[60]">
          <button 
            onClick={() => navigateTo(AppScreen.CART)}
            className="w-full flex items-center bg-black dark:bg-white text-white dark:text-black rounded-2xl shadow-xl overflow-hidden transition-all active:scale-[0.97] h-[60px]"
          >
            <div className="flex-1 flex flex-col items-start justify-center pl-6 text-left h-full">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-60 mb-0.5">Total Cart</span>
              <span className="text-lg font-black tracking-tight leading-none">₹{cartTotal.toFixed(0)}</span>
            </div>
            
            <div className="h-6 w-[1.5px] bg-white/10 dark:bg-black/10"></div>
            
            <div className="flex items-center gap-2 pr-6 pl-5 h-full">
              <span className="text-[10px] font-black uppercase tracking-widest">View Cart</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};