export const generateMockData = () => ({
  currentSession: {
    leakRate: 18,
    duration: 7.5,
    pressure: 10.2
  },
  maskInfo: {
    type: 'Full-Face',
    model: 'ResMed AirFit F20',
    size: 'Medium',
    purchaseDate: '2023-08-15',
    usageHours: 890
  },
  therapyData: {
    ahi: 3.2,
    compliance: 92,
    leakRate: 22,
    usageHours: 7.2,
    pressure: 9.8,
    events: {
      central: 0.8,
      obstructive: 1.9,
      hypopnea: 0.5
    }
  }
});