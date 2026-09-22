import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { COLORS, FONT_SIZES, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { useBooking } from '../../context/BookingContext';
import type { FilterState } from '../../types/index';
import { CustomButton } from './CustomButton';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
}

const CATEGORY_OPTIONS = [
  'All',
  'Plumbing',
  'Electrical',
  'Cleaning',
  'AC Repair',
  'Appliance Repair',
  'Beauty & Salon',
  'Painting',
  'Vehicle Service',
  'Gardening',
  'Computer Repair',
];

const DISTANCE_OPTIONS = [
  { label: 'Within 1 km', value: 1 },
  { label: 'Within 3 km', value: 3 },
  { label: 'Within 5 km', value: 5 },
  { label: 'Within 10 km', value: 10 },
];

const RATING_OPTIONS = [
  { label: '4.5★ & above', value: 4.5 },
  { label: '4★ & above', value: 4.0 },
  { label: '3★ & above', value: 3.0 },
  { label: 'Any rating', value: null },
];

const AVAILABILITY_OPTIONS: ('Available Now' | 'Available Today' | 'Available Tomorrow')[] = [
  'Available Now',
  'Available Today',
  'Available Tomorrow',
];

const SORT_OPTIONS: { label: string; value: FilterState['sortBy'] }[] = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Distance (Nearest)', value: 'distance' },
  { label: 'Rating (High to Low)', value: 'rating' },
  { label: 'Price: Low to High', value: 'price_low_high' },
  { label: 'Price: High to Low', value: 'price_high_low' },
];

export const FilterModal: React.FC<FilterModalProps> = ({ visible, onClose }) => {
  const { filters, setFilters, resetFilters } = useBooking();

  // Local draft state
  const [draftCategory, setDraftCategory] = useState<string>(filters.category);
  const [draftDistance, setDraftDistance] = useState<number | null>(filters.maxDistance);
  const [draftMinPrice, setDraftMinPrice] = useState<string>(
    filters.minPrice !== null ? String(filters.minPrice) : ''
  );
  const [draftMaxPrice, setDraftMaxPrice] = useState<string>(
    filters.maxPrice !== null ? String(filters.maxPrice) : ''
  );
  const [draftRating, setDraftRating] = useState<number | null>(filters.minRating);
  const [draftAvailability, setDraftAvailability] = useState<FilterState['availability']>(
    filters.availability
  );
  const [draftSortBy, setDraftSortBy] = useState<FilterState['sortBy']>(filters.sortBy);

  // Sync draft when opened
  React.useEffect(() => {
    if (visible) {
      setDraftCategory(filters.category);
      setDraftDistance(filters.maxDistance);
      setDraftMinPrice(filters.minPrice !== null ? String(filters.minPrice) : '');
      setDraftMaxPrice(filters.maxPrice !== null ? String(filters.maxPrice) : '');
      setDraftRating(filters.minRating);
      setDraftAvailability(filters.availability);
      setDraftSortBy(filters.sortBy);
    }
  }, [visible, filters]);

  const handleClearAll = () => {
    setDraftCategory('All');
    setDraftDistance(null);
    setDraftMinPrice('');
    setDraftMaxPrice('');
    setDraftRating(null);
    setDraftAvailability(null);
    setDraftSortBy('relevance');
    resetFilters();
    onClose();
  };

  const handleApply = () => {
    const minP = draftMinPrice.trim() ? Number(draftMinPrice) : null;
    const maxP = draftMaxPrice.trim() ? Number(draftMaxPrice) : null;

    setFilters((prev) => ({
      ...prev,
      category: draftCategory,
      maxDistance: draftDistance,
      minPrice: !isNaN(minP as number) ? minP : null,
      maxPrice: !isNaN(maxP as number) ? maxP : null,
      minRating: draftRating,
      availability: draftAvailability,
      sortBy: draftSortBy,
    }));
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sheetContainer}>
              {/* Sheet Drag Indicator */}
              <View style={styles.dragIndicator} />

              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerTitleCol}>
                  <Text style={styles.headerTitle}>Filter & Sort Services</Text>
                  <Text style={styles.headerSubtitle}>Customize your service search</Text>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <Ionicons name="close" size={22} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* 1. Sort By Section */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Sort By</Text>
                  <View style={styles.chipsWrap}>
                    {SORT_OPTIONS.map((item) => {
                      const isSelected = draftSortBy === item.value;
                      return (
                        <TouchableOpacity
                          key={item.value}
                          style={[styles.chip, isSelected && styles.selectedChip]}
                          onPress={() => setDraftSortBy(item.value)}
                          activeOpacity={0.7}
                        >
                          <Ionicons
                            name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                            size={14}
                            color={isSelected ? COLORS.primary : COLORS.textMuted}
                          />
                          <Text style={[styles.chipText, isSelected && styles.selectedChipText]}>
                            {item.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* 2. Category Section */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Service Category</Text>
                  <View style={styles.chipsWrap}>
                    {CATEGORY_OPTIONS.map((cat) => {
                      const isSelected = draftCategory === cat;
                      return (
                        <TouchableOpacity
                          key={cat}
                          style={[styles.pill, isSelected && styles.selectedPill]}
                          onPress={() => setDraftCategory(cat)}
                          activeOpacity={0.7}
                        >
                          <Text style={[styles.pillText, isSelected && styles.selectedPillText]}>
                            {cat}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* 3. Distance Section */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Distance</Text>
                  <View style={styles.chipsWrap}>
                    {DISTANCE_OPTIONS.map((d) => {
                      const isSelected = draftDistance === d.value;
                      return (
                        <TouchableOpacity
                          key={d.value}
                          style={[styles.pill, isSelected && styles.selectedPill]}
                          onPress={() => setDraftDistance(isSelected ? null : d.value)}
                          activeOpacity={0.7}
                        >
                          <Ionicons
                            name="location-outline"
                            size={14}
                            color={isSelected ? COLORS.white : COLORS.textSecondary}
                          />
                          <Text style={[styles.pillText, isSelected && styles.selectedPillText]}>
                            {d.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* 4. Price Range (₹) */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Price Range (₹)</Text>
                  <View style={styles.priceRow}>
                    <View style={styles.priceInputWrapper}>
                      <Text style={styles.priceInputLabel}>Min Price (₹)</Text>
                      <TextInput
                        style={styles.priceInput}
                        placeholder="100"
                        placeholderTextColor={COLORS.textMuted}
                        keyboardType="numeric"
                        value={draftMinPrice}
                        onChangeText={setDraftMinPrice}
                      />
                    </View>
                    <Text style={styles.priceDash}>—</Text>
                    <View style={styles.priceInputWrapper}>
                      <Text style={styles.priceInputLabel}>Max Price (₹)</Text>
                      <TextInput
                        style={styles.priceInput}
                        placeholder="2000"
                        placeholderTextColor={COLORS.textMuted}
                        keyboardType="numeric"
                        value={draftMaxPrice}
                        onChangeText={setDraftMaxPrice}
                      />
                    </View>
                  </View>
                </View>

                {/* 5. Rating Section */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Rating</Text>
                  <View style={styles.chipsWrap}>
                    {RATING_OPTIONS.map((r) => {
                      const isSelected = draftRating === r.value;
                      return (
                        <TouchableOpacity
                          key={r.label}
                          style={[styles.pill, isSelected && styles.selectedPill]}
                          onPress={() => setDraftRating(r.value)}
                          activeOpacity={0.7}
                        >
                          <Ionicons
                            name="star"
                            size={13}
                            color={isSelected ? COLORS.white : COLORS.star}
                          />
                          <Text style={[styles.pillText, isSelected && styles.selectedPillText]}>
                            {r.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* 6. Availability */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Availability</Text>
                  <View style={styles.chipsWrap}>
                    {AVAILABILITY_OPTIONS.map((avail) => {
                      const isSelected = draftAvailability === avail;
                      return (
                        <TouchableOpacity
                          key={avail}
                          style={[styles.pill, isSelected && styles.selectedPill]}
                          onPress={() => setDraftAvailability(isSelected ? null : avail)}
                          activeOpacity={0.7}
                        >
                          <Ionicons
                            name="time-outline"
                            size={14}
                            color={isSelected ? COLORS.white : COLORS.textSecondary}
                          />
                          <Text style={[styles.pillText, isSelected && styles.selectedPillText]}>
                            {avail}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </ScrollView>

              {/* Action Buttons */}
              <View style={styles.footer}>
                <TouchableOpacity
                  style={styles.clearBtn}
                  onPress={handleClearAll}
                  activeOpacity={0.7}
                >
                  <Text style={styles.clearBtnText}>Clear All</Text>
                </TouchableOpacity>

                <CustomButton
                  title="Apply Filters"
                  onPress={handleApply}
                  style={styles.applyBtn}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    maxHeight: '88%',
    paddingTop: SPACING.md,
    ...SHADOWS.large,
  },
  dragIndicator: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.border,
    alignSelf: 'center',
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  headerTitleCol: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '800',
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    padding: SPACING.xs,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm + 2,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
  },
  selectedChip: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: FONT_SIZES.xs + 1,
    color: COLORS.text,
    fontWeight: '500',
  },
  selectedChipText: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md + 2,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 5,
  },
  selectedPill: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  pillText: {
    fontSize: FONT_SIZES.xs + 1,
    color: COLORS.text,
    fontWeight: '600',
  },
  selectedPillText: {
    color: COLORS.white,
    fontWeight: '700',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  priceInputWrapper: {
    flex: 1,
  },
  priceInputLabel: {
    fontSize: FONT_SIZES.xs - 1,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  priceInput: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 44,
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    fontWeight: '600',
  },
  priceDash: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textMuted,
    marginTop: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md + 4,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    gap: SPACING.md,
  },
  clearBtn: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearBtnText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  applyBtn: {
    flex: 1,
  },
});
