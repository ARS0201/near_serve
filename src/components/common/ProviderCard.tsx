import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { COLORS, FONT_SIZES, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { useBooking } from '../../context/BookingContext';
import type { Provider } from '../../types/index';
import { RatingStars } from './RatingStars';

interface ProviderCardProps {
  provider: Provider;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({
  provider,
  onPress,
  style,
}) => {
  const { isFavorite, toggleFavorite } = useBooking();
  const favorite = isFavorite(provider.id);

  const getAvailabilityColor = () => {
    switch (provider.availabilityStatus) {
      case 'Available Now':
        return { bg: COLORS.successLight, text: COLORS.success };
      case 'Available Today':
        return { bg: COLORS.primaryLight, text: COLORS.primary };
      case 'Available Tomorrow':
      default:
        return { bg: COLORS.warningLight, text: COLORS.warning };
    }
  };

  const availColor = getAvailabilityColor();

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.88}
    >
      {/* Service Image Container */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: provider.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        {/* Availability Pill */}
        <View style={[styles.availBadge, { backgroundColor: availColor.bg }]}>
          <View style={[styles.availDot, { backgroundColor: availColor.text }]} />
          <Text style={[styles.availText, { color: availColor.text }]}>
            {provider.availabilityStatus}
          </Text>
        </View>

        {/* Favorite Heart Button */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(provider.id)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={favorite ? 'heart' : 'heart-outline'}
            size={18}
            color={favorite ? COLORS.danger : COLORS.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {/* Card Details */}
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.titlesCol}>
            <Text style={styles.serviceName} numberOfLines={1}>
              {provider.serviceName}
            </Text>
            <Text style={styles.providerName} numberOfLines={1}>
              {provider.name}
            </Text>
          </View>
        </View>

        {/* Rating & Distance Meta */}
        <View style={styles.metaRow}>
          <RatingStars
            rating={provider.rating}
            showText
            reviewCount={provider.reviewCount}
          />
          <View style={styles.distanceWrapper}>
            <Ionicons name="location-outline" size={13} color={COLORS.textSecondary} />
            <Text style={styles.distanceText}>{provider.distanceKm} km</Text>
          </View>
        </View>

        {/* Price & CTA Footer */}
        <View style={styles.footerRow}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Starts from</Text>
            <Text style={styles.priceValue}>₹{provider.startingPrice}</Text>
          </View>

          <TouchableOpacity
            style={styles.viewDetailsButton}
            onPress={onPress}
            activeOpacity={0.8}
          >
            <Text style={styles.viewDetailsText}>View Details</Text>
            <Ionicons name="chevron-forward" size={14} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  imageWrapper: {
    width: '100%',
    height: 160,
    backgroundColor: COLORS.borderLight,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  availBadge: {
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    gap: 5,
    ...SHADOWS.subtle,
  },
  availDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  availText: {
    fontSize: FONT_SIZES.xs - 1,
    fontWeight: '700',
  },
  favoriteButton: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.subtle,
  },
  content: {
    padding: SPACING.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs + 2,
  },
  titlesCol: {
    flex: 1,
  },
  serviceName: {
    fontSize: FONT_SIZES.md + 1,
    fontWeight: '700',
    color: COLORS.text,
  },
  providerName: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: SPACING.sm,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  distanceWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  distanceText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  priceContainer: {},
  priceLabel: {
    fontSize: FONT_SIZES.xs - 1,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  priceValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '800',
    color: COLORS.primary,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm + 1,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.md,
    gap: 4,
    ...SHADOWS.button,
  },
  viewDetailsText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
  },
});
