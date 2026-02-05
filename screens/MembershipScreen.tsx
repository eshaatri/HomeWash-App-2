
import React from 'react';
import { AppScreen, NavigationProps } from '../types';
import { BottomNav } from '../components/BottomNav';

export const MembershipScreen: React.FC<NavigationProps> = (props) => {
  const { navigateTo, isPremium, togglePremium } = props;

  return (
    <div className="bg-alabaster dark:bg-[#121212] font-display text-slate-900 dark:text-white antialiased overflow-x-hidden min-h-screen flex flex-col relative pb-48 transition-colors duration-300">
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5">
         <button onClick={() => navigateTo(AppScreen.HOME)} className="material-symbols-outlined">arrow_back</button>
         <span className="text-sm font-bold tracking-widest uppercase">HomeWash Gold</span>
         <div className="w-6"></div>
      </nav>

      {/* Hero Section */}
      <div className="relative px-6 pt-8 pb-12 overflow-hidden">
        {/* Abstract Background Blurs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 text-center space-y-4">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-2">
               <span className="material-symbols-outlined text-[14px]">stars</span>
               Premium Membership
           </div>
           <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-[1.1]">
              Upgrade your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffd633] to-[#b39624]">Lifestyle.</span>
           </h1>
           <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
             Join the exclusive club of homeowners who enjoy priority service and unmatched savings.
           </p>
        </div>
      </div>

      {/* Main Card */}
      <div className="px-6 mb-8">
         <div className="relative w-full aspect-[4/5] md:aspect-video rounded-3xl overflow-hidden shadow-2xl shadow-primary/20 border border-white/20 group">
             {/* Background Image */}
             <div className="absolute inset-0 bg-black">
                 <img 
                    src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600&auto=format&fit=crop" 
                    className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                    alt="Luxury Interior"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
             </div>
             
             {/* Card Content */}
             <div className="absolute inset-0 p-8 flex flex-col justify-between">
                 <div className="flex justify-between items-start">
                     <span className="text-white/80 font-mono text-xs tracking-widest">MEMBER CARD</span>
                     <span className="material-symbols-outlined text-primary text-3xl">workspace_premium</span>
                 </div>
                 
                 <div>
                     <p className="text-primary font-bold text-sm uppercase tracking-widest mb-1">Gold Tier</p>
                     <h2 className="text-white text-3xl font-black tracking-tight mb-4">Unlocks Everything.</h2>
                     <div className="flex items-baseline gap-2 text-white">
                         <span className="text-4xl font-black">₹499</span>
                         <span className="text-white/60 text-sm">/ month</span>
                     </div>
                 </div>
             </div>
         </div>
      </div>

      {/* Benefits List */}
      <div className="px-6 space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">Gold Privileges</h3>
          
          {/* Benefit 1: 10% Discount */}
          <div className="flex items-start gap-5">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-primary-dim flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                  <span className="material-symbols-outlined text-black text-2xl">percent</span>
              </div>
              <div className="flex-1">
                  <h4 className="text-lg font-bold text-onyx dark:text-white">Flat 10% Off</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mt-1">
                      Save instantly on every service, cleaning agent, and add-on. No minimum order value.
                  </p>
              </div>
          </div>

           {/* Benefit 2: Priority Timings */}
           <div className="flex items-start gap-5">
              <div className="h-12 w-12 rounded-2xl bg-gray-900 dark:bg-white/10 flex items-center justify-center shrink-0 border border-gray-200 dark:border-white/10">
                  <span className="material-symbols-outlined text-white text-2xl">schedule</span>
              </div>
              <div className="flex-1">
                  <h4 className="text-lg font-bold text-onyx dark:text-white">Priority Slots</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mt-1">
                      Get exclusive access to high-demand morning and weekend slots reserved just for you.
                  </p>
              </div>
          </div>

          {/* Benefit 3: Top Partners */}
          <div className="flex items-start gap-5">
              <div className="h-12 w-12 rounded-2xl bg-gray-900 dark:bg-white/10 flex items-center justify-center shrink-0 border border-gray-200 dark:border-white/10">
                  <span className="material-symbols-outlined text-white text-2xl">badge</span>
              </div>
              <div className="flex-1">
                  <h4 className="text-lg font-bold text-onyx dark:text-white">Top-Rated Partners</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mt-1">
                      Auto-assigned 4.9+ rated professionals for all your bookings.
                  </p>
              </div>
          </div>
      </div>

      {/* CTA - Fixed above Bottom Nav for Mobile */}
      <div className="fixed bottom-[84px] md:bottom-8 left-0 right-0 px-6 z-40 max-w-md mx-auto pointer-events-none">
          <button 
            onClick={togglePremium}
            className="pointer-events-auto relative w-full h-14 bg-onyx dark:bg-white rounded-xl overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.12)] active:scale-[0.98] transition-all border border-white/10"
          >
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dim opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 flex items-center justify-center gap-3 h-full">
                  <span className={`text-lg font-bold ${isPremium ? 'text-white' : 'text-white dark:text-black group-hover:text-black'}`}>
                      {isPremium ? 'Manage Membership' : 'Unlock Gold @ ₹499'}
                  </span>
                  {!isPremium && <span className="material-symbols-outlined text-white dark:text-black group-hover:text-black">arrow_forward</span>}
              </div>
          </button>
      </div>

      <BottomNav {...props} />
    </div>
  );
};
