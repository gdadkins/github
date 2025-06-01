export const CSS_CLASSES = {
  CARD: 'bg-white rounded-lg shadow-md p-6',
  BUTTON_PRIMARY: 'btn btn-primary',
  BUTTON_SECONDARY: 'btn btn-secondary',
  LOADING_CONTAINER: 'flex items-center justify-center p-8',
  ERROR_CONTAINER: 'text-center p-8 text-red-600',
  EMPTY_STATE: 'flex flex-col items-center justify-center p-8 text-center'
} as const;

export const CHART_MARGINS = {
  DEFAULT: { top: 20, right: 30, bottom: 20, left: 20 },
  WITH_LEGEND: { top: 20, right: 80, bottom: 20, left: 20 },
  COMPACT: { top: 10, right: 10, bottom: 10, left: 10 }
} as const;

export const CHART_DIMENSIONS = {
  DEFAULT_HEIGHT: 300,
  COMPACT_HEIGHT: 200,
  LARGE_HEIGHT: 400
} as const;