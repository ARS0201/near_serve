import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS, FONT_SIZES, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import type { Category } from '../../types/index';

interface CategoryCardProps {
  category: Category;
  isSelected?: boolean;
  onPress: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  isSelected = false,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.selectedContainer]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.iconWrapper, isSelected && styles.selectedIconWrapper]}>
        <Ionicons
          name={category.icon as any}
          size={24}
          color={isSelected ? COLORS.white : COLORS.primary}
        />
      </View>
      <Text
        style={[styles.categoryName, isSelected && styles.selectedCategoryName]}
        numberOfLines={1}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: SPACING.md,
    width: 78,
  },
  selectedContainer: {
    transform: [{ scale: 1.04 }],
  },
  iconWrapper: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs + 2,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.subtle,
  },
  selectedIconWrapper: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    ...SHADOWS.button,
  },
  categoryName: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  selectedCategoryName: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});
