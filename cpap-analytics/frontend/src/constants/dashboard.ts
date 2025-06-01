export const DATE_RANGES = {
  '7d': { label: '7 Days', days: 7 },
  '30d': { label: '30 Days', days: 30 },
  '90d': { label: '90 Days', days: 90 },
  '180d': { label: '6 Months', days: 180, isPremium: true },
  '365d': { label: '1 Year', days: 365, isPremium: true },
  'all': { label: 'All Time', days: null, isPremium: true }
} as const;

export const LAYOUT_TYPES = {
  DEFAULT: 'default',
  COMPLIANCE_FOCUSED: 'compliance-focused',
  CLINICAL_DETAIL: 'clinical-detail',
  MINIMALIST: 'minimalist',
  DATA_ENTHUSIAST: 'data-enthusiast'
} as const;

export const WIDGET_CATEGORIES = {
  CRITICAL: 'critical',
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  OPTIONAL: 'optional'
} as const;

export const WIDGET_SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
  FULL: 'full'
} as const;

export type DateRangeKey = keyof typeof DATE_RANGES;
export type LayoutType = typeof LAYOUT_TYPES[keyof typeof LAYOUT_TYPES];
export type WidgetCategory = typeof WIDGET_CATEGORIES[keyof typeof WIDGET_CATEGORIES];
export type WidgetSize = typeof WIDGET_SIZES[keyof typeof WIDGET_SIZES];