import { useState, useEffect, useCallback } from 'react';
import { parseChangelog } from '@/lib/parseChangelog';
import { CHANGELOG_URL } from '@/lib/constants';
import type { Release } from '@/lib/types';

interface UseChangelogResult {
  releases: Release[];
  isLoading: boolean;
  error: Error | null;
  retry: () => void;
}

export function useChangelog(): UseChangelogResult {
  const [releases, setReleases] = useState<Release[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);

  useEffect(() => {
    const fetchChangelog = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(CHANGELOG_URL);

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }

        const markdown = await response.text();
        const parsedReleases = parseChangelog(markdown);

        // Sort releases in reverse chronological order (newest first)
        // Parse semantic versions (e.g., "1.0.53" -> [1, 0, 53])
        const sortedReleases = [...parsedReleases].sort((a, b) => {
          const parseVersion = (version: string): number[] => {
            const parts = version.match(/(\d+)\.(\d+)\.(\d+)/);
            if (!parts) return [0, 0, 0];
            return [parseInt(parts[1]), parseInt(parts[2]), parseInt(parts[3])];
          };

          const [aMajor, aMinor, aPatch] = parseVersion(a.version);
          const [bMajor, bMinor, bPatch] = parseVersion(b.version);

          // Compare major, then minor, then patch (descending order)
          if (bMajor !== aMajor) return bMajor - aMajor;
          if (bMinor !== aMinor) return bMinor - aMinor;
          return bPatch - aPatch;
        });

        setReleases(sortedReleases);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load releases'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchChangelog();
  }, [retryCount]);

  const retry = useCallback(() => {
    setRetryCount((prev) => prev + 1);
  }, []);

  return { releases, isLoading, error, retry };
}
