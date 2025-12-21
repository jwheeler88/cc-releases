import type { ReactNode } from 'react';
import type { Category } from '@/lib/types';
import { CATEGORIES } from '@/lib/constants';

interface ReleaseEntryProps {
  category: Category;
  children: ReactNode;
}

export function ReleaseEntry({ category, children }: ReleaseEntryProps) {
  // Defensive: fallback to features color if category somehow invalid at runtime
  const categoryData = CATEGORIES[category];
  const color = categoryData?.color ?? CATEGORIES.features.color;

  return (
    <div
      className="pl-4 py-2 text-[17px] font-[Lora] text-[#faf9f5] leading-relaxed
                 hover:bg-[#1a1a19] transition-colors rounded-r"
      style={{ borderLeft: `2px solid ${color}` }}
    >
      {children}
    </div>
  );
}
