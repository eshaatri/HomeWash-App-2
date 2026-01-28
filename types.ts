export enum AppScreen {
  HOME = 'HOME',
  MEMBERSHIP = 'MEMBERSHIP',
  ADDRESSES = 'ADDRESSES',
  BOOKING = 'BOOKING',
  SUPPORT = 'SUPPORT',
  SERVICE_SELECTION = 'SERVICE_SELECTION',
  CART = 'CART',
  CHECKOUT = 'CHECKOUT',
}

export interface NavigationProps {
  currentScreen: AppScreen;
  navigateTo: (screen: AppScreen) => void;
  isPremium: boolean;
  togglePremium: () => void;
}
