import type { Category } from '@/lib/types';
import { CATEGORIES } from '@/lib/constants';

// Pre-compile keyword regexes at module load for performance
// Avoids creating new RegExp objects on every categorizeEntry() call
const KEYWORD_PATTERNS = Object.entries(CATEGORIES).map(([categoryKey, categoryConfig]) => ({
  category: categoryKey as Category,
  patterns: categoryConfig.keywords.map(keyword => {
    // Some keywords need complete word matching to avoid false positives
    const completeWordOnly = ['perf', 'dx', 'cli'];
    const useCompleteWord = completeWordOnly.includes(keyword);
    const pattern = useCompleteWord ? `\\b${keyword}\\b` : `\\b${keyword}`;
    return new RegExp(pattern, 'i');
  })
}));

/**
 * Categorizes a release entry based on content keyword analysis.
 *
 * Uses pre-compiled regex patterns for performance optimization.
 * Categories are checked in CATEGORIES definition order (bugfixes → performance → devx → features).
 *
 * @param content - The text content of the release entry
 * @returns A Category type value ('features', 'bugfixes', 'performance', or 'devx')
 *
 * @example
 * categorizeEntry('Add new MCP server support') // Returns 'features'
 * categorizeEntry('Fix bug in parser') // Returns 'bugfixes'
 * categorizeEntry('Optimize rendering performance') // Returns 'performance'
 * categorizeEntry('Improve developer tooling') // Returns 'devx'
 */
export function categorizeEntry(content: string): Category {
  // Iterate through pre-compiled patterns
  for (const { category, patterns } of KEYWORD_PATTERNS) {
    for (const regex of patterns) {
      if (regex.test(content)) {
        return category;
      }
    }
  }

  // Default category if no keywords match
  return 'features';
}
