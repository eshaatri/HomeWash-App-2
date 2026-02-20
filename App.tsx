import React, { useState, useEffect } from "react";
import { HomeScreen } from "./screens/HomeScreen";
import { MembershipScreen } from "./screens/MembershipScreen";
import { AddressScreen } from "./screens/AddressScreen";
import { BookingScreen } from "./screens/BookingScreen";
import { SlotSelectionScreen } from "./screens/SlotSelectionScreen";
import { SupportScreen } from "./screens/SupportScreen";
import { ServiceSelectionScreen } from "./screens/ServiceSelectionScreen";
import { ServiceDetailScreen } from "./screens/ServiceDetailScreen";
import { SubCategoryScreen } from "./screens/SubCategoryScreen";
import { CartScreen } from "./screens/CartScreen";
import { CheckoutScreen } from "./screens/CheckoutScreen";
import { LoginScreen } from "./screens/LoginScreen";
import { PartnerDashboardScreen } from "./screens/PartnerDashboardScreen";
import { BookingDetailScreen } from "./screens/BookingDetailScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
// import { DesktopSidebar } from './components/DesktopSidebar'; // Hiding for mobile default view
import {
  AppScreen,
  User,
  UserRole,
  Booking,
  Service,
  CartItem,
  BookingStatus,
  ServiceCategory,
} from "./types";
import { MOCK_BOOKINGS, MOCK_PARTNER, MOCK_USER } from "./mockData";
import { userService, bookingService } from "./src/services/api";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(
    AppScreen.LOGIN,
  );
  const [isPremium, setIsPremium] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [currentLocation, setCurrentLocationState] = useState<string>(
    "Detecting location...",
  );
  const [currentLocationLabel, setCurrentLocationLabel] =
    useState<string>("Current Location");

  // Data State
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Category State
  const [selectedCategory, setSelectedCategoryState] =
    useState<ServiceCategory | null>(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<
    string | null
  >(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Map serviceId -> { date, time }
  // Key is simply service.id now, shared across all quantities of that service
  const [serviceSlots, setServiceSlots] = useState<
    Record<string, { date: string; time: string }>
  >({});
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Apply theme colors via CSS variables
  useEffect(() => {
    const root = document.documentElement;
    if (isPremium) {
      // Premium Theme: #ffd633 (New Gold)
      root.style.setProperty("--primary-r", "255");
      root.style.setProperty("--primary-g", "214");
      root.style.setProperty("--primary-b", "51");
      root.style.setProperty("--primary-dim", "#b39624");
      root.style.setProperty("--gradient-start", "#ffd633");
      root.style.setProperty("--gradient-end", "#e6c229");
    } else {
      // Freemium Theme: #e68a00 (Orange)
      root.style.setProperty("--primary-r", "230");
      root.style.setProperty("--primary-g", "138");
      root.style.setProperty("--primary-b", "0");
      root.style.setProperty("--primary-dim", "#b36b00");
      root.style.setProperty("--gradient-start", "#e68a00");
      root.style.setProperty("--gradient-end", "#cc7a00");
    }
  }, [isPremium]);

  // Fetch bookings when user logs in
  useEffect(() => {
    if (user) {
      const fetchBookings = async () => {
        try {
          const data =
            user.role === UserRole.CUSTOMER
              ? await bookingService.getCustomerBookings(user.id)
              : await bookingService.getPartnerBookings(user.id);
          setBookings(data);
        } catch (error) {
          console.error("Failed to fetch bookings:", error);
        }
      };
      fetchBookings();
    }
  }, [user]);

  // Apply Dark Mode class
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  const togglePremium = () => setIsPremium((prev) => !prev);
  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const navigateTo = (screen: AppScreen) => {
    window.scrollTo(0, 0);
    setCurrentScreen(screen);
  };

  const setSelectedCategory = (category: ServiceCategory | null) => {
    setSelectedCategoryState(category);
    // Reset sub-category when main category changes to ensure fresh start
    setSelectedSubCategoryId(null);
  };

  const login = async (phone: string, role: UserRole) => {
    try {
      const userData = await userService.login(phone, role);
      setUser(userData);
      if (role === UserRole.PARTNER) {
        setCurrentScreen(AppScreen.PARTNER_DASHBOARD);
      } else {
        setCurrentScreen(AppScreen.HOME);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = () => {
    setUser(null);
    setCurrentScreen(AppScreen.LOGIN);
  };

  const setCurrentLocation = (
    location: string,
    label: string = "Current Location",
  ) => {
    setCurrentLocationState(location);
    setCurrentLocationLabel(label);
  };

  // --- Cart & Booking Logic ---

  const addToCart = (service: Service) => {
    setCart((prev) => {
      // Check if exact same service ID exists (usually simple items)
      // For configured items, we might generate unique IDs in ServiceDetailScreen,
      // but for simplicity here we rely on ID.
      const existing = prev.find((item) => item.service.id === service.id);
      if (existing) {
        return prev.map((item) =>
          item.service.id === service.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { service, quantity: 1 }];
    });
  };

  const decreaseQuantity = (service: Service) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.service.id === service.id);
      if (existing && existing.quantity > 1) {
        return prev.map((item) =>
          item.service.id === service.id
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        );
      }
      return prev.filter((item) => item.service.id !== service.id);
    });
  };

  const removeFromCart = (serviceId: string) => {
    setCart((prev) => prev.filter((item) => item.service.id !== serviceId));
    // Remove slot for this service ID
    setServiceSlots((prev) => {
      const newState = { ...prev };
      delete newState[serviceId];
      return newState;
    });
  };

  const setServiceSlot = (serviceId: string, date: string, time: string) => {
    setServiceSlots((prev) => ({
      ...prev,
      [serviceId]: { date, time },
    }));
  };

  const onPaymentComplete = async () => {
    if (!user) return;

    // Create bookings.
    try {
      const promises = cart.map((item) => {
        const slot = serviceSlots[item.service.id] || {
          date: "Pending",
          time: "Pending",
        };

        return bookingService.createBooking({
          customerId: user.id,
          serviceId: item.service.id,
          serviceName: item.service.title,
          status: BookingStatus.PENDING,
          date: slot.date,
          time: slot.time,
          amount: item.service.price,
        });
      });

      await Promise.all(promises);

      // Refresh bookings
      const updatedBookings = await bookingService.getCustomerBookings(user.id);
      setBookings(updatedBookings);

      setCart([]); // Clear cart
      setServiceSlots({});
      navigateTo(AppScreen.BOOKING);
    } catch (error) {
      console.error("Failed to create bookings:", error);
    }
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
    selectedCategory,
    setSelectedCategory,
    selectedSubCategoryId,
    setSelectedSubCategoryId,
    selectedService,
    setSelectedService,
    addToCart,
    removeFromCart,
    decreaseQuantity,
    setServiceSlot,
    onPaymentComplete,
  };

  const renderScreen = () => {
    // If we are on SUB_CATEGORY, we render HomeScreen behind it
    const activeScreen =
      currentScreen === AppScreen.SUB_CATEGORY ? AppScreen.HOME : currentScreen;

    const screenContent = (() => {
      switch (activeScreen) {
        case AppScreen.LOGIN:
          return <LoginScreen {...commonProps} />;
        case AppScreen.PARTNER_DASHBOARD:
          return <PartnerDashboardScreen {...commonProps} />;
        case AppScreen.HOME:
          return <HomeScreen {...commonProps} />;
        case AppScreen.PROFILE:
          return <ProfileScreen {...commonProps} />;
        case AppScreen.MEMBERSHIP:
          return <MembershipScreen {...commonProps} />;
        case AppScreen.ADDRESSES:
          return <AddressScreen {...commonProps} />;
        case AppScreen.BOOKING:
          return (
            <BookingScreen
              {...commonProps}
              onSelectBooking={(b) => {
                setSelectedBooking(b);
                navigateTo(AppScreen.BOOKING_DETAIL);
              }}
            />
          );
        case AppScreen.SLOT_SELECTION:
          return <SlotSelectionScreen {...commonProps} />;
        case AppScreen.BOOKING_DETAIL:
          return (
            <BookingDetailScreen
              {...commonProps}
              booking={selectedBooking || bookings[0] || MOCK_BOOKINGS[0]}
            />
          );
        case AppScreen.SUPPORT:
          return <SupportScreen {...commonProps} />;
        case AppScreen.SERVICE_SELECTION:
          return <ServiceSelectionScreen {...commonProps} />;
        case AppScreen.SERVICE_DETAIL:
          return <ServiceDetailScreen {...commonProps} />;
        case AppScreen.CART:
          return <CartScreen {...commonProps} />;
        case AppScreen.CHECKOUT:
          return <CheckoutScreen {...commonProps} />;
        default:
          return <HomeScreen {...commonProps} />;
      }
    })();

    return (
      <>
        {screenContent}
        {currentScreen === AppScreen.SUB_CATEGORY && (
          <div className="absolute inset-0 z-[60]">
            <SubCategoryScreen {...commonProps} />
          </div>
        )}
      </>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-200 dark:bg-[#050505] justify-center transition-colors duration-300">
      <div className="w-full max-w-md h-full min-h-screen bg-white dark:bg-black shadow-2xl overflow-hidden relative">
        {renderScreen()}
      </div>
    </div>
  );
}
