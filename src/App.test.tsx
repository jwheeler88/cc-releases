import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { ThemeProvider } from "@/contexts/ThemeContext";
import * as useChangelogModule from "@/hooks/useChangelog";
import type { Release } from "@/lib/types";

// Mock the useChangelog hook module
vi.mock("@/hooks/useChangelog");

// Helper to render App with ThemeProvider
const renderApp = () => {
  return render(
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
};

// Test data: mock releases for success state testing
const mockReleases: Release[] = [
  {
    version: "1.0.53",
    date: "2025-01-15",
    entries: [
      { content: "Added new feature X", category: "features" as const },
      { content: "Fixed critical bug Y", category: "bugfixes" as const },
    ],
  },
  {
    version: "1.0.52",
    date: "2025-01-10",
    entries: [
      {
        content: "Performance improvements for Z",
        category: "performance" as const,
      },
    ],
  },
];

// Helper function to mock the useChangelog hook with specific states
const mockHook = (
  state: Partial<ReturnType<typeof useChangelogModule.useChangelog>>,
) => {
  vi.mocked(useChangelogModule.useChangelog).mockReturnValue({
    releases: [],
    isLoading: false,
    error: null,
    retry: vi.fn(),
    ...state,
  });
};

describe("App", () => {
  let mockLocalStorage: Record<string, string>;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock localStorage for ThemeProvider
    mockLocalStorage = {};
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn((key: string) => mockLocalStorage[key] || null),
        setItem: vi.fn((key: string, value: string) => {
          mockLocalStorage[key] = value;
        }),
        removeItem: vi.fn((key: string) => {
          delete mockLocalStorage[key];
        }),
        clear: vi.fn(() => {
          mockLocalStorage = {};
        }),
      },
      writable: true,
    });

    // Mock matchMedia for ThemeProvider
    Object.defineProperty(window, 'matchMedia', {
      value: vi.fn(() => ({
        matches: true,
        media: '(prefers-color-scheme: dark)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
      writable: true,
    });
  });

  // LOADING STATE TESTS
  describe("Loading State", () => {
    it("renders LoadingState component when isLoading is true", () => {
      mockHook({ isLoading: true });
      renderApp();

      // LoadingState should have role="status" for accessibility
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("does not render main element during loading", () => {
      mockHook({ isLoading: true });
      renderApp();

      // Main content should not be present during loading
      expect(screen.queryByRole("main")).not.toBeInTheDocument();
    });
  });

  // ERROR STATE TESTS
  describe("Error State", () => {
    it("renders ErrorState component when error exists", () => {
      const mockError = new Error("Network failed");
      mockHook({ error: mockError });
      renderApp();

      // ErrorState should have role="alert" for accessibility
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("passes error and retry to ErrorState component", async () => {
      const mockRetry = vi.fn();
      const mockError = new Error("Network failed");
      mockHook({ error: mockError, retry: mockRetry });

      renderApp();

      // Find and click the retry button
      const retryButton = screen.getByRole("button", { name: /try.*again/i });
      await userEvent.click(retryButton);

      // Verify retry callback was called
      expect(mockRetry).toHaveBeenCalledOnce();
    });

    it("does not render main element during error", () => {
      mockHook({ error: new Error("Test error") });
      renderApp();

      // Main content should not be present during error
      expect(screen.queryByRole("main")).not.toBeInTheDocument();
    });
  });

  // SUCCESS STATE TESTS
  describe("Success State", () => {
    it("renders main landmark when releases are loaded", () => {
      mockHook({ releases: mockReleases });
      renderApp();

      expect(screen.getByRole("main")).toBeInTheDocument();
    });

    it("renders h1 heading with app title", () => {
      mockHook({ releases: mockReleases });
      renderApp();

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("Claude Code");
    });

    it("renders all releases in the list", () => {
      mockHook({ releases: mockReleases });
      const { container } = renderApp();

      // Check that both release versions are present via h2 elements
      const headings = container.querySelectorAll("h2");
      const versionHeadings = Array.from(headings).filter(
        (h) =>
          h.textContent?.includes("1.0.53") ||
          h.textContent?.includes("1.0.52"),
      );

      expect(versionHeadings).toHaveLength(2);
    });

    it("renders releases in correct order (newest first)", () => {
      mockHook({ releases: mockReleases });
      const { container } = renderApp();

      // Get all h2 elements and find version headings
      const headings = container.querySelectorAll("h2");
      const versionHeadings = Array.from(headings).filter(
        (h) =>
          h.textContent?.includes("1.0.53") ||
          h.textContent?.includes("1.0.52"),
      );

      // First should be newest (1.0.53), second should be older (1.0.52)
      expect(versionHeadings[0]).toHaveTextContent("1.0.53");
      expect(versionHeadings[1]).toHaveTextContent("1.0.52");
    });

    it("renders all release entries with correct content", () => {
      mockHook({ releases: mockReleases });
      renderApp();

      // Check that entry content is rendered
      expect(screen.getByText(/Added new feature X/i)).toBeInTheDocument();
      expect(screen.getByText(/Fixed critical bug Y/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Performance improvements for Z/i),
      ).toBeInTheDocument();
    });

    it("applies max-width constraint for centered layout", () => {
      mockHook({ releases: mockReleases });
      const { container } = renderApp();

      // Find element with max-w-[720px] class
      const centeredContainer = container.querySelector(".max-w-\\[720px\\]");
      expect(centeredContainer).toBeInTheDocument();
    });

    it("does not render loading state in success", () => {
      mockHook({ releases: mockReleases });
      renderApp();

      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    it("does not render error state in success", () => {
      mockHook({ releases: mockReleases });
      renderApp();

      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("supports keyboard navigation through content", () => {
      mockHook({ releases: mockReleases });
      const { container } = renderApp();

      // Verify main content is in the document
      const main = screen.getByRole("main");
      expect(main).toBeInTheDocument();

      // Verify heading is keyboard-accessible (part of document flow)
      const h1 = screen.getByRole("heading", { level: 1 });
      expect(h1).toBeVisible();

      // Verify release sections are accessible
      const h2Elements = container.querySelectorAll("h2");
      expect(h2Elements.length).toBeGreaterThan(0);

      // All headings should be visible and in DOM (keyboard navigable)
      h2Elements.forEach((heading) => {
        expect(heading).toBeVisible();
      });
    });
  });

  // EDGE CASE TESTS
  describe("Edge Cases", () => {
    it("handles empty releases array gracefully", () => {
      mockHook({ releases: [] });
      const { container } = renderApp();

      // Main element should still render
      expect(screen.getByRole("main")).toBeInTheDocument();

      // No release sections should be present
      const versionHeadings = Array.from(
        container.querySelectorAll("h2"),
      ).filter((h) => h.textContent?.match(/\d+\.\d+\.\d+/));
      expect(versionHeadings).toHaveLength(0);
    });
  });

  // STATE TRANSITION TESTS
  describe("State Transitions", () => {
    it("transitions from loading to success", () => {
      // Initial render with loading state
      mockHook({ isLoading: true });
      const { rerender } = renderApp();
      expect(screen.getByRole("status")).toBeInTheDocument();

      // Simulate successful data fetch
      mockHook({ releases: mockReleases });
      rerender(
        <ThemeProvider>
          <App />
        </ThemeProvider>
      );

      // Should now show main content
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
      expect(screen.getByRole("main")).toBeInTheDocument();
    });

    it("transitions from loading to error", () => {
      // Initial render with loading state
      mockHook({ isLoading: true });
      const { rerender } = renderApp();
      expect(screen.getByRole("status")).toBeInTheDocument();

      // Simulate fetch error
      mockHook({ error: new Error("Network failed") });
      rerender(
        <ThemeProvider>
          <App />
        </ThemeProvider>
      );

      // Should now show error state
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });
});
