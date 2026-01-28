import React from 'react';
import { AppScreen, NavigationProps } from '../types';

export const CartScreen: React.FC<NavigationProps> = ({ navigateTo }) => {
  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden pb-32 bg-alabaster dark:bg-onyx text-onyx dark:text-alabaster font-display antialiased transition-colors duration-300">
      <header className="sticky top-0 z-30 flex items-center justify-between bg-white/95 dark:bg-onyx/95 px-6 py-4 backdrop-blur-md transition-colors duration-300">
        <button 
          onClick={() => navigateTo(AppScreen.SERVICE_SELECTION)}
          className="group flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-onyx-light transition-colors hover:bg-gray-200 dark:hover:bg-white hover:text-onyx dark:hover:text-onyx active:scale-95"
        >
          <span className="material-symbols-outlined text-sm">arrow_back_ios_new</span>
        </button>
        <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 dark:text-white/60">Checkout</span>
        <button className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-onyx-light text-gray-400 dark:text-white/60 transition-colors hover:text-black dark:hover:text-white">
          <span className="material-symbols-outlined">more_horiz</span>
        </button>
      </header>

      <div className="px-6 pt-4 pb-2">
        <h1 className="text-[3rem] font-black leading-none tracking-tighter text-onyx dark:text-alabaster">
          Cart<span className="text-primary">.</span>
        </h1>
        <p className="mt-2 text-sm text-gray-400 dark:text-white/40 font-medium">3 services selected</p>
      </div>

      <section className="mt-4 px-6">
        <div className="space-y-6">
          {/* Item 1 */}
          <div className="relative flex items-start gap-4 border-b border-gray-200 dark:border-white/5 pb-6">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-onyx-light border border-gray-200 dark:border-white/5 text-primary">
              <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>cleaning_services</span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-onyx dark:text-alabaster leading-tight">Deep Home Cleaning</h3>
                  <p className="mt-1 text-xs font-medium text-gray-500 dark:text-white/40">4 BHK • 2200 sqft</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider rounded bg-gray-100 dark:bg-white/5 px-2 py-1 text-gray-600 dark:text-white/60">Includes Sanitization</span>
                  </div>
                </div>
                <span className="text-lg font-semibold tracking-tight text-onyx dark:text-white">$149.00</span>
              </div>
            </div>
            <button className="absolute -right-2 -bottom-2 p-2 text-gray-300 dark:text-white/20 hover:text-red-400 transition-colors">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
            </button>
          </div>

          {/* Item 2 */}
          <div className="relative flex items-start gap-4 border-b border-gray-200 dark:border-white/5 pb-6">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-onyx-light border border-gray-200 dark:border-white/5 text-gray-400 dark:text-white/80">
              <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>chair</span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-onyx dark:text-alabaster leading-tight">Sofa Revival</h3>
                  <p className="mt-1 text-xs font-medium text-gray-500 dark:text-white/40">3 Seater • Leather</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider rounded bg-gray-100 dark:bg-white/5 px-2 py-1 text-gray-600 dark:text-white/60">Conditioning</span>
                  </div>
                </div>
                <span className="text-lg font-semibold tracking-tight text-onyx dark:text-white">$89.00</span>
              </div>
            </div>
            <button className="absolute -right-2 -bottom-2 p-2 text-gray-300 dark:text-white/20 hover:text-red-400 transition-colors">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
            </button>
          </div>

          {/* Item 3 */}
          <div className="relative flex items-start gap-4 border-b border-gray-200 dark:border-white/5 pb-6">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-onyx-light border border-gray-200 dark:border-white/5 text-gray-400 dark:text-white/80">
              <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>local_laundry_service</span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-onyx dark:text-alabaster leading-tight">Premium Laundry</h3>
                  <p className="mt-1 text-xs font-medium text-gray-500 dark:text-white/40">12kg • Wash & Fold</p>
                </div>
                <span className="text-lg font-semibold tracking-tight text-onyx dark:text-white">$45.00</span>
              </div>
            </div>
            <button className="absolute -right-2 -bottom-2 p-2 text-gray-300 dark:text-white/20 hover:text-red-400 transition-colors">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
            </button>
          </div>
        </div>
      </section>

      <section className="px-6 py-6">
        <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-r from-gray-50 to-white dark:from-onyx-light dark:to-[#1a1a1a] p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="material-symbols-outlined fill-current">stars</span>
              </div>
              <div>
                <p className="text-sm font-bold text-onyx dark:text-white">Use Gold Credit</p>
                <p className="text-xs text-primary/80">Balance: $450.00</p>
              </div>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input className="peer sr-only" type="checkbox" defaultChecked />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 dark:bg-white/10 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
            </label>
          </div>
        </div>
      </section>

      <section className="px-6 pb-6">
        <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-white/30">Payment Breakdown</h4>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-gray-600 dark:text-alabaster/70">
            <span>Subtotal</span>
            <span className="font-medium text-onyx dark:text-alabaster">$283.00</span>
          </div>
          <div className="flex justify-between text-gray-600 dark:text-alabaster/70">
            <span>Taxes & Fees (5%)</span>
            <span className="font-medium text-onyx dark:text-alabaster">$14.15</span>
          </div>
          <div className="flex justify-between text-primary/80">
            <span>Gold Member Savings</span>
            <span className="font-medium">-$25.00</span>
          </div>
        </div>
        <div className="my-6 h-px w-full bg-gray-200 dark:bg-white/5"></div>
        <div className="flex items-end justify-between">
          <span className="mb-1 text-sm font-medium text-gray-500 dark:text-white/50">Total Amount</span>
          <span className="text-4xl font-black tracking-tight text-onyx dark:text-white">$272.15</span>
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 z-50 w-full max-w-md mx-auto border-t border-gray-200 dark:border-white/5 bg-white/90 dark:bg-onyx/90 p-6 backdrop-blur-xl transition-colors duration-300">
        <button 
          onClick={() => navigateTo(AppScreen.CHECKOUT)}
          className="group relative flex w-full items-center justify-center overflow-hidden rounded-full bg-onyx dark:bg-alabaster py-4 transition-all hover:bg-black dark:hover:bg-white active:scale-[0.98]"
        >
          <span className="relative z-10 text-sm font-bold uppercase tracking-widest text-white dark:text-onyx">Proceed to Payment</span>
          <div className="absolute inset-0 -translate-x-full bg-primary opacity-0 transition-transform duration-300 group-hover:translate-x-0 group-hover:opacity-10"></div>
        </button>
        <div className="h-2 w-full"></div>
      </div>
    </div>
  );
};
