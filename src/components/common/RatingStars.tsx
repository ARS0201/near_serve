import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '../../constants/theme';

interface RatingStarsProps {
  rating: number;
  size?: number;
  showText?: boolean;
  reviewCount?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  size = 14,
  showText = false,
  reviewCount,
  interactive = false,
  onRatingChange,
}) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <View style={styles.container}>
      <View style={styles.starsRow}>
        {stars.map((star) => {
          const isFilled = star <= Math.floor(rating);
          const isHalf = star === Math.ceil(rating) && rating % 1 !== 0;

          const starIcon = (
            <Ionicons
              key={star}
              name={isFilled ? 'star' : isHalf ? 'star-half' : 'star-outline'}
              size={size}
              color={COLORS.star}
              style={styles.starIcon}
            />
          );

          if (interactive) {
            return (
              <TouchableOpacity
                key={star}
                onPress={() => onRatingChange && onRatingChange(star)}
                activeOpacity={0.7}
                style={styles.interactiveStar}
              >
                {starIcon}
              </TouchableOpacity>
            );
          }

          return starIcon;
        })}
      </View>
      {showText && (
        <Text style={styles.ratingText}>
          {rating.toFixed(1)}
          {reviewCount !== undefined && (
            <Text style={styles.reviewCountText}> ({reviewCount})</Text>
          )}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    marginRight: 2,
  },
  interactiveStar: {
    padding: SPACING.xs,
  },
  ratingText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    color: COLORS.text,
    marginLeft: SPACING.xs,
  },
  reviewCountText: {
    fontWeight: '400',
    color: COLORS.textSecondary,
  },
});
