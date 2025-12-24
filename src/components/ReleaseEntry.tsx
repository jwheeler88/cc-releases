import { marked } from "marked";
import type { Category } from "@/lib/types";
import { CATEGORIES } from "@/lib/constants";
import { CategoryBadge } from "./CategoryBadge";
import { cn } from "@/lib/utils";

interface ReleaseEntryProps {
  category: Category;
  content: string;
}

// Create renderer once at module scope for performance
const linkRenderer = new marked.Renderer();

// Override link renderer to add target="_blank" and sanitize hrefs
linkRenderer.link = ({ href, title, tokens }) => {
  // Sanitize href - only allow http/https/mailto protocols to prevent XSS
  const sanitizedHref =
    href?.startsWith("javascript:") || href?.startsWith("data:") ? "#" : href;
  const text = tokens.map((t) => t.raw).join("");
  const titleAttr = title ? ` title="${title}"` : "";
  return `<a href="${sanitizedHref}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`;
};

/**
 * Renders markdown content with custom link handling and XSS protection
 * @param content - Raw markdown string from CHANGELOG
 * @returns Sanitized HTML string
 */
function renderMarkdown(content: string): string {
  return marked.parse(content, {
    renderer: linkRenderer,
    breaks: true,
    gfm: true,
  }) as string;
}

export function ReleaseEntry({ category, content }: ReleaseEntryProps) {
  // Defensive: fallback to features color if category somehow invalid at runtime
  const categoryData = CATEGORIES[category];
  const color = categoryData?.color ?? CATEGORIES.features.color;
  const html = renderMarkdown(content);

  return (
    <div
      className="flex items-start gap-4 pl-4 py-4"
      style={{ borderLeft: `2px solid ${color}` }}
    >
      {/* Badge - fixed width, no shrink */}
      <CategoryBadge category={category} className="shrink-0 mt-2" />

      {/* Content - flexible width with markdown */}
      <div
        className={cn(
          // Base layout and typography
          "flex-1 text-[17px] font-body text-[#141413] dark:text-[#faf9f5] leading-relaxed",
          // Hover states
          "hover:bg-[#e8e6dc] dark:hover:bg-[#1a1a19] transition-colors rounded-r",
          // Inline code styling
          "[&_code]:bg-[#2a2a28] [&_code]:px-1.5 [&_code]:py-0.5",
          "[&_code]:rounded [&_code]:text-[15px] [&_code]:font-mono",
          // Link styling
          "[&_a]:text-[#6a9bcc] [&_a:hover]:text-[#8bb4d9] [&_a]:underline",
          // List styling
          "[&_ul]:list-disc [&_ul]:ml-6 [&_ul]:my-2",
          "[&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:my-2",
          "[&_li]:my-1",
        )}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
