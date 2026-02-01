import React from 'react';
import { AppScreen, NavigationProps } from '../types';
import { BottomNav } from '../components/BottomNav';

export const MembershipScreen: React.FC<NavigationProps> = (props) => {
  const { navigateTo, isPremium, togglePremium } = props;

  return (
    <div className="bg-alabaster dark:bg-[#201d12] font-display text-slate-900 dark:text-white antialiased overflow-x-hidden min-h-screen flex flex-col relative pb-32">
      
      {/* Top Navigation - Back button removed for Tab View */}
      <nav className="sticky top-0 z-50 flex items-center bg-alabaster/90 dark:bg-[#201d12]/90 backdrop-blur-md px-4 py-3 justify-center border-b border-gray-200 dark:border-white/5">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>diamond</span>
          <span className="text-sm font-bold tracking-widest uppercase text-black dark:text-white">Home Wash | Gold</span>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative w-full h-[320px] overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-t from-[#201d12] via-[#201d12]/50 to-transparent z-10 pointer-events-none"></div>
        <div 
          className="w-full h-full bg-center bg-cover bg-no-repeat transform scale-105 group-hover:scale-100 transition-transform duration-700 ease-out" 
          style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBzAsocfs1AlEM7Y5Wk1Mp-lLpJof03tyV2Z4uTWZA7lPbKIE6FzeFGJzt3BSbLg9S7OnltFtxPYTjd6Y4r65DSCX2aZK2v6ue29JrYowb4Aync6wrX-ZElIUNDJBHp3vwphOyVc39Tr3g2UY-brOyJmsxr4D6CuIrMnRgswSNXCoPsCmZD8Wi-kLG6BpUQPW1Fa3SvBZOMl_nvMpDGWgujBhRfg0tgkSlGzoR6MpvURgeonSUNL0Q_5pEzaAXA1L9BBWSOU95PHTY")' }}
        ></div>
        {/* Floating Badge */}
        <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center">
          <div className="bg-black/60 backdrop-blur-sm border border-primary/30 px-5 py-1.5 rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(var(--primary-r),var(--primary-g),var(--primary-b),0.2)]">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/90">Premium Tier</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-4 -mt-4 relative z-20 space-y-8">
        
        {/* Headlines */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white drop-shadow-sm">
            Laundry, <br/><span className="text-primary">Redefined.</span>
          </h1>
          <p className="text-gray-400 text-base font-normal leading-relaxed max-w-xs mx-auto">
            Unlock premium privileges across 6 major metros with the Gold Standard.
          </p>
        </div>

        {/* Benefits List */}
        <div className="space-y-4">
          {[
            { icon: 'bolt', title: 'Zero Waiting', desc: 'Skip the queue, every time.' },
            { icon: 'local_shipping', title: 'Priority Pickup', desc: '60-minute turnaround windows.' },
            { icon: 'savings', title: 'Rollover Credits', desc: 'Unused washes stay with you.' },
            { icon: 'checkroom', title: 'Premium Packaging', desc: 'Your clothes, delivered in style.' }
          ].map((benefit) => (
            <div key={benefit.title} className="group flex items-center gap-4 bg-white/[0.03] border border-white/5 p-4 rounded-xl hover:bg-white/[0.06] transition-colors">
              <div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-12 group-hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined">{benefit.icon}</span>
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-white text-base font-semibold leading-normal">{benefit.title}</p>
                <p className="text-[#b6b1a0] text-sm font-normal leading-normal">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Card */}
        <div className="relative overflow-hidden rounded-xl border border-primary/40 bg-gradient-to-b from-primary/10 to-[#201d12] p-8 text-center shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/10 blur-[60px] rounded-full pointer-events-none"></div>
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-primary/5 blur-[60px] rounded-full pointer-events-none"></div>
          <div className="relative z-10">
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-bold mb-3">All Inclusive</p>
            <div className="flex items-start justify-center gap-1 mb-2">
              <span className="text-2xl font-medium text-white/60 mt-2">₹</span>
              <span className="text-5xl font-bold text-white tracking-tight">499</span>
            </div>
            <p className="text-gray-400 text-sm mb-6">per month, billed annually</p>
            <div className="inline-flex items-center gap-2 bg-[#201d12]/80 border border-white/10 px-3 py-1.5 rounded-lg">
              <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
              <span className="text-xs text-white/80">Cancel anytime. No hidden fees.</span>
            </div>
          </div>
        </div>

        {/* Testimonial Section */}
        <div className="text-center py-6 border-t border-white/5">
          <div className="flex justify-center gap-1 mb-4 text-primary">
            {[1,2,3,4,5].map(i => (
              <span key={i} className="material-symbols-outlined fill-1 text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            ))}
          </div>
          <p className="text-white/90 italic text-lg leading-relaxed mb-6 px-2 font-light">
            "The zero waiting feature is a game changer for my busy schedule. Absolute luxury service."
          </p>
          <div className="flex items-center justify-center gap-3">
            <div 
              className="size-10 rounded-full border border-white/10 bg-gray-600 bg-cover bg-center" 
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD8Ef8ElZ7J83hubPUVTphlL6jRIDuWtp5EFsDw6rd_Icq1Yg2EQlc_I5qUWcgFpbBfNFA0m-LM4jEponYXscfjzKcyhtVnstRyC40_1JyrUVKNb4ZjZyDeHZ4D6vL8v36QtcGod1pP6AQ5eh1kVQaYGeITmlsGU7RyFTaYQhENZM-HQsJjXQhJ_37OsDcQmMXZuLR7fKun5432GAyyjSHO4ai2cYemjusup_DY_6ZQY7sLdmnu4Ag0bto7swuZk-tjKULVADDumYo")' }}
            ></div>
            <div className="text-left">
              <p className="text-sm font-semibold text-white">Sarah Jenkins</p>
              <p className="text-xs text-primary/80 uppercase tracking-wider">Gold Member</p>
            </div>
          </div>
        </div>
      </main>

      {/* Floating CTA above BottomNav */}
      <div className="fixed bottom-20 left-0 right-0 max-w-md mx-auto w-full px-4 z-40 pointer-events-none">
        <button 
          onClick={togglePremium}
          className="w-full relative group overflow-hidden bg-primary text-[#201d12] font-bold text-lg h-14 rounded-lg shadow-[0_4px_25px_rgba(var(--primary-r),var(--primary-g),var(--primary-b),0.3)] flex items-center justify-center gap-2 active:scale-[0.98] transition-all pointer-events-auto border border-white/10"
        >
          <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[20deg] group-hover:animate-shimmer"></div>
          <span className="relative z-10">{isPremium ? 'Extend Membership' : 'Upgrade to Gold'}</span>
          <span className="material-symbols-outlined relative z-10 transition-transform group-hover:translate-x-1">arrow_forward</span>
        </button>
      </div>

      <BottomNav {...props} />
    </div>
  );
};
