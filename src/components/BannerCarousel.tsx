import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../constants/theme';
import { useApp } from '../context/AppContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_WIDTH = SCREEN_WIDTH - SPACING.lg * 2;

interface BannerItem {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  actionText: string;
  categoryFilter?: 'milking-machines' | 'spares-accessories' | 'milk-analysers';
  gradientColor: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const BANNERS: BannerItem[] = [
  {
    id: 'b1',
    badge: 'FARM AUTOMATION',
    title: 'Modern Milking Machines',
    subtitle: 'Save 70% milking time & maintain udder health with food-grade SS cans.',
    actionText: 'View Machines',
    categoryFilter: 'milking-machines',
    gradientColor: '#0284C7',
    icon: 'hardware-chip-outline',
  },
  {
    id: 'b2',
    badge: '100% GENUINE SPARES',
    title: 'Pulsators, Liners & Cans',
    subtitle: 'Flat 20%+ Off on high-durability replacement parts & milk cans.',
    actionText: 'Shop Spares',
    categoryFilter: 'spares-accessories',
    gradientColor: '#059669',
    icon: 'construct-outline',
  },
  {
    id: 'b3',
    badge: 'ACCURATE TESTING',
    title: 'Ultrasonic Milk Analysers',
    subtitle: 'Accurate Fat, SNF & Density measurement in 30 seconds.',
    actionText: 'Explore Testers',
    categoryFilter: 'milk-analysers',
    gradientColor: '#7C3AED',
    icon: 'flask-outline',
  },
];

export const BannerCarousel: React.FC = () => {
  const { setSelectedCategory } = useApp();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleBannerPress = (banner: BannerItem) => {
    if (banner.categoryFilter) {
      setSelectedCategory(banner.categoryFilter);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={(e) => {
          const offsetX = e.nativeEvent.contentOffset.x;
          const index = Math.round(offsetX / BANNER_WIDTH);
          if (index !== activeIndex && index >= 0 && index < BANNERS.length) {
            setActiveIndex(index);
          }
        }}
        scrollEventThrottle={16}
      >
        {BANNERS.map((banner) => (
          <TouchableOpacity
            key={banner.id}
            style={[styles.bannerCard, { backgroundColor: banner.gradientColor }]}
            onPress={() => handleBannerPress(banner)}
            activeOpacity={0.9}
          >
            <View style={styles.contentCol}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{banner.badge}</Text>
              </View>
              <Text style={styles.title} numberOfLines={2}>
                {banner.title}
              </Text>
              <Text style={styles.subtitle} numberOfLines={2}>
                {banner.subtitle}
              </Text>
              <View style={styles.actionBtn}>
                <Text style={styles.actionText}>{banner.actionText}</Text>
                <Ionicons name="arrow-forward" size={14} color={COLORS.primaryDark} />
              </View>
            </View>

            <View style={styles.iconContainer}>
              <Ionicons name={banner.icon} size={64} color="rgba(255, 255, 255, 0.22)" />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Pagination dots */}
      <View style={styles.dotsRow}>
        {BANNERS.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === activeIndex ? styles.activeDot : styles.inactiveDot]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.md,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  bannerCard: {
    width: BANNER_WIDTH,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 155,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  contentCol: {
    flex: 1,
    zIndex: 2,
    paddingRight: SPACING.sm,
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
    alignSelf: 'flex-start',
    marginBottom: SPACING.xs,
  },
  badgeText: {
    color: COLORS.textInverse,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textInverse,
    lineHeight: 22,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 16,
    marginBottom: SPACING.md,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  iconContainer: {
    position: 'absolute',
    right: -10,
    bottom: -10,
    zIndex: 1,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: SPACING.sm,
  },
  dot: {
    height: 6,
    borderRadius: RADIUS.full,
  },
  activeDot: {
    width: 20,
    backgroundColor: COLORS.primary,
  },
  inactiveDot: {
    width: 6,
    backgroundColor: COLORS.border,
  },
});
