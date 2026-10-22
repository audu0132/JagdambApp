import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { QuantityControl } from '../components/QuantityControl';

export const ProductDetailsScreen: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    cart,
    isInWishlist,
    toggleWishlist,
    setActiveTab,
    requestProductQuote,
  } = useApp();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [localQuantity, setLocalQuantity] = useState<number>(1);

  if (!selectedProduct) return null;

  const isWishlisted = isInWishlist(selectedProduct.id);
  const cartItem = cart.find((item) => item.product.id === selectedProduct.id);
  const currentImageUri = selectedImage || selectedProduct.image;
  const isOnRequest = selectedProduct.priceType === 'on-request';

  const imagesList = [
    selectedProduct.image,
    ...(selectedProduct.additionalImages || []),
  ];

  const formattedPrice = selectedProduct.price
    ? `₹${selectedProduct.price.toLocaleString('en-IN')}`
    : 'Price on Request';
  const formattedOriginalPrice = selectedProduct.originalPrice
    ? `₹${selectedProduct.originalPrice.toLocaleString('en-IN')}`
    : null;
  const savings =
    selectedProduct.originalPrice && selectedProduct.price
      ? selectedProduct.originalPrice - selectedProduct.price
      : 0;

  const handleAddToCart = () => {
    addToCart(selectedProduct, localQuantity);
  };

  const handleInquire = () => {
    Alert.alert(
      'Jagdamb Enterprises — Baramati Direct Contact',
      `Interested in ${selectedProduct.name} (Model: ${selectedProduct.modelNumber})?\n\n📍 Visit: Shop 2, Jamdar Nagar, Near PDCC Bank, Kasba, Baramati - 413102\n📞 Call: +91 98220 XXXXX for direct quotes and farm delivery.`,
      [{ text: 'Close', style: 'cancel' }]
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setSelectedProduct(null)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Back to products"
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {selectedProduct.brand}
        </Text>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => toggleWishlist(selectedProduct)}
            accessibilityLabel={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Ionicons
              name={isWishlisted ? 'heart' : 'heart-outline'}
              size={24}
              color={isWishlisted ? COLORS.discountBadge : COLORS.textPrimary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => {
              setSelectedProduct(null);
              setActiveTab('cart');
            }}
            accessibilityLabel="Go to cart"
          >
            <Ionicons name="cart-outline" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Main Image Gallery */}
        <View style={styles.imageSection}>
          <Image source={{ uri: currentImageUri }} style={styles.mainImage} resizeMode="cover" />

          {isOnRequest ? (
            <View style={styles.quoteBadge}>
              <Text style={styles.quoteBadgeText}>QUOTE ON REQUEST</Text>
            </View>
          ) : selectedProduct.discountPercent && selectedProduct.discountPercent > 0 ? (
            <View style={styles.discountBadge}>
              <Text style={styles.discountBadgeText}>
                {selectedProduct.discountPercent}% OFF
              </Text>
            </View>
          ) : null}

          {imagesList.length > 1 && (
            <View style={styles.thumbnailsRow}>
              {imagesList.map((imgUri, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setSelectedImage(imgUri)}
                  style={[
                    styles.thumbnail,
                    currentImageUri === imgUri && styles.thumbnailActive,
                  ]}
                >
                  <Image source={{ uri: imgUri }} style={styles.thumbImage} resizeMode="cover" />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Product Info Block */}
        <View style={styles.infoSection}>
          <View style={styles.metaRow}>
            <Text style={styles.brandTag}>{selectedProduct.brand}</Text>
            <Text style={styles.modelTag}>Model: {selectedProduct.modelNumber}</Text>
          </View>

          <Text style={styles.productTitle}>{selectedProduct.name}</Text>
          {selectedProduct.marathiName && (
            <Text style={styles.productMarathiTitle}>{selectedProduct.marathiName}</Text>
          )}

          {/* Ratings & Stock Availability */}
          <View style={styles.ratingStockRow}>
            <View style={styles.ratingChip}>
              <Ionicons name="star" size={14} color={COLORS.star} />
              <Text style={styles.ratingNumber}>{selectedProduct.rating.toFixed(1)}</Text>
              <Text style={styles.reviewsText}>({selectedProduct.reviewCount} Reviews)</Text>
            </View>

            <View
              style={[
                styles.stockPill,
                {
                  backgroundColor: selectedProduct.inStock
                    ? COLORS.successLight
                    : COLORS.dangerLight,
                },
              ]}
            >
              <Ionicons
                name={selectedProduct.inStock ? 'checkmark-circle' : 'close-circle'}
                size={14}
                color={selectedProduct.inStock ? COLORS.success : COLORS.danger}
              />
              <Text
                style={[
                  styles.stockPillText,
                  { color: selectedProduct.inStock ? COLORS.success : COLORS.danger },
                ]}
              >
                {selectedProduct.inStock ? 'Available' : 'Out of Stock'}
              </Text>
            </View>
          </View>

          {/* Pricing Box */}
          <View style={styles.priceContainer}>
            {isOnRequest ? (
              <View>
                <View style={styles.priceRow}>
                  <Text style={styles.quotePriceTitle}>Price on Request</Text>
                </View>
                <Text style={styles.quoteExplanation}>
                  Commercial milk cooling & pipeline parlour systems require custom sizing based on your farm's herd count, shed dimensions, and electrical phase. Submit a quotation enquiry for a custom engineered proposal.
                </Text>
              </View>
            ) : (
              <View>
                <View style={styles.priceRow}>
                  <Text style={styles.currentPrice}>{formattedPrice}</Text>
                  {formattedOriginalPrice && (
                    <Text style={styles.mrpPrice}>{formattedOriginalPrice}</Text>
                  )}
                </View>
                {savings > 0 && (
                  <Text style={styles.savingsTag}>
                    You Save ₹{savings.toLocaleString('en-IN')} ({selectedProduct.discountPercent}% off MRP)
                  </Text>
                )}
                <Text style={styles.taxNote}>*Inclusive of GST. Delivery available in Baramati & across Maharashtra.</Text>
              </View>
            )}
          </View>

          {/* Description */}
          <View style={styles.cardBlock}>
            <Text style={styles.blockTitle}>Equipment Description</Text>
            <Text style={styles.descriptionText}>{selectedProduct.description}</Text>
          </View>

          {/* Key Features */}
          <View style={styles.cardBlock}>
            <Text style={styles.blockTitle}>Key Features & Farm Benefits</Text>
            {selectedProduct.features.map((feature, i) => (
              <View key={i} style={styles.featureItem}>
                <Ionicons name="checkmark-done" size={18} color={COLORS.primary} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          {/* Technical Specifications */}
          <View style={styles.cardBlock}>
            <Text style={styles.blockTitle}>Technical Specifications</Text>
            <View style={styles.specTable}>
              {selectedProduct.specifications.map((spec, i) => (
                <View
                  key={i}
                  style={[
                    styles.specRow,
                    i % 2 === 0 ? styles.specRowEven : styles.specRowOdd,
                  ]}
                >
                  <Text style={styles.specLabel}>{spec.label}</Text>
                  <Text style={styles.specValue}>{spec.value}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Warranty & Guarantee Assurance */}
          <View style={styles.warrantyBox}>
            <Ionicons name="shield-checkmark" size={28} color={COLORS.accent} />
            <View style={styles.warrantyContent}>
              <Text style={styles.warrantyTitle}>{selectedProduct.warranty}</Text>
              <Text style={styles.warrantySub}>
                Authorized Jagdamb Enterprises genuine parts guarantee with on-site technician service in Baramati and surrounding regions.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Action Bar */}
      <View style={styles.bottomBar}>
        {isOnRequest ? (
          <TouchableOpacity
            style={styles.fullQuoteBtn}
            onPress={() => requestProductQuote(selectedProduct)}
            activeOpacity={0.8}
          >
            <Ionicons name="document-text" size={20} color={COLORS.textInverse} />
            <Text style={styles.fullQuoteBtnText}>Request Official Quotation</Text>
          </TouchableOpacity>
        ) : (
          <>
            <View style={styles.bottomBarLeft}>
              <Text style={styles.qtyLabel}>Quantity:</Text>
              <QuantityControl
                quantity={localQuantity}
                onIncrement={() => setLocalQuantity((q) => q + 1)}
                onDecrement={() => setLocalQuantity((q) => Math.max(1, q - 1))}
                min={1}
                max={selectedProduct.stockCount || 10}
                size="medium"
              />
            </View>

            <View style={styles.bottomBarRight}>
              <TouchableOpacity
                style={[
                  styles.addCartBtn,
                  !selectedProduct.inStock && styles.addCartBtnDisabled,
                ]}
                onPress={handleAddToCart}
                disabled={!selectedProduct.inStock}
                activeOpacity={0.8}
              >
                <Ionicons name="cart" size={18} color={COLORS.textInverse} />
                <Text style={styles.addCartBtnText}>
                  {cartItem ? `In Cart (${cartItem.quantity})` : 'Add to Cart'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.inquireBtn}
                onPress={handleInquire}
                activeOpacity={0.8}
                accessibilityLabel="Call store"
              >
                <Ionicons name="call-outline" size={18} color={COLORS.primaryDark} />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  backButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: SPACING.sm,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  headerIconBtn: {
    padding: SPACING.xs,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  imageSection: {
    position: 'relative',
    backgroundColor: COLORS.surfaceSecondary,
  },
  mainImage: {
    width: '100%',
    height: 300,
  },
  quoteBadge: {
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.md,
    backgroundColor: COLORS.primaryDark,
    paddingHorizontal: SPACING.md,
    paddingVertical: 5,
    borderRadius: RADIUS.xs,
  },
  quoteBadgeText: {
    color: COLORS.textInverse,
    fontSize: 11,
    fontWeight: '800',
  },
  discountBadge: {
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.md,
    backgroundColor: COLORS.discountBadge,
    paddingHorizontal: SPACING.md,
    paddingVertical: 5,
    borderRadius: RADIUS.xs,
  },
  discountBadgeText: {
    color: COLORS.textInverse,
    fontSize: 12,
    fontWeight: '800',
  },
  thumbnailsRow: {
    flexDirection: 'row',
    padding: SPACING.md,
    gap: SPACING.sm,
    backgroundColor: COLORS.surface,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.sm,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  thumbnailActive: {
    borderColor: COLORS.primary,
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  infoSection: {
    padding: SPACING.lg,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  brandTag: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
    textTransform: 'uppercase',
  },
  modelTag: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  productTitle: {
    ...TYPOGRAPHY.h1,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  productMarathiTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  ratingStockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  ratingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warningLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  ratingNumber: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  reviewsText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  stockPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  stockPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  priceContainer: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: SPACING.lg,
  },
  quotePriceTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
  },
  quoteExplanation: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginTop: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: SPACING.md,
  },
  currentPrice: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  mrpPrice: {
    fontSize: 16,
    color: COLORS.textMuted,
    textDecorationLine: 'line-through',
  },
  savingsTag: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.accent,
    marginTop: 4,
  },
  taxNote: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  cardBlock: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: SPACING.lg,
  },
  blockTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  descriptionText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  featureText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    flex: 1,
  },
  specTable: {
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  specRow: {
    flexDirection: 'row',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  specRowEven: {
    backgroundColor: COLORS.surfaceSecondary,
  },
  specRowOdd: {
    backgroundColor: COLORS.surface,
  },
  specLabel: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  specValue: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  warrantyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accentLight,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  warrantyContent: {
    flex: 1,
  },
  warrantyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.accent,
    marginBottom: 2,
  },
  warrantySub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  fullQuoteBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: RADIUS.md,
    gap: 8,
  },
  fullQuoteBtnText: {
    color: COLORS.textInverse,
    fontSize: 15,
    fontWeight: '700',
  },
  bottomBarLeft: {
    flexDirection: 'column',
    gap: 4,
  },
  qtyLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  bottomBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  addCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    gap: SPACING.xs,
  },
  addCartBtnDisabled: {
    backgroundColor: COLORS.surfaceSecondary,
  },
  addCartBtnText: {
    color: COLORS.textInverse,
    fontSize: 14,
    fontWeight: '700',
  },
  inquireBtn: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
