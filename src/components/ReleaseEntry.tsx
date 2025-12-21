import { marked } from 'marked';
import type { Category } from '@/lib/types';
import { CATEGORIES } from '@/lib/constants';

// Configure marked globally for this module
marked.setOptions({
  breaks: true,
  gfm: true,
});

interface ReleaseEntryProps {
  category: Category;
  content: string;
}

/**
 * Renders markdown content with custom link handling
 * @param content - Raw markdown string from CHANGELOG
 * @returns Sanitized HTML string
 */
function renderMarkdown(content: string): string {
  const renderer = new marked.Renderer();

  // Override link renderer to add target="_blank" and security attributes
  renderer.link = ({ href, title, tokens }) => {
    const text = tokens.map(t => t.raw).join('');
    const titleAttr = title ? ` title="${title}"` : '';
    return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`;
  };

  return marked.parse(content, { renderer }) as string;
}

export function ReleaseEntry({ category, content }: ReleaseEntryProps) {
  // Defensive: fallback to features color if category somehow invalid at runtime
  const categoryData = CATEGORIES[category];
  const color = categoryData?.color ?? CATEGORIES.features.color;
  const html = renderMarkdown(content);

  return (
    <div
      className="pl-4 py-2 text-[17px] font-[Lora] text-[#faf9f5] leading-relaxed
                 hover:bg-[#1a1a19] transition-colors rounded-r
                 [&_code]:bg-[#2a2a28] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[15px] [&_code]:font-mono
                 [&_a]:text-[#6a9bcc] [&_a:hover]:text-[#8bb4d9] [&_a]:underline
                 [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:my-2
                 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:my-2
                 [&_li]:my-1"
      style={{ borderLeft: `2px solid ${color}` }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
