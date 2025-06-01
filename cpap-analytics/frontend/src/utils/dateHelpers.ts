/* ============================================
   Date Utility Functions - Reusable Date Logic
   ============================================ */

import { DATE_RANGES } from '../constants/medical';

export type DateRangePreset = '7d' | '30d' | '90d' | '180d' | '365d' | 'all';

export const getDaysFromRange = (range: DateRangePreset): number => {
  switch (range) {
    case '7d': return DATE_RANGES.SEVEN_DAYS;
    case '30d': return DATE_RANGES.THIRTY_DAYS;
    case '90d': return DATE_RANGES.NINETY_DAYS;
    case '180d': return DATE_RANGES.SIX_MONTHS;
    case '365d': return DATE_RANGES.ONE_YEAR;
    case 'all': return Infinity;
    default: return DATE_RANGES.THIRTY_DAYS;
  }
};

export const getDateRangeLabel = (range: DateRangePreset): string => {
  switch (range) {
    case '7d': return 'Last 7 Days';
    case '30d': return 'Last 30 Days';
    case '90d': return 'Last 90 Days';
    case '180d': return 'Last 6 Months';
    case '365d': return 'Last Year';
    case 'all': return 'All Time';
    default: return 'Last 30 Days';
  }
};

export const filterDataByDateRange = <T extends { date: string }>(
  data: T[], 
  range: DateRangePreset
): T[] => {
  const maxDays = getDaysFromRange(range);
  if (maxDays === Infinity) return data;
  
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - maxDays);
  
  return data.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate >= cutoffDate;
  });
};

export const formatSessionDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

export const getTimeOfDay = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
};