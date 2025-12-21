import { describe, it, expect } from 'vitest';
import { categorizeEntry } from './categorizeEntry';
import { CATEGORIES } from './constants';

describe('categorizeEntry', () => {
  describe('features categorization', () => {
    it('should categorize "add" keyword as features', () => {
      expect(categorizeEntry('Add new feature')).toBe('features');
    });

    it('should categorize "new" keyword as features', () => {
      expect(categorizeEntry('New support for X')).toBe('features');
    });

    it('should categorize "feature" keyword as features', () => {
      expect(categorizeEntry('Feature implementation')).toBe('features');
    });

    it('should categorize "support" keyword as features', () => {
      expect(categorizeEntry('Support for new API')).toBe('features');
    });
  });

  describe('bugfixes categorization', () => {
    it('should categorize "fix" keyword as bugfixes', () => {
      expect(categorizeEntry('Fix bug in parser')).toBe('bugfixes');
    });

    it('should categorize "bug" keyword as bugfixes', () => {
      expect(categorizeEntry('Bug in rendering')).toBe('bugfixes');
    });

    it('should categorize "resolve" keyword as bugfixes', () => {
      expect(categorizeEntry('Resolve critical issue')).toBe('bugfixes');
    });

    it('should categorize "patch" keyword as bugfixes', () => {
      expect(categorizeEntry('Patch security vulnerability')).toBe('bugfixes');
    });
  });

  describe('performance categorization', () => {
    it('should categorize "perf" keyword as performance', () => {
      expect(categorizeEntry('Perf improvements')).toBe('performance');
    });

    it('should categorize "fast" keyword as performance', () => {
      expect(categorizeEntry('Faster rendering')).toBe('performance');
    });

    it('should categorize "speed" keyword as performance', () => {
      expect(categorizeEntry('Speed up parsing')).toBe('performance');
    });

    it('should categorize "optimize" keyword as performance', () => {
      expect(categorizeEntry('Optimize bundle size')).toBe('performance');
    });
  });

  describe('devx categorization', () => {
    it('should categorize "dx" keyword as devx', () => {
      expect(categorizeEntry('DX improvements')).toBe('devx');
    });

    it('should categorize "developer" keyword as devx', () => {
      expect(categorizeEntry('Developer experience update')).toBe('devx');
    });

    it('should categorize "tooling" keyword as devx', () => {
      expect(categorizeEntry('Tooling enhancements')).toBe('devx');
    });

    it('should categorize "cli" keyword as devx', () => {
      expect(categorizeEntry('CLI improvements')).toBe('devx');
    });
  });

  describe('edge cases', () => {
    it('should be case-insensitive', () => {
      expect(categorizeEntry('ADD feature')).toBe('features');
      expect(categorizeEntry('FIX bug')).toBe('bugfixes');
      expect(categorizeEntry('OPTIMIZE performance')).toBe('performance');
      expect(categorizeEntry('DEVELOPER tools')).toBe('devx');
    });

    it('should return default category for no keyword match', () => {
      expect(categorizeEntry('Random text without keywords')).toBe('features');
      expect(categorizeEntry('Some other content')).toBe('features');
    });

    it('should handle empty strings', () => {
      expect(categorizeEntry('')).toBe('features');
    });

    it('should handle special characters', () => {
      expect(categorizeEntry('!@# Fix $%^')).toBe('bugfixes');
    });

    it('should return first matching category when multiple keywords present', () => {
      // "fix" (bugfixes) comes before "add" (features) in iteration order
      expect(categorizeEntry('Add feature and fix bug')).toBe('bugfixes');
    });
  });

  describe('false positive prevention', () => {
    it('should not match "fix" in words like "prefix" or "suffix"', () => {
      expect(categorizeEntry('prefix should not match')).toBe('features');
      expect(categorizeEntry('suffix should not match')).toBe('features');
      expect(categorizeEntry('unfixable should not match')).toBe('features');
    });

    it('should not match "perf" in words like "perfectly"', () => {
      expect(categorizeEntry('perfectly fine code')).toBe('features');
    });

    it('should not match "add" in words like "readd"', () => {
      expect(categorizeEntry('readd the configuration')).toBe('features');
    });

    it('should not match "new" in words like "newfangled"', () => {
      expect(categorizeEntry('newfangled idea')).toBe('features');
    });

    it('should match actual keywords as whole words', () => {
      expect(categorizeEntry('Fix the bug')).toBe('bugfixes');
      expect(categorizeEntry('Add new feature')).toBe('features');
      expect(categorizeEntry('Optimize performance')).toBe('performance');
    });
  });

  describe('improvement and optimization keywords', () => {
    it('should categorize "improve" keyword as devx', () => {
      expect(categorizeEntry('Improve developer experience')).toBe('devx');
    });

    it('should categorize "improved" keyword as devx', () => {
      expect(categorizeEntry('Improved tooling support')).toBe('devx');
    });

    it('should categorize "reduce" keyword as performance', () => {
      expect(categorizeEntry('Reduce bundle size')).toBe('performance');
    });

    it('should categorize "reduced" keyword as performance', () => {
      expect(categorizeEntry('Reduced terminal flickering')).toBe('performance');
    });
  });

  describe('real changelog patterns', () => {
    it('should correctly categorize real feature entries', () => {
      expect(categorizeEntry('Added LSP tool for code intelligence')).toBe('features');
      expect(categorizeEntry('Added /config toggle to enable/disable prompt suggestions')).toBe('features');
    });

    it('should correctly categorize real bugfix entries', () => {
      expect(categorizeEntry('Fixed skill allowed-tools not being applied')).toBe('bugfixes');
      expect(categorizeEntry('Fixed IME support for languages')).toBe('bugfixes');
    });

    it('should correctly categorize real performance entries', () => {
      expect(categorizeEntry('Reduced terminal flickering')).toBe('performance');
    });

    it('should correctly categorize real devx entries', () => {
      expect(categorizeEntry('Improved memory usage by 3x for large conversations')).toBe('devx');
      expect(categorizeEntry('Improved /context command visualization')).toBe('devx');
    });

    it('should handle entries with multiple potential keywords', () => {
      // "fix" (bugfixes) is checked before "add" (features) in CATEGORIES order
      expect(categorizeEntry('Add feature and fix bug')).toBe('bugfixes');
      // "Fixed" (bugfixes) is found before "support" (features)
      expect(categorizeEntry('Fixed support for new API')).toBe('bugfixes');
    });
  });

  describe('CATEGORIES constant verification', () => {
    it('should use CATEGORIES constant with correct structure', () => {
      // Verify CATEGORIES has expected keys in correct order (bugfixes first for priority)
      const categoryKeys = Object.keys(CATEGORIES);
      expect(categoryKeys).toEqual(['bugfixes', 'performance', 'devx', 'features']);
    });

    it('should have keywords array for each category', () => {
      // Verify each category has keywords defined
      Object.values(CATEGORIES).forEach((config) => {
        expect(Array.isArray(config.keywords)).toBe(true);
        expect(config.keywords.length).toBeGreaterThan(0);
      });
    });

    it('should have performance keywords including reduce verbs', () => {
      const perfKeywords = CATEGORIES.performance.keywords;
      expect(perfKeywords).toContain('reduce');
      expect(perfKeywords).toContain('reduced');
    });

    it('should have devx keywords including improvement verbs', () => {
      const devxKeywords = CATEGORIES.devx.keywords;
      expect(devxKeywords).toContain('improve');
      expect(devxKeywords).toContain('improved');
    });
  });
});
