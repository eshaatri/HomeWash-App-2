import React, { useState, useEffect } from 'react';
import { AppScreen, NavigationProps, Service } from '../types';

interface SchedulableItem {
    service: Service;
    uniqueKey: string; // id_index
    instanceIndex: number;
    totalInstances: number;
}

export const SlotSelectionScreen: React.FC<NavigationProps> = ({ navigateTo, isPremium, setServiceSlot, cart }) => {
  const [queue, setQueue] = useState<SchedulableItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Selection State
  const [selectedSlot, setSelectedSlot] = useState<string | null>('10:00 AM');
  const [dates, setDates] = useState<{ dayName: string; dayNumber: number; fullDate: string; isWeekend: boolean }[]>([]);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);

  // Initialize Queue and Dates
  useEffect(() => {
    // 1. Build Scheduling Queue (Flatten cart)
    const newQueue: SchedulableItem[] = [];
    cart.forEach(item => {
        for (let i = 0; i < item.quantity; i++) {
            newQueue.push({
                service: item.service,
                uniqueKey: `${item.service.id}_${i}`,
                instanceIndex: i + 1,
                totalInstances: item.quantity
            });
        }
    });
    setQueue(newQueue);

    // 2. Generate Next 14 Days
    const nextDays = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        nextDays.push({
            dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
            dayNumber: d.getDate(),
            fullDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            isWeekend: d.getDay() === 0 || d.getDay() === 6
        });
    }
    setDates(nextDays);

    if (cart.length === 0) {
        navigateTo(AppScreen.HOME);
    }
  }, [cart, navigateTo]);

  const currentItem = queue[currentIndex];

  const handleNext = () => {
    if (!currentItem || !selectedSlot) return;

    // Save selection
    setServiceSlot(currentItem.uniqueKey, dates[selectedDateIndex].fullDate, selectedSlot);

    if (currentIndex < queue.length - 1) {
        setCurrentIndex(prev => prev + 1);
        // Reset defaults if needed, or keep previous selection for convenience
        // setSelectedSlot('10:00 AM'); 
    } else {
        navigateTo(AppScreen.CHECKOUT);
    }
  };

  const handleBack = () => {
      if (currentIndex > 0) {
          setCurrentIndex(prev => prev - 1);
      } else {
          navigateTo(AppScreen.CART);
      }
  };

  if (!currentItem || dates.length === 0) return null;

  const progressPercent = ((currentIndex + 1) / queue.length) * 100;

  const TIME_SLOTS = [
      { time: '08:00 AM', label: 'Early Bird', premium: true },
      { time: '09:00 AM', label: 'Morning Peak', premium: true },
      { time: '10:00 AM', label: 'Standard', premium: false },
      { time: '11:00 AM', label: 'Standard', premium: false },
      { time: '12:00 PM', label: 'Lunch Hour', premium: false },
      { time: '02:00 PM', label: 'Afternoon', premium: false },
      { time: '04:00 PM', label: 'Late Afternoon', premium: false },
      { time: '06:00 PM', label: 'Evening Relax', premium: false },
  ];

  return (
    <div className="bg-[#f8f7f6] dark:bg-[#171612] text-slate-900 dark:text-white font-display antialiased min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-[#f8f7f6]/95 dark:bg-[#171612]/95 backdrop-blur-md border-b border-gray-200 dark:border-white/5">
        <button 
          onClick={handleBack}
          className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-black dark:text-white"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-bold leading-tight tracking-tight">Schedule Service</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Step {currentIndex + 1} of {queue.length}</p>
        </div>
        <div className="size-10"></div>
      </header>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-gray-200 dark:bg-white/10">
          <div className="h-full bg-primary transition-all duration-300 ease-out" style={{ width: `${progressPercent}%` }}></div>
      </div>

      <main className="flex-1 flex flex-col pb-40 px-4">
        
        {/* Service Context Card */}
        <div className="mt-6 bg-white dark:bg-[#1a1915] p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm flex items-center gap-4 transition-all">
            <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center shrink-0 overflow-hidden">
                <img src={currentItem.service.image} className="w-full h-full object-cover opacity-90" alt="" />
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <p className="text-[10px] text-primary font-bold uppercase tracking-wider mb-0.5">
                        Booking {currentItem.instanceIndex} of {currentItem.totalInstances}
                    </p>
                </div>
                <h3 className="text-lg font-bold leading-tight line-clamp-1">{currentItem.service.title}</h3>
                <p className="text-xs text-gray-400">{currentItem.service.duration} • <span className="font-medium text-onyx dark:text-white">${currentItem.service.price}</span></p>
            </div>
        </div>

        {/* Date Strip */}
        <section className="pt-6">
          <h3 className="tracking-widest text-xs font-bold text-gray-400 dark:text-gray-500 mb-4 uppercase pl-2">Select Date</h3>
          <div className="flex overflow-x-auto gap-3 pb-2 -mx-4 px-4 no-scrollbar">
            {dates.map((d, index) => {
                const isSelected = index === selectedDateIndex;
                return (
                    <button 
                        key={index}
                        onClick={() => setSelectedDateIndex(index)}
                        className={`flex flex-col items-center justify-center min-w-[64px] h-[84px] rounded-2xl border transition-all duration-200 ${
                            isSelected 
                            ? 'bg-primary border-primary shadow-lg shadow-primary/20 scale-105' 
                            : 'bg-white dark:bg-[#1a1915] border-transparent hover:border-gray-200 dark:hover:border-white/10'
                        }`}
                    >
                        <span className={`text-xs font-medium uppercase mb-1 ${isSelected ? 'text-[#171612]/70' : 'text-gray-400'}`}>{d.dayName}</span>
                        <span className={`text-xl font-bold ${isSelected ? 'text-[#171612]' : 'text-onyx dark:text-white'}`}>{d.dayNumber}</span>
                        {d.isWeekend && !isSelected && (
                            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-white/20 mt-1"></span>
                        )}
                    </button>
                );
            })}
          </div>
        </section>

        {/* Time Slots List */}
        <section className="pt-6">
          <h3 className="tracking-widest text-xs font-bold text-gray-400 dark:text-gray-500 mb-4 uppercase pl-2">Available Time Slots</h3>
          <div className="grid grid-cols-1 gap-3">
              {TIME_SLOTS.map((slot) => {
                  const isSelected = selectedSlot === slot.time;
                  const isLocked = slot.premium && !isPremium;

                  return (
                      <button
                        key={slot.time}
                        onClick={() => !isLocked && setSelectedSlot(slot.time)}
                        className={`relative flex items-center justify-between p-4 rounded-xl border transition-all active:scale-[0.99] ${
                            isSelected 
                            ? 'bg-white dark:bg-[#2a2a2a] border-primary ring-1 ring-primary' 
                            : 'bg-white dark:bg-[#1a1915] border-transparent hover:border-gray-200 dark:hover:border-white/10'
                        } ${isLocked ? 'opacity-60 cursor-not-allowed grayscale' : ''}`}
                      >
                          <div className="flex items-center gap-4">
                              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isSelected ? 'bg-primary/20 text-primary' : 'bg-gray-100 dark:bg-white/5 text-gray-400'}`}>
                                  {isLocked ? (
                                      <span className="material-symbols-outlined text-[18px]">lock</span>
                                  ) : (
                                      <span className="material-symbols-outlined text-[18px]">schedule</span>
                                  )}
                              </div>
                              <div className="text-left">
                                  <p className={`font-bold ${isSelected ? 'text-primary' : 'text-onyx dark:text-white'}`}>{slot.time}</p>
                                  <p className="text-xs text-gray-400">{slot.label}</p>
                              </div>
                          </div>
                          
                          {slot.premium && (
                              <div className="absolute top-0 right-0 px-2 py-1 bg-gradient-to-r from-[#ffd633] to-[#e6c229] text-[9px] font-bold uppercase text-black rounded-bl-xl rounded-tr-xl">
                                  Gold
                              </div>
                          )}
                          
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-primary' : 'border-gray-200 dark:border-white/10'}`}>
                              {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>}
                          </div>
                      </button>
                  )
              })}
          </div>
        </section>
      </main>

      {/* Sticky Footer */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto w-full bg-white dark:bg-[#171612] border-t border-gray-200 dark:border-white/10 p-5 z-40 pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="flex items-end justify-between mb-5 px-1">
          <div className="flex flex-col gap-1">
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                {currentIndex < queue.length - 1 ? 'Next Step' : 'Final Step'}
            </p>
            <div className="flex items-baseline gap-3">
               <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight line-clamp-1">
                   {dates[selectedDateIndex]?.fullDate || ''}, {selectedSlot}
               </span>
            </div>
          </div>
        </div>

        <button 
          onClick={handleNext}
          disabled={!selectedSlot}
          className="w-full bg-primary hover:brightness-110 text-[#171612] font-bold text-lg py-4 rounded-xl shadow-[0_4px_20px_rgba(var(--primary-r),var(--primary-g),var(--primary-b),0.3)] transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed">
          <span>{currentIndex < queue.length - 1 ? 'Schedule Next Item' : 'Review & Checkout'}</span>
          <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>
      </footer>
    </div>
  );
};
