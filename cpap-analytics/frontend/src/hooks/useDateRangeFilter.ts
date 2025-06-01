import { useMemo } from 'react';
import { filterDataByDateRange } from '../utils/dateHelpers';
import { DateRangeKey } from '../constants/dashboard';

export const useDateRangeFilter = <T extends { date: string } | { session_date: string }>(
  data: T[] | null,
  dateRange: DateRangeKey
) => {
  return useMemo(() => {
    if (!data) return null;
    return filterDataByDateRange(data as any[], dateRange);
  }, [data, dateRange]);
};