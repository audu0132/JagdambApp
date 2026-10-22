import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { TabScreen } from '../types/product';

interface TabItem {
  id: TabScreen;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
}

const TABS: TabItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: 'home-outline',
    activeIcon: 'home',
  },
  {
    id: 'categories',
    label: 'Categories',
    icon: 'grid-outline',
    activeIcon: 'grid',
  },
  {
    id: 'quote',
    label: 'Enquiry',
    icon: 'document-text-outline',
    activeIcon: 'document-text',
  },
  {
    id: 'wishlist',
    label: 'Wishlist',
    icon: 'heart-outline',
    activeIcon: 'heart',
  },
  {
    id: 'cart',
    label: 'Cart',
    icon: 'cart-outline',
    activeIcon: 'cart',
  },
];

export const BottomTabBar: React.FC = () => {
  const { activeTab, setActiveTab, setSelectedProduct, getCartCount, wishlist } = useApp();
  const cartCount = getCartCount();
  const wishlistCount = wishlist.length;

  const handleTabPress = (tabId: TabScreen) => {
    setSelectedProduct(null);
    setActiveTab(tabId);
  };

  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        let badgeCount = 0;
        if (tab.id === 'cart') badgeCount = cartCount;
        if (tab.id === 'wishlist') badgeCount = wishlistCount;

        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tabBtn}
            onPress={() => handleTabPress(tab.id)}
            activeOpacity={0.7}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={`${tab.label} tab`}
          >
            <View style={styles.iconWrapper}>
              <Ionicons
                name={isActive ? tab.activeIcon : tab.icon}
                size={22}
                color={isActive ? COLORS.primary : COLORS.textSecondary}
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
            >
              {tab.label}
            </Text>
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
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.xs,
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 8,
  },
  tabBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 2,
  },
  iconWrapper: {
    position: 'relative',
    width: 28,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
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
    backgroundColor: COLORS.accent,
  },
  wishlistBadge: {
    backgroundColor: COLORS.discountBadge,
  },
  badgeText: {
    color: COLORS.textInverse,
    fontSize: 9,
    fontWeight: '800',
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 2,
  },
  tabLabelActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  tabLabelInactive: {
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
});
