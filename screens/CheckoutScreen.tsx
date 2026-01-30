import React from 'react';
import { AppScreen, NavigationProps } from '../types';

export const CheckoutScreen: React.FC<NavigationProps> = ({ navigateTo, cart, isPremium, onPaymentComplete, serviceSlots }) => {
  const subTotal = cart.reduce((sum, item) => sum + (item.service.price * item.quantity), 0);
  const tax = subTotal * 0.05;
  const discount = isPremium ? 25 : 0;
  const total = Math.max(0, subTotal + tax - discount);

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden pb-8 bg-alabaster dark:bg-onyx text-onyx dark:text-alabaster font-display antialiased transition-colors duration-300">
      <header className="sticky top-0 z-30 flex items-center justify-between bg-white/95 dark:bg-onyx/95 px-6 py-6 backdrop-blur-md transition-colors duration-300">
        <button 
          onClick={() => navigateTo(AppScreen.SLOT_SELECTION)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-onyx-light text-onyx dark:text-alabaster transition-colors hover:bg-gray-200 dark:hover:bg-white/10 active:scale-95"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_back</span>
        </button>
        <h1 className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-white/80">Secure Checkout</h1>
        <div className="h-10 w-10"></div> 
      </header>

      <div className="flex flex-col items-center justify-center py-10">
        <span className="mb-2 text-xs font-bold uppercase tracking-widest text-primary/80">Total Payment</span>
        <div className="flex items-baseline gap-1">
          <span className="text-5xl font-light tracking-tighter text-onyx dark:text-white">${total.toFixed(2)}</span>
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-full border border-gray-200 dark:border-white/5 bg-white dark:bg-white/5 px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
          <span className="text-[10px] font-medium uppercase tracking-wide text-gray-500 dark:text-white/60">Service Bundle ({cart.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
        </div>
      </div>

      <section className="flex-1 px-6">
        
        {/* Scheduled Items Summary */}
        <div className="mb-6 space-y-3">
            <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-white/30">Scheduled Appointments</h2>
                <button onClick={() => navigateTo(AppScreen.SLOT_SELECTION)} className="text-xs font-bold text-primary hover:underline">Edit All</button>
            </div>
            
            {cart.map((item) => {
                // Render a block for each instance of the service (e.g., Deep Cleaning 1, Deep Cleaning 2)
                return Array.from({ length: item.quantity }).map((_, i) => {
                    const uniqueKey = `${item.service.id}_${i}`;
                    const slot = serviceSlots[uniqueKey] || { date: 'Not Set', time: 'Not Set' };
                    
                    return (
                        <div key={uniqueKey} className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 font-bold text-xs">
                                    #{i + 1}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-onyx dark:text-white">{item.service.title}</p>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <span className="material-symbols-outlined text-[14px] text-primary">event</span>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{slot.date} @ {slot.time}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                });
            })}
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold text-onyx dark:text-white">Payment Method</h2>
          <button className="text-xs font-medium text-primary hover:text-primary-dim transition-colors">Manage</button>
        </div>
        <div className="space-y-3">
          <label className="group relative flex cursor-pointer flex-col gap-3 rounded-xl border border-primary/40 bg-white dark:bg-[#161618] p-5 shadow-[0_4px_20px_-10px_rgba(var(--primary-r),var(--primary-g),var(--primary-b),0.15)] dark:shadow-[0_4px_20px_-10px_rgba(0,0,0,0.5)] transition-all hover:bg-gray-50 dark:hover:bg-[#1a1a1d]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-14 items-center justify-center rounded bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white/90 shadow-inner">
                  <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>credit_card</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-onyx dark:text-white">Saved Card</p>
                  <p className="text-xs text-gray-500 dark:text-white/40 font-mono tracking-wide">Ending in 4242</p>
                </div>
              </div>
              <div className="flex h-5 w-5 items-center justify-center rounded-full border border-primary bg-primary shadow-[0_0_10px_rgba(var(--primary-r),var(--primary-g),var(--primary-b),0.3)]">
                <div className="h-2 w-2 rounded-full bg-white dark:bg-onyx"></div>
              </div>
            </div>
          </label>

          <label className="group relative flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-onyx-light p-5 transition-all hover:border-gray-300 dark:hover:border-white/10 hover:bg-gray-100 dark:hover:bg-[#202022]">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-14 items-center justify-center rounded bg-white dark:bg-white/5 text-gray-500 dark:text-white/60">
                <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>account_balance_wallet</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-white/80 group-hover:text-black dark:group-hover:text-white">UPI</p>
                <p className="text-xs text-gray-500 dark:text-white/40">GooglePay, PhonePe</p>
              </div>
            </div>
            <div className="h-5 w-5 rounded-full border border-gray-300 dark:border-white/10 group-hover:border-gray-400 dark:group-hover:border-white/30"></div>
          </label>

          <label className="group relative flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-onyx-light p-5 transition-all hover:border-gray-300 dark:hover:border-white/10 hover:bg-gray-100 dark:hover:bg-[#202022]">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-14 items-center justify-center rounded bg-black border border-white/5 text-white">
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>phone_iphone</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-white/80 group-hover:text-black dark:group-hover:text-white">Apple Pay</p>
                <p className="text-xs text-gray-500 dark:text-white/40">Default Wallet</p>
              </div>
            </div>
            <div className="h-5 w-5 rounded-full border border-gray-300 dark:border-white/10 group-hover:border-gray-400 dark:group-hover:border-white/30"></div>
          </label>
        </div>
      </section>

      <div className="mt-auto px-6 pt-8">
        <div className="mb-6 flex flex-col items-center justify-center gap-1">
          <div className="flex items-center gap-2 rounded-full bg-primary/5 px-4 py-1.5 border border-primary/10">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '14px' }}>lock</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Secure Checkout</span>
          </div>
          <p className="text-[10px] text-gray-400 dark:text-white/30">256-bit SSL Encrypted Transaction</p>
        </div>
        <button 
          onClick={onPaymentComplete}
          className="group relative w-full overflow-hidden rounded-lg bg-onyx dark:bg-white py-4 shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_0_40px_-10px_rgba(255,255,255,0.1)] transition-transform active:scale-[0.98]"
        >
          <span className="relative z-10 text-base font-bold text-white dark:text-onyx">Pay ${total.toFixed(2)}</span>
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 dark:via-gray-200/50 to-transparent transition-transform duration-1000 group-hover:translate-x-full"></div>
        </button>
        <div className="mt-6 flex justify-center gap-4 grayscale opacity-20">
          <div className="h-4 w-7 rounded bg-black dark:bg-white"></div>
          <div className="h-4 w-7 rounded bg-black dark:bg-white"></div>
          <div className="h-4 w-7 rounded bg-black dark:bg-white"></div>
        </div>
      </div>
    </div>
  );
};
