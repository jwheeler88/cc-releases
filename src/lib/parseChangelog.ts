import { marked } from 'marked';
import type { Release, ReleaseEntry } from '@/lib/types';
import { categorizeEntry } from './categorizeEntry';
import { GITHUB_COMMITS_API } from './constants';
import { formatReleaseDate } from './dateUtils';

/**
 * Fetches commit dates from GitHub for changelog versions
 * @param versions - Array of version strings in reverse chronological order (newest first)
 * @returns Map of version to formatted date string
 */
async function fetchCommitDates(versions: string[]): Promise<Map<string, string>> {
  const commitDates = new Map<string, string>();

  try {
    const response = await fetch(`${GITHUB_COMMITS_API}?path=CHANGELOG.md&per_page=100`);

    if (!response.ok) {
      console.error(`GitHub API request failed: ${response.status} ${response.statusText}`);
      return commitDates;
    }

    const commits = await response.json();

    // Match commits to versions by chronological order
    // Assumption: Each commit adds ONE new version to the top of CHANGELOG.md
    // GitHub returns commits newest first, versions array is also newest first
    // So commits[0] matches versions[0], commits[1] matches versions[1], etc.
    for (let i = 0; i < Math.min(commits.length, versions.length); i++) {
      const commit = commits[i];
      const version = versions[i];
      const authorDate = commit.commit?.author?.date;

      if (authorDate) {
        const formattedDate = formatReleaseDate(authorDate);
        if (formattedDate) {
          commitDates.set(version, formattedDate);
        }
      }
    }
  } catch (error) {
    console.error('Error fetching commit dates from GitHub:', error);
  }

  return commitDates;
}

export async function parseChangelog(markdown: string): Promise<Release[]> {
  if (!markdown || markdown.trim() === '') {
    return [];
  }

  try {
    const tokens = marked.lexer(markdown);
    const releases: Release[] = [];
    let currentRelease: Partial<Release> | null = null;

    // First pass: parse versions and entries
    for (const token of tokens) {
      // Detect version header (## X.Y.Z)
      if (token.type === 'heading' && token.depth === 2) {
        // Save previous release if exists
        if (currentRelease && currentRelease.version) {
          releases.push({
            version: currentRelease.version,
            date: currentRelease.date || '',
            entries: currentRelease.entries || [],
          });
        }

        // Start new release
        currentRelease = {
          version: token.text.trim(),
          date: '',
          entries: [],
        };
      }

      // Detect date line (_Released YYYY-MM-DD_) - fallback if exists in markdown
      if (token.type === 'paragraph' && currentRelease) {
        const dateMatch = token.text.match(/_Released (\d{4}-\d{2}-\d{2})_/);
        if (dateMatch) {
          currentRelease.date = dateMatch[1];
        }
      }

      // Detect bullet list entries
      if (token.type === 'list' && currentRelease) {
        const entries: ReleaseEntry[] = [];
        for (const item of token.items) {
          if (item.text) {
            const content = item.text.trim();
            entries.push({
              content,
              category: categorizeEntry(content),
            });
          }
        }
        // Append to existing entries instead of overwriting
        currentRelease.entries = [...(currentRelease.entries || []), ...entries];
      }
    }

    // Save final release
    if (currentRelease && currentRelease.version) {
      releases.push({
        version: currentRelease.version,
        date: currentRelease.date || '',
        entries: currentRelease.entries || [],
      });
    }

    // Second pass: fetch commit dates from GitHub
    // Sort versions in reverse chronological order for matching with commits
    const sortedVersions = [...releases].sort((a, b) => {
      const parseVersion = (version: string): number[] => {
        const parts = version.match(/(\d+)\.(\d+)\.(\d+)/);
        if (!parts) return [0, 0, 0];
        return [parseInt(parts[1]), parseInt(parts[2]), parseInt(parts[3])];
      };

      const [aMajor, aMinor, aPatch] = parseVersion(a.version);
      const [bMajor, bMinor, bPatch] = parseVersion(b.version);

      // Compare in descending order (newest first)
      if (bMajor !== aMajor) return bMajor - aMajor;
      if (bMinor !== aMinor) return bMinor - aMinor;
      return bPatch - aPatch;
    });

    const versions = sortedVersions.map(r => r.version);
    const commitDates = await fetchCommitDates(versions);

    // Populate dates from commit history (only if not already set from markdown)
    for (const release of releases) {
      if (!release.date && commitDates.has(release.version)) {
        release.date = commitDates.get(release.version)!;
      }
    }

    return releases;
  } catch (error) {
    console.error('Error parsing changelog:', error);
    throw new Error(`Failed to parse changelog: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
