import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useChangelog } from "./useChangelog";

describe("useChangelog", () => {
  const mockMarkdown = `## 1.0.53
_Released 2025-01-15_

- New feature added
- Bug fix applied

## 1.0.52
_Released 2025-01-10_

- Performance improvement`;

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

  beforeEach(() => {
    global.fetch = vi.fn() as typeof fetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should have initial loading state", () => {
    vi.mocked(global.fetch).mockImplementation(() => new Promise(() => {})); // Never resolves

    const { result } = renderHook(() => useChangelog());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.releases).toEqual([]);
    expect(result.current.error).toBe(null);
    expect(typeof result.current.retry).toBe("function");
  });

  it("should fetch and parse changelog successfully", async () => {
    vi.mocked(global.fetch)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => mockMarkdown,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockGitHubCommits,
      } as Response);

    const { result } = renderHook(() => useChangelog());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.releases).toHaveLength(2);
    expect(result.current.releases[0].version).toBe("1.0.53");
    expect(result.current.releases[0].date).toBe("2025-01-15");
    expect(result.current.releases[0].entries).toHaveLength(2);
    expect(result.current.releases[1].version).toBe("1.0.52");
    expect(result.current.error).toBe(null);
  });

  it("should handle network errors", async () => {
    vi.mocked(global.fetch).mockRejectedValueOnce(new Error("Network failure"));

    const { result } = renderHook(() => useChangelog());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.releases).toEqual([]);
  });

  it("should handle HTTP errors", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: "Not Found",
      text: async () => "",
    } as Response);

    const { result } = renderHook(() => useChangelog());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toContain("404");
    expect(result.current.releases).toEqual([]);
  });

  it("should handle retry functionality", async () => {
    // First call fails
    vi.mocked(global.fetch).mockRejectedValueOnce(new Error("Network failure"));

    const { result } = renderHook(() => useChangelog());

    await waitFor(() => {
      expect(result.current.error).toBeInstanceOf(Error);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.releases).toEqual([]);

    // Mock successful response for retry (both changelog and commits)
    vi.mocked(global.fetch)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => mockMarkdown,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockGitHubCommits,
      } as Response);

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
    expect(result.current.releases[0].version).toBe("1.0.53");
  });

  it("should call CHANGELOG_URL with fetch", async () => {
    vi.mocked(global.fetch)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => mockMarkdown,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockGitHubCommits,
      } as Response);

    renderHook(() => useChangelog());

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md",
      );
    });
  });

  it("should only fetch once on mount", async () => {
    vi.mocked(global.fetch)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => mockMarkdown,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockGitHubCommits,
      } as Response);

    const { rerender } = renderHook(() => useChangelog());

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2); // Once for changelog, once for commits
    });

    // Rerender should not trigger another fetch
    rerender();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2); // Still only 2 calls
    });
  });

  it("should handle empty changelog", async () => {
    vi.mocked(global.fetch)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => "",
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockGitHubCommits,
      } as Response);

    const { result } = renderHook(() => useChangelog());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.releases).toEqual([]);
    expect(result.current.error).toBe(null);
  });

  it("should sort releases in reverse chronological order", async () => {
    const unsortedMarkdown = `## 1.0.50
_Released 2025-01-01_

- Older release

## 2.0.5
_Released 2025-01-20_

- Newer major version

## 1.0.52
_Released 2025-01-10_

- Middle release`;

    vi.mocked(global.fetch)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => unsortedMarkdown,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockGitHubCommits,
      } as Response);

    const { result } = renderHook(() => useChangelog());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.releases).toHaveLength(3);
    // Should be sorted newest first: 2.0.5, 1.0.52, 1.0.50
    expect(result.current.releases[0].version).toBe("2.0.5");
    expect(result.current.releases[1].version).toBe("1.0.52");
    expect(result.current.releases[2].version).toBe("1.0.50");
  });
});
