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
import { AppScreen, User, UserRole } from './types';
import { MOCK_BOOKINGS, MOCK_PARTNER, MOCK_USER } from './mockData';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.LOGIN);
  const [isPremium, setIsPremium] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [user, setUser] = useState<User | null>(null);

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

  const commonProps = {
    currentScreen,
    navigateTo,
    isPremium,
    togglePremium,
    isDarkMode,
    toggleDarkMode,
    user,
    login,
    logout
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
        return <BookingScreen {...commonProps} />;
      case AppScreen.SLOT_SELECTION:
        return <SlotSelectionScreen {...commonProps} />;
      case AppScreen.BOOKING_DETAIL:
        return <BookingDetailScreen {...commonProps} booking={MOCK_BOOKINGS[0]} />;
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

  return (
    <div className="flex justify-center min-h-screen bg-gray-100 dark:bg-neutral-900 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-black shadow-2xl overflow-hidden min-h-screen transition-colors duration-300">
        {renderScreen()}
      </div>
    </div>
  );
}
