import { MOCK_BOOKINGS, MOCK_CATEGORIES, MOCK_NOTIFICATIONS, MOCK_PROVIDERS, MOCK_USERS } from '../data/mockData';
import type { AppNotification, Booking, Category, FilterState, Provider, User } from '../types/index';

const API_BASE_URL = 'http://localhost:5000/api';

// In-memory runtime state for offline/demo fallback
let localUsers: User[] = [...MOCK_USERS];
let localProviders: Provider[] = [...MOCK_PROVIDERS];
let localBookings: Booking[] = [...MOCK_BOOKINGS];
let localNotifications: AppNotification[] = [...MOCK_NOTIFICATIONS];
let localSavedIds: string[] = ['prov_1', 'prov_5'];
let currentToken: string | null = null;

export const api = {
  // 1. Authentication
  login: async (emailOrPhone: string, password: string): Promise<{ user: User; token: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone, password }),
      });
      if (response.ok) {
        const data = await response.json();
        currentToken = data.token;
        return data;
      }
    } catch (e) {
      // Fallback to local mock data
    }

    const cleanInput = emailOrPhone.trim().toLowerCase();
    const matched = localUsers.find(
      (u) =>
        u.email.toLowerCase() === cleanInput ||
        u.phone.replace(/\D/g, '') === cleanInput.replace(/\D/g, '')
    );

    if (matched) {
      currentToken = 'mock_jwt_token_' + matched.id;
      return { user: matched, token: currentToken };
    }

    // Allow quick demo email signup on the fly
    if (cleanInput.includes('@') && password.length >= 6) {
      const newUser: User = {
        id: 'user_' + Date.now(),
        name: cleanInput.split('@')[0].toUpperCase(),
        email: cleanInput,
        phone: '+91 98765 43210',
        location: 'Coimbatore, Tamil Nadu',
        createdAt: new Date().toISOString(),
      };
      localUsers.push(newUser);
      currentToken = 'mock_jwt_token_' + newUser.id;
      return { user: newUser, token: currentToken };
    }

    throw new Error('Invalid email or password. Use demo@nearserve.com / password123');
  },

  signup: async (userData: {
    name: string;
    email: string;
    phone: string;
    location: string;
    password: string;
  }): Promise<{ user: User; token: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (response.ok) {
        const data = await response.json();
        currentToken = data.token;
        return data;
      }
    } catch (e) {
      // Fallback to local
    }

    const newUser: User = {
      id: 'user_' + Date.now(),
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      location: userData.location,
      createdAt: new Date().toISOString(),
    };
    localUsers.push(newUser);
    currentToken = 'mock_jwt_token_' + newUser.id;
    return { user: newUser, token: currentToken };
  },

  updateProfile: async (fields: Partial<User>): Promise<User> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify(fields),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      // Fallback
    }

    if (localUsers.length > 0) {
      localUsers[0] = { ...localUsers[0], ...fields };
      return localUsers[0];
    }
    throw new Error('No active user found');
  },

  // 2. Categories & Services
  fetchCategories: async (): Promise<Category[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      if (response.ok) return await response.json();
    } catch (e) {}
    return MOCK_CATEGORIES;
  },

  fetchServices: async (): Promise<Provider[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/services`);
      if (response.ok) return await response.json();
    } catch (e) {}
    return localProviders;
  },

  fetchServiceDetails: async (providerId: string): Promise<Provider | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/services/${providerId}`);
      if (response.ok) return await response.json();
    } catch (e) {}
    return localProviders.find((p) => p.id === providerId) || null;
  },

  filterServices: async (filters: FilterState): Promise<Provider[]> => {
    try {
      const params = new URLSearchParams();
      if (filters.searchQuery) params.append('search', filters.searchQuery);
      if (filters.category && filters.category !== 'All') params.append('category', filters.category);
      if (filters.maxDistance) params.append('maxDistance', String(filters.maxDistance));
      if (filters.minPrice) params.append('minPrice', String(filters.minPrice));
      if (filters.maxPrice) params.append('maxPrice', String(filters.maxPrice));
      if (filters.minRating) params.append('minRating', String(filters.minRating));
      if (filters.availability) params.append('availability', filters.availability);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);

      const response = await fetch(`${API_BASE_URL}/services/filter?${params.toString()}`);
      if (response.ok) return await response.json();
    } catch (e) {}

    // Local filter fallback
    let res = [...localProviders];
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      res = res.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.serviceName.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q)
      );
    }
    if (filters.category && filters.category !== 'All') {
      res = res.filter((p) => p.categoryName.toLowerCase() === filters.category.toLowerCase());
    }
    if (filters.maxDistance !== null) {
      res = res.filter((p) => p.distanceKm <= filters.maxDistance!);
    }
    if (filters.minPrice !== null) {
      res = res.filter((p) => p.startingPrice >= filters.minPrice!);
    }
    if (filters.maxPrice !== null) {
      res = res.filter((p) => p.startingPrice <= filters.maxPrice!);
    }
    if (filters.minRating !== null) {
      res = res.filter((p) => p.rating >= filters.minRating!);
    }
    if (filters.availability !== null) {
      res = res.filter((p) => p.availabilityStatus === filters.availability);
    }
    return res;
  },

  // 3. Bookings
  createBooking: async (bookingData: Omit<Booking, 'id' | 'bookingCode' | 'createdAt' | 'status' | 'timelineStage'>): Promise<Booking> => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify(bookingData),
      });
      if (response.ok) return await response.json();
    } catch (e) {}

    const newCode = `NS20260922${Math.floor(100 + Math.random() * 900)}`;
    const newBooking: Booking = {
      ...bookingData,
      id: 'book_' + Date.now(),
      bookingCode: newCode,
      status: 'Pending',
      timelineStage: 'placed',
      createdAt: new Date().toISOString(),
    };
    localBookings.unshift(newBooking);
    return newBooking;
  },

  fetchBookings: async (): Promise<Booking[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      if (response.ok) return await response.json();
    } catch (e) {}
    return localBookings;
  },

  cancelBooking: async (bookingId: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      if (response.ok) return true;
    } catch (e) {}

    localBookings = localBookings.map((b) =>
      b.id === bookingId ? { ...b, status: 'Cancelled' as const } : b
    );
    return true;
  },

  // 4. Notifications
  fetchNotifications: async (): Promise<AppNotification[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications`, {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      if (response.ok) return await response.json();
    } catch (e) {}
    return localNotifications;
  },

  // 5. Saved Services
  toggleSaveService: async (providerId: string): Promise<string[]> => {
    localSavedIds = localSavedIds.includes(providerId)
      ? localSavedIds.filter((id) => id !== providerId)
      : [...localSavedIds, providerId];
    return localSavedIds;
  },
};
