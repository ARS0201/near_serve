import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '../components/common/EmptyState';
import { FilterModal } from '../components/common/FilterModal';
import { ProviderCard } from '../components/common/ProviderCard';
import { COLORS, FONT_SIZES, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { useBooking } from '../context/BookingContext';
import { RootStackParamList } from '../navigation/types';
import type { Provider } from '../types/index';

type DiscoverScreenRouteProp = RouteProp<RootStackParamList, 'Discover'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const DiscoverScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<DiscoverScreenRouteProp>();
  const { filters, setFilters, resetFilters, getFilteredProviders } = useBooking();

  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const filteredProviders = getFilteredProviders();

  // Active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.category && filters.category !== 'All') count++;
    if (filters.maxDistance !== null) count++;
    if (filters.minPrice !== null || filters.maxPrice !== null) count++;
    if (filters.minRating !== null) count++;
    if (filters.availability !== null) count++;
    if (filters.sortBy !== 'relevance') count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  const handleClearSingleFilter = (key: keyof typeof filters) => {
    if (key === 'category') setFilters((prev) => ({ ...prev, category: 'All' }));
    else if (key === 'maxDistance') setFilters((prev) => ({ ...prev, maxDistance: null }));
    else if (key === 'minPrice' || key === 'maxPrice')
      setFilters((prev) => ({ ...prev, minPrice: null, maxPrice: null }));
    else if (key === 'minRating') setFilters((prev) => ({ ...prev, minRating: null }));
    else if (key === 'availability') setFilters((prev) => ({ ...prev, availability: null }));
    else if (key === 'sortBy') setFilters((prev) => ({ ...prev, sortBy: 'relevance' }));
  };

  const renderActiveFilterBadges = () => {
    if (activeFilterCount === 0) return null;

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.activeFiltersContainer}
      >
        {filters.category !== 'All' && (
          <View style={styles.activeFilterBadge}>
            <Text style={styles.activeFilterText}>{filters.category}</Text>
            <TouchableOpacity onPress={() => handleClearSingleFilter('category')}>
              <Ionicons name="close" size={14} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        )}

        {filters.maxDistance !== null && (
          <View style={styles.activeFilterBadge}>
            <Text style={styles.activeFilterText}>≤ {filters.maxDistance} km</Text>
            <TouchableOpacity onPress={() => handleClearSingleFilter('maxDistance')}>
              <Ionicons name="close" size={14} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        )}

        {(filters.minPrice !== null || filters.maxPrice !== null) && (
          <View style={styles.activeFilterBadge}>
            <Text style={styles.activeFilterText}>
              ₹{filters.minPrice || 0} - ₹{filters.maxPrice || '2000+'}
            </Text>
            <TouchableOpacity onPress={() => handleClearSingleFilter('minPrice')}>
              <Ionicons name="close" size={14} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        )}

        {filters.minRating !== null && (
          <View style={styles.activeFilterBadge}>
            <Text style={styles.activeFilterText}>★ {filters.minRating}+</Text>
            <TouchableOpacity onPress={() => handleClearSingleFilter('minRating')}>
              <Ionicons name="close" size={14} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        )}

        {filters.availability !== null && (
          <View style={styles.activeFilterBadge}>
            <Text style={styles.activeFilterText}>{filters.availability}</Text>
            <TouchableOpacity onPress={() => handleClearSingleFilter('availability')}>
              <Ionicons name="close" size={14} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        )}

        {filters.sortBy !== 'relevance' && (
          <View style={styles.activeFilterBadge}>
            <Text style={styles.activeFilterText}>
              Sort: {filters.sortBy.replace(/_/g, ' ')}
            </Text>
            <TouchableOpacity onPress={() => handleClearSingleFilter('sortBy')}>
              <Ionicons name="close" size={14} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity onPress={resetFilters} style={styles.resetAllBtn}>
          <Text style={styles.resetAllText}>Reset All</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Discover Local Services</Text>
          <Text style={styles.subtitle}>
            Explore and filter verified service professionals
          </Text>
        </View>
      </View>

      {/* Search & Filter Row */}
      <View style={styles.searchFilterRow}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for services or providers..."
            placeholderTextColor={COLORS.textMuted}
            value={filters.searchQuery}
            onChangeText={(text) =>
              setFilters((prev) => ({ ...prev, searchQuery: text }))
            }
          />
          {filters.searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
              style={styles.clearSearchBtn}
            >
              <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Trigger Button */}
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilterCount > 0 && styles.activeFilterButton,
          ]}
          onPress={() => setFilterModalVisible(true)}
          activeOpacity={0.8}
        >
          <Ionicons
            name="options-outline"
            size={20}
            color={activeFilterCount > 0 ? COLORS.white : COLORS.text}
          />
          {activeFilterCount > 0 && (
            <View style={styles.filterBadgeCount}>
              <Text style={styles.filterBadgeCountText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Active Filter Chips */}
      {renderActiveFilterBadges()}

      {/* Provider List */}
      <FlatList
        data={filteredProviders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }: { item: Provider }) => (
          <ProviderCard
            provider={item}
            onPress={() =>
              navigation.navigate('ServiceDetails', { providerId: item.id })
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="search-outline"
            title="No services found"
            subtitle="Try changing your filters or search terms to find matching service providers."
            actionText="Clear All Filters"
            onAction={resetFilters}
          />
        }
      />

      {/* Filter Bottom Sheet Modal */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.xl + 1,
    fontWeight: '800',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  searchFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm + 2,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.subtle,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    marginLeft: SPACING.xs + 2,
    height: '100%',
  },
  clearSearchBtn: {
    padding: 4,
  },
  filterButton: {
    width: 50,
    height: 50,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...SHADOWS.subtle,
  },
  activeFilterButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterBadgeCount: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.danger,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  filterBadgeCountText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '800',
  },
  activeFiltersContainer: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xs,
    gap: SPACING.xs + 2,
    marginBottom: SPACING.xs,
  },
  activeFilterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  activeFilterText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
  },
  resetAllBtn: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    justifyContent: 'center',
  },
  resetAllText: {
    color: COLORS.danger,
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xxxl,
  },
});
