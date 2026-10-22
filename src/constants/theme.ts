export const COLORS = {
  // Brand Colors (Jagdamb Enterprises Dairy Tech Palette)
  primary: '#0284C7',      // Sky/Cerulean Blue
  primaryDark: '#0369A1',  // Deep Marine
  primaryLight: '#E0F2FE', // Light Ice Blue
  accent: '#059669',       // Clean Green (Quality & Agriculture)
  accentLight: '#D1FAE5',

  // UI Neutrals
  background: '#F8FAFC',   // Off-white / Slate 50
  surface: '#FFFFFF',      // Pure White Card
  surfaceSecondary: '#F1F5F9', // Light Gray Fill
  border: '#E2E8F0',       // Subtle Border
  borderFocus: '#0284C7',

  // Typography
  textPrimary: '#0F172A',  // Slate 900
  textSecondary: '#64748B',// Slate 500
  textMuted: '#94A3B8',    // Slate 400
  textInverse: '#FFFFFF',

  // Status & Badges
  success: '#10B981',      // In stock
  successLight: '#DCFCE7',
  warning: '#F59E0B',      // Low stock
  warningLight: '#FEF3C7',
  danger: '#EF4444',       // Out of stock / Discount
  dangerLight: '#FEE2E2',
  discountBadge: '#DC2626',

  // Rating
  star: '#F59E0B',

  // Shadows / Overlay
  shadow: 'rgba(15, 23, 42, 0.08)',
  overlay: 'rgba(15, 23, 42, 0.5)',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const TYPOGRAPHY = {
  hero: {
    fontSize: 26,
    fontWeight: '700' as const,
    lineHeight: 32,
  },
  h1: {
    fontSize: 22,
    fontWeight: '700' as const,
    lineHeight: 28,
  },
  h2: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  h3: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 22,
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  captionMedium: {
    fontSize: 12,
    fontWeight: '600' as const,
    lineHeight: 16,
  },
};
