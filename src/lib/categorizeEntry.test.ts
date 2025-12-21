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
      // "add" (features) comes before "fix" (bugfixes) in iteration order
      expect(categorizeEntry('Add feature and fix bug')).toBe('features');
    });
  });

  describe('CATEGORIES constant verification', () => {
    it('should use CATEGORIES constant with correct structure', () => {
      // Verify CATEGORIES has expected keys in correct order
      const categoryKeys = Object.keys(CATEGORIES);
      expect(categoryKeys).toEqual(['features', 'bugfixes', 'performance', 'devx']);
    });

    it('should have keywords array for each category', () => {
      // Verify each category has keywords defined
      Object.values(CATEGORIES).forEach((config) => {
        expect(Array.isArray(config.keywords)).toBe(true);
        expect(config.keywords.length).toBeGreaterThan(0);
      });
    });
  });
});
