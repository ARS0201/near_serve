import React from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { COLORS, FONT_SIZES, RADIUS, SHADOWS, SPACING } from '../../constants/theme';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
}) => {
  const isInteractive = !disabled && !loading;

  const getContainerStyle = () => {
    const baseStyle: ViewStyle[] = [styles.button];

    // Size
    if (size === 'sm') baseStyle.push(styles.sizeSm);
    else if (size === 'lg') baseStyle.push(styles.sizeLg);
    else baseStyle.push(styles.sizeMd);

    // Variant
    switch (variant) {
      case 'secondary':
        baseStyle.push(styles.secondaryButton);
        break;
      case 'outline':
        baseStyle.push(styles.outlineButton);
        break;
      case 'ghost':
        baseStyle.push(styles.ghostButton);
        break;
      case 'danger':
        baseStyle.push(styles.dangerButton);
        break;
      case 'primary':
      default:
        baseStyle.push(styles.primaryButton);
        break;
    }

    if (disabled) {
      baseStyle.push(styles.disabledButton);
    }

    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle: TextStyle[] = [styles.text];

    if (size === 'sm') baseStyle.push(styles.textSm);
    else if (size === 'lg') baseStyle.push(styles.textLg);
    else baseStyle.push(styles.textMd);

    switch (variant) {
      case 'secondary':
        baseStyle.push(styles.secondaryText);
        break;
      case 'outline':
        baseStyle.push(styles.outlineText);
        break;
      case 'ghost':
        baseStyle.push(styles.ghostText);
        break;
      case 'danger':
        baseStyle.push(styles.dangerText);
        break;
      case 'primary':
      default:
        baseStyle.push(styles.primaryText);
        break;
    }

    if (disabled) {
      baseStyle.push(styles.disabledText);
    }

    return baseStyle;
  };

  const spinnerColor =
    variant === 'outline' || variant === 'ghost' ? COLORS.primary : COLORS.white;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={!isInteractive}
      style={[getContainerStyle(), style]}
    >
      {loading ? (
        <ActivityIndicator color={spinnerColor} size="small" />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          <Text style={[getTextStyle(), icon && iconPosition === 'left' ? styles.iconMarginLeft : null, icon && iconPosition === 'right' ? styles.iconMarginRight : null, textStyle]}>
            {title}
          </Text>
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.md,
  },
  // Sizes
  sizeSm: {
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.md,
    minHeight: 36,
  },
  sizeMd: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    minHeight: 50,
  },
  sizeLg: {
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    minHeight: 56,
  },
  // Variants
  primaryButton: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.button,
  },
  secondaryButton: {
    backgroundColor: COLORS.secondary,
    ...SHADOWS.button,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  dangerButton: {
    backgroundColor: COLORS.danger,
  },
  disabledButton: {
    backgroundColor: COLORS.border,
    borderColor: COLORS.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  // Text Styles
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  textSm: {
    fontSize: FONT_SIZES.sm,
  },
  textMd: {
    fontSize: FONT_SIZES.md,
  },
  textLg: {
    fontSize: FONT_SIZES.lg,
  },
  primaryText: {
    color: COLORS.white,
  },
  secondaryText: {
    color: COLORS.white,
  },
  outlineText: {
    color: COLORS.primary,
  },
  ghostText: {
    color: COLORS.primary,
  },
  dangerText: {
    color: COLORS.white,
  },
  disabledText: {
    color: COLORS.textMuted,
  },
  iconMarginLeft: {
    marginLeft: SPACING.sm,
  },
  iconMarginRight: {
    marginRight: SPACING.sm,
  },
});
