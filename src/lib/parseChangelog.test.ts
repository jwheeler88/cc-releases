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

  it('should handle malformed markdown', () => {
    const markdown = `Some random text without proper headers`;
    expect(parseChangelog(markdown)).toEqual([]);
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
});
