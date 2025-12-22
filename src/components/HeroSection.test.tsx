import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HeroSection } from './HeroSection';

describe('HeroSection', () => {
  const defaultProps = {
    query: '',
    onQueryChange: vi.fn(),
    onSuggestionClick: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Content rendering', () => {
    it('should render title "Claude Code"', () => {
      render(<HeroSection {...defaultProps} />);
      expect(screen.getByRole('heading', { name: 'Claude Code' })).toBeInTheDocument();
    });

    it('should render tagline text', () => {
      render(<HeroSection {...defaultProps} />);
      expect(screen.getByText('Release Notes & Changelog')).toBeInTheDocument();
    });

    it('should render search input with correct placeholder', () => {
      render(<HeroSection {...defaultProps} />);
      expect(screen.getByPlaceholderText(/search releases.*mcp.*hooks/i)).toBeInTheDocument();
    });

    it('should render search icon', () => {
      render(<HeroSection {...defaultProps} />);
      const searchInput = screen.getByLabelText(/search releases/i);
      const container = searchInput.closest('div');
      const icon = container?.querySelector('svg[aria-hidden="true"]');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Search input behavior', () => {
    it('should display controlled value', () => {
      render(<HeroSection {...defaultProps} query="test query" />);
      const input = screen.getByPlaceholderText(/search releases/i) as HTMLInputElement;
      expect(input.value).toBe('test query');
    });

    it('should call onQueryChange when input changes', async () => {
      const onQueryChange = vi.fn();
      render(<HeroSection {...defaultProps} onQueryChange={onQueryChange} />);

      const input = screen.getByPlaceholderText(/search releases/i);
      await userEvent.type(input, 'MCP');

      expect(onQueryChange).toHaveBeenCalledTimes(3); // M, C, P
      // userEvent.type() calls onChange for each character: 'M', 'C', 'P'
      expect(onQueryChange).toHaveBeenNthCalledWith(1, 'M');
      expect(onQueryChange).toHaveBeenNthCalledWith(2, 'C');
      expect(onQueryChange).toHaveBeenNthCalledWith(3, 'P');
    });
  });

  describe('Suggestion pills', () => {
    it('should render all suggestion pills', () => {
      render(<HeroSection {...defaultProps} />);
      expect(screen.getByRole('button', { name: 'MCP' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'hooks' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'performance' })).toBeInTheDocument();
    });

    it('should call onQueryChange when pill is clicked', async () => {
      const onQueryChange = vi.fn();
      render(<HeroSection {...defaultProps} onQueryChange={onQueryChange} />);

      const pill = screen.getByRole('button', { name: 'MCP' });
      await userEvent.click(pill);

      expect(onQueryChange).toHaveBeenCalledWith('MCP');
    });

    it('should call onSuggestionClick when pill is clicked', async () => {
      const onSuggestionClick = vi.fn();
      render(<HeroSection {...defaultProps} onSuggestionClick={onSuggestionClick} />);

      const pill = screen.getByRole('button', { name: 'hooks' });
      await userEvent.click(pill);

      expect(onSuggestionClick).toHaveBeenCalledWith('hooks');
    });

    it('should handle missing onSuggestionClick gracefully', async () => {
      const onQueryChange = vi.fn();
      render(<HeroSection query="" onQueryChange={onQueryChange} />);

      const pill = screen.getByRole('button', { name: 'MCP' });
      await userEvent.click(pill);

      // Should still call onQueryChange without error
      expect(onQueryChange).toHaveBeenCalledWith('MCP');
    });
  });

  describe('Accessibility', () => {
    it('should have accessible search input label', () => {
      render(<HeroSection {...defaultProps} />);
      expect(screen.getByLabelText(/search releases/i)).toBeInTheDocument();
    });

    it('should have proper heading role for title', () => {
      render(<HeroSection {...defaultProps} />);
      const heading = screen.getByRole('heading', { name: 'Claude Code' });
      expect(heading.tagName).toBe('H1');
    });

    it('should have visible and focusable suggestion buttons', () => {
      render(<HeroSection {...defaultProps} />);
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3);
      buttons.forEach(button => {
        expect(button).toBeVisible();
      });
    });
  });

  describe('Keyboard accessibility', () => {
    it('should activate pill on Enter key', async () => {
      const onQueryChange = vi.fn();
      render(<HeroSection {...defaultProps} onQueryChange={onQueryChange} />);

      const pill = screen.getByRole('button', { name: 'performance' });
      pill.focus();
      await userEvent.keyboard('{Enter}');

      expect(onQueryChange).toHaveBeenCalledWith('performance');
    });

    it('should activate pill on Space key', async () => {
      const onQueryChange = vi.fn();
      render(<HeroSection {...defaultProps} onQueryChange={onQueryChange} />);

      const pill = screen.getByRole('button', { name: 'MCP' });
      pill.focus();
      await userEvent.keyboard(' ');

      expect(onQueryChange).toHaveBeenCalledWith('MCP');
    });
  });
});
