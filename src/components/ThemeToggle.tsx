import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

export interface ThemeToggleProps {
  // No props currently, but interface allows future extensibility
  // e.g., className?: string, position?: 'top-right' | 'top-left'
}

export function ThemeToggle(props?: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="text-[#b0aea5] hover:text-[#faf9f5] hover:bg-[#1a1a19] dark:text-[#b0aea5] dark:hover:text-[#faf9f5] dark:hover:bg-[#1a1a19] focus-visible:ring-[#d97757]"
    >
      {isDark ? (
        <Sun className="h-5 w-5" data-testid="sun-icon" />
      ) : (
        <Moon className="h-5 w-5" data-testid="moon-icon" />
      )}
    </Button>
  );
}
