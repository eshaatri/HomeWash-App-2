import React, { useState } from 'react';
import { AppScreen, Booking, BookingStatus, NavigationProps } from '../types';
import { BottomNav } from '../components/BottomNav';

interface BookingScreenProps extends NavigationProps {
  onSelectBooking?: (booking: Booking) => void;
}

export const BookingScreen: React.FC<BookingScreenProps> = (props) => {
  const { navigateTo, onSelectBooking, bookings } = props;
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'HISTORY' | 'CANCELLED'>('ACTIVE');

  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'ACTIVE') {
      return [BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.PARTNER_ASSIGNED, BookingStatus.PARTNER_EN_ROUTE, BookingStatus.IN_PROGRESS].includes(b.status);
    } else if (activeTab === 'HISTORY') {
      return b.status === BookingStatus.COMPLETED;
    } else {
      return b.status === BookingStatus.CANCELLED;
    }
  });

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.PARTNER_EN_ROUTE: return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400';
      case BookingStatus.CONFIRMED: return 'text-purple-500 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400';
      case BookingStatus.COMPLETED: return 'text-green-500 bg-green-50 dark:bg-green-900/20 dark:text-green-400';
      case BookingStatus.CANCELLED: return 'text-red-500 bg-red-50 dark:bg-red-900/20 dark:text-red-400';
      default: return 'text-gray-500 bg-gray-50 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getStatusText = (status: BookingStatus) => {
    return status.replace(/_/g, ' ');
  };

  return (
    <div className="bg-alabaster dark:bg-[#0f0f0f] min-h-screen flex flex-col font-display antialiased transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-30 flex flex-col bg-white/95 dark:bg-[#0f0f0f]/95 backdrop-blur-md border-b border-gray-200 dark:border-white/5">
        <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-xl font-bold text-onyx dark:text-white">My Bookings</h1>
            <button className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20">
                <span className="material-symbols-outlined text-[20px] text-gray-600 dark:text-white">search</span>
            </button>
        </div>
        
        {/* Tabs */}
        <div className="flex px-6 gap-6">
            {['ACTIVE', 'HISTORY', 'CANCELLED'].map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`pb-3 text-sm font-bold tracking-wide transition-all relative ${
                        activeTab === tab 
                        ? 'text-primary' 
                        : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                    }`}
                >
                    {tab.charAt(0) + tab.slice(1).toLowerCase()}
                    {activeTab === tab && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></div>
                    )}
                </button>
            ))}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-6 pb-32 space-y-4">
        {filteredBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center pt-20 opacity-50">
                <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-700 mb-4">calendar_today</span>
                <p className="text-gray-500 dark:text-gray-400 font-medium">No {activeTab.toLowerCase()} bookings found</p>
            </div>
        ) : (
            filteredBookings.map((booking) => (
                <div 
                    key={booking.id}
                    onClick={() => {
                        if (booking.status !== BookingStatus.CANCELLED) {
                            if (onSelectBooking) {
                                onSelectBooking(booking);
                            } else {
                                navigateTo(AppScreen.BOOKING_DETAIL);
                            }
                        }
                    }}
                    className="group bg-white dark:bg-[#1a1a1a] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-white/5 active:scale-[0.99] transition-all cursor-pointer hover:shadow-md hover:border-primary/20"
                >
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 dark:text-gray-400">
                                <span className="material-symbols-outlined">cleaning_services</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-onyx dark:text-white leading-tight">{booking.serviceName}</h3>
                                <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-0.5">
                                    {booking.date} • {booking.time}
                                </p>
                            </div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide ${getStatusColor(booking.status)}`}>
                            {getStatusText(booking.status)}
                        </span>
                    </div>
                    
                    <div className="h-px bg-gray-100 dark:bg-white/5 w-full my-3"></div>
                    
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                             {booking.partnerName && (
                                <>
                                    <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                        {booking.partnerImage ? (
                                            <img src={booking.partnerImage} className="h-full w-full object-cover" alt="partner" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-[10px] font-bold">P</div>
                                        )}
                                    </div>
                                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{booking.partnerName}</span>
                                </>
                             )}
                         </div>
                         <div className="flex items-center gap-2">
                             <span className="text-sm font-bold text-onyx dark:text-white">₹{booking.amount}</span>
                             {booking.status === BookingStatus.COMPLETED && (
                                <button className="flex items-center gap-1 text-xs font-bold text-primary border border-primary/20 px-2 py-1 rounded hover:bg-primary/10 transition-colors">
                                    <span className="material-symbols-outlined text-[14px]">refresh</span>
                                    Rebook
                                </button>
                             )}
                             {activeTab === 'ACTIVE' && (
                                <button className="flex items-center gap-1 text-xs font-bold text-onyx dark:text-white bg-gray-100 dark:bg-white/10 px-3 py-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-white/20 transition-colors">
                                    Track
                                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                                </button>
                             )}
                         </div>
                    </div>
                </div>
            ))
        )}
      </main>

      <BottomNav {...props} />
    </div>
  );
};