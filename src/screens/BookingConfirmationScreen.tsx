import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomButton } from '../components/common/CustomButton';
import { StatusBadge } from '../components/common/StatusBadge';
import { COLORS, FONT_SIZES, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { useBooking } from '../context/BookingContext';
import { RootStackParamList } from '../navigation/types';

type ConfirmationScreenRouteProp = RouteProp<RootStackParamList, 'BookingConfirmation'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const BookingConfirmationScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ConfirmationScreenRouteProp>();
  const { bookings } = useBooking();

  const booking =
    bookings.find((b) => b.id === route.params?.bookingId) || bookings[0];

  const handleViewBooking = () => {
    if (booking) {
      navigation.navigate('BookingDetails', { bookingId: booking.id });
    } else {
      navigation.navigate('MyBookings');
    }
  };

  const handleBackToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Celebration Banner */}
        <View style={styles.celebrationWrapper}>
          <View style={styles.successOuterRing}>
            <View style={styles.successInnerCircle}>
              <Ionicons name="checkmark" size={42} color={COLORS.white} />
            </View>
          </View>
          <Text style={styles.heading}>Booking Confirmed! ✓</Text>
          <Text style={styles.subheading}>
            Your service request has been sent to the provider
          </Text>
        </View>

        {/* Booking Details Summary Card */}
        {booking && (
          <View style={styles.card}>
            {/* Booking Code Header */}
            <View style={styles.codeRow}>
              <View>
                <Text style={styles.codeLabel}>Booking ID</Text>
                <Text style={styles.codeValue}>#{booking.bookingCode}</Text>
              </View>
              <StatusBadge status={booking.status} />
            </View>

            <View style={styles.divider} />

            {/* Service & Provider */}
            <View style={styles.infoRow}>
              <Ionicons name="construct-outline" size={18} color={COLORS.primary} />
              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>Service & Provider</Text>
                <Text style={styles.infoTitle}>{booking.serviceName}</Text>
                <Text style={styles.infoSub}>{booking.providerName}</Text>
              </View>
            </View>

            {/* Date & Time */}
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={18} color={COLORS.primary} />
              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>Scheduled Date & Time</Text>
                <Text style={styles.infoTitle}>
                  {booking.date} at {booking.time}
                </Text>
              </View>
            </View>

            {/* Location */}
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={18} color={COLORS.primary} />
              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>Service Location</Text>
                <Text style={styles.infoTitle}>
                  {booking.location.address}, {booking.location.area}
                </Text>
                <Text style={styles.infoSub}>
                  {booking.location.city} - {booking.location.pincode}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Total Price */}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Estimated Price</Text>
              <Text style={styles.totalPrice}>₹{booking.totalPrice}</Text>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <CustomButton
            title="View Booking"
            onPress={handleViewBooking}
            icon={<Ionicons name="receipt-outline" size={18} color={COLORS.white} />}
            style={styles.actionBtn}
          />

          <CustomButton
            title="Back to Home"
            variant="outline"
            onPress={handleBackToHome}
            icon={<Ionicons name="home-outline" size={18} color={COLORS.primary} />}
            style={styles.actionBtn}
          />
        </View>
      </ScrollView>
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
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxl,
    alignItems: 'center',
  },
  celebrationWrapper: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  successOuterRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.successLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.card,
  },
  successInnerCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subheading: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xl,
    ...SHADOWS.card,
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  codeLabel: {
    fontSize: FONT_SIZES.xs - 1,
    color: COLORS.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  codeValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: FONT_SIZES.xs - 1,
    color: COLORS.textMuted,
    fontWeight: '500',
    marginBottom: 2,
  },
  infoTitle: {
    fontSize: FONT_SIZES.sm + 1,
    fontWeight: '700',
    color: COLORS.text,
  },
  infoSub: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 2,
  },
  totalLabel: {
    fontSize: FONT_SIZES.sm + 1,
    fontWeight: '700',
    color: COLORS.text,
  },
  totalPrice: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '800',
    color: COLORS.primary,
  },
  actionsContainer: {
    width: '100%',
    gap: SPACING.md,
  },
  actionBtn: {
    width: '100%',
  },
});
