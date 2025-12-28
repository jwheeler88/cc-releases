import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { parseChangelog } from './parseChangelog';

// Mock GitHub API responses
const mockGitHubCommits = [
  {
    commit: {
      message: 'Release 1.0.53',
      author: { date: '2025-01-15T10:30:00Z' }
    }
  },
  {
    commit: {
      message: 'Release 1.0.52',
      author: { date: '2025-01-10T08:00:00Z' }
    }
  }
];

describe('parseChangelog', () => {
  let fetchSpy: any;

  beforeEach(() => {
    // Mock fetch to avoid actual GitHub API calls
    fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockGitHubCommits,
    } as Response);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should parse basic CHANGELOG structure', async () => {
    const markdown = `## 1.0.53
_Released 2025-01-15_

- Added new feature X
- Fixed bug in Y`;

    const result = await parseChangelog(markdown);

    expect(result).toHaveLength(1);
    expect(result[0].version).toBe('1.0.53');
    expect(result[0].date).toBe('2025-01-15');
    expect(result[0].entries).toHaveLength(2);
    expect(result[0].entries[0].content).toBe('Added new feature X');
    expect(result[0].entries[1].content).toBe('Fixed bug in Y');
  });

  it('should parse multiple releases', async () => {
    const markdown = `## 1.0.53
_Released 2025-01-15_

- Feature A

## 1.0.52
_Released 2025-01-10_

- Fix B`;

    const result = await parseChangelog(markdown);

    expect(result).toHaveLength(2);
    expect(result[0].version).toBe('1.0.53');
    expect(result[1].version).toBe('1.0.52');
  });

  it('should handle empty input', async () => {
    expect(await parseChangelog('')).toEqual([]);
  });

  it('should handle malformed markdown gracefully', async () => {
    // Malformed but parseable markdown returns empty results
    const markdown = `Some random text without proper headers`;
    const result = await parseChangelog(markdown);
    expect(result).toEqual([]);
  });

  it('should extract version numbers correctly', async () => {
    const markdown = `## 1.0.53
_Released 2025-01-15_

- Test`;

    const result = await parseChangelog(markdown);
    expect(result[0].version).toBe('1.0.53');
  });

  it('should extract dates correctly', async () => {
    const markdown = `## 1.0.53
_Released 2025-01-15_

- Test`;

    const result = await parseChangelog(markdown);
    expect(result[0].date).toBe('2025-01-15');
  });

  it('should handle releases without dates', async () => {
    const markdown = `## 1.0.53

- Test entry`;

    const result = await parseChangelog(markdown);
    // Should fetch date from GitHub API mock
    expect(result[0].date).toBe('Jan 15, 2025');
  });

  it('should handle releases without entries', async () => {
    const markdown = `## 1.0.53
_Released 2025-01-15_`;

    const result = await parseChangelog(markdown);
    expect(result[0].entries).toEqual([]);
  });

  it('should parse real Claude Code CHANGELOG sample', async () => {
    // Real sample matching actual CHANGELOG.md structure
    const realSample = `## 1.0.53
_Released 2025-01-15_

- Added new MCP server support
- Fixed bug in task execution
- Performance improvements for file search`;

    const result = await parseChangelog(realSample);

    expect(result).toHaveLength(1);
    expect(result[0].version).toBe('1.0.53');
    expect(result[0].date).toBe('2025-01-15');
    expect(result[0].entries).toHaveLength(3);
    expect(result[0].entries[0].content).toBe('Added new MCP server support');
    expect(result[0].entries[1].content).toBe('Fixed bug in task execution');
    expect(result[0].entries[2].content).toBe('Performance improvements for file search');
  });

  it('should handle multiple bullet lists in single release', async () => {
    // Verifies H1 fix - multiple lists should append, not overwrite
    const markdown = `## 1.0.53
_Released 2025-01-15_

- Feature A
- Feature B

Some text here

- Feature C
- Feature D`;

    const result = await parseChangelog(markdown);

    expect(result).toHaveLength(1);
    expect(result[0].entries).toHaveLength(4);
    expect(result[0].entries[0].content).toBe('Feature A');
    expect(result[0].entries[1].content).toBe('Feature B');
    expect(result[0].entries[2].content).toBe('Feature C');
    expect(result[0].entries[3].content).toBe('Feature D');
  });

  describe('GitHub commit date fetching', () => {
    it('should fetch and populate dates from GitHub API', async () => {
      const markdown = `## 1.0.53

- Test entry`;

      const result = await parseChangelog(markdown);

      expect(result[0].date).toBe('Jan 15, 2025');
      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining('commits?path=CHANGELOG.md&per_page=100')
      );
    });

    it('should handle GitHub API errors gracefully', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      } as Response);

      const markdown = `## 1.0.53

- Test entry`;

      const result = await parseChangelog(markdown);

      // Should still return results, just without dates
      expect(result).toHaveLength(1);
      expect(result[0].date).toBe('');
    });

    it('should handle fetch network errors gracefully', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('Network error'));

      const markdown = `## 1.0.53

- Test entry`;

      const result = await parseChangelog(markdown);

      // Should still return results, just without dates
      expect(result).toHaveLength(1);
      expect(result[0].date).toBe('');
    });

    it('should prefer markdown dates over GitHub API dates', async () => {
      const markdown = `## 1.0.53
_Released 2025-01-20_

- Test entry`;

      const result = await parseChangelog(markdown);

      // Markdown date should be preserved (not overwritten by GitHub API)
      expect(result[0].date).toBe('2025-01-20');
    });
  });

  describe('entry categorization', () => {
    it('should categorize entries with "fix" keyword as bugfixes', async () => {
      const markdown = `## 1.0.0

_Released 2024-01-01_

- Fix parsing bug`;
      const result = await parseChangelog(markdown);
      expect(result[0].entries[0].category).toBe('bugfixes');
    });

    it('should categorize entries with "add" keyword as features', async () => {
      const markdown = `## 1.0.0

_Released 2024-01-01_

- Add new search feature`;
      const result = await parseChangelog(markdown);
      expect(result[0].entries[0].category).toBe('features');
    });

    it('should categorize entries with "optimize" keyword as performance', async () => {
      const markdown = `## 1.0.0

_Released 2024-01-01_

- Optimize rendering speed`;
      const result = await parseChangelog(markdown);
      expect(result[0].entries[0].category).toBe('performance');
    });

    it('should categorize entries with "improve developer" as devx', async () => {
      const markdown = `## 1.0.0

_Released 2024-01-01_

- Improve developer experience`;
      const result = await parseChangelog(markdown);
      expect(result[0].entries[0].category).toBe('devx');
    });
  });
});
