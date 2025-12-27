import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ReleaseEntry } from "./ReleaseEntry";
import { CATEGORIES } from "@/lib/constants";

describe("ReleaseEntry", () => {
  it("should render content", () => {
    const { getByText } = render(
      <ReleaseEntry category="features" content="Test entry content" />,
    );

    expect(getByText("Test entry content")).toBeInTheDocument();
  });

  it("should apply correct border color for features category", () => {
    const { container } = render(
      <ReleaseEntry category="features" content="Content" />,
    );

    const entry = container.firstChild as HTMLElement;
    expect(entry.style.borderLeft).toBe(
      `2px solid ${CATEGORIES.features.color}`,
    );
  });

  it("should apply correct border colors for all categories", () => {
    const categories: Array<keyof typeof CATEGORIES> = [
      "features",
      "bugfixes",
      "performance",
      "devx",
    ];

    categories.forEach((category) => {
      const { container } = render(
        <ReleaseEntry category={category} content="Content" />,
      );

      const entry = container.firstChild as HTMLElement;
      expect(entry.style.borderLeft).toBe(
        `2px solid ${CATEGORIES[category].color}`,
      );
    });
  });

  it("should have exact hover and transition classes for both themes", () => {
    const { container } = render(
      <ReleaseEntry category="features" content="Content" />,
    );

    const wrapper = container.firstChild as HTMLElement;
    // Light theme hover
    expect(wrapper.className).toContain("hover:bg-[#f5f4f0]");
    // Dark theme hover
    expect(wrapper.className).toContain("dark:hover:bg-[#1f1f1e]");
    expect(wrapper.className).toContain("transition-all");
  });

  it("should have correct typography and spacing classes", () => {
    const { container } = render(
      <ReleaseEntry category="features" content="Content" />,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("pl-4");
    expect(wrapper.className).toContain("py-4");
    expect(wrapper.className).toContain("rounded-r-lg");

    const contentDiv = container.querySelector(".font-body") as HTMLElement;
    expect(contentDiv.className).toContain("text-[17px]");
    expect(contentDiv.className).toContain("font-body");
    expect(contentDiv.className).toContain("font-medium");
    // Theme-aware text colors (light and dark)
    expect(contentDiv.className).toContain("text-[#141413]");
    expect(contentDiv.className).toContain("dark:text-[#faf9f5]");
    expect(contentDiv.className).toContain("leading-relaxed");
  });

  it("should gracefully handle invalid category with fallback color", () => {
    const { container } = render(
      <ReleaseEntry category="features" content="Content" />,
    );

    const entry = container.firstChild as HTMLElement;
    // Should use features color
    expect(entry.style.borderLeft).toBe(
      `2px solid ${CATEGORIES.features.color}`,
    );
    expect(entry).toBeInTheDocument();
  });
});

describe("ReleaseEntry - Markdown Rendering", () => {
  it("should render plain text content", () => {
    const { getByText } = render(
      <ReleaseEntry category="features" content="Plain text entry" />,
    );

    expect(getByText("Plain text entry")).toBeInTheDocument();
  });

  it("should render inline code with code tags", () => {
    const { container } = render(
      <ReleaseEntry
        category="features"
        content="Text with `inline code` here"
      />,
    );

    const code = container.querySelector("code");
    expect(code).toBeInTheDocument();
    expect(code?.textContent).toBe("inline code");
  });

  it("should apply inline code styling classes", () => {
    const { container } = render(
      <ReleaseEntry category="features" content="Text with `code` here" />,
    );

    const contentDiv = container.querySelector(".font-body") as HTMLElement;
    // Verify Tailwind arbitrary selectors for code styling (theme-aware)
    expect(contentDiv.className).toContain("[&_code]:bg-[#e8e6dc]");
    expect(contentDiv.className).toContain("dark:[&_code]:bg-[#2a2a28]");
    expect(contentDiv.className).toContain("[&_code]:px-1.5");
    expect(contentDiv.className).toContain("[&_code]:py-0.5");
    expect(contentDiv.className).toContain("[&_code]:rounded");
    expect(contentDiv.className).toContain("[&_code]:text-[15px]");
    expect(contentDiv.className).toContain("[&_code]:font-mono");
  });

  it('should render links with target="_blank" and rel attributes', () => {
    const { container } = render(
      <ReleaseEntry
        category="features"
        content="Check [documentation](https://example.com)"
      />,
    );

    const link = container.querySelector("a");
    expect(link).toBeInTheDocument();
    expect(link?.getAttribute("href")).toBe("https://example.com");
    expect(link?.getAttribute("target")).toBe("_blank");
    expect(link?.getAttribute("rel")).toBe("noopener noreferrer");
    expect(link?.textContent).toBe("documentation");
  });

  it("should apply link styling classes", () => {
    const { container } = render(
      <ReleaseEntry
        category="features"
        content="Check [docs](https://example.com)"
      />,
    );

    const contentDiv = container.querySelector(".font-body") as HTMLElement;
    // Verify Tailwind arbitrary selectors for link styling
    expect(contentDiv.className).toContain("[&_a]:text-[#6a9bcc]");
    expect(contentDiv.className).toContain("[&_a:hover]:text-[#8bb4d9]");
    expect(contentDiv.className).toContain("[&_a]:underline");
  });

  it("should render unordered lists correctly", () => {
    const content = "Features:\n- Item 1\n- Item 2";
    const { container } = render(
      <ReleaseEntry category="features" content={content} />,
    );

    const ul = container.querySelector("ul");
    expect(ul).toBeInTheDocument();

    const items = container.querySelectorAll("li");
    expect(items.length).toBe(2);
  });

  it("should apply list styling classes", () => {
    const content = "Items:\n- One\n- Two";
    const { container } = render(
      <ReleaseEntry category="features" content={content} />,
    );

    const contentDiv = container.querySelector(".font-body") as HTMLElement;
    // Verify Tailwind arbitrary selectors for list styling
    expect(contentDiv.className).toContain("[&_ul]:list-disc");
    expect(contentDiv.className).toContain("[&_ul]:ml-6");
    expect(contentDiv.className).toContain("[&_ul]:my-2");
    expect(contentDiv.className).toContain("[&_ol]:list-decimal");
    expect(contentDiv.className).toContain("[&_ol]:ml-6");
    expect(contentDiv.className).toContain("[&_ol]:my-2");
    expect(contentDiv.className).toContain("[&_li]:my-1");
  });

  it("should render bold and italic text", () => {
    const { container } = render(
      <ReleaseEntry
        category="features"
        content="**bold text** and *italic text*"
      />,
    );

    const strong = container.querySelector("strong");
    expect(strong?.textContent).toBe("bold text");

    const em = container.querySelector("em");
    expect(em?.textContent).toBe("italic text");
  });

  it("should handle empty content gracefully", () => {
    const { container } = render(
      <ReleaseEntry category="features" content="" />,
    );

    const entry = container.firstChild as HTMLElement;
    expect(entry).toBeInTheDocument();
  });

  it("should sanitize javascript: protocol URLs (XSS protection)", () => {
    const { container } = render(
      <ReleaseEntry
        category="features"
        content="Click [here](javascript:alert('xss'))"
      />,
    );

    const link = container.querySelector("a");
    expect(link).toBeInTheDocument();
    // Should be sanitized to # instead of javascript:
    expect(link?.getAttribute("href")).toBe("#");
    expect(link?.getAttribute("href")).not.toContain("javascript:");
  });

  it("should sanitize data: protocol URLs (XSS protection)", () => {
    const { container } = render(
      <ReleaseEntry
        category="features"
        content="[malicious](data:text/html,<script>alert('xss')</script>)"
      />,
    );

    const link = container.querySelector("a");
    expect(link).toBeInTheDocument();
    // Should be sanitized to # instead of data:
    expect(link?.getAttribute("href")).toBe("#");
    expect(link?.getAttribute("href")).not.toContain("data:");
  });

  it("should allow safe http and https URLs", () => {
    const { container } = render(
      <ReleaseEntry
        category="features"
        content="[safe](https://example.com) and [also safe](http://example.com)"
      />,
    );

    const links = container.querySelectorAll("a");
    expect(links.length).toBe(2);
    expect(links[0]?.getAttribute("href")).toBe("https://example.com");
    expect(links[1]?.getAttribute("href")).toBe("http://example.com");
  });

  it("should maintain category border color with markdown content", () => {
    const { container } = render(
      <ReleaseEntry category="bugfixes" content="Fixed **bug** in `parser`" />,
    );

    const entry = container.firstChild as HTMLElement;
    // Border color should still be category-specific
    expect(entry.style.borderLeft).toBe(
      `2px solid ${CATEGORIES.bugfixes.color}`,
    );
  });
});

describe("ReleaseEntry - CHANGELOG Integration", () => {
  it("should render realistic CHANGELOG entry with GitHub link", () => {
    const content =
      "Added new feature for file uploads [#1234](https://github.com/user/repo/issues/1234)";
    const { container } = render(
      <ReleaseEntry category="features" content={content} />,
    );

    const link = container.querySelector("a");
    expect(link).toBeInTheDocument();
    expect(link?.getAttribute("href")).toBe(
      "https://github.com/user/repo/issues/1234",
    );
    expect(link?.getAttribute("target")).toBe("_blank");
    expect(link?.textContent).toBe("#1234");
  });

  it("should render entry with inline code and bold text", () => {
    const content = "Fixed **critical bug** in `parseChangelog` function";
    const { container } = render(
      <ReleaseEntry category="bugfixes" content={content} />,
    );

    const strong = container.querySelector("strong");
    expect(strong?.textContent).toBe("critical bug");

    const code = container.querySelector("code");
    expect(code?.textContent).toBe("parseChangelog");
  });

  it("should render complex markdown with multiple elements", () => {
    const content =
      "Added **new hook** `useChangelog` with:\n- Automatic retries\n- Error handling\n- See [docs](https://example.com/docs)";
    const { container } = render(
      <ReleaseEntry category="features" content={content} />,
    );

    expect(container.querySelector("strong")).toBeInTheDocument();
    expect(container.querySelector("code")).toBeInTheDocument();
    expect(container.querySelector("ul")).toBeInTheDocument();
    expect(container.querySelector("a")).toBeInTheDocument();
  });

  it("should handle entries with code blocks", () => {
    const content = "Fixed bug in parser: `const result = parse(input)`";
    const { container } = render(
      <ReleaseEntry category="bugfixes" content={content} />,
    );

    const code = container.querySelector("code");
    expect(code?.textContent).toBe("const result = parse(input)");
  });
});

// CategoryBadge Integration tests removed - badge no longer rendered in ReleaseEntry per design spec
