import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../constants/theme';

interface QuantityControlProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  max?: number;
  size?: 'small' | 'medium';
}

export const QuantityControl: React.FC<QuantityControlProps> = ({
  quantity,
  onIncrement,
  onDecrement,
  min = 1,
  max = 99,
  size = 'medium',
}) => {
  const isSmall = size === 'small';

  return (
    <View style={[styles.container, isSmall && styles.containerSmall]}>
      <TouchableOpacity
        style={[
          styles.button,
          isSmall && styles.buttonSmall,
          quantity <= min && styles.buttonDisabled,
        ]}
        onPress={onDecrement}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessibilityLabel="Decrease quantity"
        accessibilityRole="button"
      >
        <Ionicons
          name={quantity <= min ? 'trash-outline' : 'remove'}
          size={isSmall ? 14 : 16}
          color={quantity <= min ? COLORS.danger : COLORS.textPrimary}
        />
      </TouchableOpacity>

      <View style={[styles.countContainer, isSmall && styles.countContainerSmall]}>
        <Text style={[styles.countText, isSmall && styles.countTextSmall]}>{quantity}</Text>
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          isSmall && styles.buttonSmall,
          quantity >= max && styles.buttonDisabled,
        ]}
        onPress={onIncrement}
        disabled={quantity >= max}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessibilityLabel="Increase quantity"
        accessibilityRole="button"
      >
        <Ionicons
          name="add"
          size={isSmall ? 14 : 16}
          color={quantity >= max ? COLORS.textMuted : COLORS.textPrimary}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    height: 38,
  },
  containerSmall: {
    height: 30,
    borderRadius: RADIUS.sm,
  },
  button: {
    width: 36,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
  },
  buttonSmall: {
    width: 28,
  },
  buttonDisabled: {
    opacity: 0.8,
  },
  countContainer: {
    minWidth: 32,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xs,
  },
  countContainerSmall: {
    minWidth: 24,
  },
  countText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  countTextSmall: {
    fontSize: 12,
    fontWeight: '700',
  },
});
