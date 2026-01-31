import React, { useState, useEffect } from 'react';
import { HomeScreen } from './screens/HomeScreen';
import { MembershipScreen } from './screens/MembershipScreen';
import { AddressScreen } from './screens/AddressScreen';
import { BookingScreen } from './screens/BookingScreen';
import { SlotSelectionScreen } from './screens/SlotSelectionScreen';
import { SupportScreen } from './screens/SupportScreen';
import { ServiceSelectionScreen } from './screens/ServiceSelectionScreen';
import { SubCategoryScreen } from './screens/SubCategoryScreen';
import { CartScreen } from './screens/CartScreen';
import { CheckoutScreen } from './screens/CheckoutScreen';
import { LoginScreen } from './screens/LoginScreen';
import { PartnerDashboardScreen } from './screens/PartnerDashboardScreen';
import { BookingDetailScreen } from './screens/BookingDetailScreen';
// import { DesktopSidebar } from './components/DesktopSidebar'; // Hiding for mobile default view
import { AppScreen, User, UserRole, Booking, Service, CartItem, BookingStatus } from './types';
import { MOCK_BOOKINGS, MOCK_PARTNER, MOCK_USER } from './mockData';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.LOGIN);
  const [isPremium, setIsPremium] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [currentLocation, setCurrentLocationState] = useState<string>('Detecting location...');
  const [currentLocationLabel, setCurrentLocationLabel] = useState<string>('Current Location');
  
  // Data State
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [cart, setCart] = useState<CartItem[]>([]);
  // Changed from single bookingSlot to a map of uniqueId -> Slot
  // Key format: `${serviceId}_${index}` (e.g. s1_0, s1_1)
  const [serviceSlots, setServiceSlots] = useState<Record<string, { date: string; time: string }>>({});
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Apply theme colors via CSS variables
  useEffect(() => {
    const root = document.documentElement;
    if (isPremium) {
      // Premium Theme: #ffd633 (New Gold)
      root.style.setProperty('--primary-r', '255');
      root.style.setProperty('--primary-g', '214');
      root.style.setProperty('--primary-b', '51');
      root.style.setProperty('--primary-dim', '#b39624');
      root.style.setProperty('--gradient-start', '#ffd633');
      root.style.setProperty('--gradient-end', '#e6c229');
    } else {
      // Freemium Theme: #e68a00 (Orange)
      root.style.setProperty('--primary-r', '230');
      root.style.setProperty('--primary-g', '138');
      root.style.setProperty('--primary-b', '0');
      root.style.setProperty('--primary-dim', '#b36b00');
      root.style.setProperty('--gradient-start', '#e68a00');
      root.style.setProperty('--gradient-end', '#cc7a00');
    }
  }, [isPremium]);

  // Apply Dark Mode class
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  const togglePremium = () => setIsPremium(prev => !prev);
  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const navigateTo = (screen: AppScreen) => {
    window.scrollTo(0, 0);
    setCurrentScreen(screen);
  };

  const login = (phone: string, role: UserRole) => {
    if (role === UserRole.PARTNER) {
      setUser(MOCK_PARTNER);
      setCurrentScreen(AppScreen.PARTNER_DASHBOARD);
    } else {
      setUser(MOCK_USER);
      setCurrentScreen(AppScreen.HOME);
    }
  };

  const logout = () => {
    setUser(null);
    setCurrentScreen(AppScreen.LOGIN);
  };

  const setCurrentLocation = (location: string, label: string = 'Current Location') => {
    setCurrentLocationState(location);
    setCurrentLocationLabel(label);
  };

  // --- Cart & Booking Logic ---

  const addToCart = (service: Service) => {
    setCart((prev) => {
      const existing = prev.find(item => item.service.id === service.id);
      if (existing) {
        return prev.map(item => 
          item.service.id === service.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { service, quantity: 1 }];
    });
  };

  const decreaseQuantity = (service: Service) => {
    setCart((prev) => {
      const existing = prev.find(item => item.service.id === service.id);
      if (existing && existing.quantity > 1) {
        return prev.map(item => 
          item.service.id === service.id 
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prev.filter(item => item.service.id !== service.id);
    });
  };

  const removeFromCart = (serviceId: string) => {
    setCart((prev) => prev.filter((item) => item.service.id !== serviceId));
    // Also remove from slots if it exists (cleanup all potential indices)
    setServiceSlots(prev => {
        const newState = { ...prev };
        Object.keys(newState).forEach(key => {
            if (key.startsWith(serviceId + '_')) {
                delete newState[key];
            }
        });
        return newState;
    });
  };

  const setServiceSlot = (uniqueKey: string, date: string, time: string) => {
    setServiceSlots(prev => ({
        ...prev,
        [uniqueKey]: { date, time }
    }));
  };

  const onPaymentComplete = () => {
    const newBookings: Booking[] = [];
    
    // Explode cart items based on quantity
    cart.forEach(item => {
        for (let i = 0; i < item.quantity; i++) {
            const uniqueKey = `${item.service.id}_${i}`;
            const slot = serviceSlots[uniqueKey] || { date: 'Pending', time: 'Pending' };
            
            newBookings.push({
                id: 'bk' + Math.random().toString(36).substr(2, 6),
                serviceName: item.service.title,
                status: BookingStatus.PENDING,
                date: slot.date,
                time: slot.time,
                amount: item.service.price, // Individual price
                partnerName: 'Looking for partner...',
            });
        }
    });

    setBookings(prev => [...newBookings, ...prev]);
    setCart([]); // Clear cart
    setServiceSlots({});
    navigateTo(AppScreen.BOOKING);
  };

  const commonProps = {
    currentScreen,
    navigateTo,
    isPremium,
    togglePremium,
    isDarkMode,
    toggleDarkMode,
    user,
    login,
    logout,
    currentLocation,
    currentLocationLabel,
    setCurrentLocation,
    bookings,
    cart,
    serviceSlots,
    addToCart,
    removeFromCart,
    decreaseQuantity,
    setServiceSlot,
    onPaymentComplete
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case AppScreen.LOGIN:
        return <LoginScreen {...commonProps} />;
      case AppScreen.PARTNER_DASHBOARD:
        return <PartnerDashboardScreen {...commonProps} />;
      case AppScreen.HOME:
        return <HomeScreen {...commonProps} />;
      case AppScreen.MEMBERSHIP:
        return <MembershipScreen {...commonProps} />;
      case AppScreen.ADDRESSES:
        return <AddressScreen {...commonProps} />;
      case AppScreen.BOOKING:
        return <BookingScreen {...commonProps} onSelectBooking={(b) => {
          setSelectedBooking(b);
          navigateTo(AppScreen.BOOKING_DETAIL);
        }} />;
      case AppScreen.SLOT_SELECTION:
        return <SlotSelectionScreen {...commonProps} />;
      case AppScreen.BOOKING_DETAIL:
        return <BookingDetailScreen {...commonProps} booking={selectedBooking || bookings[0] || MOCK_BOOKINGS[0]} />;
      case AppScreen.SUPPORT:
        return <SupportScreen {...commonProps} />;
      case AppScreen.SUB_CATEGORY:
        return <SubCategoryScreen {...commonProps} />;
      case AppScreen.SERVICE_SELECTION:
        return <ServiceSelectionScreen {...commonProps} />;
      case AppScreen.CART:
        return <CartScreen {...commonProps} />;
      case AppScreen.CHECKOUT:
        return <CheckoutScreen {...commonProps} />;
      default:
        return <HomeScreen {...commonProps} />;
    }
  };

  const isLoggedIn = user !== null && currentScreen !== AppScreen.LOGIN;

  return (
    <div className="flex min-h-screen bg-gray-200 dark:bg-[#050505] justify-center transition-colors duration-300">
      
      {/* 
         MOBILE DEFAULT VIEW: 
         - Constrained width (max-w-md)
         - Centered (mx-auto)
         - Shadow to resemble a device
         - Hidden sidebar
      */}
      
      <div className="w-full max-w-md h-full min-h-screen bg-white dark:bg-black shadow-2xl overflow-hidden relative">
         {renderScreen()}
      </div>
    </div>
  );
}
