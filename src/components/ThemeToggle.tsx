import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

export interface ThemeToggleProps {
  // No props currently, but interface allows future extensibility
  // e.g., className?: string, position?: 'top-right' | 'top-left'
}

export function ThemeToggle(_props?: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="bg-[#faf9f5] dark:bg-[#1a1a19] border border-[#e8e6dc] dark:border-[#2a2a28] rounded-lg shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        className="text-[#141413] hover:text-[#141413] hover:bg-[#e8e6dc] dark:text-[#b0aea5] dark:hover:text-[#faf9f5] dark:hover:bg-[#2a2a28] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#d97757]"
      >
        {isDark ? (
          <Sun className="h-5 w-5" data-testid="sun-icon" />
        ) : (
          <Moon className="h-5 w-5" data-testid="moon-icon" />
        )}
      </Button>
    </div>
  );
}
