import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, screen, renderHook, act, cleanup } from '@testing-library/react';
import { ThemeProvider, useTheme } from './ThemeContext';

// Mock matchMedia factory
const mockMatchMedia = (matches: boolean) =>
  vi.fn(() => ({
    matches,
    media: '(prefers-color-scheme: dark)',
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));

describe('ThemeContext', () => {
  let mockLocalStorage: {
    getItem: ReturnType<typeof vi.fn>;
    setItem: ReturnType<typeof vi.fn>;
    removeItem: ReturnType<typeof vi.fn>;
    clear: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    // Create fresh mock localStorage for each test
    let store: Record<string, string> = {};
    mockLocalStorage = {
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

    // Apply mocks before each test
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(window, 'matchMedia', {
      value: mockMatchMedia(true), // default: prefers dark
      writable: true,
      configurable: true,
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('ThemeProvider', () => {
    it('should render children correctly', () => {
      render(
        <ThemeProvider>
          <div>Test Child</div>
        </ThemeProvider>
      );
      expect(screen.getByText('Test Child')).toBeInTheDocument();
    });

    it('should default to dark theme', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider
      });
      expect(result.current.theme).toBe('dark');
    });

    it('should accept custom defaultTheme prop', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => (
          <ThemeProvider defaultTheme="light">{children}</ThemeProvider>
        )
      });
      expect(result.current.theme).toBe('light');
    });
  });

  describe('useTheme hook', () => {
    it('should return theme, setTheme, and toggleTheme', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider
      });

      expect(result.current).toHaveProperty('theme');
      expect(result.current).toHaveProperty('setTheme');
      expect(result.current).toHaveProperty('toggleTheme');
      expect(typeof result.current.setTheme).toBe('function');
      expect(typeof result.current.toggleTheme).toBe('function');
    });

    it('should throw error when used outside provider', () => {
      expect(() => {
        renderHook(() => useTheme());
      }).toThrow('useTheme must be used within a ThemeProvider');
    });
  });

  describe('Theme state management', () => {
    it('should update theme when setTheme is called', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider
      });

      act(() => {
        result.current.setTheme('light');
      });

      expect(result.current.theme).toBe('light');
    });

    it('should toggle from dark to light', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider
      });

      expect(result.current.theme).toBe('dark');

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe('light');
    });

    it('should toggle from light to dark', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => (
          <ThemeProvider defaultTheme="light">{children}</ThemeProvider>
        )
      });

      expect(result.current.theme).toBe('light');

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe('dark');
    });

    it('should handle multiple rapid toggles', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider
      });

      expect(result.current.theme).toBe('dark');

      act(() => {
        result.current.toggleTheme(); // dark → light
        result.current.toggleTheme(); // light → dark
        result.current.toggleTheme(); // dark → light
      });

      expect(result.current.theme).toBe('light');
    });
  });

  describe('Multiple consumers', () => {
    it('should provide same theme state to multiple consumers', () => {
      const TestComponent = () => {
        const { theme } = useTheme();
        return <div>Theme: {theme}</div>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
          <TestComponent />
        </ThemeProvider>
      );

      const elements = screen.getAllByText(/Theme: dark/i);
      expect(elements).toHaveLength(2);
    });

    it('should propagate theme changes to all consumers', () => {
      const ThemeChanger = () => {
        const { setTheme } = useTheme();
        return <button onClick={() => setTheme('light')}>Change Theme</button>;
      };

      const ThemeDisplay = ({ testId }: { testId: string }) => {
        const { theme } = useTheme();
        return <div data-testid={testId}>Theme: {theme}</div>;
      };

      render(
        <ThemeProvider>
          <ThemeChanger />
          <ThemeDisplay testId="consumer-1" />
          <ThemeDisplay testId="consumer-2" />
        </ThemeProvider>
      );

      // Verify initial state
      expect(screen.getByTestId('consumer-1')).toHaveTextContent('Theme: dark');
      expect(screen.getByTestId('consumer-2')).toHaveTextContent('Theme: dark');

      // Change theme from one component
      act(() => {
        screen.getByRole('button').click();
      });

      // Verify both consumers updated
      expect(screen.getByTestId('consumer-1')).toHaveTextContent('Theme: light');
      expect(screen.getByTestId('consumer-2')).toHaveTextContent('Theme: light');
    });
  });

  describe('Theme initialization', () => {
    it('should use theme from localStorage when present', () => {
      mockLocalStorage.setItem('cc-releases-theme', 'light');

      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      expect(result.current.theme).toBe('light');
    });

    it('should use system dark preference when no localStorage', () => {
      Object.defineProperty(window, 'matchMedia', {
        value: mockMatchMedia(true), // prefers dark
        writable: true,
      });

      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      expect(result.current.theme).toBe('dark');
    });

    it('should use system light preference when no localStorage', () => {
      Object.defineProperty(window, 'matchMedia', {
        value: mockMatchMedia(false), // prefers light
        writable: true,
      });

      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      expect(result.current.theme).toBe('light');
    });

    it('should fallback to dark when no localStorage and no matchMedia', () => {
      Object.defineProperty(window, 'matchMedia', {
        value: undefined,
        writable: true,
      });

      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      expect(result.current.theme).toBe('dark');
    });

    it('should prioritize localStorage over system preference', () => {
      mockLocalStorage.setItem('cc-releases-theme', 'light');
      Object.defineProperty(window, 'matchMedia', {
        value: mockMatchMedia(true), // prefers dark, but localStorage should win
        writable: true,
      });

      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      expect(result.current.theme).toBe('light');
    });
  });

  describe('Theme persistence', () => {
    it('should save to localStorage when setTheme is called', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      act(() => {
        result.current.setTheme('light');
      });

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('cc-releases-theme', 'light');
    });

    it('should save to localStorage when toggleTheme is called', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      act(() => {
        result.current.toggleTheme();
      });

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('cc-releases-theme', 'light');
    });

    it('should update localStorage when theme changes multiple times', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      act(() => {
        result.current.setTheme('light');
      });
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('cc-releases-theme', 'light');

      act(() => {
        result.current.setTheme('dark');
      });
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('cc-releases-theme', 'dark');
    });
  });

  describe('DOM synchronization', () => {
    it('should add dark class to documentElement when theme is dark', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      expect(result.current.theme).toBe('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should remove dark class from documentElement when theme is light', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      act(() => {
        result.current.setTheme('light');
      });

      expect(result.current.theme).toBe('light');
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('should update documentElement class when theme changes', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      // Start with dark
      expect(document.documentElement.classList.contains('dark')).toBe(true);

      // Toggle to light
      act(() => {
        result.current.toggleTheme();
      });
      expect(document.documentElement.classList.contains('dark')).toBe(false);

      // Toggle back to dark
      act(() => {
        result.current.toggleTheme();
      });
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });

  describe('Edge cases and fallbacks', () => {
    it('should handle localStorage.getItem throwing error', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('localStorage unavailable');
      });

      expect(() => {
        renderHook(() => useTheme(), {
          wrapper: ThemeProvider,
        });
      }).not.toThrow();
    });

    it('should handle localStorage.setItem throwing error', () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('localStorage unavailable');
      });

      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      expect(() => {
        act(() => {
          result.current.setTheme('light');
        });
      }).not.toThrow();
    });

    it('should handle window.matchMedia being undefined', () => {
      Object.defineProperty(window, 'matchMedia', {
        value: undefined,
        writable: true,
      });

      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      expect(result.current.theme).toBe('dark'); // Falls back to dark
    });

    it('should handle invalid stored theme value', () => {
      mockLocalStorage.setItem('cc-releases-theme', 'invalid-theme');

      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      // Should verify localStorage was accessed
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('cc-releases-theme');

      // Should verify invalid value was removed
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('cc-releases-theme');

      // Should fall back to system preference (dark by default in mock)
      expect(result.current.theme).toBe('dark');
    });

    it('should handle SSR environment (no window object)', () => {
      // Simulate SSR by making localStorage fail
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('window is not defined');
      });

      // Should not crash in SSR-like environment
      expect(() => {
        renderHook(() => useTheme(), {
          wrapper: ThemeProvider,
        });
      }).not.toThrow();

      const { result } = renderHook(() => useTheme(), {
        wrapper: ThemeProvider,
      });

      // Should fall back to dark theme
      expect(result.current.theme).toBe('dark');
    });
  });
});
