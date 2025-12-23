import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, renderHook, act, cleanup } from '@testing-library/react';
import { ThemeProvider, useTheme } from './ThemeContext';

describe('ThemeContext', () => {
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
  });
});
