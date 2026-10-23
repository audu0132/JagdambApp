import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { CATEGORIES } from '../data/categories';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { ProductCategory } from '../types/product';

export const CategoriesScreen: React.FC = () => {
  const { setSelectedCategory, setActiveTab } = useApp();
  const { language, t } = useLanguage();

  const handleSelectCategory = (categoryId: ProductCategory) => {
    setSelectedCategory(categoryId);
    setActiveTab('home');
    try {
      router.push('/(tabs)');
    } catch (e) {
      // handled
    }
  };

  const displayCategories = CATEGORIES.filter((c) => c.id !== 'all');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {language === 'mr' ? 'उपकरण विभाग' : 'Equipment Categories'}
        </Text>
        <Text style={styles.headerSubtitle}>
          {language === 'mr'
            ? 'जगदंब एंटरप्रायझेस बारामती • अधिकृत डेअरी उपकरणे'
            : 'Jagdamb Enterprises Baramati • Official Dairy Equipment'}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.grid}>
          {displayCategories.map((cat) => {
            const primaryTitle = language === 'mr' && cat.nameMarathi ? cat.nameMarathi : cat.name;
            const secondaryTitle = language === 'mr' ? cat.name : cat.nameMarathi;

            return (
              <TouchableOpacity
                key={cat.id}
                style={styles.card}
                onPress={() => handleSelectCategory(cat.id as ProductCategory)}
                activeOpacity={0.82}
              >
                <View style={styles.iconCircle}>
                  <Ionicons name={cat.icon as any} size={28} color={COLORS.primary} />
                </View>

                <View style={styles.cardContent}>
                  <View style={styles.titleRow}>
                    <Text style={styles.cardTitle}>{primaryTitle}</Text>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>
                        {cat.itemCount} {language === 'mr' ? 'उपकरणे' : 'Items'}
                      </Text>
                    </View>
                  </View>

                  {secondaryTitle && (
                    <Text style={styles.secondaryTitle}>{secondaryTitle}</Text>
                  )}

                  <Text style={styles.description} numberOfLines={2}>
                    {cat.description}
                  </Text>

                  <View style={styles.exploreLink}>
                    <Text style={styles.exploreText}>
                      {language === 'mr' ? 'उपकरणे पहा' : 'Browse Equipment'}
                    </Text>
                    <Ionicons name="chevron-forward" size={14} color={COLORS.primary} />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
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
    color: COLORS.textMuted,
    marginTop: 2,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  grid: {
    gap: SPACING.md,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  cardContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
  },
  secondaryTitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '500',
    marginBottom: 4,
  },
  badge: {
    backgroundColor: COLORS.surfaceSecondary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    marginLeft: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  description: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
    marginBottom: 8,
  },
  exploreLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  exploreText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
