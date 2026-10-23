import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Product } from '../types/product';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { QuantityControl } from './QuantityControl';
import { openWhatsAppEnquiry } from '../lib/supabaseService';

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const {
    setSelectedProduct,
    addToCart,
    updateCartQuantity,
    getCartItemQuantity,
    isInWishlist,
    toggleWishlist,
    requestProductQuote,
  } = useApp();
  const { language, t } = useLanguage();

  const isWishlisted = isInWishlist(product.id);
  const cartQty = getCartItemQuantity(product.id);
  const isOnRequest = product.priceType === 'on-request';

  const handleCardPress = () => {
    if (onPress) {
      onPress();
    } else {
      setSelectedProduct(product);
      try {
        router.push({
          pathname: '/product/[id]',
          params: { id: product.id },
        });
      } catch (e) {
        // Fallback handled by state
      }
    }
  };

  const displayName = language === 'mr' && product.marathiName ? product.marathiName : product.name;
  const secondaryName = language === 'mr' ? product.name : product.marathiName;

  const formattedPrice = product.price
    ? `₹${product.price.toLocaleString('en-IN')}`
    : t('priceOnRequest');
  const formattedOriginalPrice = product.originalPrice
    ? `₹${product.originalPrice.toLocaleString('en-IN')}`
    : null;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handleCardPress}
      activeOpacity={0.88}
      accessibilityLabel={`${displayName}, ${formattedPrice}`}
      accessibilityRole="button"
    >
      {/* Product Image Area */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />

        {/* Badges Overlay */}
        <View style={styles.badgesRow}>
          {isOnRequest ? (
            <View style={styles.quoteBadge}>
              <Text style={styles.quoteBadgeText}>
                {language === 'mr' ? 'कोटेशन हवे' : 'QUOTE REQUIRED'}
              </Text>
            </View>
          ) : product.discountPercent && product.discountPercent > 0 ? (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{product.discountPercent}% OFF</Text>
            </View>
          ) : null}

          {product.isBestSeller && (
            <View style={styles.bestSellerBadge}>
              <Text style={styles.bestSellerText}>{t('bestSeller')}</Text>
            </View>
          )}
        </View>

        {/* Wishlist Button */}
        <TouchableOpacity
          style={styles.wishlistBtn}
          onPress={() => toggleWishlist(product)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          accessibilityRole="button"
        >
          <Ionicons
            name={isWishlisted ? 'heart' : 'heart-outline'}
            size={19}
            color={isWishlisted ? COLORS.discountBadge : COLORS.textSecondary}
          />
        </TouchableOpacity>

        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>{t('outOfStock')}</Text>
          </View>
        )}
      </View>

      {/* Product Info */}
      <View style={styles.content}>
        {/* Brand & Stock Status */}
        <View style={styles.metaRow}>
          <Text style={styles.brandText}>{product.brand}</Text>
          <View style={styles.stockBadge}>
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
              {product.inStock ? t('inStock') : t('outOfStock')}
            </Text>
          </View>
        </View>

        {/* Product Title */}
        <Text style={styles.title} numberOfLines={2}>
          {displayName}
        </Text>

        {/* Secondary Name */}
        {secondaryName && (
          <Text style={styles.secondaryTitle} numberOfLines={1}>
            {secondaryName}
          </Text>
        )}

        {/* Rating Row */}
        <View style={styles.ratingRow}>
          <View style={styles.starBox}>
            <Ionicons name="star" size={12} color={COLORS.star} />
            <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
          </View>
          <Text style={styles.reviewCount}>
            ({product.reviewCount} {t('reviews')})
          </Text>
        </View>

        {/* Price Section */}
        <View style={styles.priceRow}>
          {isOnRequest ? (
            <View style={styles.onRequestRow}>
              <Ionicons name="chatbubbles-outline" size={15} color={COLORS.primary} />
              <Text style={styles.onRequestText}>{t('priceOnRequest')}</Text>
            </View>
          ) : (
            <>
              <Text style={styles.price}>{formattedPrice}</Text>
              {formattedOriginalPrice && (
                <Text style={styles.originalPrice}>{formattedOriginalPrice}</Text>
              )}
            </>
          )}
        </View>

        {/* Action Button: Add to Cart OR Request Quote */}
        <View style={styles.actionContainer}>
          {isOnRequest ? (
            <View style={styles.quoteButtonGroup}>
              <TouchableOpacity
                style={styles.quoteBtn}
                onPress={() => requestProductQuote(product)}
                activeOpacity={0.8}
              >
                <Ionicons name="document-text-outline" size={14} color={COLORS.primaryDark} />
                <Text style={styles.quoteBtnText}>{t('requestQuote')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.whatsappCardBtn}
                onPress={() => openWhatsAppEnquiry(product.name, product.modelNumber)}
                activeOpacity={0.8}
                accessibilityLabel="WhatsApp Quote"
              >
                <Ionicons name="logo-whatsapp" size={16} color="#15803D" />
              </TouchableOpacity>
            </View>
          ) : cartQty > 0 ? (
            <View style={styles.quantityRow}>
              <QuantityControl
                quantity={cartQty}
                onIncrement={() => updateCartQuantity(product.id, cartQty + 1)}
                onDecrement={() => updateCartQuantity(product.id, cartQty - 1)}
                size="small"
              />
              <Text style={styles.inCartNote}>
                {language === 'mr' ? 'कार्टमध्ये' : 'In Cart'}
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[
                styles.addToCartBtn,
                !product.inStock && styles.addToCartBtnDisabled,
              ]}
              onPress={() => addToCart(product, 1)}
              disabled={!product.inStock}
              activeOpacity={0.8}
            >
              <Ionicons
                name="cart-outline"
                size={15}
                color={product.inStock ? COLORS.textInverse : COLORS.textMuted}
              />
              <Text
                style={[
                  styles.addToCartText,
                  !product.inStock && styles.addToCartTextDisabled,
                ]}
              >
                {t('addToCart')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: SPACING.lg,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 175,
    backgroundColor: COLORS.surfaceSecondary,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgesRow: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    flexDirection: 'column',
    gap: 4,
  },
  quoteBadge: {
    backgroundColor: COLORS.quoteBadge,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
  },
  quoteBadgeText: {
    color: COLORS.surface,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  discountBadge: {
    backgroundColor: COLORS.discountBadge,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
  },
  discountText: {
    color: COLORS.surface,
    fontSize: 10,
    fontWeight: '800',
  },
  bestSellerBadge: {
    backgroundColor: COLORS.warning,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
  },
  bestSellerText: {
    color: '#78350F',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  wishlistBtn: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outOfStockText: {
    color: COLORS.surface,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
  },
  content: {
    padding: SPACING.md,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  brandText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stockDot: {
    width: 6,
    height: 6,
    borderRadius: RADIUS.full,
  },
  stockText: {
    fontSize: 11,
    fontWeight: '600',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    lineHeight: 19,
    marginBottom: 2,
  },
  secondaryTitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '500',
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  starBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
    gap: 3,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
  },
  reviewCount: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 10,
    minHeight: 24,
  },
  price: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  originalPrice: {
    fontSize: 12,
    color: COLORS.textMuted,
    textDecorationLine: 'line-through',
  },
  onRequestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  onRequestText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  actionContainer: {
    marginTop: 2,
  },
  quoteButtonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quoteBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 9,
    borderRadius: RADIUS.md,
    gap: 6,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  quoteBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  whatsappCardBtn: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.md,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  addToCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 9,
    borderRadius: RADIUS.md,
    gap: 6,
  },
  addToCartBtnDisabled: {
    backgroundColor: COLORS.surfaceSecondary,
  },
  addToCartText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.surface,
  },
  addToCartTextDisabled: {
    color: COLORS.textMuted,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inCartNote: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.accent,
  },
});
