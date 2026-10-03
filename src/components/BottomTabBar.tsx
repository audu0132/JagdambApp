import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { TabScreen } from '../types/product';

interface TabItem {
  id: TabScreen;
  labelKey: 'tabHome' | 'tabCategories' | 'tabQuote' | 'tabWishlist' | 'tabCart' | 'tabAccount';
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
  route: string;
}

const TABS: TabItem[] = [
  {
    id: 'home',
    labelKey: 'tabHome',
    icon: 'home-outline',
    activeIcon: 'home',
    route: '/(tabs)',
  },
  {
    id: 'categories',
    labelKey: 'tabCategories',
    icon: 'grid-outline',
    activeIcon: 'grid',
    route: '/(tabs)/categories',
  },
  {
    id: 'quote',
    labelKey: 'tabQuote',
    icon: 'document-text-outline',
    activeIcon: 'document-text',
    route: '/(tabs)/quote',
  },
  {
    id: 'wishlist',
    labelKey: 'tabWishlist',
    icon: 'heart-outline',
    activeIcon: 'heart',
    route: '/(tabs)/wishlist',
  },
  {
    id: 'cart',
    labelKey: 'tabCart',
    icon: 'cart-outline',
    activeIcon: 'cart',
    route: '/(tabs)/cart',
  },
  {
    id: 'account',
    labelKey: 'tabAccount',
    icon: 'person-outline',
    activeIcon: 'person',
    route: '/(tabs)/account',
  },
];

export const BottomTabBar: React.FC = () => {
  const { activeTab, setActiveTab, setSelectedProduct, getCartCount, wishlist } = useApp();
  const { t } = useLanguage();
  const cartCount = getCartCount();
  const wishlistCount = wishlist.length;

  const handleTabPress = (tab: TabItem) => {
    setSelectedProduct(null);
    setActiveTab(tab.id);
    try {
      router.push(tab.route as any);
    } catch (e) {
      // In case outside router
    }
  };

  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        let badgeCount = 0;
        if (tab.id === 'cart') badgeCount = cartCount;
        if (tab.id === 'wishlist') badgeCount = wishlistCount;

        const label = t(tab.labelKey);

        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tabBtn}
            onPress={() => handleTabPress(tab)}
            activeOpacity={0.7}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={`${label} tab`}
          >
            <View style={styles.iconWrapper}>
              <Ionicons
                name={isActive ? tab.activeIcon : tab.icon}
                size={22}
                color={isActive ? COLORS.primary : COLORS.textMuted}
              />
              {badgeCount > 0 && (
                <View
                  style={[
                    styles.badge,
                    tab.id === 'cart' ? styles.cartBadge : styles.wishlistBadge,
                  ]}
                >
                  <Text style={styles.badgeText}>
                    {badgeCount > 99 ? '99+' : badgeCount}
                  </Text>
                </View>
              )}
            </View>

            <Text
              style={[
                styles.tabLabel,
                isActive ? styles.tabLabelActive : styles.tabLabelInactive,
              ]}
              numberOfLines={1}
            >
              {label}
            </Text>

            {isActive && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: 6,
    paddingBottom: 10,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 8,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingVertical: 2,
  },
  iconWrapper: {
    position: 'relative',
    paddingHorizontal: 6,
    marginBottom: 2,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -2,
    borderRadius: RADIUS.full,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: COLORS.surface,
  },
  cartBadge: {
    backgroundColor: COLORS.warning,
  },
  wishlistBadge: {
    backgroundColor: COLORS.discountBadge,
  },
  badgeText: {
    color: COLORS.surface,
    fontSize: 9,
    fontWeight: '800',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 1,
  },
  tabLabelActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  tabLabelInactive: {
    color: COLORS.textMuted,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -8,
    width: 20,
    height: 3,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
  },
});
