import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { SearchBar } from '../components/SearchBar';
import { BannerCarousel } from '../components/BannerCarousel';
import { CategoryList } from '../components/CategoryList';
import { ProductCard } from '../components/ProductCard';
import { EmptyState } from '../components/EmptyState';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { openWhatsAppEnquiry, callBaramatiShowroom } from '../lib/supabaseService';

type QuickFilter = 'all' | 'bestsellers' | 'offers' | 'top-rated';

export const HomeScreen: React.FC = () => {
  const {
    filteredProducts,
    isLoading,
    refreshProducts,
    setSelectedCategory,
    setSearchQuery,
    searchQuery,
  } = useApp();
  const { language, t } = useLanguage();

  const [refreshing, setRefreshing] = useState(false);
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('all');

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshProducts();
    setRefreshing(false);
  };

  const displayedProducts = useMemo(() => {
    let list = [...filteredProducts];
    if (quickFilter === 'bestsellers') {
      list = list.filter((p) => p.isBestSeller);
    } else if (quickFilter === 'offers') {
      list = list.filter((p) => typeof p.discountPercent === 'number' && p.discountPercent >= 15);
    } else if (quickFilter === 'top-rated') {
      list = list.filter((p) => p.rating >= 4.8);
    }
    return list;
  }, [filteredProducts, quickFilter]);

  const clearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setQuickFilter('all');
  };

  return (
    <View style={styles.container}>
      <SearchBar />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* Hero promo banners & quick categories when not actively searching */}
        {searchQuery.trim() === '' && (
          <>
            <BannerCarousel />
            <CategoryList />

            {/* Quick Farmer Helpline Card */}
            <View style={styles.helplineBanner}>
              <View style={styles.helplineLeft}>
                <Ionicons name="chatbubbles" size={24} color={COLORS.primary} />
                <View>
                  <Text style={styles.helplineTitle}>
                    {language === 'mr' ? 'बारामती शेतकरी हेल्पलाइन' : 'Baramati Farmer Helpline'}
                  </Text>
                  <Text style={styles.helplineSubtitle}>
                    {language === 'mr'
                      ? 'मिल्किंग मशिनरी सल्ला व तंत्रज्ञ सहाय्य'
                      : 'Free machinery guidance & technician support'}
                  </Text>
                </View>
              </View>
              <View style={styles.helplineButtons}>
                <TouchableOpacity
                  style={styles.waBtn}
                  onPress={() => openWhatsAppEnquiry()}
                  activeOpacity={0.8}
                >
                  <Ionicons name="logo-whatsapp" size={16} color="#FFFFFF" />
                  <Text style={styles.waBtnText}>WhatsApp</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.callBtn}
                  onPress={callBaramatiShowroom}
                  activeOpacity={0.8}
                >
                  <Ionicons name="call" size={15} color={COLORS.primary} />
                  <Text style={styles.callBtnText}>Call</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

        {/* Quick Filter Bar */}
        <View style={styles.filtersSection}>
          <View style={styles.filtersHeader}>
            <View>
              <Text style={styles.sectionTitle}>
                {searchQuery
                  ? language === 'mr'
                    ? 'शोध परिणाम'
                    : 'Search Results'
                  : language === 'mr'
                  ? 'डेअरी उपकरण कॅटलॉग'
                  : 'Dairy Equipment Catalog'}
              </Text>
              <Text style={styles.sectionSubtitle}>
                {t('resultsCount', { count: displayedProducts.length })}
              </Text>
            </View>

            {(searchQuery !== '' || quickFilter !== 'all') && (
              <TouchableOpacity onPress={clearFilters} style={styles.resetBtn}>
                <Text style={styles.resetText}>{t('clearSearch')}</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Filter Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterPillsContainer}
          >
            <TouchableOpacity
              style={[
                styles.filterPill,
                quickFilter === 'all' && styles.filterPillActive,
              ]}
              onPress={() => setQuickFilter('all')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterPillText,
                  quickFilter === 'all' && styles.filterPillTextActive,
                ]}
              >
                {t('filterAll')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterPill,
                quickFilter === 'bestsellers' && styles.filterPillActive,
              ]}
              onPress={() => setQuickFilter('bestsellers')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterPillText,
                  quickFilter === 'bestsellers' && styles.filterPillTextActive,
                ]}
              >
                {t('filterPopular')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterPill,
                quickFilter === 'offers' && styles.filterPillActive,
              ]}
              onPress={() => setQuickFilter('offers')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterPillText,
                  quickFilter === 'offers' && styles.filterPillTextActive,
                ]}
              >
                {t('filterDiscount')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterPill,
                quickFilter === 'top-rated' && styles.filterPillActive,
              ]}
              onPress={() => setQuickFilter('top-rated')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterPillText,
                  quickFilter === 'top-rated' && styles.filterPillTextActive,
                ]}
              >
                {t('filterHighRated')}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Product Grid Area */}
        <View style={styles.productsSection}>
          {isLoading ? (
            <LoadingSkeleton
              message={
                language === 'mr'
                  ? 'डेअरी उपकरणे लोड होत आहेत...'
                  : 'Loading dairy equipment...'
              }
            />
          ) : displayedProducts.length === 0 ? (
            <EmptyState
              icon="search-outline"
              title={t('noResults')}
              subtitle={
                language === 'mr'
                  ? 'कृपया वेगळे नाव टाकून शोधा किंवा फिल्टर रीसेट करा.'
                  : 'Try searching with different terms or reset your filters.'
              }
              actionLabel={t('clearSearch')}
              onAction={clearFilters}
            />
          ) : (
            displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
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
  scrollContent: {
    paddingBottom: SPACING.xxxl,
  },
  helplineBanner: {
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.sm,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  helplineLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  helplineTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  helplineSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  helplineButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  waBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#25D366',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: RADIUS.md,
  },
  waBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.surface,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  callBtnText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  filtersSection: {
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  filtersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
  },
  sectionSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
  },
  resetBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceSecondary,
  },
  resetText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  filterPillsContainer: {
    paddingHorizontal: SPACING.lg,
    gap: 8,
  },
  filterPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  filterPillActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  filterPillTextActive: {
    color: COLORS.primaryDark,
    fontWeight: '700',
  },
  productsSection: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.sm,
  },
});
