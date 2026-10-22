import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../constants/theme';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const { setActiveTab, getCartCount, wishlist, setSelectedProduct, user } = useApp();
  const cartCount = getCartCount();
  const wishlistCount = wishlist.length;

  const handleLogoPress = () => {
    setSelectedProduct(null);
    setActiveTab('home');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.brandContainer}
        onPress={handleLogoPress}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Jagdamb Enterprises Home"
      >
        <View style={styles.logoBadge}>
          <Ionicons name="hardware-chip" size={18} color={COLORS.surface} />
        </View>
        <View>
          <View style={styles.titleRow}>
            <Text style={styles.brandTitle}>JAGDAMB</Text>
            <Text style={styles.brandSub}>ENTERPRISES</Text>
          </View>
          <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={11} color={COLORS.primary} />
            <Text style={styles.locationText}>Baramati • Dairy Solutions</Text>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.actions}>
        {/* Account / Profile Button */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => {
            setSelectedProduct(null);
            setActiveTab('account');
          }}
          activeOpacity={0.7}
          accessibilityLabel="Farmer Account"
          accessibilityRole="button"
        >
          <Ionicons name="person-outline" size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>

        {/* Wishlist Button */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => {
            setSelectedProduct(null);
            setActiveTab('wishlist');
          }}
          activeOpacity={0.7}
          accessibilityLabel={`Wishlist, ${wishlistCount} items`}
          accessibilityRole="button"
        >
          <Ionicons name="heart-outline" size={22} color={COLORS.textPrimary} />
          {wishlistCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{wishlistCount > 99 ? '99+' : wishlistCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Cart Button */}
        <TouchableOpacity
          style={[styles.iconButton, styles.cartButton]}
          onPress={() => {
            setSelectedProduct(null);
            setActiveTab('cart');
          }}
          activeOpacity={0.7}
          accessibilityLabel={`Cart, ${cartCount} items`}
          accessibilityRole="button"
        >
          <Ionicons name="cart-outline" size={22} color={COLORS.surface} />
          {cartCount > 0 && (
            <View style={[styles.badge, styles.cartBadge]}>
              <Text style={styles.badgeText}>{cartCount > 99 ? '99+' : cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primaryDark,
    letterSpacing: 0.5,
  },
  brandSub: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    letterSpacing: 0.2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 1,
  },
  locationText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cartButton: {
    backgroundColor: COLORS.primary,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: COLORS.discountBadge,
    borderRadius: RADIUS.full,
    minWidth: 17,
    height: 17,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: COLORS.surface,
  },
  cartBadge: {
    backgroundColor: COLORS.accent,
  },
  badgeText: {
    color: COLORS.textInverse,
    fontSize: 9,
    fontWeight: '700',
  },
});
