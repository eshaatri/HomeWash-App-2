import React from 'react';
import { AppScreen, Booking, BookingStatus, NavigationProps } from '../types';

interface Props extends NavigationProps {
  booking: Booking;
}

export const BookingDetailScreen: React.FC<Props> = ({ navigateTo, booking }) => {
  const steps = [
    { status: BookingStatus.PENDING, label: 'Booking Confirmed', time: '10:00 AM' },
    { status: BookingStatus.PARTNER_ASSIGNED, label: 'Partner Assigned', time: '10:05 AM' },
    { status: BookingStatus.PARTNER_EN_ROUTE, label: 'Out for Service', time: '01:30 PM' },
    { status: BookingStatus.IN_PROGRESS, label: 'Job Started', time: null },
    { status: BookingStatus.COMPLETED, label: 'Completed', time: null },
  ];

  const currentStepIndex = steps.findIndex(s => s.status === booking.status);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#121212] font-display text-onyx dark:text-white pb-safe">
      <header className="bg-white dark:bg-[#1a1a1a] p-4 flex items-center gap-4 shadow-sm z-20 sticky top-0">
        <button onClick={() => navigateTo(AppScreen.HOME)} className="material-symbols-outlined">arrow_back</button>
        <h1 className="font-bold text-lg">Booking #{booking.id}</h1>
        <div className="flex-1 text-right">
             <button className="text-xs font-bold text-primary uppercase border border-primary/30 px-3 py-1 rounded-full">Help</button>
        </div>
      </header>

      {/* Map Placeholder */}
      <div className="h-64 bg-gray-200 dark:bg-[#202020] relative w-full">
         <div className="absolute inset-0 flex items-center justify-center opacity-10">
             {/* Abstract Map Lines */}
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0,50 Q25,25 50,50 T100,50" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M20,0 L20,100" stroke="currentColor" strokeWidth="1" fill="none" />
                <path d="M80,0 L80,100" stroke="currentColor" strokeWidth="1" fill="none" />
            </svg>
         </div>
         {/* Partner Marker */}
         <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
             <div className="bg-primary p-2 rounded-full shadow-lg border-2 border-white dark:border-black animate-bounce">
                 <span className="material-symbols-outlined text-black">directions_car</span>
             </div>
             <div className="bg-black/70 text-white text-[10px] px-2 py-1 rounded mt-1 font-bold">5 mins away</div>
         </div>
      </div>

      <div className="flex-1 bg-white dark:bg-[#1a1a1a] -mt-4 rounded-t-3xl relative z-10 p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        {/* Partner Info */}
        <div className="flex items-start justify-between border-b border-gray-100 dark:border-white/5 pb-6 mb-6">
            <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-gray-200 overflow-hidden border-2 border-white dark:border-gray-700 shadow-md">
                    <img src={booking.partnerImage} alt="Partner" className="h-full w-full object-cover"/>
                </div>
                <div>
                    <h2 className="font-bold text-lg">{booking.partnerName}</h2>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                        <span className="material-symbols-outlined text-[16px] text-yellow-500 fill-current">star</span>
                        <span>4.9 Rating</span>
                    </div>
                </div>
            </div>
            <div className="flex gap-2">
                <button className="h-10 w-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">chat</span>
                </button>
                <button className="h-10 w-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">call</span>
                </button>
            </div>
        </div>

        {/* OTP Section */}
        {booking.otp && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-xl p-4 mb-6 flex justify-between items-center">
                <div>
                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">Start Service OTP</p>
                    <p className="text-blue-800 dark:text-blue-200 text-xs mt-1">Share this code with partner when they arrive.</p>
                </div>
                <div className="text-3xl font-mono font-bold text-blue-700 dark:text-blue-300 tracking-widest bg-white dark:bg-black/20 px-3 py-1 rounded-lg border border-blue-200 dark:border-blue-900/50">
                    {booking.otp}
                </div>
            </div>
        )}

        {/* Tracking Steps */}
        <div className="space-y-6 relative pl-2">
             <div className="absolute left-[11px] top-2 bottom-4 w-0.5 bg-gray-200 dark:bg-white/10"></div>
             {steps.map((step, idx) => {
                 const isCompleted = idx <= currentStepIndex;
                 const isCurrent = idx === currentStepIndex;
                 
                 return (
                     <div key={idx} className="relative flex items-start gap-4">
                         <div className={`z-10 h-6 w-6 rounded-full border-4 flex items-center justify-center ${isCompleted ? 'bg-primary border-primary' : 'bg-white dark:bg-[#1a1a1a] border-gray-300 dark:border-gray-600'}`}>
                             {isCompleted && <span className="material-symbols-outlined text-black text-[12px] font-bold">check</span>}
                         </div>
                         <div className={`flex-1 ${!isCompleted && 'opacity-50'}`}>
                             <h4 className={`text-sm font-bold ${isCurrent ? 'text-primary' : 'text-onyx dark:text-white'}`}>{step.label}</h4>
                             {step.time && <p className="text-xs text-gray-500 mt-0.5">{step.time}</p>}
                         </div>
                     </div>
                 )
             })}
        </div>
      </div>
    </div>
  );
};
