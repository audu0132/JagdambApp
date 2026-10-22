import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../constants/theme';
import { useApp } from '../context/AppContext';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      <View style={styles.toastCard}>
        <Text style={styles.toastText}>{toastMessage}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 84, // Above the bottom tab bar
    left: SPACING.lg,
    right: SPACING.lg,
    alignItems: 'center',
    zIndex: 9999,
  },
  toastCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.94)',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
    maxWidth: '95%',
  },
  toastText: {
    color: COLORS.textInverse,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});
