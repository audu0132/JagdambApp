import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORIES } from '../data/categories';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { ProductCategory } from '../types/product';

export const CategoryList: React.FC = () => {
  const { selectedCategory, setSelectedCategory } = useApp();
  const { language } = useLanguage();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>
          {language === 'mr' ? 'उपकरण विभाग' : 'Categories'}
        </Text>
        <Text style={styles.sectionSubtitle}>
          {language === 'mr' ? 'कॅटलॉग निवडा' : 'Select Category'}
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}
      >
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const primaryName = language === 'mr' && cat.nameMarathi ? cat.nameMarathi : cat.name;
          const secondaryName = language === 'mr' ? cat.name : cat.nameMarathi;

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
              accessibilityLabel={`${primaryName}, ${cat.itemCount} items`}
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
                  {primaryName}
                </Text>
                {secondaryName && (
                  <Text
                    style={[
                      styles.marathiSub,
                      isSelected ? styles.marathiSubActive : styles.marathiSubInactive,
                    ]}
                    numberOfLines={1}
                  >
                    {secondaryName}
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
    color: COLORS.textMuted,
  },
  scrollList: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
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
    borderColor: COLORS.borderLight,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  iconCircleActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  iconCircleInactive: {
    backgroundColor: COLORS.primaryLight,
  },
  textContainer: {
    flexDirection: 'column',
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '700',
  },
  textActive: {
    color: COLORS.textInverse,
  },
  textInactive: {
    color: COLORS.textPrimary,
  },
  marathiSub: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 1,
  },
  marathiSubActive: {
    color: 'rgba(255, 255, 255, 0.85)',
  },
  marathiSubInactive: {
    color: COLORS.textMuted,
  },
});
