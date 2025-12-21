import type { ReactNode } from 'react';

interface ReleaseSectionProps {
  version: string;
  /** Release date in ISO 8601 format (YYYY-MM-DD) for HTML5 compliance */
  date: string;
  children: ReactNode;
}

/**
 * Converts various date formats to ISO 8601 (YYYY-MM-DD) for <time> dateTime attribute.
 * Falls back to original string if already in ISO format or conversion fails.
 */
function toISODate(dateString: string): string {
  // Already in ISO format (YYYY-MM-DD)
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }

  // Try parsing and converting to ISO
  const parsed = new Date(dateString);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split('T')[0];
  }

  // Fallback to original (best effort)
  return dateString;
}

export function ReleaseSection({ version, date, children }: ReleaseSectionProps) {
  const isoDate = toISODate(date);

  return (
    <article className="relative flex flex-col md:flex-row gap-4 md:gap-16 py-16">
      {/* Sticky version/date sidebar (desktop only) */}
      <div className="md:sticky top-8 h-fit w-48 shrink-0">
        {/* Version header */}
        <h2 className="text-[28px] md:text-[36px] font-[Poppins] font-semibold text-[#faf9f5] mb-1">
          {version}
        </h2>

        {/* Release date */}
        <time className="text-sm text-[#b0aea5] font-[Lora]" dateTime={isoDate}>
          {date}
        </time>
      </div>

      {/* Release content area */}
      <div className="flex-1 max-w-prose">
        {children}
      </div>
    </article>
  );
}
