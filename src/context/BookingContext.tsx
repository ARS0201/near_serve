import React, { createContext, useContext, useState } from 'react';
import { MOCK_BOOKINGS, MOCK_CATEGORIES, MOCK_NOTIFICATIONS, MOCK_PROVIDERS } from '../data/mockData';
import type { AppNotification, Booking, Category, FilterState, Provider } from '../types/index';

interface BookingContextType {
  categories: Category[];
  providers: Provider[];
  bookings: Booking[];
  savedProviderIds: string[];
  notifications: AppNotification[];
  currentLocation: string;
  setCurrentLocation: (loc: string) => void;
  toggleFavorite: (providerId: string) => void;
  isFavorite: (providerId: string) => boolean;
  createBooking: (bookingData: Omit<Booking, 'id' | 'bookingCode' | 'createdAt' | 'status' | 'timelineStage'>) => Promise<Booking>;
  cancelBooking: (bookingId: string) => Promise<void>;
  rateBooking: (bookingId: string, rating: number, comment: string) => Promise<void>;
  markNotificationAsRead: (notificationId: string) => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  getFilteredProviders: () => Provider[];
}

const defaultFilters: FilterState = {
  searchQuery: '',
  category: 'All',
  maxDistance: null,
  minPrice: null,
  maxPrice: null,
  minRating: null,
  availability: null,
  sortBy: 'relevance',
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories] = useState<Category[]>(MOCK_CATEGORIES);
  const [providers, setProviders] = useState<Provider[]>(MOCK_PROVIDERS);
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [savedProviderIds, setSavedProviderIds] = useState<string[]>(['prov_1', 'prov_5']);
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);
  const [currentLocation, setCurrentLocation] = useState<string>('Coimbatore');
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const toggleFavorite = (providerId: string) => {
    setSavedProviderIds((prev) =>
      prev.includes(providerId) ? prev.filter((id) => id !== providerId) : [...prev, providerId]
    );
  };

  const isFavorite = (providerId: string) => savedProviderIds.includes(providerId);

  const createBooking = async (
    bookingData: Omit<Booking, 'id' | 'bookingCode' | 'createdAt' | 'status' | 'timelineStage'>
  ): Promise<Booking> => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const dateDigits = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const newBookingCode = `NS${dateDigits}${randomSuffix}`;

    const newBooking: Booking = {
      ...bookingData,
      id: `book_${Date.now()}`,
      bookingCode: newBookingCode,
      status: 'Pending',
      timelineStage: 'placed',
      createdAt: new Date().toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Also add a new notification
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      userId: bookingData.userId,
      title: 'Booking Placed! ⏳',
      message: `Your booking for ${bookingData.serviceName} (#${newBookingCode}) has been received and is pending provider confirmation.`,
      timeAgo: 'Just now',
      isRead: false,
      createdAt: new Date().toISOString(),
      type: 'booking_confirmed',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return newBooking;
  };

  const cancelBooking = async (bookingId: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'Cancelled' as const } : b))
    );

    const cancelledBooking = bookings.find((b) => b.id === bookingId);
    if (cancelledBooking) {
      const cancelNotif: AppNotification = {
        id: `notif_${Date.now()}`,
        userId: cancelledBooking.userId,
        title: 'Booking Cancelled ❌',
        message: `Your booking #${cancelledBooking.bookingCode} for ${cancelledBooking.serviceName} has been cancelled.`,
        timeAgo: 'Just now',
        isRead: false,
        createdAt: new Date().toISOString(),
        type: 'booking_cancelled',
      };
      setNotifications((prev) => [cancelNotif, ...prev]);
    }
  };

  const rateBooking = async (bookingId: string, rating: number, comment: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, userRating: rating, userReviewComment: comment } : b
      )
    );
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const getFilteredProviders = (): Provider[] => {
    let result = [...providers];

    // Search Query (Service name, Provider name, Category name)
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.serviceName.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          p.servicesOffered.some((s) => s.name.toLowerCase().includes(q))
      );
    }

    // Category Filter
    if (filters.category && filters.category !== 'All') {
      result = result.filter(
        (p) => p.categoryName.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Distance Filter
    if (filters.maxDistance !== null) {
      result = result.filter((p) => p.distanceKm <= (filters.maxDistance as number));
    }

    // Price Range Filter
    if (filters.minPrice !== null) {
      result = result.filter((p) => p.startingPrice >= (filters.minPrice as number));
    }
    if (filters.maxPrice !== null) {
      result = result.filter((p) => p.startingPrice <= (filters.maxPrice as number));
    }

    // Rating Filter
    if (filters.minRating !== null) {
      result = result.filter((p) => p.rating >= (filters.minRating as number));
    }

    // Availability Filter
    if (filters.availability !== null) {
      result = result.filter((p) => p.availabilityStatus === filters.availability);
    }

    // Sort
    switch (filters.sortBy) {
      case 'distance':
        result.sort((a, b) => a.distanceKm - b.distanceKm);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'price_low_high':
        result.sort((a, b) => a.startingPrice - b.startingPrice);
        break;
      case 'price_high_low':
        result.sort((a, b) => b.startingPrice - a.startingPrice);
        break;
      case 'relevance':
      default:
        // Default ranking: highest rating & lowest distance
        result.sort((a, b) => b.rating - a.rating || a.distanceKm - b.distanceKm);
        break;
    }

    return result;
  };

  return (
    <BookingContext.Provider
      value={{
        categories,
        providers,
        bookings,
        savedProviderIds,
        notifications,
        currentLocation,
        setCurrentLocation,
        toggleFavorite,
        isFavorite,
        createBooking,
        cancelBooking,
        rateBooking,
        markNotificationAsRead,
        filters,
        setFilters,
        resetFilters,
        getFilteredProviders,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
