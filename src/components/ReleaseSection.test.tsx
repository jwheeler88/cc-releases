import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ReleaseSection } from "./ReleaseSection";
import type { ReleaseEntry as ReleaseEntryType } from "@/lib/types";

describe("ReleaseSection", () => {
  const mockEntries: ReleaseEntryType[] = [
    { content: "Test content", category: "features" },
  ];

  it("should render version and date", () => {
    render(
      <ReleaseSection
        version="1.0.53"
        date="2025-01-15"
        entries={mockEntries}
      />,
    );

    expect(screen.getByText("1.0.53")).toBeInTheDocument();
    expect(screen.getByText("2025-01-15")).toBeInTheDocument();
  });

  it("should use semantic HTML elements", () => {
    const { container } = render(
      <ReleaseSection
        version="1.0.53"
        date="2025-01-15"
        entries={mockEntries}
      />,
    );

    const article = container.querySelector("article");
    expect(article).toBeInTheDocument();

    const time = container.querySelector("time");
    expect(time).toBeInTheDocument();
    expect(time).toHaveAttribute("dateTime", "2025-01-15");
  });

  it("should have complete sticky sidebar positioning classes", () => {
    const { container } = render(
      <ReleaseSection
        version="1.0.53"
        date="2025-01-15"
        entries={mockEntries}
      />,
    );

    const sidebar = container.querySelector(".md\\:sticky");
    expect(sidebar).toBeInTheDocument();
    expect(sidebar?.className).toContain("top-8");
    expect(sidebar?.className).toContain("h-fit");
    expect(sidebar?.className).toContain("w-48");
    expect(sidebar?.className).toContain("shrink-0");
  });

  it("should have responsive layout classes", () => {
    const { container } = render(
      <ReleaseSection
        version="1.0.53"
        date="2025-01-15"
        entries={mockEntries}
      />,
    );

    const article = container.querySelector("article");
    expect(article?.className).toContain("flex-col");
    expect(article?.className).toContain("md:flex-row");
    expect(article?.className).toContain("gap-4");
    expect(article?.className).toContain("md:gap-16");
  });

  it("should have correct typography classes", () => {
    const { container } = render(
      <ReleaseSection
        version="1.0.53"
        date="2025-01-15"
        entries={mockEntries}
      />,
    );

    const version = container.querySelector("h2");
    expect(version?.className).toContain("text-[28px]");
    expect(version?.className).toContain("md:text-[36px]");
    expect(version?.className).toContain("font-[Poppins]");
    expect(version?.className).toContain("text-[#faf9f5]");

    const time = container.querySelector("time");
    expect(time?.className).toContain("text-sm");
    expect(time?.className).toContain("font-[Lora]");
    expect(time?.className).toContain("text-[#b0aea5]");
  });

  it("should convert non-ISO dates to ISO format for dateTime attribute", () => {
    const { container } = render(
      <ReleaseSection
        version="1.0.53"
        date="January 15, 2025"
        entries={mockEntries}
      />,
    );

    const time = container.querySelector("time");
    expect(time).toHaveAttribute("dateTime", "2025-01-15");
    expect(time?.textContent).toBe("January 15, 2025"); // Display unchanged
  });

  it("should have aria-live region for accessibility", () => {
    const { container } = render(
      <ReleaseSection
        version="1.0.53"
        date="2025-01-15"
        entries={mockEntries}
      />,
    );

    const contentDiv = container.querySelector(".max-w-prose");
    expect(contentDiv).toHaveAttribute("aria-live", "polite");
  });
});

describe("ReleaseSection - Category Grouping", () => {
  const mockEntries: ReleaseEntryType[] = [
    { content: "Add new feature", category: "features" },
    { content: "Fix critical bug", category: "bugfixes" },
    { content: "Another feature", category: "features" },
    { content: "Optimize performance", category: "performance" },
  ];

  it("should group entries by category", () => {
    render(
      <ReleaseSection
        version="1.0.0"
        date="2024-01-01"
        entries={mockEntries}
      />,
    );

    // Should render CategoryGroup headers (checking via role)
    const headers = screen.getAllByRole("heading", { level: 3 });
    const headerTexts = headers.map((h) => h.textContent);
    expect(headerTexts).toContain("Features");
    expect(headerTexts).toContain("Bug Fixes");
    expect(headerTexts).toContain("Performance");
  });

  it("should not render empty categories", () => {
    const entriesNoDevx: ReleaseEntryType[] = [
      { content: "Add feature", category: "features" },
    ];
    render(
      <ReleaseSection
        version="1.0.0"
        date="2024-01-01"
        entries={entriesNoDevx}
      />,
    );

    const headers = screen.getAllByRole("heading", { level: 3 });
    const headerTexts = headers.map((h) => h.textContent);
    expect(headerTexts).toContain("Features");
    expect(headerTexts).not.toContain("DevX");
  });

  it("should render categories in display order", () => {
    render(
      <ReleaseSection
        version="1.0.0"
        date="2024-01-01"
        entries={mockEntries}
      />,
    );

    const headers = screen.getAllByRole("heading", { level: 3 });
    expect(headers[0]).toHaveTextContent("Features");
    expect(headers[1]).toHaveTextContent("Bug Fixes");
    expect(headers[2]).toHaveTextContent("Performance");
  });
});
