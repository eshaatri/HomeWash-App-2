import React from 'react';
import { AppScreen, NavigationProps } from '../types';

export const ServiceSelectionScreen: React.FC<NavigationProps> = ({ navigateTo }) => {
  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden pb-24 bg-black font-display text-white antialiased">
      <div className="sticky top-0 z-50 flex items-center bg-black/90 backdrop-blur-md p-4 border-b border-gray-800 justify-between transition-colors">
        <div 
          onClick={() => navigateTo(AppScreen.HOME)}
          className="text-white flex size-12 shrink-0 items-center justify-start cursor-pointer hover:opacity-80"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </div>
        <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Select Service</h2>
        <div className="flex w-12 items-center justify-end">
          <button 
            onClick={() => navigateTo(AppScreen.CART)}
            className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-transparent text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0"
          >
            <span className="material-symbols-outlined text-2xl">shopping_bag</span>
          </button>
        </div>
      </div>

      <div className="w-full">
        <h2 className="text-white tracking-tight text-[28px] font-extrabold leading-tight px-4 text-left pb-2 pt-6">Premium Packages</h2>
        <p className="px-4 text-gray-400 text-sm font-medium mb-4">Customize your home refresh.</p>
      </div>

      <div className="space-y-4 pb-4">
        {/* Item 1 */}
        <div className="px-4 py-2 @container">
          <div className="flex flex-col items-stretch justify-start rounded-xl bg-[#121212] shadow-sm ring-1 ring-gray-800 overflow-hidden transition-all">
            <div 
              className="w-full bg-center bg-no-repeat aspect-video bg-cover" 
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD5c6hvQ269iGoWpfvLQDj7bmbtgQqliAJq7BfBgfU8BHSZcE672IWwFIUyJwLcXTmRxl-d_6CJGFY8mrBW_yYweVNb0Z8pwQMyLnSDTo0OkDBx3H2C6kv7t6i8CmM--y6OgboO4_hRAVdAPLhRcmW5Iwf_tTuBbeplYcIo5l2upmHCwrLpjiX4GjFVevtkalgAkoM7Zmx65Lz5m_wtRsf-iJCLDXu9twEi1DRlqL1TtgrE-tHdbGkjNlYM0C2O5h4WFVNfyD4uPNY")' }}
            ></div>
            <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-1 p-4">
              <div className="flex justify-between items-start">
                <p className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Deep Home Cleaning</p>
                <span className="material-symbols-outlined text-gray-500 text-xl">info</span>
              </div>
              <p className="text-gray-400 text-sm font-normal leading-normal mb-3">Complete top-to-bottom restoration.</p>
              <div className="flex items-center gap-3 justify-between mt-auto">
                <p className="text-white text-lg font-bold leading-normal">$199</p>
                <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-white border border-white text-black hover:bg-gray-200 transition-colors text-sm font-semibold leading-normal active:scale-95">
                  <span className="truncate">Select</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Item 2 */}
        <div className="px-4 py-2 @container">
          <div className="flex flex-col items-stretch justify-start rounded-xl bg-[#121212] shadow-sm ring-1 ring-gray-800 overflow-hidden transition-all">
            <div 
              className="w-full bg-center bg-no-repeat aspect-video bg-cover" 
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBQyKII_vIaYbueglrCgh8F-6OF2PmOkj_bk4X1NuaRUaG6y4NFTB8zkvoUBZifEDIflhH_vZTPVTbUi9ppddj_PADLZ0Il4Vsmr9H9nVcoY0k-neYBhDNDzKMHL24IdQyDdjbg9z_AA9ueRIAis-0JpNbTycooHUHFjvfvfW12Ph2DWiEhKPP_W2nkZpSEYQ4K-opYDnVrif3S7JtLwW5khRfD5qc-wFSUznoff5_xsW1tqqLI73qRV4Sx0ZH-fvpasYD6YzS7f20")' }}
            ></div>
            <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-1 p-4">
              <div className="flex justify-between items-start">
                <p className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Kitchen Sanitization</p>
                <span className="material-symbols-outlined text-gray-500 text-xl">info</span>
              </div>
              <p className="text-gray-400 text-sm font-normal leading-normal mb-3">Grease removal and appliance detailing.</p>
              <div className="flex items-center gap-3 justify-between mt-auto">
                <p className="text-white text-lg font-bold leading-normal">$89</p>
                <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-white border border-white text-black hover:bg-gray-200 transition-colors text-sm font-semibold leading-normal active:scale-95">
                  <span className="truncate">Select</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Item 3 */}
        <div className="px-4 py-2 @container">
          <div className="flex flex-col items-stretch justify-start rounded-xl bg-[#121212] shadow-sm ring-1 ring-gray-800 overflow-hidden transition-all">
            <div 
              className="w-full bg-center bg-no-repeat aspect-video bg-cover" 
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDhMOlSsEXRDt3sDDyty-vRXWr9jTMfio4HeOZi-wMf023A4X41bpDbxNoMTChDF3Q7UsnfNjf4uO9K3KvdwtLVUq9OsiWgG827dJOoZ8asEZ3pr14pe72BEq5VkZ82epmnm4AUhIuDiL6TM_ev5YD5WhGGC2EWBxbosU6TMvisuWQs2qtTKt-f2FcexXRiQUbbC0IAy9oUDhO3H4gH-aDNn_C25obcofREoGJcAnmog7P2vfTgtxgrAvoJ1XCfM1K14feVlYB71eo")' }}
            ></div>
            <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-1 p-4">
              <div className="flex justify-between items-start">
                <p className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Bathroom Sparkle</p>
                <span className="material-symbols-outlined text-gray-500 text-xl">info</span>
              </div>
              <p className="text-gray-400 text-sm font-normal leading-normal mb-3">Tile scrubbing and fixture polishing.</p>
              <div className="flex items-center gap-3 justify-between mt-auto">
                <p className="text-white text-lg font-bold leading-normal">$69</p>
                <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-white border border-white text-black hover:bg-gray-200 transition-colors text-sm font-semibold leading-normal active:scale-95">
                  <span className="truncate">Select</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Item 4 */}
        <div className="px-4 py-2 @container">
          <div className="flex flex-col items-stretch justify-start rounded-xl bg-[#121212] shadow-sm ring-1 ring-gray-800 overflow-hidden transition-all">
            <div 
              className="w-full bg-center bg-no-repeat aspect-video bg-cover" 
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCxfgxTKVL3pzVbOj0bxIsLzORLmiwHUocaoDIr3VK0eMNh2-xL8OaiKej1o7duNf9CGGFUEH_DYX84BsAUIJjJClBT5WFsDHKfqOuXr0PnxAc4M25nFQuJuRNGHPM9npjmlRHgbm1LC2lCt6LaxRo7HDUNkJ5cB3r7YXArocq0d1-K9aXTgu7pw0zBhLG-nqz3qyz6QgUVewEQIi8XaSV5G3poBZnOfDI7Da3k6YhgWEhGJs9FAjjobjyCarCekl_fszz01AYxhiM")' }}
            ></div>
            <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-1 p-4">
              <div className="flex justify-between items-start">
                <p className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Sofa &amp; Carpet Grooming</p>
                <span className="material-symbols-outlined text-gray-500 text-xl">info</span>
              </div>
              <p className="text-gray-400 text-sm font-normal leading-normal mb-3">Deep shampoo and fabric care.</p>
              <div className="flex items-center gap-3 justify-between mt-auto">
                <p className="text-white text-lg font-bold leading-normal">$120</p>
                <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-white border border-white text-black hover:bg-gray-200 transition-colors text-sm font-semibold leading-normal active:scale-95">
                  <span className="truncate">Select</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-black/95 backdrop-blur-lg border-t border-gray-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3)] z-50">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total</span>
            <span className="text-xl font-bold text-white">$477</span>
          </div>
          <button 
            onClick={() => navigateTo(AppScreen.CART)}
            className="flex-1 bg-white hover:bg-gray-200 text-black font-bold rounded-lg h-12 px-6 flex items-center justify-center shadow-lg shadow-white/10 transition-all active:scale-95"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};
