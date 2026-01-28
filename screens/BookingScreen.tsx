import React, { useState } from 'react';
import { AppScreen, NavigationProps } from '../types';

export const BookingScreen: React.FC<NavigationProps> = ({ navigateTo, isPremium }) => {
  const [selectedSlot, setSelectedSlot] = useState('09:00 AM');
  const [useCredit, setUseCredit] = useState(true);

  return (
    <div className="bg-[#f8f7f6] dark:bg-[#171612] text-slate-900 dark:text-white font-display antialiased min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-[#f8f7f6]/95 dark:bg-[#171612]/95 backdrop-blur-md border-b border-gray-200 dark:border-white/5">
        <button 
          onClick={() => navigateTo(AppScreen.HOME)}
          className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-black dark:text-white"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-bold leading-tight tracking-tight">Priority Booking</h2>
          {isPremium && (
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[10px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="text-[10px] uppercase tracking-widest text-primary font-bold">Gold Member</span>
            </div>
          )}
        </div>
        <div className="size-10"></div>
      </header>

      {/* Progress Stepper */}
      <div className="flex w-full flex-col items-center justify-center pt-6 pb-2">
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center gap-1">
            <div className="h-2 w-8 rounded-full bg-primary shadow-[0_0_12px_rgba(var(--primary-r),var(--primary-g),var(--primary-b),0.6)]"></div>
          </div>
          <div className="h-px w-6 bg-gray-300 dark:bg-white/10"></div>
          <div className="flex flex-col items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-gray-300 dark:bg-white/20"></div>
          </div>
          <div className="h-px w-6 bg-gray-300 dark:bg-white/10"></div>
          <div className="flex flex-col items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-gray-300 dark:bg-white/20"></div>
          </div>
        </div>
      </div>

      <main className="flex-1 flex flex-col pb-48 px-4">
        {/* Calendar Section */}
        <section className="pt-6">
          <h3 className="tracking-widest text-xs font-bold text-gray-400 dark:text-gray-500 mb-4 uppercase pl-2">Select Date</h3>
          <div className="bg-white dark:bg-[#1a1915] rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-white/5">
            <div className="flex items-center justify-between mb-6 px-1">
              <button className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-500 dark:text-gray-400 hover:text-primary">
                <span className="material-symbols-outlined text-xl">chevron_left</span>
              </button>
              <p className="text-lg font-bold tracking-tight">August 2023</p>
              <button className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-500 dark:text-gray-400 hover:text-primary">
                <span className="material-symbols-outlined text-xl">chevron_right</span>
              </button>
            </div>
            <div className="grid grid-cols-7 gap-y-3 mb-2">
              {['S','M','T','W','T','F','S'].map(d => (
                <div key={d} className="text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">{d}</div>
              ))}
              
              <div className="col-span-3"></div>
              {[1,2,3,4].map(d => (
                <button key={d} className="h-10 w-full flex items-center justify-center text-sm text-gray-300 dark:text-gray-600 cursor-not-allowed" disabled>{d}</button>
              ))}
              
              {/* Selected Date */}
              <button className="relative h-10 w-full flex items-center justify-center group">
                <div className="absolute inset-0 m-auto size-10 rounded-full bg-primary shadow-[0_4px_12px_rgba(var(--primary-r),var(--primary-g),var(--primary-b),0.3)] flex items-center justify-center text-[#171612] font-bold text-sm">5</div>
              </button>
              
              {[6,7].map(d => (
                <button key={d} className="h-10 w-full flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors">{d}</button>
              ))}

              {/* Priority Date 8 */}
              <button className="h-10 w-full flex flex-col items-center justify-center gap-0.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors relative group">
                <span className="text-sm font-medium text-black dark:text-white group-hover:text-primary transition-colors">8</span>
                {isPremium && <span className="size-1 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary-r),var(--primary-g),var(--primary-b),0.8)]"></span>}
              </button>

              {[9,10].map(d => (
                 <button key={d} className="h-10 w-full flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors">{d}</button>
              ))}

               {/* Priority Date 11 */}
               <button className="h-10 w-full flex flex-col items-center justify-center gap-0.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors relative group">
                <span className="text-sm font-medium text-black dark:text-white group-hover:text-primary transition-colors">11</span>
                {isPremium && <span className="size-1 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary-r),var(--primary-g),var(--primary-b),0.8)]"></span>}
              </button>

               {[12,13,14,15].map(d => (
                 <button key={d} className="h-10 w-full flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors">{d}</button>
              ))}
            </div>
          </div>
          {isPremium && (
            <div className="flex items-center justify-center gap-2 py-4 opacity-60">
              <span className="size-1.5 rounded-full bg-primary"></span>
              <p className="text-gray-500 dark:text-gray-400 text-[10px] uppercase font-bold tracking-wide">Gold date indicates priority availability</p>
            </div>
          )}
        </section>

        {/* Time Selection */}
        <section className="mt-2">
          <h3 className="tracking-widest text-xs font-bold text-gray-400 dark:text-gray-500 mb-4 uppercase pl-2">Available Time Slots</h3>
          <div className="flex flex-col gap-3">
            {/* Gold Slot */}
            <label 
              onClick={() => isPremium && setSelectedSlot('09:00 AM')}
              className={`group relative flex items-center justify-between p-4 pr-5 rounded-2xl border ${selectedSlot === '09:00 AM' ? 'border-primary bg-primary/5' : 'border-primary/40 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent'} ${isPremium ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'} overflow-hidden transition-all hover:border-primary active:scale-[0.99]`}
            >
              <div className="z-10 flex items-center gap-4">
                <div className="flex items-center justify-center size-12 rounded-full bg-primary text-[#171612] shadow-lg shadow-primary/20">
                  <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>{isPremium ? 'star' : 'lock'}</span>
                </div>
                <div className="flex flex-col">
                  <p className="text-black dark:text-white font-bold text-lg group-hover:text-primary transition-colors">09:00 AM</p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-primary text-[10px] font-bold tracking-widest uppercase">Priority Gold</span>
                    {isPremium && <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded text-[10px] font-bold">INSTANT</span>}
                  </div>
                </div>
              </div>
              {isPremium && (
                <div className={`z-10 size-6 rounded-full border ${selectedSlot === '09:00 AM' ? 'border-primary bg-primary' : 'border-primary/50 bg-primary/10'} flex items-center justify-center transition-all`}>
                  <div className={`size-2.5 rounded-full bg-[#171612] ${selectedSlot === '09:00 AM' ? 'opacity-100' : 'opacity-0'} transition-opacity`}></div>
                </div>
              )}
            </label>

            {/* Standard Slots */}
            {[
              { time: '11:00 AM', label: 'Standard Service' },
              { time: '02:00 PM', label: 'Standard Service' }
            ].map((slot) => (
              <label 
                key={slot.time}
                onClick={() => setSelectedSlot(slot.time)}
                className={`relative flex items-center justify-between p-4 pr-5 rounded-2xl border ${selectedSlot === slot.time ? 'border-white bg-white/10' : 'border-gray-200 dark:border-white/5 bg-white dark:bg-white/5'} hover:bg-gray-50 dark:hover:bg-white/10 cursor-pointer transition-all active:scale-[0.99]`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center size-12 rounded-full bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-500">
                    <span className="material-symbols-outlined text-xl">schedule</span>
                  </div>
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 font-bold text-lg">{slot.time}</p>
                    <p className="text-gray-500 text-xs font-medium">{slot.label}</p>
                  </div>
                </div>
                <div className={`size-6 rounded-full border-2 ${selectedSlot === slot.time ? 'border-white bg-white' : 'border-gray-300 dark:border-gray-600'} transition-all`}></div>
              </label>
            ))}
          </div>
        </section>
      </main>

      {/* Sticky Footer */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto w-full bg-white dark:bg-[#171612] border-t border-gray-200 dark:border-white/10 p-5 z-40 pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        {/* Credit Toggle */}
        {isPremium && (
          <div className="flex items-center justify-between mb-6 bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/5 shadow-inner">
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 size-10 flex items-center justify-center rounded-lg text-primary shadow-sm">
                <span className="material-symbols-outlined text-xl">workspace_premium</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-800 dark:text-white">Use Gold Credit</span>
                <span className="text-[11px] text-primary dark:text-primary/80 font-medium">1 Credit Available</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={useCredit} 
                onChange={() => setUseCredit(!useCredit)} 
                className="sr-only peer" 
              />
              <div className="w-12 h-7 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary shadow-sm"></div>
            </label>
          </div>
        )}

        <div className="flex items-end justify-between mb-5 px-1">
          <div className="flex flex-col gap-1">
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Total Amount</p>
            <div className="flex items-baseline gap-3">
              {isPremium && useCredit ? (
                <>
                  <span className="text-gray-400 dark:text-gray-600 line-through text-sm font-medium">$150.00</span>
                  <span className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">$0.00</span>
                </>
              ) : (
                <span className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">$150.00</span>
              )}
            </div>
          </div>
          {isPremium && useCredit && (
            <div className="text-right pb-1">
              <span className="inline-block bg-primary text-[#171612] text-[10px] font-bold px-2.5 py-1 rounded shadow-lg shadow-primary/20 uppercase tracking-widest">Free with Gold</span>
            </div>
          )}
        </div>

        <button className="w-full bg-primary hover:brightness-110 text-[#171612] font-bold text-lg py-4 rounded-xl shadow-[0_4px_20px_rgba(var(--primary-r),var(--primary-g),var(--primary-b),0.3)] transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 group">
          <span>{isPremium ? 'Confirm Priority Booking' : 'Proceed to Pay'}</span>
          <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>
      </footer>
    </div>
  );
};
