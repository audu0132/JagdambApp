import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../types/product';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { QuantityControl } from './QuantityControl';

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
  } = useApp();

  const isWishlisted = isInWishlist(product.id);
  const cartQty = getCartItemQuantity(product.id);

  const handleCardPress = () => {
    if (onPress) {
      onPress();
    } else {
      setSelectedProduct(product);
    }
  };

  const formattedPrice = `₹${product.price.toLocaleString('en-IN')}`;
  const formattedOriginalPrice = `₹${product.originalPrice.toLocaleString('en-IN')}`;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handleCardPress}
      activeOpacity={0.88}
      accessibilityLabel={`${product.name}, price ${formattedPrice}`}
      accessibilityRole="button"
    >
      {/* Product Image Area */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Badges Overlay */}
        <View style={styles.badgesRow}>
          {product.discountPercent > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{product.discountPercent}% OFF</Text>
            </View>
          )}

          {product.isBestSeller && (
            <View style={styles.bestSellerBadge}>
              <Text style={styles.bestSellerText}>BESTSELLER</Text>
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
            size={20}
            color={isWishlisted ? COLORS.discountBadge : COLORS.textSecondary}
          />
        </TouchableOpacity>

        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>OUT OF STOCK</Text>
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
              {product.inStock ? `In Stock (${product.stockCount})` : 'Sold Out'}
            </Text>
          </View>
        </View>

        {/* Product Title */}
        <Text style={styles.title} numberOfLines={2}>
          {product.name}
        </Text>

        {/* Marathi Subtitle */}
        {product.marathiName && (
          <Text style={styles.marathiTitle} numberOfLines={1}>
            {product.marathiName}
          </Text>
        )}

        {/* Rating Row */}
        <View style={styles.ratingRow}>
          <View style={styles.starBox}>
            <Ionicons name="star" size={13} color={COLORS.star} />
            <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
          </View>
          <Text style={styles.reviewCount}>({product.reviewCount} reviews)</Text>
        </View>

        {/* Price Section */}
        <View style={styles.priceRow}>
          <Text style={styles.price}>{formattedPrice}</Text>
          {product.originalPrice > product.price && (
            <Text style={styles.originalPrice}>{formattedOriginalPrice}</Text>
          )}
        </View>

        {/* Action Button: Add to Cart OR Quantity Controls */}
        <View style={styles.actionContainer}>
          {cartQty > 0 ? (
            <View style={styles.quantityRow}>
              <QuantityControl
                quantity={cartQty}
                onIncrement={() => updateCartQuantity(product.id, cartQty + 1)}
                onDecrement={() => updateCartQuantity(product.id, cartQty - 1)}
                size="small"
              />
              <Text style={styles.inCartNote}>In Cart</Text>
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
              accessibilityLabel={`Add ${product.name} to cart`}
              accessibilityRole="button"
            >
              <Ionicons
                name="cart-outline"
                size={16}
                color={product.inStock ? COLORS.surface : COLORS.textMuted}
              />
              <Text
                style={[
                  styles.addToCartText,
                  !product.inStock && styles.addToCartTextDisabled,
                ]}
              >
                {product.inStock ? 'Add to Cart' : 'Unavailable'}
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
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    height: 175,
    backgroundColor: COLORS.surfaceSecondary,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgesRow: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    gap: 4,
    zIndex: 2,
  },
  discountBadge: {
    backgroundColor: COLORS.discountBadge,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
  },
  discountText: {
    color: COLORS.textInverse,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  bestSellerBadge: {
    backgroundColor: COLORS.warning,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
  },
  bestSellerText: {
    color: COLORS.textInverse,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  wishlistBtn: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    width: 34,
    height: 34,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  outOfStockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  outOfStockText: {
    color: COLORS.textInverse,
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 1,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.xs,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
  },
  content: {
    padding: SPACING.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  brandText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryDark,
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
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    minHeight: 44,
  },
  marathiTitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: SPACING.sm,
  },
  starBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: COLORS.warningLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  reviewCount: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  originalPrice: {
    fontSize: 13,
    color: COLORS.textMuted,
    textDecorationLine: 'line-through',
  },
  actionContainer: {
    marginTop: 2,
  },
  addToCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    gap: 6,
  },
  addToCartBtnDisabled: {
    backgroundColor: COLORS.surfaceSecondary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  addToCartText: {
    color: COLORS.textInverse,
    fontSize: 13,
    fontWeight: '700',
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
