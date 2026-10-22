import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORIES } from '../data/categories';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { ProductCategory } from '../types/product';

export const CategoryList: React.FC = () => {
  const { selectedCategory, setSelectedCategory } = useApp();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <Text style={styles.sectionSubtitle}>वर्गवारी</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}
      >
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;

          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryChip,
                isSelected ? styles.categoryChipActive : styles.categoryChipInactive,
              ]}
              onPress={() => setSelectedCategory(cat.id as ProductCategory)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`${cat.name}, ${cat.itemCount} items`}
            >
              <View
                style={[
                  styles.iconCircle,
                  isSelected ? styles.iconCircleActive : styles.iconCircleInactive,
                ]}
              >
                <Ionicons
                  name={cat.icon as any}
                  size={18}
                  color={isSelected ? COLORS.textInverse : COLORS.primary}
                />
              </View>

              <View style={styles.textContainer}>
                <Text
                  style={[
                    styles.categoryName,
                    isSelected ? styles.textActive : styles.textInactive,
                  ]}
                  numberOfLines={1}
                >
                  {cat.name}
                </Text>
                {cat.nameMarathi && (
                  <Text
                    style={[
                      styles.marathiSub,
                      isSelected ? styles.marathiSubActive : styles.marathiSubInactive,
                    ]}
                    numberOfLines={1}
                  >
                    {cat.nameMarathi}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    gap: SPACING.xs,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
  },
  sectionSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  scrollList: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    minHeight: 46,
    gap: SPACING.sm,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryChipInactive: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
  },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  iconCircleInactive: {
    backgroundColor: COLORS.primaryLight,
  },
  textContainer: {
    justifyContent: 'center',
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '700',
  },
  marathiSub: {
    fontSize: 10,
    marginTop: 1,
  },
  textActive: {
    color: COLORS.textInverse,
  },
  textInactive: {
    color: COLORS.textPrimary,
  },
  marathiSubActive: {
    color: 'rgba(255, 255, 255, 0.85)',
  },
  marathiSubInactive: {
    color: COLORS.textSecondary,
  },
});
