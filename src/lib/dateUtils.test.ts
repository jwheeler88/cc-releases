import { describe, it, expect } from 'vitest';
import { formatReleaseDate } from './dateUtils';

describe('formatReleaseDate', () => {
  it('formats valid ISO 8601 date correctly', () => {
    expect(formatReleaseDate('2025-01-15T10:30:00Z')).toBe('Jan 15, 2025');
  });

  it('formats date with different month', () => {
    expect(formatReleaseDate('2024-12-25T00:00:00Z')).toBe('Dec 25, 2024');
  });

  it('handles single digit day without leading zero', () => {
    expect(formatReleaseDate('2025-03-05T12:00:00Z')).toBe('Mar 5, 2025');
  });

  it('handles last day of month', () => {
    expect(formatReleaseDate('2025-01-31T23:59:59Z')).toBe('Jan 31, 2025');
  });

  it('handles leap year date', () => {
    expect(formatReleaseDate('2024-02-29T00:00:00Z')).toBe('Feb 29, 2024');
  });

  it('handles all months correctly', () => {
    expect(formatReleaseDate('2025-01-01T00:00:00Z')).toBe('Jan 1, 2025');
    expect(formatReleaseDate('2025-02-01T00:00:00Z')).toBe('Feb 1, 2025');
    expect(formatReleaseDate('2025-03-01T00:00:00Z')).toBe('Mar 1, 2025');
    expect(formatReleaseDate('2025-04-01T00:00:00Z')).toBe('Apr 1, 2025');
    expect(formatReleaseDate('2025-05-01T00:00:00Z')).toBe('May 1, 2025');
    expect(formatReleaseDate('2025-06-01T00:00:00Z')).toBe('Jun 1, 2025');
    expect(formatReleaseDate('2025-07-01T00:00:00Z')).toBe('Jul 1, 2025');
    expect(formatReleaseDate('2025-08-01T00:00:00Z')).toBe('Aug 1, 2025');
    expect(formatReleaseDate('2025-09-01T00:00:00Z')).toBe('Sep 1, 2025');
    expect(formatReleaseDate('2025-10-01T00:00:00Z')).toBe('Oct 1, 2025');
    expect(formatReleaseDate('2025-11-01T00:00:00Z')).toBe('Nov 1, 2025');
    expect(formatReleaseDate('2025-12-01T00:00:00Z')).toBe('Dec 1, 2025');
  });

  it('returns empty string for invalid date string', () => {
    expect(formatReleaseDate('invalid-date')).toBe('');
  });

  it('returns empty string for empty string', () => {
    expect(formatReleaseDate('')).toBe('');
  });

  it('returns empty string for non-string input', () => {
    expect(formatReleaseDate(null as any)).toBe('');
    expect(formatReleaseDate(undefined as any)).toBe('');
    expect(formatReleaseDate(123 as any)).toBe('');
  });

  it('handles timezone offsets correctly', () => {
    // Different timezone formats should still produce correct date
    expect(formatReleaseDate('2025-01-15T10:30:00+00:00')).toBe('Jan 15, 2025');
    expect(formatReleaseDate('2025-01-15T10:30:00-05:00')).toBe('Jan 15, 2025');
  });

  it('handles year boundaries', () => {
    expect(formatReleaseDate('2024-12-31T23:59:59Z')).toBe('Dec 31, 2024');
    expect(formatReleaseDate('2025-01-01T00:00:00Z')).toBe('Jan 1, 2025');
  });
});
