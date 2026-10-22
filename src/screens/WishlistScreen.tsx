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
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { EmptyState } from '../components/EmptyState';

export const WishlistScreen: React.FC = () => {
  const {
    wishlist,
    removeFromWishlist,
    moveToCartFromWishlist,
    setSelectedProduct,
    setActiveTab,
  } = useApp();

  if (wishlist.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Wishlist</Text>
        </View>
        <EmptyState
          icon="heart-outline"
          title="Your Wishlist is Empty"
          subtitle="Keep track of your favorite milking machines, testing instruments and spares here."
          actionLabel="Browse Dairy Catalog"
          onAction={() => setActiveTab('home')}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Wishlist</Text>
          <Text style={styles.headerSubtitle}>
            {wishlist.length} item{wishlist.length === 1 ? '' : 's'} saved
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.list}>
          {wishlist.map(({ product }) => (
            <View key={product.id} style={styles.card}>
              <TouchableOpacity
                onPress={() => setSelectedProduct(product)}
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: product.image }}
                  style={styles.image}
                  resizeMode="cover"
                />
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
                  onPress={() => setSelectedProduct(product)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.title} numberOfLines={2}>
                    {product.name}
                  </Text>
                </TouchableOpacity>

                <View style={styles.priceRow}>
                  <Text style={styles.price}>
                    ₹{product.price.toLocaleString('en-IN')}
                  </Text>
                  {product.originalPrice > product.price && (
                    <Text style={styles.originalPrice}>
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </Text>
                  )}
                </View>

                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={[
                      styles.moveToCartBtn,
                      !product.inStock && styles.moveToCartBtnDisabled,
                    ]}
                    onPress={() => moveToCartFromWishlist(product)}
                    disabled={!product.inStock}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name="cart-outline"
                      size={16}
                      color={product.inStock ? COLORS.textInverse : COLORS.textMuted}
                    />
                    <Text
                      style={[
                        styles.moveToCartText,
                        !product.inStock && styles.moveToCartTextDisabled,
                      ]}
                    >
                      {product.inStock ? 'Move to Cart' : 'Out of Stock'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
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
    borderBottomColor: COLORS.border,
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
  list: {
    gap: SPACING.md,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    gap: SPACING.md,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceSecondary,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primaryDark,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    lineHeight: 18,
    marginVertical: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: SPACING.sm,
    marginVertical: 2,
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  originalPrice: {
    fontSize: 12,
    color: COLORS.textMuted,
    textDecorationLine: 'line-through',
  },
  actionRow: {
    marginTop: 4,
  },
  moveToCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 7,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.sm,
    gap: 6,
  },
  moveToCartBtnDisabled: {
    backgroundColor: COLORS.surfaceSecondary,
  },
  moveToCartText: {
    color: COLORS.textInverse,
    fontSize: 12,
    fontWeight: '700',
  },
  moveToCartTextDisabled: {
    color: COLORS.textMuted,
  },
});
