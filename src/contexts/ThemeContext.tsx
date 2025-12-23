import { createContext, useContext, useState, useCallback, useMemo, useEffect, type ReactNode } from 'react';
import type { Theme } from '@/lib/types';

export interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// localStorage key for theme persistence
const THEME_STORAGE_KEY = 'cc-releases-theme';

// Helper: Safely read theme from localStorage
// Returns: Theme if valid value found, null otherwise
function getStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    // Clear invalid values to prevent pollution
    if (stored !== null) {
      localStorage.removeItem(THEME_STORAGE_KEY);
    }
    return null;
  } catch {
    // localStorage unavailable (private browsing, SSR, etc.)
    return null;
  }
}

// Helper: Detect system color scheme preference
// Returns: Theme based on OS setting, defaults to 'dark'
function getSystemPreference(): Theme {
  if (typeof window === 'undefined') return 'dark'; // SSR fallback
  if (!window.matchMedia) return 'dark'; // Browser compatibility fallback

  const isDark = window.matchMedia('(prefers-color-scheme: dark)')?.matches ?? false;
  return isDark ? 'dark' : 'light';
}

// Helper: Get initial theme with priority order
// Returns: Theme from localStorage > system preference > 'dark' fallback
function getInitialTheme(): Theme {
  // Priority 1: Explicit user choice from localStorage
  const stored = getStoredTheme();
  if (stored) return stored;

  // Priority 2: System preference (includes 'dark' fallback)
  return getSystemPreference();
}

export function ThemeProvider({ children, defaultTheme }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => defaultTheme ?? getInitialTheme());

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  // Persist theme to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      // Warn developer if localStorage unavailable
      // User preference won't persist, but app continues working
      console.warn('Theme persistence failed:', error);
    }
  }, [theme]);

  // Sync theme with document root class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
