import type { Category } from "@/lib/types";
import { CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const categoryBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium border font-heading",
);

interface CategoryBadgeProps
  extends
    React.ComponentPropsWithoutRef<"span">,
    VariantProps<typeof categoryBadgeVariants> {
  category: Category;
}

/**
 * CategoryBadge displays a color-coded pill badge for release entry categories.
 *
 * Uses the CATEGORIES constant for labels and colors:
 * - Features: Blue (#6a9bcc)
 * - Bug Fixes: Green (#788c5d)
 * - Performance: Orange (#d97757)
 * - DevX: Purple (#9b8bb0)
 *
 * Hybrid approach: CVA for base styling, inline styles for dynamic category colors.
 *
 * @example
 * <CategoryBadge category="features" />
 * <CategoryBadge category="bugfixes" />
 */
export function CategoryBadge({
  category,
  className,
  ...props
}: CategoryBadgeProps): React.JSX.Element {
  const { label, color } = CATEGORIES[category];

  return (
    <span
      className={cn(categoryBadgeVariants(), className)}
      style={{
        backgroundColor: `${color}33`, // 20% opacity
        borderColor: `${color}4D`, // 30% opacity
        color: color, // Full opacity for text
      }}
      {...props}
    >
      {label}
    </span>
  );
}
