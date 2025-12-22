import { useMemo } from 'react';
import type { Release } from '@/lib/types';

interface UseSearchParams {
  releases: Release[];
  query: string;
}

interface UseSearchResult {
  filteredReleases: Release[];
  matchCount: number;
  releaseCount: number;
}

export function useSearch({ releases, query }: UseSearchParams): UseSearchResult {
  return useMemo(() => {
    // Empty query = return all releases with zero match stats
    if (!query.trim()) {
      const totalEntries = releases.reduce((sum, r) => sum + r.entries.length, 0);
      return {
        filteredReleases: releases,
        matchCount: totalEntries,
        releaseCount: releases.length,
      };
    }

    const lowerQuery = query.toLowerCase();
    const filtered: Release[] = [];
    let totalMatches = 0;

    // Filter each release
    for (const release of releases) {
      // Find matching entries within this release
      const matchingEntries = release.entries.filter((entry) =>
        entry.content.toLowerCase().includes(lowerQuery)
      );

      // Only include release if it has matching entries
      if (matchingEntries.length > 0) {
        filtered.push({
          ...release,
          entries: matchingEntries, // Only matching entries
        });
        totalMatches += matchingEntries.length;
      }
    }

    return {
      filteredReleases: filtered,
      matchCount: totalMatches,
      releaseCount: filtered.length,
    };
  }, [releases, query]);
}
