import type { ReleaseEntry as ReleaseEntryType, Category } from "@/lib/types";
import { CategoryGroup } from "./CategoryGroup";
import { ReleaseEntry } from "./ReleaseEntry";

// Display order for UI (user-friendly order, NOT matching CATEGORIES priority)
const DISPLAY_ORDER: Category[] = [
  "features",
  "bugfixes",
  "performance",
  "devx",
];

interface ReleaseSectionProps {
  version: string;
  /** Release date in ISO 8601 format (YYYY-MM-DD) for HTML5 compliance */
  date: string;
  entries: ReleaseEntryType[];
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
    return parsed.toISOString().split("T")[0];
  }

  // Fallback to original (best effort)
  return dateString;
}

export function ReleaseSection({
  version,
  date,
  entries,
}: ReleaseSectionProps) {
  const isoDate = toISODate(date);

  // Group entries by category
  const groupedEntries = DISPLAY_ORDER.reduce(
    (acc, category) => {
      acc[category] = entries.filter((e) => e.category === category);
      return acc;
    },
    {} as Record<Category, ReleaseEntryType[]>,
  );

  return (
    <article className="relative flex flex-col md:flex-row gap-4 md:gap-16 py-16">
      {/* Decorative divider - top of each release (gradient fade) */}
      <div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e8e6dc] to-transparent dark:via-[#2a2a28]"
        aria-hidden="true"
      />

      {/* Sticky version/date sidebar (desktop only) */}
      <div className="md:sticky top-8 h-fit w-48 shrink-0">
        {/* Version header - prominent accent color */}
        <h2 className="text-[32px] md:text-[42px] font-heading font-bold mb-0.5 tracking-tight leading-none">
          <span className="text-[#d97757]">{version}</span>
        </h2>

        {/* Release date */}
        <time className="text-sm text-[#9b8bb0] font-body" dateTime={isoDate}>
          └─ {date}
        </time>
      </div>

      {/* Release content grouped by category */}
      <div className="flex-1 max-w-prose" aria-live="polite">
        {DISPLAY_ORDER.map((category) => (
          <CategoryGroup key={category} category={category}>
            {groupedEntries[category].map((entry, idx) => (
              <ReleaseEntry
                key={`${category}-${idx}`}
                category={entry.category}
                content={entry.content}
              />
            ))}
          </CategoryGroup>
        ))}
      </div>
    </article>
  );
}
