import { MOCK_USERS } from '../data/mockData';
import type { User } from '../types/index';

let currentUser: User | null = null;
const registeredUsers: User[] = [...MOCK_USERS];

export const authService = {
  getCurrentUser: (): User | null => {
    return currentUser;
  },

  login: async (emailOrPhone: string, password: string):Promise<User> => {
    // Simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    const cleanInput = emailOrPhone.trim().toLowerCase();
    
    const digitsOnly = cleanInput.replace(/\D/g, '');
    const isEmail = cleanInput.includes('@');

    const matchedUser = registeredUsers.find((u) => {
      if (isEmail) {
        return u.email.toLowerCase() === cleanInput;
      }
      if (digitsOnly.length >= 6) {
        const userPhoneDigits = u.phone.replace(/\D/g, '');
        return userPhoneDigits.includes(digitsOnly) || digitsOnly.includes(userPhoneDigits);
      }
      return u.email.toLowerCase() === cleanInput;
    });

    if (!matchedUser) {
      // Allow any demo sign in if credentials are provided for convenient evaluation
      if (cleanInput.includes('@') && password.length >= 6) {
        const tempUser: User = {
          id: 'user_' + Date.now(),
          name: cleanInput.split('@')[0].replace('.', ' ').toUpperCase(),
          email: cleanInput,
          phone: '+1 555 019 2831',
          location: 'Downtown Center',
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&q=80',
          createdAt: new Date().toISOString(),
        };
        registeredUsers.push(tempUser);
        currentUser = tempUser;
        return tempUser;
      }
      throw new Error('User not found. Please check your email or phone, or create a new account.');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    currentUser = matchedUser;
    return matchedUser;
  },

  signup: async (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    location: string;
  }): Promise<User> => {
    // Simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 900));

    const cleanEmail = userData.email.trim().toLowerCase();

    // Check if user already exists
    const existing = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      throw new Error('An account with this email already exists. Please login.');
    }

    const newUser: User = {
      id: 'user_' + Date.now(),
      name: userData.name.trim(),
      email: cleanEmail,
      phone: userData.phone.trim(),
      location: userData.location.trim() || 'Downtown City',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80',
      createdAt: new Date().toISOString(),
    };

    registeredUsers.push(newUser);
    currentUser = newUser;
    return newUser;
  },

  logout: async (): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    currentUser = null;
  },

  updateProfile: async (updatedFields: Partial<User>): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (!currentUser) throw new Error('No user is currently logged in.');
    currentUser = { ...currentUser, ...updatedFields };
    return currentUser;
  },
};
