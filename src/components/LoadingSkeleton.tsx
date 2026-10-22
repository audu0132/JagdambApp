import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';

interface LoadingProps {
  message?: string;
}

export const LoadingSkeleton: React.FC<LoadingProps> = ({ message = 'Loading dairy equipment...' }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.xxxl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
  },
  text: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
});
