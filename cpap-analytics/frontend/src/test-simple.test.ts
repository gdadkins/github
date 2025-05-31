/**
 * Simple test to verify Jest setup works
 */

describe('Simple Tests', () => {
  it('should run basic arithmetic tests', () => {
    expect(2 + 2).toBe(4);
    expect(5 * 3).toBe(15);
    expect(10 / 2).toBe(5);
  });

  it('should handle string operations', () => {
    const text = 'CPAP Analytics';
    expect(text.length).toBe(14);
    expect(text.toLowerCase()).toBe('cpap analytics');
    expect(text).toContain('CPAP');
  });

  it('should work with objects', () => {
    const data = { total_sessions: 30, avg_ahi: 4.2 };
    expect(data.total_sessions).toBe(30);
    expect(typeof data.avg_ahi).toBe('number');
  });

  it('should handle arrays', () => {
    const trends = [
      { date: '2025-01-01', ahi: 3.2 },
      { date: '2025-01-02', ahi: 4.1 }
    ];
    expect(trends).toHaveLength(2);
    expect(trends[0].ahi).toBe(3.2);
  });
});