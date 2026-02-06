import React from 'react';
import { AppScreen, NavigationProps } from '../types';
import { BottomNav } from '../components/BottomNav';

export const SupportScreen: React.FC<NavigationProps> = (props) => {
  const { navigateTo } = props;
  
  return (
    <div className="bg-background-light dark:bg-[#0f0f0f] text-slate-900 dark:text-white font-display antialiased min-h-screen flex flex-col">
      {/* Header - Back button removed for Tab View */}
      <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-white/80 dark:bg-[#0f0f0f]/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5">
        <h1 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">VIP Support Hub</h1>
        <div className="flex size-10 shrink-0 items-center justify-center">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>crown</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-5 gap-8 pb-32">
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center space-y-6 pt-2">
          <div className="space-y-2">
            <h2 className="text-3xl font-light tracking-tight text-slate-900 dark:text-white">Premium Concierge</h2>
            <p className="text-sm text-slate-500 dark:text-gray-400 max-w-[280px] mx-auto leading-relaxed">
              Need assistance? Your personal concierge is ready to help you instantly.
            </p>
          </div>
          <button className="group relative w-full flex items-center justify-center h-14 bg-gold-gradient text-black font-semibold rounded-lg shadow-[0_0_15px_rgba(var(--primary-r),var(--primary-g),var(--primary-b),0.3)] hover:shadow-[0_0_25px_rgba(var(--primary-r),var(--primary-g),var(--primary-b),0.5)] transition-all active:scale-[0.98]">
            <span className="material-symbols-outlined mr-2 transition-transform group-hover:rotate-12">temp_preferences_custom</span>
            Connect with Concierge
          </button>
        </section>

        {/* Contact Grid */}
        <section className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 h-12 rounded-lg border border-primary/30 hover:border-primary bg-surface-dark/50 hover:bg-primary/5 transition-all active:scale-[0.98]">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>chat</span>
            <span className="text-sm font-medium text-slate-900 dark:text-white">WhatsApp Priority</span>
          </button>
          <button className="flex items-center justify-center gap-2 h-12 rounded-lg border border-primary/30 hover:border-primary bg-surface-dark/50 hover:bg-primary/5 transition-all active:scale-[0.98]">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>call</span>
            <span className="text-sm font-medium text-slate-900 dark:text-white">Direct Call</span>
          </button>
        </section>

        {/* Active Ticket Tracker */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">Active Request</h3>
            <span className="text-xs text-primary font-medium hover:underline cursor-pointer">View Details</span>
          </div>
          <div className="relative overflow-hidden rounded-lg bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-white/5 p-4">
            {/* Status Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">Order #2938 - Deluxe Wash</p>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">Technician Arriving in 5m</p>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 border border-primary/20">
                <span className="material-symbols-outlined text-primary text-[14px] animate-pulse">bolt</span>
                <span className="text-[10px] font-bold text-primary tracking-wide uppercase">Fast-Track</span>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-medium text-slate-400 dark:text-gray-500 uppercase tracking-wider">
                <span>Confirmed</span>
                <span className="text-primary">En Route</span>
                <span>Service</span>
              </div>
              <div className="h-1 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-2/3 shadow-[0_0_10px_rgba(var(--primary-r),var(--primary-g),var(--primary-b),0.5)]"></div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="pb-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500 mb-3 px-1">Common Questions</h3>
          <div className="space-y-3">
            {[
              { q: 'Rescheduling Policy', a: 'As a VIP member, you can reschedule any service up to 1 hour before the scheduled time without any penalty fees.' },
              { q: 'Premium Insurance Coverage', a: 'Your Gold subscription includes comprehensive insurance coverage up to $5,000 for any potential damages during service.' },
              { q: 'Add-on Services', a: 'You can add extra services like upholstery cleaning or window treatments directly through your concierge or during booking.' }
            ].map((faq, idx) => (
              <details key={idx} className="group rounded-lg bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-white/5 open:bg-gray-100 dark:open:bg-[#2a2a2a] transition-colors duration-200">
                <summary className="flex cursor-pointer list-none items-center justify-between p-4 text-sm font-medium text-slate-900 dark:text-gray-200">
                  <span>{faq.q}</span>
                  <span className="transition group-open:rotate-180">
                    <span className="material-symbols-outlined text-gray-400 text-lg">expand_more</span>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-sm text-slate-600 dark:text-gray-400 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>
      </main>

      <BottomNav {...props} />
    </div>
  );
};
