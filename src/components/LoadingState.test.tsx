import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { LoadingState } from "./LoadingState";

describe("LoadingState", () => {
  it("should render without errors", () => {
    const { container } = render(<LoadingState />);
    expect(container).toBeInTheDocument();
  });

  it("should have aria-busy attribute set to true", () => {
    const { container } = render(<LoadingState />);
    const loadingContainer = container.querySelector('[aria-busy="true"]');
    expect(loadingContainer).toBeInTheDocument();
  });

  it("should have aria-label for screen readers", () => {
    const { container } = render(<LoadingState />);
    const loadingContainer = container.querySelector(
      '[aria-label="Loading releases"]',
    );
    expect(loadingContainer).toBeInTheDocument();
  });

  it('should have role="status" for accessibility', () => {
    const { container } = render(<LoadingState />);
    const statusElement = container.querySelector('[role="status"]');
    expect(statusElement).toBeInTheDocument();
  });

  it("should render multiple release section skeletons", () => {
    const { container } = render(<LoadingState />);
    const articles = container.querySelectorAll("article");

    // Should render 2-3 release sections
    expect(articles.length).toBeGreaterThanOrEqual(2);
    expect(articles.length).toBeLessThanOrEqual(3);
  });

  it("should render skeleton elements for version and date", () => {
    const { container } = render(<LoadingState />);

    // Check for skeleton elements (data-slot="skeleton" from Skeleton component)
    const skeletons = container.querySelectorAll('[data-slot="skeleton"]');

    // Should have multiple skeletons (version, date, entries for each release)
    expect(skeletons.length).toBeGreaterThan(10);
  });

  it("should have matching layout structure to ReleaseSection", () => {
    const { container } = render(<LoadingState />);
    const article = container.querySelector("article");

    // Should have flex layout classes
    expect(article?.className).toContain("flex");
    expect(article?.className).toContain("md:flex-row");
    expect(article?.className).toContain("py-16");
  });

  it("should have sidebar with fixed width", () => {
    const { container } = render(<LoadingState />);
    const sidebar = container.querySelector(".w-48");

    expect(sidebar).toBeInTheDocument();
    expect(sidebar?.className).toContain("shrink-0");
  });

  it("should render entry skeletons with left borders", () => {
    const { container } = render(<LoadingState />);
    const borderedEntries = container.querySelectorAll(".border-l-2");

    // Should have multiple entries with left borders
    expect(borderedEntries.length).toBeGreaterThan(5);
  });

  it("should use brand gray color for borders at 20% opacity", () => {
    const { container } = render(<LoadingState />);
    const borderedEntry = container.querySelector(".border-l-2");

    expect(borderedEntry?.className).toContain("border-[#b0aea5]/20");
  });

  it("should render multiple category groups per release", () => {
    const { container } = render(<LoadingState />);
    const articles = container.querySelectorAll("article");

    // Each article should have multiple .space-y-3 divs (category groups)
    const firstArticle = articles[0];
    const categoryGroups = firstArticle?.querySelectorAll(".space-y-3");

    expect(categoryGroups.length).toBeGreaterThanOrEqual(2);
  });

  it("should have version skeleton in sidebar", () => {
    const { container } = render(<LoadingState />);
    const article = container.querySelector("article");
    const sidebar = article?.querySelector(".w-48");
    // Query by data-slot attribute (stable) rather than Tailwind classes (may reorder)
    const versionSkeleton = sidebar?.querySelector('[data-slot="skeleton"]');

    expect(versionSkeleton).toBeInTheDocument();
  });

  it("should use brand gray color for skeletons", () => {
    const { container } = render(<LoadingState />);
    const skeleton = container.querySelector('[data-slot="skeleton"]');

    // Verify skeleton uses brand gray override class
    expect(skeleton?.className).toContain("bg-[#b0aea5]/20");
  });

  it("should have animate-pulse class for skeleton animation", () => {
    const { container } = render(<LoadingState />);
    const skeleton = container.querySelector('[data-slot="skeleton"]');

    // Skeleton component has built-in animate-pulse
    // Tailwind automatically respects prefers-reduced-motion via CSS
    expect(skeleton?.className).toContain("animate-pulse");
  });

  it("should work with reduced motion preference (CSS-level)", () => {
    // Note: Tailwind's animate-pulse automatically includes:
    // @media (prefers-reduced-motion: reduce) { animation: none; }
    // This is a documentation test - actual behavior is CSS-level
    const { container } = render(<LoadingState />);
    const skeleton = container.querySelector('[data-slot="skeleton"]');

    // Verify the animate-pulse class is present (CSS handles reduced motion)
    expect(skeleton?.className).toContain("animate-pulse");

    // MANUAL TESTING REQUIRED: The actual reduced motion behavior is handled by Tailwind CSS
    // and cannot be tested via JSDOM without CSS evaluation. To verify:
    // 1. Open the app in a browser
    // 2. Set System Preferences > Accessibility > Display > Reduce motion ON
    // 3. Verify skeleton loading animation stops (no pulse effect)
    // 4. This should be verified during Story 2.7 integration
  });
});
