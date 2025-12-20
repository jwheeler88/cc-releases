import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useChangelog } from './useChangelog';

describe('useChangelog', () => {
  const mockMarkdown = `## 1.0.53
_Released 2025-01-15_

- New feature added
- Bug fix applied

## 1.0.52
_Released 2025-01-10_

- Performance improvement`;

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should have initial loading state', () => {
    (global.fetch as any).mockImplementation(() => new Promise(() => {})); // Never resolves

    const { result } = renderHook(() => useChangelog());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.releases).toEqual([]);
    expect(result.current.error).toBe(null);
    expect(typeof result.current.retry).toBe('function');
  });

  it('should fetch and parse changelog successfully', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: async () => mockMarkdown,
    });

    const { result } = renderHook(() => useChangelog());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.releases).toHaveLength(2);
    expect(result.current.releases[0].version).toBe('1.0.53');
    expect(result.current.releases[0].date).toBe('2025-01-15');
    expect(result.current.releases[0].entries).toHaveLength(2);
    expect(result.current.releases[1].version).toBe('1.0.52');
    expect(result.current.error).toBe(null);
  });

  it('should handle network errors', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('Network failure'));

    const { result } = renderHook(() => useChangelog());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.releases).toEqual([]);
  });

  it('should handle HTTP errors', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      text: async () => '',
    });

    const { result } = renderHook(() => useChangelog());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toContain('404');
    expect(result.current.releases).toEqual([]);
  });

  it('should handle retry functionality', async () => {
    // First call fails
    (global.fetch as any).mockRejectedValueOnce(new Error('Network failure'));

    const { result } = renderHook(() => useChangelog());

    await waitFor(() => {
      expect(result.current.error).toBeInstanceOf(Error);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.releases).toEqual([]);

    // Mock successful response for retry
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: async () => mockMarkdown,
    });

    // Trigger retry
    act(() => {
      result.current.retry();
    });

    // Should be loading again
    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });

    // Wait for success
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe(null);
    expect(result.current.releases).toHaveLength(2);
    expect(result.current.releases[0].version).toBe('1.0.53');
  });

  it('should call CHANGELOG_URL with fetch', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: async () => mockMarkdown,
    });

    renderHook(() => useChangelog());

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md');
    });
  });

  it('should only fetch once on mount', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => mockMarkdown,
    });

    const { rerender } = renderHook(() => useChangelog());

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    // Rerender should not trigger another fetch
    rerender();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  it('should handle empty changelog', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: async () => '',
    });

    const { result } = renderHook(() => useChangelog());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.releases).toEqual([]);
    expect(result.current.error).toBe(null);
  });
});
