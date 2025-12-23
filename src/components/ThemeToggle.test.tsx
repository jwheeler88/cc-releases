import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { ThemeToggle } from './ThemeToggle';
import { ThemeProvider } from '@/contexts/ThemeContext';

// Mock localStorage
const createMockLocalStorage = () => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
};

// Mock matchMedia
const mockMatchMedia = (matches: boolean) =>
  vi.fn(() => ({
    matches,
    media: '(prefers-color-scheme: dark)',
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));

// Helper to render with ThemeProvider
function renderWithTheme(defaultTheme?: 'light' | 'dark') {
  return render(
    <ThemeProvider defaultTheme={defaultTheme}>
      <ThemeToggle />
    </ThemeProvider>
  );
}

describe('ThemeToggle', () => {
  let mockLocalStorage: ReturnType<typeof createMockLocalStorage>;

  beforeEach(() => {
    mockLocalStorage = createMockLocalStorage();
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });
    Object.defineProperty(window, 'matchMedia', {
      value: mockMatchMedia(true),
      writable: true,
    });
    mockLocalStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Icon rendering', () => {
    it('renders Sun icon when theme is dark', () => {
      renderWithTheme('dark');
      expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('moon-icon')).not.toBeInTheDocument();
    });

    it('renders Moon icon when theme is light', () => {
      renderWithTheme('light');
      expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('sun-icon')).not.toBeInTheDocument();
    });
  });

  describe('Click behavior', () => {
    it('toggles from dark to light on click', () => {
      renderWithTheme('dark');
      const button = screen.getByRole('button');

      // Initially dark mode - Sun icon shown
      expect(screen.getByTestId('sun-icon')).toBeInTheDocument();

      fireEvent.click(button);

      // After click - Moon icon shown (light mode)
      expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
    });

    it('toggles from light to dark on click', () => {
      renderWithTheme('light');
      const button = screen.getByRole('button');

      // Initially light mode - Moon icon shown
      expect(screen.getByTestId('moon-icon')).toBeInTheDocument();

      fireEvent.click(button);

      // After click - Sun icon shown (dark mode)
      expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has aria-label "Switch to light mode" when dark', () => {
      renderWithTheme('dark');
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
    });

    it('has aria-label "Switch to dark mode" when light', () => {
      renderWithTheme('light');
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
    });

    it('aria-label updates after toggle', () => {
      renderWithTheme('dark');
      const button = screen.getByRole('button');

      expect(button).toHaveAttribute('aria-label', 'Switch to light mode');

      fireEvent.click(button);

      expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
    });

    it('is keyboard accessible', () => {
      renderWithTheme('dark');
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe('BUTTON');
    });
  });

  describe('Styling', () => {
    it('uses ghost button variant', () => {
      renderWithTheme('dark');
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-variant', 'ghost');
    });

    it('uses icon size', () => {
      renderWithTheme('dark');
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-size', 'icon');
    });
  });
});
