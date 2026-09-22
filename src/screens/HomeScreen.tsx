import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CategoryCard } from '../components/common/CategoryCard';
import { LocationModal } from '../components/common/LocationModal';
import { ProviderCard } from '../components/common/ProviderCard';
import { COLORS, FONT_SIZES, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();
  const { categories, providers, currentLocation, notifications, setFilters } = useBooking();

  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleCategoryPress = (categoryName: string, catId: string) => {
    setSelectedCatId(catId);
    setFilters((prev) => ({ ...prev, category: categoryName, searchQuery: '' }));
    navigation.navigate('Discover', { categoryId: catId });
  };

  const handleSearchPress = () => {
    navigation.navigate('Discover');
  };

  const handleSeeAll = () => {
    setFilters((prev) => ({ ...prev, category: 'All', searchQuery: '' }));
    navigation.navigate('Discover');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Header */}
        <View style={styles.topHeader}>
          {/* User Info & Location */}
          <View style={styles.userLocationCol}>
            <Text style={styles.greetingText}>
              Hello, {user?.name?.split(' ')[0] || 'User'}! 👋
            </Text>

            <TouchableOpacity
              style={styles.locationPill}
              onPress={() => setLocationModalVisible(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="location" size={15} color={COLORS.primary} />
              <Text style={styles.locationText}>{currentLocation}</Text>
              <Ionicons name="chevron-down" size={13} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Action Icons */}
          <View style={styles.headerActions}>
            {/* Notifications Button */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('Notifications')}
              activeOpacity={0.7}
            >
              <Ionicons name="notifications-outline" size={22} color={COLORS.text} />
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Profile Avatar Button */}
            <TouchableOpacity
              style={styles.avatarButton}
              onPress={() => navigation.navigate('Profile')}
              activeOpacity={0.7}
            >
              {user?.avatarUrl ? (
                <Image source={{ uri: user.avatarUrl }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person" size={18} color={COLORS.white} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Large Search Bar */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={handleSearchPress}
          activeOpacity={0.9}
        >
          <Ionicons name="search-outline" size={22} color={COLORS.primary} />
          <TextInput
            style={styles.searchInput}
            placeholder="What service do you need?"
            placeholderTextColor={COLORS.textMuted}
            editable={false}
            pointerEvents="none"
          />
          <View style={styles.searchFilterBadge}>
            <Ionicons name="options-outline" size={18} color={COLORS.primary} />
          </View>
        </TouchableOpacity>

        {/* Promo Hero Banner */}
        <View style={styles.promoBanner}>
          <View style={styles.promoContent}>
            <View style={styles.promoTag}>
              <Text style={styles.promoTagText}>NEARSERVE ASSURED</Text>
            </View>
            <Text style={styles.promoHeading}>
              Up to 30% OFF on First Booking
            </Text>
            <Text style={styles.promoSub}>
              Trusted local experts at your doorstep
            </Text>
          </View>
          <View style={styles.promoIconCircle}>
            <Ionicons name="sparkles" size={32} color={COLORS.white} />
          </View>
        </View>

        {/* Service Categories Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Service Categories</Text>
          <TouchableOpacity onPress={handleSeeAll} activeOpacity={0.7}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {/* Horizontal Category Carousel */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              isSelected={selectedCatId === cat.id}
              onPress={() => handleCategoryPress(cat.name, cat.id)}
            />
          ))}
        </ScrollView>

        {/* Nearby Services Section */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Nearby Services</Text>
            <Text style={styles.sectionSubtitle}>
              Top-rated verified professionals near {currentLocation}
            </Text>
          </View>
          <TouchableOpacity onPress={handleSeeAll} activeOpacity={0.7}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {/* Nearby Provider Cards List */}
        <View style={styles.providersList}>
          {providers.slice(0, 4).map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              onPress={() =>
                navigation.navigate('ServiceDetails', { providerId: provider.id })
              }
            />
          ))}
        </View>
      </ScrollView>

      {/* Location Picker Modal */}
      <LocationModal
        visible={locationModalVisible}
        onClose={() => setLocationModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    marginBottom: SPACING.sm,
  },
  userLocationCol: {
    flex: 1,
  },
  greetingText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '800',
    color: COLORS.text,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
    alignSelf: 'flex-start',
  },
  locationText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm + 2,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    position: 'relative',
    ...SHADOWS.subtle,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: COLORS.danger,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
  },
  avatarButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...SHADOWS.subtle,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    height: 54,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
    ...SHADOWS.subtle,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    marginLeft: SPACING.sm + 2,
  },
  searchFilterBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoBanner: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
    ...SHADOWS.card,
  },
  promoContent: {
    flex: 1,
    marginRight: SPACING.md,
  },
  promoTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
    marginBottom: SPACING.xs,
  },
  promoTagText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  promoHeading: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md + 2,
    fontWeight: '800',
    lineHeight: 22,
  },
  promoSub: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: FONT_SIZES.xs,
    marginTop: 4,
  },
  promoIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: SPACING.md,
    marginTop: SPACING.xs,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '800',
    color: COLORS.text,
  },
  sectionSubtitle: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  seeAllText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    color: COLORS.primary,
    paddingBottom: 2,
  },
  categoriesScroll: {
    paddingBottom: SPACING.lg,
  },
  providersList: {
    marginTop: SPACING.xs,
  },
});
