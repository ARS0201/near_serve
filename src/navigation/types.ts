import { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  HomeTab: undefined;
  DiscoverTab: { categoryId?: string } | undefined;
  BookingsTab: undefined;
  ProfileTab: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Signup: undefined;
  Main: NavigatorScreenParams<MainTabParamList> | undefined;
  Home: undefined;
  Discover: { categoryId?: string } | undefined;
  ServiceDetails: { providerId: string };
  Booking: { providerId: string; serviceId?: string };
  BookingConfirmation: {
    bookingId: string;
    serviceName?: string;
    providerName?: string;
  };
  MyBookings: undefined;
  BookingDetails: { bookingId: string };
  Profile: undefined;
  SavedServices: undefined;
  Notifications: undefined;
};
