import { marked } from "marked";
import type { Category } from "@/lib/types";
import { CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Copy } from "lucide-react";
import { toast } from "sonner";

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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  return (
    <div
      className={cn(
        "relative group pl-4 py-4 rounded-r-lg transition-all duration-200",
        // Enhanced hover states per spec
        "hover:bg-[#f5f4f0] dark:hover:bg-[#1f1f1e]",
        "hover:pl-5",
        "hover:shadow-sm dark:hover:shadow-none",
      )}
      style={{ borderLeft: `2px solid ${color}` }}
    >
      {/* Content - full width with markdown (badge removed per spec) */}
      <div
        className={cn(
          // Base layout and typography
          "text-[17px] font-body font-medium text-[#141413] dark:text-[#faf9f5] leading-relaxed",
          // Inline code styling (theme-aware)
          "[&_code]:bg-[#e8e6dc] dark:[&_code]:bg-[#2a2a28] [&_code]:px-1.5 [&_code]:py-0.5",
          "[&_code]:rounded [&_code]:text-[14px] [&_code]:font-mono",
          // Link styling
          "[&_a]:text-[#6a9bcc] [&_a:hover]:text-[#8bb4d9] [&_a]:underline",
          // List styling
          "[&_ul]:list-disc [&_ul]:ml-6 [&_ul]:my-2",
          "[&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:my-2",
          "[&_li]:my-1",
        )}
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* Copy button - visible on hover */}
      <button
        onClick={handleCopy}
        className={cn(
          "absolute bottom-3 right-3 p-2 rounded-md",
          "bg-[#e8e6dc] dark:bg-[#2a2a28]",
          "text-[#141413] dark:text-[#faf9f5]",
          "hover:bg-[#d97757] hover:text-[#faf9f5]",
          "transition-all duration-200",
          "opacity-0 group-hover:opacity-100",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d97757]",
        )}
        aria-label="Copy to clipboard"
      >
        <Copy className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  );
}
