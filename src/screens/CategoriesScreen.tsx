import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORIES } from '../data/categories';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { ProductCategory } from '../types/product';

export const CategoriesScreen: React.FC = () => {
  const { setSelectedCategory, setActiveTab } = useApp();

  const handleSelectCategory = (categoryId: ProductCategory) => {
    setSelectedCategory(categoryId);
    setActiveTab('home');
  };

  // Skip 'all' for the category drilldown display
  const displayCategories = CATEGORIES.filter((c) => c.id !== 'all');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Equipment Categories</Text>
        <Text style={styles.headerSubtitle}>
          Provisional dairy equipment catalogue • Jagdamb Enterprises
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.bannerBox}>
          <Ionicons name="information-circle-outline" size={20} color={COLORS.primary} />
          <Text style={styles.bannerText}>
            These are provisional categories for Phase 1. Final product codes and factory pricing will be synchronized in Phase 2.
          </Text>
        </View>

        <View style={styles.grid}>
          {displayCategories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.card}
              onPress={() => handleSelectCategory(cat.id)}
              activeOpacity={0.8}
            >
              <View style={styles.iconCircle}>
                <Ionicons name={cat.icon as any} size={28} color={COLORS.primary} />
              </View>

              <View style={styles.cardContent}>
                <View style={styles.titleRow}>
                  <Text style={styles.cardTitle}>{cat.name}</Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{cat.itemCount} Items</Text>
                  </View>
                </View>

                {cat.nameMarathi && (
                  <Text style={styles.marathiTitle}>{cat.nameMarathi}</Text>
                )}

                <Text style={styles.description} numberOfLines={2}>
                  {cat.description}
                </Text>

                <View style={styles.exploreLink}>
                  <Text style={styles.exploreText}>Browse Products</Text>
                  <Ionicons name="chevron-forward" size={14} color={COLORS.primary} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: 40,
  },
  bannerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.primaryLight,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.lg,
  },
  bannerText: {
    fontSize: 12,
    color: COLORS.primaryDark,
    flex: 1,
    lineHeight: 16,
  },
  grid: {
    gap: SPACING.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: SPACING.lg,
    gap: SPACING.md,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
  },
  badge: {
    backgroundColor: COLORS.surfaceSecondary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  marathiTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.primary,
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
    marginBottom: SPACING.sm,
  },
  exploreLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  exploreText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
