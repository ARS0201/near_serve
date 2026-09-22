import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomButton } from '../components/common/CustomButton';
import { Header } from '../components/common/Header';
import { RatingStars } from '../components/common/RatingStars';
import { StatusBadge } from '../components/common/StatusBadge';
import { COLORS, FONT_SIZES, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { useBooking } from '../context/BookingContext';
import { RootStackParamList } from '../navigation/types';

type BookingDetailsRouteProp = RouteProp<RootStackParamList, 'BookingDetails'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const TIMELINE_STAGES = [
  { key: 'placed', label: 'Booking Placed', icon: 'receipt-outline' },
  { key: 'confirmed', label: 'Confirmed', icon: 'checkmark-circle-outline' },
  { key: 'assigned', label: 'Provider Assigned', icon: 'person-outline' },
  { key: 'started', label: 'Service Started', icon: 'hammer-outline' },
  { key: 'completed', label: 'Completed', icon: 'shield-checkmark-outline' },
];

export const BookingDetailsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<BookingDetailsRouteProp>();
  const { bookings, cancelBooking, rateBooking } = useBooking();

  const booking =
    bookings.find((b) => b.id === route.params?.bookingId) || bookings[0];

  // Cancel Dialog & Rating Modal States
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [rateModalVisible, setRateModalVisible] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!booking) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header showBack onBack={() => navigation.goBack()} title="Booking Details" />
        <View style={styles.centerBox}>
          <Text style={styles.errorTitle}>Booking Not Found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isUpcoming =
    booking.status === 'Pending' ||
    booking.status === 'Confirmed' ||
    booking.status === 'In Progress';

  const isCompleted = booking.status === 'Completed';
  const isCancelled = booking.status === 'Cancelled';

  const getStageIndex = () => {
    if (isCancelled) return -1;
    switch (booking.status) {
      case 'Completed':
        return 4;
      case 'In Progress':
        return 3;
      case 'Confirmed':
        return 2;
      case 'Pending':
      default:
        return 0;
    }
  };

  const activeStageIndex = getStageIndex();

  const handleConfirmCancel = async () => {
    setIsProcessing(true);
    try {
      await cancelBooking(booking.id);
      setCancelModalVisible(false);
      Alert.alert(
        'Booking Cancelled',
        'Your service booking has been cancelled successfully.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmitRating = async () => {
    setIsProcessing(true);
    try {
      await rateBooking(booking.id, userRating, userComment.trim());
      setRateModalVisible(false);
      Alert.alert('Review Submitted! ⭐', 'Thank you for your valuable feedback.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCallProvider = () => {
    Alert.alert('Call Provider', `Connecting to ${booking.providerName}...`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        showBack
        onBack={() => navigation.goBack()}
        title={`Booking #${booking.bookingCode}`}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Card Banner */}
        <View style={styles.statusBannerCard}>
          <View style={styles.statusBannerRow}>
            <View>
              <Text style={styles.statusBannerLabel}>CURRENT STATUS</Text>
              <Text style={styles.statusBannerTitle}>{booking.status}</Text>
            </View>
            <StatusBadge status={booking.status} />
          </View>
          <Text style={styles.statusBannerSub}>
            Booked on {new Date(booking.createdAt).toLocaleDateString()}
          </Text>
        </View>

        {/* Visual Progress Timeline (Shown unless cancelled) */}
        {!isCancelled ? (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeading}>Booking Progress Timeline</Text>
            <View style={styles.timelineContainer}>
              {TIMELINE_STAGES.map((stage, index) => {
                const isReached = index <= activeStageIndex;
                const isCurrent = index === activeStageIndex;

                return (
                  <View key={stage.key} style={styles.timelineItem}>
                    {/* Left node & connector */}
                    <View style={styles.nodeColumn}>
                      <View
                        style={[
                          styles.timelineNode,
                          isReached && styles.reachedNode,
                          isCurrent && styles.currentNode,
                        ]}
                      >
                        <Ionicons
                          name={stage.icon as any}
                          size={14}
                          color={isReached ? COLORS.white : COLORS.textMuted}
                        />
                      </View>
                      {index < TIMELINE_STAGES.length - 1 && (
                        <View
                          style={[
                            styles.timelineLine,
                            index < activeStageIndex && styles.reachedLine,
                          ]}
                        />
                      )}
                    </View>

                    {/* Stage Label */}
                    <View style={styles.stageLabelCol}>
                      <Text
                        style={[
                          styles.stageLabel,
                          isReached && styles.reachedStageLabel,
                        ]}
                      >
                        {stage.label}
                      </Text>
                      {isCurrent && (
                        <Text style={styles.stageCurrentBadge}>In Progress</Text>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        ) : (
          <View style={styles.cancelledAlertCard}>
            <Ionicons name="close-circle" size={24} color={COLORS.danger} />
            <View style={styles.cancelledAlertTextCol}>
              <Text style={styles.cancelledAlertTitle}>This Booking is Cancelled</Text>
              <Text style={styles.cancelledAlertSub}>
                You can book this service again anytime from Discover.
              </Text>
            </View>
          </View>
        )}

        {/* Provider & Service Card */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Service & Provider Details</Text>
          <View style={styles.providerInfoRow}>
            <Image
              source={{ uri: booking.providerImage }}
              style={styles.providerAvatar}
            />
            <View style={styles.providerInfoCol}>
              <Text style={styles.serviceName}>{booking.serviceName}</Text>
              <Text style={styles.providerName}>{booking.providerName}</Text>
            </View>
            <TouchableOpacity
              style={styles.callCircleBtn}
              onPress={handleCallProvider}
              activeOpacity={0.7}
            >
              <Ionicons name="call" size={16} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Schedule & Location */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Schedule & Location</Text>

          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={18} color={COLORS.primary} />
            <View style={styles.detailCol}>
              <Text style={styles.detailLabel}>Date & Time</Text>
              <Text style={styles.detailValue}>
                {booking.date} at {booking.time}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={18} color={COLORS.primary} />
            <View style={styles.detailCol}>
              <Text style={styles.detailLabel}>Service Location</Text>
              <Text style={styles.detailValue}>
                {booking.location.address}, {booking.location.area}
              </Text>
              <Text style={styles.detailSub}>
                {booking.location.city} - {booking.location.pincode}
              </Text>
            </View>
          </View>

          {booking.notes ? (
            <View style={styles.detailRow}>
              <Ionicons name="document-text-outline" size={18} color={COLORS.primary} />
              <View style={styles.detailCol}>
                <Text style={styles.detailLabel}>Additional Instructions</Text>
                <Text style={styles.detailValue}>{booking.notes}</Text>
              </View>
            </View>
          ) : null}
        </View>

        {/* Payment & Price Breakdown */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Payment Summary</Text>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Service Charge</Text>
            <Text style={styles.billValue}>₹{booking.serviceCharge}</Text>
          </View>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Additional Charges</Text>
            <Text style={styles.billValue}>₹{booking.additionalCharges}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.billTotalRow}>
            <Text style={styles.billTotalLabel}>Total Amount</Text>
            <Text style={styles.billTotalValue}>₹{booking.totalPrice}</Text>
          </View>
        </View>

        {/* Existing Rating Card (if already rated) */}
        {booking.userRating ? (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeading}>Your Review</Text>
            <View style={styles.ratedCard}>
              <RatingStars rating={booking.userRating} size={18} />
              {booking.userReviewComment ? (
                <Text style={styles.ratedComment}>
                  "{booking.userReviewComment}"
                </Text>
              ) : null}
            </View>
          </View>
        ) : null}

        {/* Action Button: Cancel Booking or Rate Service */}
        {isUpcoming && (
          <CustomButton
            title="Cancel Booking"
            variant="danger"
            onPress={() => setCancelModalVisible(true)}
            icon={<Ionicons name="close-circle-outline" size={18} color={COLORS.white} />}
            style={styles.actionButton}
          />
        )}

        {isCompleted && !booking.userRating && (
          <CustomButton
            title="Rate Service"
            onPress={() => setRateModalVisible(true)}
            icon={<Ionicons name="star-outline" size={18} color={COLORS.white} />}
            style={styles.actionButton}
          />
        )}
      </ScrollView>

      {/* Cancel Confirmation Modal (Phase 9) */}
      <Modal
        visible={cancelModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCancelModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setCancelModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalCard}>
                <View style={styles.cancelModalIcon}>
                  <Ionicons name="alert" size={32} color={COLORS.danger} />
                </View>

                <Text style={styles.modalTitle}>Cancel Booking?</Text>
                <Text style={styles.modalMessage}>
                  Are you sure you want to cancel this booking? This action cannot be undone.
                </Text>

                <View style={styles.modalButtonsRow}>
                  <TouchableOpacity
                    style={styles.keepBookingBtn}
                    onPress={() => setCancelModalVisible(false)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.keepBookingText}>Keep Booking</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.confirmCancelBtn}
                    onPress={handleConfirmCancel}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.confirmCancelText}>
                      {isProcessing ? 'Cancelling...' : 'Cancel Booking'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Rate Service Modal */}
      <Modal
        visible={rateModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setRateModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setRateModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.rateModalCard}>
                <Text style={styles.rateModalTitle}>Rate Your Service</Text>
                <Text style={styles.rateModalSub}>
                  How was your experience with {booking.providerName}?
                </Text>

                <View style={styles.starPickerRow}>
                  <RatingStars
                    rating={userRating}
                    size={32}
                    interactive
                    onRatingChange={setUserRating}
                  />
                </View>

                <TextInput
                  style={styles.reviewInput}
                  placeholder="Share your experience (optional)..."
                  placeholderTextColor={COLORS.textMuted}
                  multiline
                  numberOfLines={3}
                  value={userComment}
                  onChangeText={setUserComment}
                />

                <CustomButton
                  title="Submit Rating"
                  loading={isProcessing}
                  onPress={handleSubmitRating}
                  style={styles.submitReviewBtn}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
    paddingBottom: SPACING.xxxl,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorTitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.danger,
  },
  statusBannerCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.subtle,
  },
  statusBannerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBannerLabel: {
    fontSize: FONT_SIZES.xs - 2,
    color: COLORS.textMuted,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statusBannerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 2,
  },
  statusBannerSub: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  sectionCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  sectionHeading: {
    fontSize: FONT_SIZES.md,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  timelineContainer: {
    paddingVertical: SPACING.xs,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  nodeColumn: {
    alignItems: 'center',
    width: 32,
  },
  timelineNode: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  reachedNode: {
    backgroundColor: COLORS.primary,
  },
  currentNode: {
    backgroundColor: COLORS.primary,
    borderWidth: 3,
    borderColor: COLORS.primaryLight,
  },
  timelineLine: {
    width: 2,
    height: 36,
    backgroundColor: COLORS.border,
    marginVertical: -2,
  },
  reachedLine: {
    backgroundColor: COLORS.primary,
  },
  stageLabelCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: SPACING.md,
    paddingTop: 3,
    minHeight: 46,
  },
  stageLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  reachedStageLabel: {
    color: COLORS.text,
    fontWeight: '700',
  },
  stageCurrentBadge: {
    fontSize: FONT_SIZES.xs - 2,
    fontWeight: '700',
    color: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  cancelledAlertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.dangerLight,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    gap: SPACING.md,
  },
  cancelledAlertTextCol: {
    flex: 1,
  },
  cancelledAlertTitle: {
    fontSize: FONT_SIZES.sm + 1,
    fontWeight: '700',
    color: COLORS.danger,
  },
  cancelledAlertSub: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  providerInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  providerAvatar: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.md,
  },
  providerInfoCol: {
    flex: 1,
  },
  serviceName: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  providerName: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  callCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.subtle,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  detailCol: {
    flex: 1,
  },
  detailLabel: {
    fontSize: FONT_SIZES.xs - 1,
    color: COLORS.textMuted,
    fontWeight: '500',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  detailSub: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  billLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  billValue: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: SPACING.sm,
  },
  billTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 2,
  },
  billTotalLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '800',
    color: COLORS.text,
  },
  billTotalValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '800',
    color: COLORS.primary,
  },
  ratedCard: {
    alignItems: 'flex-start',
    gap: SPACING.xs,
  },
  ratedComment: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginTop: 4,
  },
  actionButton: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  modalCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    ...SHADOWS.large,
  },
  cancelModalIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.dangerLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  modalTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  modalMessage: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.xl,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    width: '100%',
  },
  keepBookingBtn: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  keepBookingText: {
    color: COLORS.text,
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
  },
  confirmCancelBtn: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.danger,
    alignItems: 'center',
  },
  confirmCancelText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
  },
  rateModalCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    width: '100%',
    maxWidth: 360,
    ...SHADOWS.large,
  },
  rateModalTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '800',
    color: COLORS.text,
  },
  rateModalSub: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: SPACING.lg,
  },
  starPickerRow: {
    marginBottom: SPACING.lg,
  },
  reviewInput: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    width: '100%',
    minHeight: 80,
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    textAlignVertical: 'top',
    marginBottom: SPACING.lg,
  },
  submitReviewBtn: {
    width: '100%',
  },
});
