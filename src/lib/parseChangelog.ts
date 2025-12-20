import { marked } from 'marked';
import type { Release, ReleaseEntry, Category } from '@/lib/types';

const DEFAULT_CATEGORY: Category = 'features';

export function parseChangelog(markdown: string): Release[] {
  if (!markdown || markdown.trim() === '') {
    return [];
  }

  try {
    const tokens = marked.lexer(markdown);
    const releases: Release[] = [];
    let currentRelease: Partial<Release> | null = null;

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

      // Detect date line (_Released YYYY-MM-DD_)
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
            entries.push({
              content: item.text.trim(),
              category: DEFAULT_CATEGORY, // Default category per story requirements
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

    return releases;
  } catch (error) {
    console.error('Error parsing changelog:', error);
    throw new Error(`Failed to parse changelog: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
