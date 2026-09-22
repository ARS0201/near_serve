import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomButton } from '../components/common/CustomButton';
import { CustomInput } from '../components/common/CustomInput';
import { Header } from '../components/common/Header';
import { COLORS, FONT_SIZES, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { RootStackParamList } from '../navigation/types';

type BookingScreenRouteProp = RouteProp<RootStackParamList, 'Booking'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Generate next 7 days for the date selector
const generateDateOptions = () => {
  const dates = [];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);

    const isToday = i === 0;
    const isTomorrow = i === 1;

    dates.push({
      dateString: d.toISOString().slice(0, 10),
      dayName: isToday ? 'Today' : isTomorrow ? 'Tomorrow' : days[d.getDay()],
      dayNumber: d.getDate(),
      month: months[d.getMonth()],
    });
  }
  return dates;
};

const DEFAULT_TIME_SLOTS = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '02:00 PM',
  '04:00 PM',
  '06:00 PM',
];

export const BookingScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<BookingScreenRouteProp>();
  const { user } = useAuth();
  const { providers, createBooking } = useBooking();

  const provider =
    providers.find((p) => p.id === route.params?.providerId) || providers[0];

  const service =
    provider.servicesOffered.find((s) => s.id === route.params?.serviceId) ||
    provider.servicesOffered[0] || {
      id: 'srv_std',
      name: provider.serviceName,
      price: provider.startingPrice,
      durationMins: 60,
      description: 'Standard Service',
    };

  const dateOptions = generateDateOptions();

  // Booking Form State
  const [selectedDate, setSelectedDate] = useState<string>(dateOptions[0].dateString);
  const [selectedTime, setSelectedTime] = useState<string>(
    provider.availableTimeSlots[0] || DEFAULT_TIME_SLOTS[0]
  );
  const [address, setAddress] = useState('Plot 12, Green Park Avenue');
  const [area, setArea] = useState('Gandhipuram');
  const [city, setCity] = useState('Coimbatore');
  const [pincode, setPincode] = useState('641012');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState<{
    address?: string;
    area?: string;
    city?: string;
    pincode?: string;
  }>({});

  const serviceCharge = service.price;
  const additionalCharges = 0;
  const totalPrice = serviceCharge + additionalCharges;

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!address.trim()) newErrors.address = 'Street address is required';
    if (!area.trim()) newErrors.area = 'Area / Neighborhood is required';
    if (!city.trim()) newErrors.city = 'City is required';
    if (!pincode.trim() || pincode.trim().length < 6)
      newErrors.pincode = 'Valid 6-digit Pincode is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirmBooking = async () => {
    if (!validate()) {
      Alert.alert('Incomplete Address', 'Please fill in all required location fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newBooking = await createBooking({
        userId: user?.id || 'user_1',
        providerId: provider.id,
        providerName: provider.name,
        providerImage: provider.imageUrl,
        providerPhone: provider.phone,
        serviceId: service.id,
        serviceName: service.name,
        date: selectedDate,
        time: selectedTime,
        location: {
          address: address.trim(),
          area: area.trim(),
          city: city.trim(),
          pincode: pincode.trim(),
        },
        notes: notes.trim(),
        serviceCharge,
        additionalCharges,
        totalPrice,
      });

      navigation.navigate('BookingConfirmation', {
        bookingId: newBooking.id,
        serviceName: service.name,
        providerName: provider.name,
      });
    } catch (err: any) {
      Alert.alert('Booking Error', err?.message || 'Failed to place booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Book Service"
        showBack
        onBack={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Selected Service Summary Card */}
          <View style={styles.summaryCard}>
            <View style={styles.serviceIconPill}>
              <Ionicons name="construct" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.summaryDetails}>
              <Text style={styles.summaryService}>{service.name}</Text>
              <Text style={styles.summaryProvider}>by {provider.name}</Text>
            </View>
            <Text style={styles.summaryPrice}>₹{service.price}</Text>
          </View>

          {/* 1. Date Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Date</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dateScroll}
            >
              {dateOptions.map((item) => {
                const isSelected = selectedDate === item.dateString;
                return (
                  <TouchableOpacity
                    key={item.dateString}
                    style={[styles.dateCard, isSelected && styles.selectedDateCard]}
                    onPress={() => setSelectedDate(item.dateString)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[styles.dateDayName, isSelected && styles.selectedDateText]}
                    >
                      {item.dayName}
                    </Text>
                    <Text
                      style={[
                        styles.dateDayNumber,
                        isSelected && styles.selectedDateText,
                      ]}
                    >
                      {item.dayNumber}
                    </Text>
                    <Text
                      style={[styles.dateMonth, isSelected && styles.selectedDateText]}
                    >
                      {item.month}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* 2. Time Slot Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Time Slot</Text>
            <View style={styles.timeGrid}>
              {(provider.availableTimeSlots.length > 0
                ? provider.availableTimeSlots
                : DEFAULT_TIME_SLOTS
              ).map((slot) => {
                const isSelected = selectedTime === slot;
                return (
                  <TouchableOpacity
                    key={slot}
                    style={[styles.timeSlotPill, isSelected && styles.selectedTimeSlot]}
                    onPress={() => setSelectedTime(slot)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="time-outline"
                      size={15}
                      color={isSelected ? COLORS.white : COLORS.textSecondary}
                    />
                    <Text
                      style={[
                        styles.timeSlotText,
                        isSelected && styles.selectedTimeSlotText,
                      ]}
                    >
                      {slot}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* 3. Service Location Inputs */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Service Location</Text>
            <View style={styles.formCard}>
              <CustomInput
                label="Address (Door / Flat / Street) *"
                placeholder="e.g. Plot 12, Green Park Avenue"
                leftIcon="home-outline"
                value={address}
                onChangeText={(t) => {
                  setAddress(t);
                  if (errors.address) setErrors({ ...errors, address: undefined });
                }}
                error={errors.address}
              />

              <View style={styles.rowInputs}>
                <View style={styles.flex1}>
                  <CustomInput
                    label="Area / Locality *"
                    placeholder="e.g. Gandhipuram"
                    leftIcon="map-outline"
                    value={area}
                    onChangeText={(t) => {
                      setArea(t);
                      if (errors.area) setErrors({ ...errors, area: undefined });
                    }}
                    error={errors.area}
                  />
                </View>

                <View style={styles.flex1}>
                  <CustomInput
                    label="City *"
                    placeholder="Coimbatore"
                    leftIcon="business-outline"
                    value={city}
                    onChangeText={(t) => {
                      setCity(t);
                      if (errors.city) setErrors({ ...errors, city: undefined });
                    }}
                    error={errors.city}
                  />
                </View>
              </View>

              <CustomInput
                label="Pincode *"
                placeholder="e.g. 641012"
                leftIcon="pin-outline"
                keyboardType="numeric"
                maxLength={6}
                value={pincode}
                onChangeText={(t) => {
                  setPincode(t);
                  if (errors.pincode) setErrors({ ...errors, pincode: undefined });
                }}
                error={errors.pincode}
              />
            </View>
          </View>

          {/* 4. Additional Instructions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Instructions</Text>
            <View style={styles.notesCard}>
              <TextInput
                style={styles.notesInput}
                placeholder="Add instructions for the service provider (e.g. landmark, exact issue details)..."
                placeholderTextColor={COLORS.textMuted}
                multiline
                numberOfLines={3}
                value={notes}
                onChangeText={setNotes}
              />
            </View>
          </View>

          {/* 5. Price Summary Breakdown */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Price Summary</Text>
            <View style={styles.priceSummaryCard}>
              <View style={styles.priceSummaryRow}>
                <Text style={styles.priceSummaryLabel}>Service Charge</Text>
                <Text style={styles.priceSummaryValue}>₹{serviceCharge}</Text>
              </View>

              <View style={styles.priceSummaryRow}>
                <Text style={styles.priceSummaryLabel}>Additional Charges</Text>
                <Text style={styles.priceSummaryValue}>₹{additionalCharges}</Text>
              </View>

              <View style={styles.priceDivider} />

              <View style={styles.totalPriceRow}>
                <Text style={styles.totalPriceLabel}>Total Amount</Text>
                <Text style={styles.totalPriceValue}>₹{totalPrice}</Text>
              </View>
            </View>
          </View>

          {/* Confirm Booking CTA */}
          <CustomButton
            title="Confirm Booking"
            loading={isSubmitting}
            onPress={handleConfirmBooking}
            icon={<Ionicons name="checkmark-circle-outline" size={20} color={COLORS.white} />}
            style={styles.confirmBtn}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xxxl,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.subtle,
  },
  serviceIconPill: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  summaryDetails: {
    flex: 1,
  },
  summaryService: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  summaryProvider: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  summaryPrice: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '800',
    color: COLORS.primary,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.sm + 2,
  },
  dateScroll: {
    gap: SPACING.sm,
    paddingVertical: 2,
  },
  dateCard: {
    width: 72,
    height: 90,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    ...SHADOWS.subtle,
  },
  selectedDateCard: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    ...SHADOWS.button,
  },
  dateDayName: {
    fontSize: FONT_SIZES.xs - 1,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  dateDayNumber: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 1,
  },
  dateMonth: {
    fontSize: FONT_SIZES.xs - 2,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  selectedDateText: {
    color: COLORS.white,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  timeSlotPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md + 2,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.md,
    gap: 6,
  },
  selectedTimeSlot: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  timeSlotText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  selectedTimeSlotText: {
    color: COLORS.white,
    fontWeight: '700',
  },
  formCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  flex1: {
    flex: 1,
  },
  notesCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    minHeight: 85,
  },
  notesInput: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    textAlignVertical: 'top',
  },
  priceSummaryCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  priceSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  priceSummaryLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  priceSummaryValue: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  priceDivider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: SPACING.sm,
  },
  totalPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 2,
  },
  totalPriceLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '800',
    color: COLORS.text,
  },
  totalPriceValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '800',
    color: COLORS.primary,
  },
  confirmBtn: {
    marginTop: SPACING.sm,
  },
});
