import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, FONT_SIZES, RADIUS, SPACING } from '../../constants/theme';
import type { Booking } from '../../types/index';

interface StatusBadgeProps {
  status: Booking['status'];
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'Confirmed':
        return {
          bg: COLORS.successLight,
          text: COLORS.success,
        };
      case 'In Progress':
        return {
          bg: COLORS.primaryLight,
          text: COLORS.primary,
        };
      case 'Completed':
        return {
          bg: '#E0F2FE',
          text: '#0284C7',
        };
      case 'Cancelled':
        return {
          bg: COLORS.dangerLight,
          text: COLORS.danger,
        };
      case 'Pending':
      default:
        return {
          bg: COLORS.warningLight,
          text: COLORS.warning,
        };
    }
  };

  const { bg, text } = getBadgeStyle();

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.badgeText, { color: text }]}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: FONT_SIZES.xs - 1,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
