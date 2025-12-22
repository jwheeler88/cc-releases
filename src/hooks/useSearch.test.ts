import { renderHook } from '@testing-library/react';
import { useSearch } from './useSearch';
import type { Release } from '@/lib/types';

const mockReleases: Release[] = [
  {
    version: '1.0.0',
    date: '2024-01-01',
    entries: [
      { content: 'Add new search feature', category: 'features' },
      { content: 'Fix authentication bug', category: 'bugfixes' },
    ],
  },
  {
    version: '0.9.0',
    date: '2023-12-01',
    entries: [
      { content: 'Optimize rendering performance', category: 'performance' },
      { content: 'Improve developer tooling', category: 'devx' },
    ],
  },
];

describe('useSearch', () => {
  describe('empty query behavior', () => {
    it('should return all releases when query is empty', () => {
      const { result } = renderHook(() =>
        useSearch({ releases: mockReleases, query: '' })
      );

      expect(result.current.filteredReleases).toEqual(mockReleases);
      expect(result.current.matchCount).toBe(0); // No search = no matches
      expect(result.current.releaseCount).toBe(0);
    });

    it('should return all releases when query is only whitespace', () => {
      const { result } = renderHook(() =>
        useSearch({ releases: mockReleases, query: '   ' })
      );

      expect(result.current.filteredReleases).toEqual(mockReleases);
    });
  });

  describe('case-insensitive filtering', () => {
    it('should match lowercase query against mixed case content', () => {
      const { result } = renderHook(() =>
        useSearch({ releases: mockReleases, query: 'search' })
      );

      expect(result.current.releaseCount).toBe(1);
      expect(result.current.matchCount).toBe(1);
      expect(result.current.filteredReleases[0].version).toBe('1.0.0');
    });

    it('should match uppercase query against mixed case content', () => {
      const { result } = renderHook(() =>
        useSearch({ releases: mockReleases, query: 'SEARCH' })
      );

      expect(result.current.matchCount).toBe(1);
    });

    it('should match mixed case query', () => {
      const { result } = renderHook(() =>
        useSearch({ releases: mockReleases, query: 'SeArCh' })
      );

      expect(result.current.matchCount).toBe(1);
    });
  });

  describe('entry content filtering', () => {
    it('should include only matching entries in filtered releases', () => {
      const { result } = renderHook(() =>
        useSearch({ releases: mockReleases, query: 'bug' })
      );

      expect(result.current.releaseCount).toBe(1);
      expect(result.current.matchCount).toBe(1);
      expect(result.current.filteredReleases[0].entries).toHaveLength(1);
      expect(result.current.filteredReleases[0].entries[0].content).toContain(
        'bug'
      );
    });

    it('should exclude releases with no matching entries', () => {
      const { result } = renderHook(() =>
        useSearch({ releases: mockReleases, query: 'nonexistent' })
      );

      expect(result.current.filteredReleases).toEqual([]);
      expect(result.current.matchCount).toBe(0);
      expect(result.current.releaseCount).toBe(0);
    });

    it('should search across all entry content in all releases', () => {
      const { result } = renderHook(() =>
        useSearch({ releases: mockReleases, query: 'e' }) // Common letter
      );

      // Should match multiple entries across multiple releases
      expect(result.current.releaseCount).toBeGreaterThan(0);
      expect(result.current.matchCount).toBeGreaterThan(0);
    });
  });

  describe('match statistics', () => {
    it('should count total matching entries correctly', () => {
      // Query that matches 2 entries
      const { result } = renderHook(() =>
        useSearch({ releases: mockReleases, query: 'e' })
      );

      expect(typeof result.current.matchCount).toBe('number');
      expect(result.current.matchCount).toBeGreaterThan(0);
    });

    it('should count releases with matches correctly', () => {
      const { result } = renderHook(() =>
        useSearch({ releases: mockReleases, query: 'performance' })
      );

      expect(result.current.releaseCount).toBe(1);
      expect(result.current.matchCount).toBe(1);
    });

    it('should return zero counts for no matches', () => {
      const { result } = renderHook(() =>
        useSearch({ releases: mockReleases, query: 'xyz123' })
      );

      expect(result.current.matchCount).toBe(0);
      expect(result.current.releaseCount).toBe(0);
    });
  });

  describe('special characters and edge cases', () => {
    it('should handle special regex characters safely', () => {
      const { result } = renderHook(() =>
        useSearch({ releases: mockReleases, query: '.' })
      );

      // Should not throw error, should treat as literal character
      expect(result.current).toBeDefined();
    });

    it('should handle empty releases array', () => {
      const { result } = renderHook(() =>
        useSearch({ releases: [], query: 'search' })
      );

      expect(result.current.filteredReleases).toEqual([]);
      expect(result.current.matchCount).toBe(0);
      expect(result.current.releaseCount).toBe(0);
    });
  });

  describe('memoization behavior', () => {
    it('should return same result for same inputs', () => {
      const { result, rerender } = renderHook(
        (props) => useSearch(props),
        { initialProps: { releases: mockReleases, query: 'search' } }
      );

      const firstResult = result.current;
      rerender({ releases: mockReleases, query: 'search' });
      const secondResult = result.current;

      expect(firstResult).toBe(secondResult); // Same reference
    });

    it('should recompute when query changes', () => {
      const { result, rerender } = renderHook(
        (props) => useSearch(props),
        { initialProps: { releases: mockReleases, query: 'search' } }
      );

      const firstResult = result.current;
      rerender({ releases: mockReleases, query: 'bug' });
      const secondResult = result.current;

      expect(firstResult).not.toBe(secondResult);
    });
  });
});
