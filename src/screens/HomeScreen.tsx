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
import { SearchBar } from '../components/SearchBar';
import { BannerCarousel } from '../components/BannerCarousel';
import { CategoryList } from '../components/CategoryList';
import { ProductCard } from '../components/ProductCard';
import { EmptyState } from '../components/EmptyState';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

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
        {/* Only show hero promo banners when not actively searching */}
        {searchQuery.trim() === '' && (
          <>
            <BannerCarousel />
            <CategoryList />
          </>
        )}

        {/* Quick Filter Bar */}
        <View style={styles.filtersSection}>
          <View style={styles.filtersHeader}>
            <View>
              <Text style={styles.sectionTitle}>
                {searchQuery ? 'Search Results' : 'Dairy Catalog'}
              </Text>
              <Text style={styles.sectionSubtitle}>
                {displayedProducts.length} items available
              </Text>
            </View>

            {(searchQuery !== '' || quickFilter !== 'all') && (
              <TouchableOpacity onPress={clearFilters} style={styles.resetBtn}>
                <Text style={styles.resetText}>Reset</Text>
              </TouchableOpacity>
            )}
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterChipsRow}
          >
            <TouchableOpacity
              style={[
                styles.filterChip,
                quickFilter === 'all' && styles.filterChipActive,
              ]}
              onPress={() => setQuickFilter('all')}
            >
              <Text
                style={[
                  styles.filterChipText,
                  quickFilter === 'all' && styles.filterChipTextActive,
                ]}
              >
                All Products
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterChip,
                quickFilter === 'bestsellers' && styles.filterChipActive,
              ]}
              onPress={() => setQuickFilter('bestsellers')}
            >
              <Ionicons
                name="flame"
                size={14}
                color={quickFilter === 'bestsellers' ? COLORS.textInverse : COLORS.warning}
              />
              <Text
                style={[
                  styles.filterChipText,
                  quickFilter === 'bestsellers' && styles.filterChipTextActive,
                ]}
              >
                Best Sellers
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterChip,
                quickFilter === 'offers' && styles.filterChipActive,
              ]}
              onPress={() => setQuickFilter('offers')}
            >
              <Ionicons
                name="pricetag"
                size={13}
                color={quickFilter === 'offers' ? COLORS.textInverse : COLORS.discountBadge}
              />
              <Text
                style={[
                  styles.filterChipText,
                  quickFilter === 'offers' && styles.filterChipTextActive,
                ]}
              >
                15%+ Off
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterChip,
                quickFilter === 'top-rated' && styles.filterChipActive,
              ]}
              onPress={() => setQuickFilter('top-rated')}
            >
              <Ionicons
                name="star"
                size={13}
                color={quickFilter === 'top-rated' ? COLORS.textInverse : COLORS.star}
              />
              <Text
                style={[
                  styles.filterChipText,
                  quickFilter === 'top-rated' && styles.filterChipTextActive,
                ]}
              >
                4.8★ & Above
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Product List or Loading/Empty States */}
        {isLoading ? (
          <LoadingSkeleton message="Updating dairy catalog..." />
        ) : displayedProducts.length === 0 ? (
          <EmptyState
            icon="search-outline"
            title="No Products Found"
            subtitle="We couldn't find matching dairy equipment. Try clearing your search or picking another category."
            actionLabel="View All Products"
            onAction={clearFilters}
          />
        ) : (
          <View style={styles.productsGrid}>
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </View>
        )}

        {/* Footer Guarantee Info */}
        <View style={styles.footerNote}>
          <Ionicons name="shield-checkmark" size={20} color={COLORS.accent} />
          <View style={styles.footerTextContainer}>
            <Text style={styles.footerTitle}>Jagdamb Enterprises Assurance</Text>
            <Text style={styles.footerDesc}>
              Direct manufacturer pricing, genuine spare parts, & 100% Baramati technician assistance.
            </Text>
          </View>
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
  filtersSection: {
    paddingHorizontal: SPACING.lg,
    marginVertical: SPACING.sm,
  },
  filtersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
  },
  sectionSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  resetBtn: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
  },
  resetText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  filterChipsRow: {
    gap: SPACING.sm,
    paddingVertical: 2,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 5,
  },
  filterChipActive: {
    backgroundColor: COLORS.primaryDark,
    borderColor: COLORS.primaryDark,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  filterChipTextActive: {
    color: COLORS.textInverse,
  },
  productsGrid: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.sm,
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.accentLight,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    gap: SPACING.sm,
  },
  footerTextContainer: {
    flex: 1,
  },
  footerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.accent,
    marginBottom: 2,
  },
  footerDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
});
