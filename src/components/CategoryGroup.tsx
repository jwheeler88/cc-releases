import React from "react";
import type { Category } from "@/lib/types";
import { CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const categoryGroupVariants = cva("mb-8");

interface CategoryGroupProps
  extends
    React.ComponentPropsWithoutRef<"section">,
    VariantProps<typeof categoryGroupVariants> {
  category: Category;
  children: React.ReactNode;
}

/**
 * CategoryGroup wraps and organizes ReleaseEntry components by category.
 *
 * Features:
 * - Colored category header with matching 2px bottom border
 * - Vertical stack layout for child ReleaseEntry components
 * - Returns null if children is empty/undefined (empty categories hidden)
 * - Uses CATEGORIES constant for labels and colors (single source of truth)
 *
 * Styling approach:
 * - CVA for base/static styles
 * - Inline styles for dynamic category colors
 * - Follows established hybrid pattern from CategoryBadge
 *
 * @example
 * <CategoryGroup category="features">
 *   <ReleaseEntry content="Added new feature" category="features" />
 *   <ReleaseEntry content="Another feature" category="features" />
 * </CategoryGroup>
 */
export function CategoryGroup({
  category,
  children,
  className,
  ...props
}: CategoryGroupProps): React.JSX.Element | null {
  // AC8: Empty categories are not displayed
  // Use React.Children.count() to correctly handle edge cases (0, "", false are valid React children)
  if (React.Children.count(children) === 0) {
    return null;
  }

  const { label, color } = CATEGORIES[category];
  const headingId = `category-${category}`;

  // Contextual icons for each category
  const categoryIcons: Record<Category, string> = {
    features: '✨',
    bugfixes: '🐛',
    performance: '⚡',
    devx: '🔧',
  };

  const icon = categoryIcons[category];

  return (
    <section
      className={cn(categoryGroupVariants(), className)}
      aria-labelledby={headingId}
      {...props}
    >
      <h3
        id={headingId}
        className="text-2xl font-semibold font-heading tracking-[0.15em] mb-4 inline-flex items-center gap-3"
        style={{
          color,
        }}
      >
        <span
          className="inline-flex items-center justify-center w-10 h-10"
          style={{
            backgroundColor: `${color}20`,
            borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
          }}
        >
          {icon}
        </span>
        {label}
      </h3>
      {/* Timeline container with vertical dashed line */}
      <div className="relative">
        {/* Vertical dashed line - light theme */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[2px] z-10 dark:hidden"
          style={{
            backgroundImage: 'linear-gradient(to bottom, #e8e6dc 50%, transparent 50%)',
            backgroundSize: '2px 16px',
            backgroundRepeat: 'repeat-y',
          }}
          aria-hidden="true"
        />
        {/* Vertical dashed line - dark theme */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[2px] z-10 hidden dark:block"
          style={{
            backgroundImage: 'linear-gradient(to bottom, #3a3a38 50%, transparent 50%)',
            backgroundSize: '2px 16px',
            backgroundRepeat: 'repeat-y',
          }}
          aria-hidden="true"
        />
        {/* Entries with spacing */}
        <div className="space-y-4">{children}</div>
      </div>
    </section>
  );
}
