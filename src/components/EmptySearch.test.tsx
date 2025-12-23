import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EmptySearch } from './EmptySearch';
import type { EmptySearchProps } from './EmptySearch';

describe('EmptySearch', () => {
  const mockOnClear = vi.fn();

  // Conditional Rendering Tests
  describe('Conditional Rendering', () => {
    it('should return null when query is empty string', () => {
      const { container } = render(
        <EmptySearch query="" onClear={mockOnClear} />
      );
      expect(container.firstChild).toBeNull();
    });

    it('should return null when query is whitespace only', () => {
      const { container } = render(
        <EmptySearch query="   " onClear={mockOnClear} />
      );
      expect(container.firstChild).toBeNull();
    });

    it('should render EmptySearch when query has value', () => {
      render(<EmptySearch query="test" onClear={mockOnClear} />);
      expect(screen.getByText(/No releases match/i)).toBeInTheDocument();
    });
  });

  // Message Content Tests
  describe('Message Content', () => {
    it('should display "No releases match" heading', () => {
      render(<EmptySearch query="xyzzy" onClear={mockOnClear} />);
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/No releases match/i);
    });

    it('should display query term in heading', () => {
      render(<EmptySearch query="xyzzy" onClear={mockOnClear} />);
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('xyzzy');
    });

    it('should display complete message format with query', () => {
      render(<EmptySearch query="features" onClear={mockOnClear} />);
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('No releases match "features"');
    });

    it('should display suggestion text with examples', () => {
      render(<EmptySearch query="test" onClear={mockOnClear} />);
      expect(screen.getByText(/Try searching for 'features', 'performance', or 'MCP'/i)).toBeInTheDocument();
    });

    it('should display "Clear search" link', () => {
      render(<EmptySearch query="test" onClear={mockOnClear} />);
      expect(screen.getByText(/Clear search/i)).toBeInTheDocument();
    });
  });

  // User Interaction Tests
  describe('User Interaction', () => {
    it('should call onClear when clear search is clicked', () => {
      const onClearMock = vi.fn();
      render(<EmptySearch query="test" onClear={onClearMock} />);
      const clearButton = screen.getByText(/Clear search/i);
      fireEvent.click(clearButton);
      expect(onClearMock).toHaveBeenCalledOnce();
    });

    it('should call onClear callback with no arguments', () => {
      const onClearMock = vi.fn();
      render(<EmptySearch query="test" onClear={onClearMock} />);
      const clearButton = screen.getByText(/Clear search/i);
      fireEvent.click(clearButton);
      expect(onClearMock).toHaveBeenCalledWith();
    });
  });

  // Accessibility Tests
  describe('Accessibility', () => {
    it('should use semantic h2 heading element', () => {
      render(<EmptySearch query="test" onClear={mockOnClear} />);
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
    });

    it('should have accessible button for clear search', () => {
      render(<EmptySearch query="test" onClear={mockOnClear} />);
      const clearButton = screen.getByRole('button', { name: /Clear search/i });
      expect(clearButton).toBeInTheDocument();
    });
  });

  // Edge Cases Tests (from code review learnings)
  describe('Edge Cases', () => {
    it('should render very long query strings without overflow', () => {
      const longQuery = 'a'.repeat(150);
      render(<EmptySearch query={longQuery} onClear={mockOnClear} />);
      expect(screen.getByText(longQuery)).toBeInTheDocument();
    });

    it('should safely display special characters in query', () => {
      const specialQuery = '<script>alert("xss")</script>';
      render(<EmptySearch query={specialQuery} onClear={mockOnClear} />);
      // Text should be escaped, not executed
      expect(screen.getByText(specialQuery)).toBeInTheDocument();
    });

    it('should render unicode characters correctly', () => {
      const unicodeQuery = '日本語 🚀 émojis';
      render(<EmptySearch query={unicodeQuery} onClear={mockOnClear} />);
      expect(screen.getByText(unicodeQuery)).toBeInTheDocument();
    });
  });

  // Props Interface Export Test
  describe('Props Interface', () => {
    it('should export EmptySearchProps interface for external typing', () => {
      // Type check - this will fail at compile time if interface not exported
      const props: EmptySearchProps = {
        query: 'test',
        onClear: mockOnClear,
      };
      expect(props).toBeDefined();
    });
  });
});
