export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string; // Ionicons icon name
  description: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMins: number;
}

export interface Provider {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  serviceName: string;
  email: string;
  phone: string;
  bio: string;
  avatarUrl: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  distanceKm: number;
  address: string;
  location: string;
  serviceArea: string;
  startingPrice: number;
  isAvailable: boolean;
  availabilityStatus: 'Available Now' | 'Available Today' | 'Available Tomorrow';
  durationText: string;
  servicesOffered: ServiceItem[];
  availableTimeSlots: string[];
  reviews: {
    id: string;
    userName: string;
    userAvatar?: string;
    rating: number;
    comment: string;
    date: string;
  }[];
}

export interface Booking {
  id: string;
  bookingCode: string;
  userId: string;
  providerId: string;
  providerName: string;
  providerImage: string;
  providerPhone?: string;
  serviceId?: string;
  serviceName: string;
  date: string;
  time: string;
  location: {
    address: string;
    area: string;
    city: string;
    pincode: string;
  };
  notes?: string;
  status: 'Pending' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled';
  timelineStage: 'placed' | 'confirmed' | 'assigned' | 'started' | 'completed';
  serviceCharge: number;
  additionalCharges: number;
  totalPrice: number;
  createdAt: string;
  userRating?: number;
  userReviewComment?: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  timeAgo: string;
  isRead: boolean;
  createdAt: string;
  type?: 'booking_confirmed' | 'provider_assigned' | 'service_reminder' | 'booking_completed' | 'booking_cancelled';
}

export interface FilterState {
  searchQuery: string;
  category: string; // 'All' or category name
  maxDistance: number | null; // e.g., 1, 3, 5, 10
  minPrice: number | null; // e.g., 100
  maxPrice: number | null; // e.g., 2000
  minRating: number | null; // e.g., 4.5, 4.0, 3.0, null
  availability: 'Available Now' | 'Available Today' | 'Available Tomorrow' | null;
  sortBy: 'relevance' | 'distance' | 'rating' | 'price_low_high' | 'price_high_low';
}
