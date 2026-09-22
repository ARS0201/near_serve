import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '../../constants/theme';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  dark?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightAction,
  containerStyle,
  dark = false,
}) => {
  const textColor = dark ? COLORS.white : COLORS.text;
  const subtextColor = dark ? 'rgba(255, 255, 255, 0.8)' : COLORS.textSecondary;
  const iconColor = dark ? COLORS.white : COLORS.text;

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.leftContainer}>
        {showBack && (
          <TouchableOpacity
            style={[styles.backButton, dark && styles.darkBackButton]}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color={iconColor} />
          </TouchableOpacity>
        )}
        {title && (
          <View style={styles.titleWrapper}>
            <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
              {title}
            </Text>
            {subtitle ? (
              <Text style={[styles.subtitle, { color: subtextColor }]} numberOfLines={1}>
                {subtitle}
              </Text>
            ) : null}
          </View>
        )}
      </View>
      {rightAction && <View style={styles.rightContainer}>{rightAction}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    minHeight: 56,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  darkBackButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'transparent',
  },
  titleWrapper: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: FONT_SIZES.xs,
    marginTop: 2,
  },
  rightContainer: {
    marginLeft: SPACING.sm,
  },
});
