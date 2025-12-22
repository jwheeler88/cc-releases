import type { Category } from '@/lib/types';
import { CATEGORIES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const categoryGroupVariants = cva('mb-8');

interface CategoryGroupProps
  extends React.ComponentPropsWithoutRef<'section'>,
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
  if (!children || (Array.isArray(children) && children.length === 0)) {
    return null;
  }

  const { label, color } = CATEGORIES[category];

  return (
    <section className={cn(categoryGroupVariants(), className)} {...props}>
      <h3
        className="text-lg font-semibold font-[Poppins] mb-4 pb-2"
        style={{
          color: color,
          borderBottom: `2px solid ${color}`,
        }}
      >
        {label}
      </h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
