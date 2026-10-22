export const COLORS = {
  // Brand Colors (Jagdamb Enterprises Specified Branding)
  primary: '#1769AA',      // Primary Blue
  primaryDark: '#0D47A1',  // Deep Marine Blue
  primaryLight: '#DFF1FF', // Specified Light Blue
  accent: '#059669',       // Clean Agricultural Green
  accentLight: '#D1FAE5',

  // UI Neutrals (White backgrounds & Dark readable text)
  background: '#F8FAFC',   // Off-white Slate
  surface: '#FFFFFF',      // Crisp White Surface
  surfaceSecondary: '#F1F5F9', // Subtle Slate 100
  border: '#CBD5E1',       // Crisp Industrial Border
  borderLight: '#E2E8F0',
  borderFocus: '#1769AA',

  // High Readability Typography
  textPrimary: '#0F172A',  // Dark Readable Slate 900
  textSecondary: '#334155',// Slate 700
  textMuted: '#64748B',    // Slate 500
  textInverse: '#FFFFFF',

  // Badges & Status
  success: '#10B981',      // In stock
  successLight: '#DCFCE7',
  warning: '#F59E0B',      // Low stock / Attention
  warningLight: '#FEF3C7',
  danger: '#DC2626',       // Out of stock
  dangerLight: '#FEE2E2',
  quoteBadge: '#0284C7',   // Price on Request Badge
  discountBadge: '#B91C1C',

  // Ratings
  star: '#F59E0B',

  // Shadows
  shadow: 'rgba(15, 23, 42, 0.08)',
  overlay: 'rgba(15, 23, 42, 0.6)',
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
    fontWeight: '600' as const,
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
