import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '../components/common/EmptyState';
import { StatusBadge } from '../components/common/StatusBadge';
import { COLORS, FONT_SIZES, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { useBooking } from '../context/BookingContext';
import { RootStackParamList } from '../navigation/types';
import type { Booking } from '../types/index';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type TabType = 'upcoming' | 'completed' | 'cancelled';

export const MyBookingsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { bookings } = useBooking();

  const [activeTab, setActiveTab] = useState<TabType>('upcoming');

  const getFilteredBookings = () => {
    switch (activeTab) {
      case 'completed':
        return bookings.filter((b) => b.status === 'Completed');
      case 'cancelled':
        return bookings.filter((b) => b.status === 'Cancelled');
      case 'upcoming':
      default:
        return bookings.filter(
          (b) =>
            b.status === 'Pending' ||
            b.status === 'Confirmed' ||
            b.status === 'In Progress'
        );
    }
  };

  const currentList = getFilteredBookings();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
        <Text style={styles.subtitle}>Track and manage your service requests</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {(['upcoming', 'completed', 'cancelled'] as TabType[]).map((tab) => {
          const isSelected = activeTab === tab;
          const count =
            tab === 'upcoming'
              ? bookings.filter(
                  (b) =>
                    b.status === 'Pending' ||
                    b.status === 'Confirmed' ||
                    b.status === 'In Progress'
                ).length
              : tab === 'completed'
              ? bookings.filter((b) => b.status === 'Completed').length
              : bookings.filter((b) => b.status === 'Cancelled').length;

          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, isSelected && styles.selectedTabButton]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.tabButtonText, isSelected && styles.selectedTabText]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
              {count > 0 && (
                <View
                  style={[
                    styles.tabCountBadge,
                    isSelected && styles.selectedTabCountBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.tabCountText,
                      isSelected && styles.selectedTabCountText,
                    ]}
                  >
                    {count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Bookings List */}
      <FlatList
        data={currentList}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }: { item: Booking }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate('BookingDetails', { bookingId: item.id })
            }
            activeOpacity={0.85}
          >
            {/* Top row: Code & Status */}
            <View style={styles.cardHeader}>
              <View style={styles.codeWrapper}>
                <Text style={styles.codeText}>#{item.bookingCode}</Text>
              </View>
              <StatusBadge status={item.status} />
            </View>

            {/* Provider image + service info */}
            <View style={styles.cardBody}>
              <Image source={{ uri: item.providerImage }} style={styles.providerThumb} />
              <View style={styles.cardInfoCol}>
                <Text style={styles.serviceTitle} numberOfLines={1}>
                  {item.serviceName}
                </Text>
                <Text style={styles.providerName} numberOfLines={1}>
                  {item.providerName}
                </Text>

                <View style={styles.dateTimeRow}>
                  <Ionicons name="calendar-outline" size={13} color={COLORS.textSecondary} />
                  <Text style={styles.dateTimeText}>
                    {item.date} • {item.time}
                  </Text>
                </View>
              </View>
            </View>

            {/* Bottom Row: Price & Details Button */}
            <View style={styles.cardFooter}>
              <View style={styles.priceCol}>
                <Text style={styles.priceLabel}>Total Price</Text>
                <Text style={styles.priceValue}>₹{item.totalPrice}</Text>
              </View>

              <TouchableOpacity
                style={styles.detailsBtn}
                onPress={() =>
                  navigation.navigate('BookingDetails', { bookingId: item.id })
                }
                activeOpacity={0.7}
              >
                <Text style={styles.detailsBtnText}>View Details</Text>
                <Ionicons name="chevron-forward" size={14} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <EmptyState
            icon="calendar-outline"
            title={`No ${activeTab} bookings`}
            subtitle={
              activeTab === 'upcoming'
                ? "You don't have any scheduled service bookings right now."
                : activeTab === 'completed'
                ? "You haven't completed any service bookings yet."
                : 'No cancelled bookings in your history.'
            }
            actionText="Discover Services"
            onAction={() => navigation.navigate('Discover')}
          />
        }
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
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm + 2,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
  },
  selectedTabButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    ...SHADOWS.subtle,
  },
  tabButtonText: {
    fontSize: FONT_SIZES.xs + 1,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  selectedTabText: {
    color: COLORS.white,
    fontWeight: '700',
  },
  tabCountBadge: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: RADIUS.full,
  },
  selectedTabCountBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  tabCountText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  selectedTabCountText: {
    color: COLORS.white,
  },
  listContent: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xxxl,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  codeWrapper: {
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
  },
  codeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  cardBody: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  providerThumb: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.borderLight,
  },
  cardInfoCol: {
    flex: 1,
    justifyContent: 'center',
  },
  serviceTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  providerName: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  dateTimeText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  priceCol: {},
  priceLabel: {
    fontSize: FONT_SIZES.xs - 2,
    color: COLORS.textMuted,
  },
  priceValue: {
    fontSize: FONT_SIZES.md + 1,
    fontWeight: '800',
    color: COLORS.primary,
  },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 4,
  },
  detailsBtnText: {
    fontSize: FONT_SIZES.xs + 1,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
