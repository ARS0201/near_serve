import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomButton } from '../components/common/CustomButton';
import { RatingStars } from '../components/common/RatingStars';
import { COLORS, FONT_SIZES, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { useBooking } from '../context/BookingContext';
import { RootStackParamList } from '../navigation/types';
import type { ServiceItem } from '../types/index';

type ServiceDetailsRouteProp = RouteProp<RootStackParamList, 'ServiceDetails'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ServiceDetailsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ServiceDetailsRouteProp>();
  const { providers, isFavorite, toggleFavorite } = useBooking();

  const provider =
    providers.find((p) => p.id === route.params?.providerId) || providers[0];

  const [selectedService, setSelectedService] = useState<ServiceItem>(
    provider.servicesOffered[0] || {
      id: 'srv_default',
      name: provider.serviceName,
      description: 'Standard Service Package',
      price: provider.startingPrice,
      durationMins: 60,
    }
  );

  const favorite = isFavorite(provider.id);

  const handleBookNow = () => {
    navigation.navigate('Booking', {
      providerId: provider.id,
      serviceId: selectedService.id,
    });
  };

  const handleContactCall = () => {
    Alert.alert(
      'Contact Provider',
      `Calling ${provider.name} at ${provider.phone}`,
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Image Container */}
        <View style={styles.heroWrapper}>
          <Image source={{ uri: provider.imageUrl }} style={styles.heroImage} />

          {/* Top Bar Floating Buttons */}
          <SafeAreaView style={styles.heroTopBar}>
            <TouchableOpacity
              style={styles.roundBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={22} color={COLORS.text} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.roundBtn}
              onPress={() => toggleFavorite(provider.id)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={favorite ? 'heart' : 'heart-outline'}
                size={22}
                color={favorite ? COLORS.danger : COLORS.text}
              />
            </TouchableOpacity>
          </SafeAreaView>

          {/* Availability Floating Badge */}
          <View style={styles.heroAvailBadge}>
            <View style={styles.greenDot} />
            <Text style={styles.heroAvailText}>{provider.availabilityStatus}</Text>
          </View>
        </View>

        {/* Main Content Sheet */}
        <View style={styles.detailsSheet}>
          {/* Category & Title */}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{provider.categoryName}</Text>
          </View>

          <Text style={styles.serviceTitle}>{provider.serviceName}</Text>
          <Text style={styles.providerName}>{provider.name}</Text>

          {/* Key Metrics Row */}
          <View style={styles.metricsRow}>
            {/* Rating */}
            <View style={styles.metricItem}>
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={14} color={COLORS.star} />
                <Text style={styles.ratingBadgeText}>{provider.rating.toFixed(1)}</Text>
              </View>
              <Text style={styles.metricSub}>{provider.reviewCount} Reviews</Text>
            </View>

            <View style={styles.metricDivider} />

            {/* Distance */}
            <View style={styles.metricItem}>
              <Ionicons name="location-outline" size={18} color={COLORS.primary} />
              <Text style={styles.metricMain}>{provider.distanceKm} km</Text>
              <Text style={styles.metricSub}>Distance</Text>
            </View>

            <View style={styles.metricDivider} />

            {/* Duration */}
            <View style={styles.metricItem}>
              <Ionicons name="time-outline" size={18} color={COLORS.primary} />
              <Text style={styles.metricMain}>{provider.durationText}</Text>
              <Text style={styles.metricSub}>Est. Duration</Text>
            </View>
          </View>

          {/* Description Section */}
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>About Service & Provider</Text>
            <Text style={styles.descriptionText}>{provider.bio}</Text>
          </View>

          {/* Services Offered Packages */}
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Services Offered</Text>
            <Text style={styles.sectionSubtext}>
              Select a package to book with this provider:
            </Text>

            <View style={styles.packagesList}>
              {provider.servicesOffered.map((service) => {
                const isSelected = selectedService.id === service.id;
                return (
                  <TouchableOpacity
                    key={service.id}
                    style={[styles.packageCard, isSelected && styles.selectedPackageCard]}
                    onPress={() => setSelectedService(service)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.packageHeader}>
                      <View style={styles.packageTitleRow}>
                        <Ionicons
                          name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                          size={20}
                          color={isSelected ? COLORS.primary : COLORS.textMuted}
                        />
                        <Text
                          style={[
                            styles.packageTitle,
                            isSelected && styles.selectedPackageTitle,
                          ]}
                        >
                          {service.name}
                        </Text>
                      </View>
                      <Text style={styles.packagePrice}>₹{service.price}</Text>
                    </View>

                    <Text style={styles.packageDesc}>{service.description}</Text>

                    <View style={styles.packageMeta}>
                      <Ionicons name="hourglass-outline" size={12} color={COLORS.textSecondary} />
                      <Text style={styles.packageDurationText}>
                        Duration: {service.durationMins} mins
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Service Area & Provider Info */}
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Service Location & Contact</Text>
            <View style={styles.contactCard}>
              <View style={styles.contactRow}>
                <Ionicons name="map-outline" size={18} color={COLORS.primary} />
                <View style={styles.contactTextCol}>
                  <Text style={styles.contactLabel}>Service Area</Text>
                  <Text style={styles.contactValue}>{provider.serviceArea}</Text>
                </View>
              </View>

              <View style={styles.contactRow}>
                <Ionicons name="call-outline" size={18} color={COLORS.primary} />
                <View style={styles.contactTextCol}>
                  <Text style={styles.contactLabel}>Phone Support</Text>
                  <Text style={styles.contactValue}>{provider.phone}</Text>
                </View>
                <TouchableOpacity
                  style={styles.callButton}
                  onPress={handleContactCall}
                  activeOpacity={0.7}
                >
                  <Ionicons name="call" size={14} color={COLORS.white} />
                  <Text style={styles.callButtonText}>Call</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Customer Reviews Section */}
          <View style={styles.section}>
            <View style={styles.reviewsHeader}>
              <Text style={styles.sectionHeading}>Customer Reviews</Text>
              <View style={styles.overallRatingBadge}>
                <Ionicons name="star" size={14} color={COLORS.star} />
                <Text style={styles.overallRatingText}>
                  {provider.rating.toFixed(1)} ({provider.reviewCount})
                </Text>
              </View>
            </View>

            <View style={styles.reviewsList}>
              {provider.reviews.map((rev) => (
                <View key={rev.id} style={styles.reviewCard}>
                  <View style={styles.reviewUserRow}>
                    <View style={styles.reviewAvatar}>
                      <Text style={styles.reviewAvatarText}>
                        {rev.userName.charAt(0)}
                      </Text>
                    </View>
                    <View style={styles.reviewUserMeta}>
                      <Text style={styles.reviewUserName}>{rev.userName}</Text>
                      <Text style={styles.reviewDate}>{rev.date}</Text>
                    </View>
                    <RatingStars rating={rev.rating} size={13} />
                  </View>
                  <Text style={styles.reviewComment}>{rev.comment}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Booking Bar */}
      <SafeAreaView edges={['bottom']} style={styles.bottomBar}>
        <View style={styles.bottomBarPriceCol}>
          <Text style={styles.bottomBarLabel}>Selected Package</Text>
          <Text style={styles.bottomBarPrice}>₹{selectedService.price}</Text>
        </View>
        <CustomButton
          title="Book Now"
          onPress={handleBookNow}
          icon={<Ionicons name="calendar-outline" size={18} color={COLORS.white} />}
          style={styles.bottomBarBtn}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  heroWrapper: {
    width: '100%',
    height: 280,
    position: 'relative',
    backgroundColor: COLORS.borderLight,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroTopBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  roundBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.card,
  },
  heroAvailBadge: {
    position: 'absolute',
    bottom: SPACING.md,
    left: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.78)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    gap: 6,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
  },
  heroAvailText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
  },
  detailsSheet: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    marginTop: -RADIUS.xl,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
  },
  categoryBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
    marginBottom: SPACING.xs,
  },
  categoryBadgeText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
  },
  serviceTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '800',
    color: COLORS.text,
  },
  providerName: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginTop: 2,
    marginBottom: SPACING.lg,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  metricItem: {
    alignItems: 'center',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingBadgeText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '800',
    color: COLORS.text,
  },
  metricMain: {
    fontSize: FONT_SIZES.md - 1,
    fontWeight: '700',
    color: COLORS.text,
  },
  metricSub: {
    fontSize: FONT_SIZES.xs - 2,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.border,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionHeading: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  sectionSubtext: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  descriptionText: {
    fontSize: FONT_SIZES.sm + 1,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  packagesList: {
    gap: SPACING.md,
  },
  packageCard: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  selectedPackageCard: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight + '35',
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  packageTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1,
  },
  packageTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  selectedPackageTitle: {
    color: COLORS.primary,
  },
  packagePrice: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '800',
    color: COLORS.primary,
  },
  packageDesc: {
    fontSize: FONT_SIZES.xs + 1,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginLeft: 28,
  },
  packageMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: SPACING.sm,
    marginLeft: 28,
  },
  packageDurationText: {
    fontSize: FONT_SIZES.xs - 1,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  contactCard: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.md,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  contactTextCol: {
    flex: 1,
  },
  contactLabel: {
    fontSize: FONT_SIZES.xs - 1,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  contactValue: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    fontWeight: '600',
    marginTop: 1,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.success,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.md,
    gap: 4,
  },
  callButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  overallRatingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  overallRatingText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    color: COLORS.text,
  },
  reviewsList: {
    gap: SPACING.md,
  },
  reviewCard: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  reviewUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs + 2,
  },
  reviewAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  reviewAvatarText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: FONT_SIZES.xs,
  },
  reviewUserMeta: {
    flex: 1,
  },
  reviewUserName: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    color: COLORS.text,
  },
  reviewDate: {
    fontSize: FONT_SIZES.xs - 2,
    color: COLORS.textMuted,
  },
  reviewComment: {
    fontSize: FONT_SIZES.xs + 1,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    ...SHADOWS.large,
  },
  bottomBarPriceCol: {
    flex: 1,
  },
  bottomBarLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  bottomBarPrice: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '800',
    color: COLORS.primary,
  },
  bottomBarBtn: {
    minWidth: 160,
  },
});
