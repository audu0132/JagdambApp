import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { openWhatsAppEnquiry } from '../lib/supabaseService';

export const Header: React.FC = () => {
  const { setActiveTab, getCartCount, wishlist, setSelectedProduct } = useApp();
  const { language, toggleLanguage } = useLanguage();
  const cartCount = getCartCount();
  const wishlistCount = wishlist.length;

  const navigateTo = (tab: 'home' | 'account' | 'wishlist' | 'cart') => {
    setSelectedProduct(null);
    setActiveTab(tab);
    try {
      if (tab === 'home') router.push('/(tabs)');
      else if (tab === 'account') router.push('/(tabs)/account');
      else if (tab === 'wishlist') router.push('/(tabs)/wishlist');
      else if (tab === 'cart') router.push('/(tabs)/cart');
    } catch (_e) {
      // In case outside router
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.brandContainer}
        onPress={() => navigateTo('home')}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Jagdamb Enterprises Home"
      >
        <View style={styles.logoBadge}>
          <Image
            source={require('../../assets/je-logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <View>
          <View style={styles.titleRow}>
            <Text style={styles.brandTitle}>
              {language === 'mr' ? 'जगदंब' : 'JAGDAMB'}
            </Text>
            <Text style={styles.brandSub}>
              {language === 'mr' ? 'एंटरप्रायझेस' : 'ENTERPRISES'}
            </Text>
          </View>
          <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={11} color={COLORS.primary} />
            <Text style={styles.locationText}>
              {language === 'mr' ? 'बारामती • डेअरी सोल्युशन्स' : 'Baramati • Dairy Solutions'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.actions}>
        {/* Language Switcher Pill */}
        <TouchableOpacity
          style={styles.langPill}
          onPress={toggleLanguage}
          activeOpacity={0.7}
          accessibilityLabel="Switch Language"
          accessibilityRole="button"
        >
          <Ionicons name="language" size={13} color={COLORS.primary} />
          <Text style={styles.langText}>
            {language === 'en' ? 'मराठी' : 'ENG'}
          </Text>
        </TouchableOpacity>

        {/* WhatsApp Helpline Quick Button */}
        <TouchableOpacity
          style={styles.whatsappIconBtn}
          onPress={() => openWhatsAppEnquiry()}
          activeOpacity={0.7}
          accessibilityLabel="WhatsApp Support"
          accessibilityRole="button"
        >
          <Ionicons name="logo-whatsapp" size={19} color="#25D366" />
        </TouchableOpacity>

        {/* Wishlist Button */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigateTo('wishlist')}
          activeOpacity={0.7}
          accessibilityLabel={`Wishlist, ${wishlistCount} items`}
          accessibilityRole="button"
        >
          <Ionicons name={wishlistCount > 0 ? 'heart' : 'heart-outline'} size={20} color={wishlistCount > 0 ? COLORS.discountBadge : COLORS.textPrimary} />
          {wishlistCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{wishlistCount > 99 ? '99+' : wishlistCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Cart Button */}
        <TouchableOpacity
          style={[styles.iconButton, styles.cartButton]}
          onPress={() => navigateTo('cart')}
          activeOpacity={0.7}
          accessibilityLabel={`Cart, ${cartCount} items`}
          accessibilityRole="button"
        >
          <Ionicons name="cart-outline" size={20} color={COLORS.surface} />
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
    flex: 1,
  },
  logoBadge: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  logoImage: {
    width: 32,
    height: 32,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  brandSub: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 1,
  },
  locationText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  langText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  whatsappIconBtn: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.full,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.md,
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
    top: -4,
    right: -4,
    backgroundColor: COLORS.danger,
    borderRadius: RADIUS.full,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  cartBadge: {
    backgroundColor: COLORS.warning,
  },
  badgeText: {
    color: COLORS.surface,
    fontSize: 10,
    fontWeight: '800',
  },
});
