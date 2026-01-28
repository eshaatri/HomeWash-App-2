import React, { useState, useEffect } from 'react';
import { HomeScreen } from './screens/HomeScreen';
import { MembershipScreen } from './screens/MembershipScreen';
import { AddressScreen } from './screens/AddressScreen';
import { BookingScreen } from './screens/BookingScreen';
import { SupportScreen } from './screens/SupportScreen';
import { ServiceSelectionScreen } from './screens/ServiceSelectionScreen';
import { CartScreen } from './screens/CartScreen';
import { CheckoutScreen } from './screens/CheckoutScreen';
import { AppScreen } from './types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.HOME);
  const [isPremium, setIsPremium] = useState(true);

  // Apply theme colors via CSS variables
  useEffect(() => {
    const root = document.documentElement;
    if (isPremium) {
      // Premium Theme: #daa520 (Gold)
      root.style.setProperty('--primary-r', '218');
      root.style.setProperty('--primary-g', '165');
      root.style.setProperty('--primary-b', '32');
      root.style.setProperty('--primary-dim', '#856d20');
      root.style.setProperty('--gradient-start', '#daa520');
      root.style.setProperty('--gradient-end', '#b8860b');
    } else {
      // Freemium Theme: #ffff33 (Bright Yellow)
      root.style.setProperty('--primary-r', '255');
      root.style.setProperty('--primary-g', '255');
      root.style.setProperty('--primary-b', '51');
      root.style.setProperty('--primary-dim', '#cccc00');
      root.style.setProperty('--gradient-start', '#ffff33');
      root.style.setProperty('--gradient-end', '#e6e600');
    }
  }, [isPremium]);

  const togglePremium = () => setIsPremium(prev => !prev);

  const navigateTo = (screen: AppScreen) => {
    // Scroll to top when changing screens
    window.scrollTo(0, 0);
    setCurrentScreen(screen);
  };

  const commonProps = {
    currentScreen,
    navigateTo,
    isPremium,
    togglePremium
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case AppScreen.HOME:
        return <HomeScreen {...commonProps} />;
      case AppScreen.MEMBERSHIP:
        return <MembershipScreen {...commonProps} />;
      case AppScreen.ADDRESSES:
        return <AddressScreen {...commonProps} />;
      case AppScreen.BOOKING:
        return <BookingScreen {...commonProps} />;
      case AppScreen.SUPPORT:
        return <SupportScreen {...commonProps} />;
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
    // Mobile container wrapper for desktop viewing
    <div className="flex justify-center min-h-screen bg-neutral-900">
      <div className="w-full max-w-md bg-black shadow-2xl overflow-hidden min-h-screen">
        {renderScreen()}
      </div>
    </div>
  );
}
