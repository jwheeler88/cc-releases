import { describe, it, expect } from 'vitest';
import { parseChangelog } from './parseChangelog';

describe('parseChangelog', () => {
  it('should parse basic CHANGELOG structure', () => {
    const markdown = `## 1.0.53
_Released 2025-01-15_

- Added new feature X
- Fixed bug in Y`;

    const result = parseChangelog(markdown);

    expect(result).toHaveLength(1);
    expect(result[0].version).toBe('1.0.53');
    expect(result[0].date).toBe('2025-01-15');
    expect(result[0].entries).toHaveLength(2);
    expect(result[0].entries[0].content).toBe('Added new feature X');
    expect(result[0].entries[1].content).toBe('Fixed bug in Y');
  });

  it('should parse multiple releases', () => {
    const markdown = `## 1.0.53
_Released 2025-01-15_

- Feature A

## 1.0.52
_Released 2025-01-10_

- Fix B`;

    const result = parseChangelog(markdown);

    expect(result).toHaveLength(2);
    expect(result[0].version).toBe('1.0.53');
    expect(result[1].version).toBe('1.0.52');
  });

  it('should handle empty input', () => {
    expect(parseChangelog('')).toEqual([]);
  });

  it('should handle malformed markdown gracefully', () => {
    // Malformed but parseable markdown returns empty results
    const markdown = `Some random text without proper headers`;
    const result = parseChangelog(markdown);
    expect(result).toEqual([]);
  });

  it('should extract version numbers correctly', () => {
    const markdown = `## 1.0.53
_Released 2025-01-15_

- Test`;

    const result = parseChangelog(markdown);
    expect(result[0].version).toBe('1.0.53');
  });

  it('should extract dates correctly', () => {
    const markdown = `## 1.0.53
_Released 2025-01-15_

- Test`;

    const result = parseChangelog(markdown);
    expect(result[0].date).toBe('2025-01-15');
  });

  it('should handle releases without dates', () => {
    const markdown = `## 1.0.53

- Test entry`;

    const result = parseChangelog(markdown);
    expect(result[0].date).toBe('');
  });

  it('should handle releases without entries', () => {
    const markdown = `## 1.0.53
_Released 2025-01-15_`;

    const result = parseChangelog(markdown);
    expect(result[0].entries).toEqual([]);
  });

  it('should parse real Claude Code CHANGELOG sample', () => {
    // Real sample matching actual CHANGELOG.md structure
    const realSample = `## 1.0.53
_Released 2025-01-15_

- Added new MCP server support
- Fixed bug in task execution
- Performance improvements for file search`;

    const result = parseChangelog(realSample);

    expect(result).toHaveLength(1);
    expect(result[0].version).toBe('1.0.53');
    expect(result[0].date).toBe('2025-01-15');
    expect(result[0].entries).toHaveLength(3);
    expect(result[0].entries[0].content).toBe('Added new MCP server support');
    expect(result[0].entries[1].content).toBe('Fixed bug in task execution');
    expect(result[0].entries[2].content).toBe('Performance improvements for file search');
  });

  it('should handle multiple bullet lists in single release', () => {
    // Verifies H1 fix - multiple lists should append, not overwrite
    const markdown = `## 1.0.53
_Released 2025-01-15_

- Feature A
- Feature B

Some text here

- Feature C
- Feature D`;

    const result = parseChangelog(markdown);

    expect(result).toHaveLength(1);
    expect(result[0].entries).toHaveLength(4);
    expect(result[0].entries[0].content).toBe('Feature A');
    expect(result[0].entries[1].content).toBe('Feature B');
    expect(result[0].entries[2].content).toBe('Feature C');
    expect(result[0].entries[3].content).toBe('Feature D');
  });

  describe('entry categorization', () => {
    it('should categorize entries with "fix" keyword as bugfixes', () => {
      const markdown = `## 1.0.0

_Released 2024-01-01_

- Fix parsing bug`;
      const result = parseChangelog(markdown);
      expect(result[0].entries[0].category).toBe('bugfixes');
    });

    it('should categorize entries with "add" keyword as features', () => {
      const markdown = `## 1.0.0

_Released 2024-01-01_

- Add new search feature`;
      const result = parseChangelog(markdown);
      expect(result[0].entries[0].category).toBe('features');
    });

    it('should categorize entries with "optimize" keyword as performance', () => {
      const markdown = `## 1.0.0

_Released 2024-01-01_

- Optimize rendering speed`;
      const result = parseChangelog(markdown);
      expect(result[0].entries[0].category).toBe('performance');
    });

    it('should categorize entries with "improve developer" as devx', () => {
      const markdown = `## 1.0.0

_Released 2024-01-01_

- Improve developer experience`;
      const result = parseChangelog(markdown);
      expect(result[0].entries[0].category).toBe('devx');
    });
  });
});
