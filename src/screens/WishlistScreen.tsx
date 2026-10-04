import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { EmptyState } from '../components/EmptyState';

export const WishlistScreen: React.FC = () => {
  const {
    wishlist,
    removeFromWishlist,
    moveToCartFromWishlist,
    setSelectedProduct,
    setActiveTab,
    requestProductQuote,
  } = useApp();
  const { language, t } = useLanguage();

  if (wishlist.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('myWishlist')}</Text>
        </View>
        <EmptyState
          icon="heart-outline"
          title={t('emptyWishlistTitle')}
          subtitle={t('emptyWishlistMsg')}
          actionLabel={t('tabHome')}
          onAction={() => {
            setActiveTab('home');
            try { router.push('/(tabs)'); } catch (e) {}
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>{t('myWishlist')}</Text>
          <Text style={styles.headerSubtitle}>
            {wishlist.length} {language === 'mr' ? 'उपकरणे जतन' : 'items saved'}
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.list}>
          {wishlist.map(({ product }) => {
            const displayName =
              language === 'mr' && product.marathiName ? product.marathiName : product.name;
            const isOnRequest = product.priceType === 'on-request';

            return (
              <View key={product.id} style={styles.card}>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedProduct(product);
                    try {
                      router.push({
                        pathname: '/product/[id]',
                        params: { id: product.id },
                      });
                    } catch (e) {}
                  }}
                  activeOpacity={0.8}
                >
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: product.image }}
                      style={styles.image}
                      resizeMode="cover"
                    />
                    {!product.inStock && (
                      <View style={styles.outOfStockOverlay}>
                        <Text style={styles.outOfStockText}>{t('outOfStock')}</Text>
                      </View>
                    )}
                    {!isOnRequest && product.discountPercent && product.discountPercent > 0 && (
                      <View style={styles.discountBadge}>
                        <Text style={styles.discountBadgeText}>{product.discountPercent}% OFF</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>

                <View style={styles.content}>
                  <View style={styles.topRow}>
                    <Text style={styles.brand}>{product.brand}</Text>
                    <TouchableOpacity
                      onPress={() => removeFromWishlist(product.id)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      accessibilityLabel="Remove from wishlist"
                    >
                      <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      setSelectedProduct(product);
                      try {
                        router.push({
                          pathname: '/product/[id]',
                          params: { id: product.id },
                        });
                      } catch (e) {}
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.title} numberOfLines={2}>
                      {displayName}
                    </Text>
                  </TouchableOpacity>

                  {/* Stock Status */}
                  <View style={styles.stockRow}>
                    <View
                      style={[
                        styles.stockDot,
                        { backgroundColor: product.inStock ? COLORS.success : COLORS.danger },
                      ]}
                    />
                    <Text
                      style={[
                        styles.stockText,
                        { color: product.inStock ? COLORS.success : COLORS.danger },
                      ]}
                    >
                      {product.inStock
                        ? `${t('inStock')}${product.stockCount <= 5 ? ` — ${language === 'mr' ? 'फक्त' : 'only'} ${product.stockCount} ${language === 'mr' ? 'शिल्लक' : 'left'}` : ''}`
                        : t('outOfStock')}
                    </Text>
                  </View>

                  <View style={styles.priceRow}>
                    {isOnRequest ? (
                      <Text style={styles.price}>{t('priceOnRequest')}</Text>
                    ) : (
                      <>
                        <Text style={styles.price}>
                          ₹{(product.price || 0).toLocaleString('en-IN')}
                        </Text>
                        {product.originalPrice && product.price && product.originalPrice > product.price && (
                          <Text style={styles.originalPrice}>
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                          </Text>
                        )}
                      </>
                    )}
                  </View>

                  <View style={styles.actionRow}>
                    {isOnRequest ? (
                      <TouchableOpacity
                        style={styles.quoteBtn}
                        onPress={() => requestProductQuote(product)}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="document-text-outline" size={14} color={COLORS.primaryDark} />
                        <Text style={styles.quoteBtnText}>{t('requestQuote')}</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={[
                          styles.moveBtn,
                          !product.inStock && styles.moveBtnDisabled,
                        ]}
                        onPress={() => moveToCartFromWishlist(product)}
                        disabled={!product.inStock}
                        activeOpacity={0.8}
                      >
                        <Ionicons
                          name="cart-outline"
                          size={14}
                          color={product.inStock ? COLORS.surface : COLORS.textMuted}
                        />
                        <Text
                          style={[
                            styles.moveBtnText,
                            !product.inStock && styles.moveBtnTextDisabled,
                          ]}
                        >
                          {t('moveToCart')}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
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
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  list: {
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
    gap: SPACING.md,
  },
  imageContainer: {
    width: 84,
    height: 84,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    backgroundColor: COLORS.surfaceSecondary,
    position: 'relative',
  },
  image: {
    width: 84,
    height: 84,
    borderRadius: RADIUS.md,
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outOfStockText: {
    color: COLORS.surface,
    fontSize: 9,
    fontWeight: '800',
    textAlign: 'center',
  },
  discountBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: COLORS.discountBadge,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
  },
  discountBadgeText: {
    color: COLORS.surface,
    fontSize: 8,
    fontWeight: '800',
  },
  content: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    lineHeight: 18,
    marginVertical: 3,
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  stockDot: {
    width: 6,
    height: 6,
    borderRadius: RADIUS.full,
  },
  stockText: {
    fontSize: 10,
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: 8,
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  originalPrice: {
    fontSize: 11,
    color: COLORS.textMuted,
    textDecorationLine: 'line-through',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: RADIUS.md,
  },
  moveBtnDisabled: {
    backgroundColor: COLORS.surfaceSecondary,
  },
  moveBtnText: {
    color: COLORS.surface,
    fontSize: 12,
    fontWeight: '700',
  },
  moveBtnTextDisabled: {
    color: COLORS.textMuted,
  },
  quoteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  quoteBtnText: {
    color: COLORS.primaryDark,
    fontSize: 12,
    fontWeight: '700',
  },
});
