/* ============================================
   Medical Constants - CPAP Therapy Standards
   ============================================ */

// AHI (Apnea-Hypopnea Index) Thresholds
export const AHI_THRESHOLDS = {
  EXCELLENT: 5,
  MILD: 15,
  MODERATE: 30
} as const;

// Compliance Standards
export const COMPLIANCE = {
  TARGET_RATE: 70, // Minimum compliance percentage
  MINIMUM_HOURS: 4, // Minimum hours per night
  TARGET_NIGHTS: 21 // Out of 30 nights
} as const;

// Sleep Quality Metrics
export const SLEEP_QUALITY = {
  EXCELLENT_SCORE: 80,
  GOOD_SCORE: 60,
  POOR_THRESHOLD: 40
} as const;

// Pressure Settings (cmH2O)
export const PRESSURE_SETTINGS = {
  MIN_PRESSURE: 4,
  MAX_PRESSURE: 20,
  DEFAULT_RAMP_TIME: 20 // minutes
} as const;

// Leak Rate Thresholds (L/min)
export const LEAK_RATE = {
  EXCELLENT: 24,
  ACCEPTABLE: 36,
  HIGH_THRESHOLD: 50
} as const;

// Date Range Configurations
export const DATE_RANGES = {
  SEVEN_DAYS: 7,
  THIRTY_DAYS: 30,
  NINETY_DAYS: 90,
  SIX_MONTHS: 180,
  ONE_YEAR: 365
} as const;

// Status Classifications
export const STATUS_TYPES = {
  EXCELLENT: 'excellent',
  GOOD: 'good',
  WARNING: 'warning',
  DANGER: 'danger'
} as const;

// Helper Functions
export const getAHIStatus = (ahi: number): string => {
  if (ahi < AHI_THRESHOLDS.EXCELLENT) return STATUS_TYPES.EXCELLENT;
  if (ahi < AHI_THRESHOLDS.MILD) return STATUS_TYPES.WARNING;
  return STATUS_TYPES.DANGER;
};

export const getComplianceStatus = (rate: number): string => {
  return rate >= COMPLIANCE.TARGET_RATE ? STATUS_TYPES.EXCELLENT : STATUS_TYPES.WARNING;
};

export const getLeakRateStatus = (rate: number): string => {
  if (rate <= LEAK_RATE.EXCELLENT) return STATUS_TYPES.EXCELLENT;
  if (rate <= LEAK_RATE.ACCEPTABLE) return STATUS_TYPES.GOOD;
  return STATUS_TYPES.WARNING;
};