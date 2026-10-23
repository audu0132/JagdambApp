import React, { useState } from 'react';
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
import { QuantityControl } from '../components/QuantityControl';
import { openWhatsAppEnquiry, callBaramatiShowroom } from '../lib/supabaseService';
import { Product } from '../types/product';

interface ProductDetailsScreenProps {
  product?: Product;
  onBack?: () => void;
}

export const ProductDetailsScreen: React.FC<ProductDetailsScreenProps> = ({
  product: propProduct,
  onBack,
}) => {
  const {
    selectedProduct: contextProduct,
    setSelectedProduct,
    addToCart,
    cart,
    isInWishlist,
    toggleWishlist,
    setActiveTab,
    requestProductQuote,
  } = useApp();
  const { language, t } = useLanguage();

  const product = propProduct || contextProduct;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [localQuantity, setLocalQuantity] = useState<number>(1);

  if (!product) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Equipment not found</Text>
        <TouchableOpacity
          style={styles.backHomeBtn}
          onPress={() => {
            if (onBack) onBack();
            else {
              setSelectedProduct(null);
              try { router.back(); } catch (e) {}
            }
          }}
        >
          <Text style={styles.backHomeBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isWishlisted = isInWishlist(product.id);
  const cartItem = cart.find((item) => item.product.id === product.id);
  const currentImageUri = selectedImage || product.image;
  const isOnRequest = product.priceType === 'on-request';

  const imagesList = [product.image, ...(product.additionalImages || [])];

  const displayName = language === 'mr' && product.marathiName ? product.marathiName : product.name;
  const secondaryName = language === 'mr' ? product.name : product.marathiName;

  const formattedPrice = product.price
    ? `₹${product.price.toLocaleString('en-IN')}`
    : t('priceOnRequest');
  const formattedOriginalPrice = product.originalPrice
    ? `₹${product.originalPrice.toLocaleString('en-IN')}`
    : null;
  const savings =
    product.originalPrice && product.price
      ? product.originalPrice - product.price
      : 0;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      setSelectedProduct(null);
      try {
        router.back();
      } catch (e) {
        // Fallback
      }
    }
  };

  const handleAddToCart = () => {
    addToCart(product, localQuantity);
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Back to products"
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {product.brand}
        </Text>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => toggleWishlist(product)}
            accessibilityLabel={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Ionicons
              name={isWishlisted ? 'heart' : 'heart-outline'}
              size={22}
              color={isWishlisted ? COLORS.discountBadge : COLORS.textPrimary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => {
              setSelectedProduct(null);
              setActiveTab('cart');
              try { router.push('/(tabs)/cart'); } catch (e) {}
            }}
            accessibilityLabel="Go to cart"
          >
            <Ionicons name="cart-outline" size={22} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Main Image Gallery */}
        <View style={styles.imageSection}>
          <Image source={{ uri: currentImageUri }} style={styles.mainImage} resizeMode="cover" />

          {isOnRequest ? (
            <View style={styles.quoteBadge}>
              <Text style={styles.quoteBadgeText}>
                {language === 'mr' ? 'मागणीनुसार दर' : 'QUOTE ON REQUEST'}
              </Text>
            </View>
          ) : product.discountPercent && product.discountPercent > 0 ? (
            <View style={styles.discountBadge}>
              <Text style={styles.discountBadgeText}>
                {product.discountPercent}% OFF
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
            <Text style={styles.brandTag}>{product.brand}</Text>
            <Text style={styles.modelTag}>Model: {product.modelNumber}</Text>
          </View>

          <Text style={styles.productTitle}>{displayName}</Text>
          {secondaryName && (
            <Text style={styles.productSecondaryTitle}>{secondaryName}</Text>
          )}

          {/* Ratings & Stock Availability */}
          <View style={styles.ratingStockRow}>
            <View style={styles.ratingChip}>
              <Ionicons name="star" size={14} color={COLORS.star} />
              <Text style={styles.ratingNumber}>{product.rating.toFixed(1)}</Text>
              <Text style={styles.reviewsText}>
                ({product.reviewCount} {t('reviews')})
              </Text>
            </View>

            <View
              style={[
                styles.stockPill,
                {
                  backgroundColor: product.inStock
                    ? COLORS.successLight
                    : COLORS.dangerLight,
                },
              ]}
            >
              <Ionicons
                name={product.inStock ? 'checkmark-circle' : 'close-circle'}
                size={14}
                color={product.inStock ? COLORS.success : COLORS.danger}
              />
              <Text
                style={[
                  styles.stockPillText,
                  { color: product.inStock ? COLORS.success : COLORS.danger },
                ]}
              >
                {product.inStock ? t('inStock') : t('outOfStock')}
              </Text>
            </View>
          </View>

          {/* Pricing Box */}
          <View style={styles.priceContainer}>
            {isOnRequest ? (
              <View>
                <View style={styles.priceRow}>
                  <Text style={styles.quotePriceTitle}>{t('priceOnRequest')}</Text>
                </View>
                <Text style={styles.quoteExplanation}>
                  {language === 'mr'
                    ? 'मोठ्या क्षमतेच्या बीएमसी कुलिंग टँक व पाईपलाईन मिल्किंग सिस्टीमसाठी आपल्या गोठ्यातील जनावरांची संख्या, शेडची रचना व वीज पुरवठ्यानुसार अचूक कोटेशन तयार केले जाते.'
                    : 'Commercial milk cooling & pipeline parlour systems require custom sizing based on your farm herd count, shed layout, and electrical phase. Submit a quotation enquiry for a custom engineered proposal.'}
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
                    {t('save')} ₹{savings.toLocaleString('en-IN')} ({product.discountPercent}% off MRP)
                  </Text>
                )}
                <Text style={styles.taxNote}>
                  {language === 'mr'
                    ? '*जीएसटी करासह. बारामती शोरूममधून थेट डिलिव्हरी उपलब्ध.'
                    : '*Inclusive of GST. Delivery available in Baramati & across Maharashtra.'}
                </Text>
              </View>
            )}
          </View>

          {/* WhatsApp Direct Enquiry Bar */}
          <View style={styles.contactBar}>
            <TouchableOpacity
              style={styles.whatsappDetailBtn}
              onPress={() => openWhatsAppEnquiry(product.name, product.modelNumber)}
              activeOpacity={0.8}
            >
              <Ionicons name="logo-whatsapp" size={18} color="#FFFFFF" />
              <Text style={styles.whatsappDetailBtnText}>{t('whatsappEnquiry')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.callDetailBtn}
              onPress={callBaramatiShowroom}
              activeOpacity={0.8}
            >
              <Ionicons name="call" size={17} color={COLORS.primary} />
              <Text style={styles.callDetailBtnText}>{t('callShowroom')}</Text>
            </TouchableOpacity>
          </View>

          {/* Description */}
          <View style={styles.cardBlock}>
            <Text style={styles.blockTitle}>
              {language === 'mr' ? 'उपकरण माहिती' : 'Equipment Description'}
            </Text>
            <Text style={styles.descriptionText}>{product.description}</Text>
          </View>

          {/* Key Features */}
          <View style={styles.cardBlock}>
            <Text style={styles.blockTitle}>{t('keyFeatures')}</Text>
            {product.features.map((feature, i) => (
              <View key={i} style={styles.featureItem}>
                <Ionicons name="checkmark-done" size={18} color={COLORS.primary} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          {/* Technical Specifications */}
          <View style={styles.cardBlock}>
            <Text style={styles.blockTitle}>{t('specifications')}</Text>
            <View style={styles.specTable}>
              {product.specifications.map((spec, i) => (
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
              <Text style={styles.warrantyTitle}>{product.warranty}</Text>
              <Text style={styles.warrantySub}>{t('genuineSubtitle')}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Action Bar */}
      <View style={styles.bottomBar}>
        {isOnRequest ? (
          <TouchableOpacity
            style={styles.fullQuoteBtn}
            onPress={() => requestProductQuote(product)}
            activeOpacity={0.8}
          >
            <Ionicons name="document-text" size={20} color={COLORS.textInverse} />
            <Text style={styles.fullQuoteBtnText}>{t('requestQuote')}</Text>
          </TouchableOpacity>
        ) : (
          <>
            <View style={styles.bottomBarLeft}>
              <Text style={styles.qtyLabel}>
                {language === 'mr' ? 'प्रमाण:' : 'Qty:'}
              </Text>
              <QuantityControl
                quantity={localQuantity}
                onIncrement={() => setLocalQuantity((q) => q + 1)}
                onDecrement={() => setLocalQuantity((q) => Math.max(1, q - 1))}
                min={1}
                max={product.stockCount || 10}
                size="medium"
              />
            </View>

            <View style={styles.bottomBarRight}>
              <TouchableOpacity
                style={[
                  styles.addCartBtn,
                  !product.inStock && styles.addCartBtnDisabled,
                ]}
                onPress={handleAddToCart}
                disabled={!product.inStock}
                activeOpacity={0.8}
              >
                <Ionicons name="cart" size={18} color={COLORS.textInverse} />
                <Text style={styles.addCartBtnText}>
                  {cartItem
                    ? language === 'mr'
                      ? `कार्टमध्ये (${cartItem.quantity})`
                      : `In Cart (${cartItem.quantity})`
                    : t('addToCart')}
                </Text>
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
  },
  backHomeBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
  },
  backHomeBtnText: {
    color: COLORS.textInverse,
    fontWeight: '700',
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
    gap: 12,
  },
  headerIconBtn: {
    padding: SPACING.xs,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  imageSection: {
    position: 'relative',
    width: '100%',
    height: 300,
    backgroundColor: COLORS.surfaceSecondary,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  quoteBadge: {
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.md,
    backgroundColor: COLORS.quoteBadge,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
  },
  quoteBadgeText: {
    color: COLORS.surface,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  discountBadge: {
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.md,
    backgroundColor: COLORS.discountBadge,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
  },
  discountBadgeText: {
    color: COLORS.surface,
    fontSize: 11,
    fontWeight: '800',
  },
  thumbnailsRow: {
    position: 'absolute',
    bottom: SPACING.md,
    left: SPACING.md,
    right: SPACING.md,
    flexDirection: 'row',
    gap: 8,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: RADIUS.sm,
    borderWidth: 2,
    borderColor: COLORS.surface,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  brandTag: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modelTag: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  productTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    lineHeight: 26,
    marginBottom: 4,
  },
  productSecondaryTitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: 10,
    fontWeight: '500',
  },
  ratingStockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  ratingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.xs,
    gap: 4,
  },
  ratingNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
  },
  reviewsText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  stockPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  stockPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  priceContainer: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: SPACING.md,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
  },
  currentPrice: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  mrpPrice: {
    fontSize: 15,
    color: COLORS.textMuted,
    textDecorationLine: 'line-through',
  },
  quotePriceTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary,
  },
  quoteExplanation: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 19,
    marginTop: 6,
  },
  savingsTag: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.accent,
    marginTop: 4,
  },
  taxNote: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  contactBar: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: SPACING.md,
  },
  whatsappDetailBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#25D366',
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    gap: 6,
  },
  whatsappDetailBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  callDetailBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  callDetailBtnText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  cardBlock: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: SPACING.md,
  },
  blockTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  descriptionText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },
  featureText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  specTable: {
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
  },
  specRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
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
    flex: 1.2,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  warrantyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accentLight,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    gap: 12,
    marginBottom: SPACING.md,
  },
  warrantyContent: {
    flex: 1,
  },
  warrantyTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#065F46',
  },
  warrantySub: {
    fontSize: 11,
    color: '#047857',
    marginTop: 2,
    lineHeight: 15,
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
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  bottomBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: SPACING.md,
  },
  qtyLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  bottomBarRight: {
    flex: 1,
  },
  addCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    gap: 8,
  },
  addCartBtnDisabled: {
    backgroundColor: COLORS.surfaceSecondary,
  },
  addCartBtnText: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: '700',
  },
  fullQuoteBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryDark,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    gap: 8,
  },
  fullQuoteBtnText: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: '700',
  },
});
