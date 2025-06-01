export const STATUS_COLORS = {
  excellent: '#10b981',  // emerald-500
  good: '#3b82f6',       // blue-500
  warning: '#f59e0b',    // amber-500
  danger: '#ef4444',     // red-500
  neutral: '#6b7280'     // gray-500
} as const;

export const getStatusColor = (value: number, thresholds = { excellent: 85, good: 70, warning: 50 }) => {
  if (value >= thresholds.excellent) return STATUS_COLORS.excellent;
  if (value >= thresholds.good) return STATUS_COLORS.good;
  if (value >= thresholds.warning) return STATUS_COLORS.warning;
  return STATUS_COLORS.danger;
};

export const getAHIStatusColor = (ahi: number) => {
  if (ahi < 5) return STATUS_COLORS.excellent;
  if (ahi < 15) return STATUS_COLORS.warning;
  return STATUS_COLORS.danger;
};

export const getComplianceStatusColor = (compliance: number) => {
  return getStatusColor(compliance, { excellent: 90, good: 80, warning: 60 });
};