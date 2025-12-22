import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SearchStatus, SearchStatusProps } from './SearchStatus';

describe('SearchStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Conditional Rendering', () => {
    it('should return null when query is empty string', () => {
      const { container } = render(
        <SearchStatus query="" matchCount={0} releaseCount={0} />
      );
      expect(container.firstChild).toBeNull();
    });

    it('should return null when query is whitespace only', () => {
      const { container } = render(
        <SearchStatus query="   " matchCount={5} releaseCount={2} />
      );
      expect(container.firstChild).toBeNull();
    });

    it('should return null when query exists but matchCount is zero', () => {
      const { container } = render(
        <SearchStatus query="xyzzy" matchCount={0} releaseCount={0} />
      );
      expect(container.firstChild).toBeNull();
    });

    it('should render status when query has value AND matchCount > 0', () => {
      const { container } = render(
        <SearchStatus query="MCP" matchCount={12} releaseCount={3} />
      );
      expect(container.firstChild).not.toBeNull();
    });
  });

  describe('Status Message Format', () => {
    it('should display correct message format with counts and query', () => {
      render(<SearchStatus query="MCP" matchCount={12} releaseCount={3} />);
      expect(screen.getByText(/12/)).toBeInTheDocument();
      expect(screen.getByText(/entries/)).toBeInTheDocument();
      expect(screen.getByText(/3/)).toBeInTheDocument();
      expect(screen.getByText(/releases/)).toBeInTheDocument();
      expect(screen.getByText(/MCP/)).toBeInTheDocument();
    });

    it('should handle singular grammar: "1 entry across 1 release"', () => {
      const { container } = render(<SearchStatus query="test" matchCount={1} releaseCount={1} />);
      const text = container.textContent || '';
      expect(text).toMatch(/1 entry across 1 release match/i);
    });

    it('should handle plural grammar: "5 entries across 3 releases"', () => {
      const { container } = render(<SearchStatus query="test" matchCount={5} releaseCount={3} />);
      const text = container.textContent || '';
      expect(text).toMatch(/5 entries across 3 releases match/i);
    });

    it('should handle mixed grammar: "1 entry across 2 releases"', () => {
      const { container } = render(<SearchStatus query="test" matchCount={1} releaseCount={2} />);
      const text = container.textContent || '';
      expect(text).toMatch(/1 entry across 2 releases match/i);
    });

    it('should handle mixed grammar: "3 entries across 1 release"', () => {
      const { container } = render(<SearchStatus query="test" matchCount={3} releaseCount={1} />);
      const text = container.textContent || '';
      expect(text).toMatch(/3 entries across 1 release match/i);
    });

    it('should display query term in the message', () => {
      render(<SearchStatus query="authentication" matchCount={7} releaseCount={2} />);
      expect(screen.getByText('authentication')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have aria-live="polite" attribute', () => {
      const { container } = render(
        <SearchStatus query="test" matchCount={5} releaseCount={2} />
      );
      const element = container.querySelector('[aria-live="polite"]');
      expect(element).toBeInTheDocument();
    });

    it('should have aria-atomic="true" attribute', () => {
      const { container } = render(
        <SearchStatus query="test" matchCount={5} releaseCount={2} />
      );
      const element = container.querySelector('[aria-atomic="true"]');
      expect(element).toBeInTheDocument();
    });
  });

  describe('Props & Interface', () => {
    it('should accept query, matchCount, releaseCount props', () => {
      const props: SearchStatusProps = {
        query: 'test',
        matchCount: 10,
        releaseCount: 4
      };
      const { container } = render(<SearchStatus {...props} />);
      expect(container.firstChild).not.toBeNull();
    });

    it('should export SearchStatusProps interface for external typing', () => {
      // TypeScript compilation will fail if interface is not exported
      const props: SearchStatusProps = {
        query: 'test',
        matchCount: 5,
        releaseCount: 2
      };
      expect(props).toBeDefined();
    });
  });
});
