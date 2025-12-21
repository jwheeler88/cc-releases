import type { Category } from '@/lib/types';
import { CATEGORIES } from '@/lib/constants';

/**
 * Categorizes a release entry based on content keyword analysis.
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
  // Iterate through categories and check keywords with word boundary matching
  for (const [categoryKey, categoryConfig] of Object.entries(CATEGORIES)) {
    for (const keyword of categoryConfig.keywords) {
      // Some keywords need complete word matching to avoid false positives
      const completeWordOnly = ['perf', 'dx', 'cli'];
      const useCompleteWord = completeWordOnly.includes(keyword);
      const pattern = useCompleteWord ? `\\b${keyword}\\b` : `\\b${keyword}`;
      const wordBoundaryRegex = new RegExp(pattern, 'i');
      if (wordBoundaryRegex.test(content)) {
        return categoryKey as Category;
      }
    }
  }

  // Default category if no keywords match
  return 'features';
}
