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
        className="text-2xl font-semibold font-heading mb-4 tracking-wide"
        style={{
          color,
        }}
      >
        {icon} {label}
      </h3>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
