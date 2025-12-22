import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CategoryBadge } from './CategoryBadge';
import { CATEGORIES } from '@/lib/constants';
import type { Category } from '@/lib/types';

describe('CategoryBadge', () => {
  describe('rendering', () => {
    it('should render features badge with correct label', () => {
      render(<CategoryBadge category="features" />);
      expect(screen.getByText('Features')).toBeInTheDocument();
    });

    it('should render bugfixes badge with correct label', () => {
      render(<CategoryBadge category="bugfixes" />);
      expect(screen.getByText('Bug Fixes')).toBeInTheDocument();
    });

    it('should render performance badge with correct label', () => {
      render(<CategoryBadge category="performance" />);
      expect(screen.getByText('Performance')).toBeInTheDocument();
    });

    it('should render devx badge with correct label', () => {
      render(<CategoryBadge category="devx" />);
      expect(screen.getByText('DevX')).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('should apply features color (#6a9bcc)', () => {
      const { container } = render(<CategoryBadge category="features" />);
      const badge = container.querySelector('span');
      expect(badge).toHaveStyle({ color: '#6a9bcc' });
    });

    it('should apply bugfixes color (#788c5d)', () => {
      const { container } = render(<CategoryBadge category="bugfixes" />);
      const badge = container.querySelector('span');
      expect(badge).toHaveStyle({ color: '#788c5d' });
    });

    it('should apply performance color (#d97757)', () => {
      const { container } = render(<CategoryBadge category="performance" />);
      const badge = container.querySelector('span');
      expect(badge).toHaveStyle({ color: '#d97757' });
    });

    it('should apply devx color (#9b8bb0)', () => {
      const { container } = render(<CategoryBadge category="devx" />);
      const badge = container.querySelector('span');
      expect(badge).toHaveStyle({ color: '#9b8bb0' });
    });

    it('should apply background with 20% opacity', () => {
      const { container } = render(<CategoryBadge category="features" />);
      const badge = container.querySelector('span');
      // #6a9bcc + 33 (20% opacity hex)
      expect(badge).toHaveStyle({ backgroundColor: '#6a9bcc33' });
    });

    it('should apply border with 30% opacity', () => {
      const { container } = render(<CategoryBadge category="features" />);
      const badge = container.querySelector('span');
      // #6a9bcc + 4D (30% opacity hex)
      expect(badge).toHaveStyle({ borderColor: '#6a9bcc4D' });
    });

    it('should have pill shape with rounded-full class', () => {
      const { container } = render(<CategoryBadge category="features" />);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('rounded-full');
    });

    it('should use 12px font (text-xs)', () => {
      const { container } = render(<CategoryBadge category="features" />);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('text-xs');
    });
  });

  describe('props handling', () => {
    it('should accept additional className', () => {
      const { container } = render(
        <CategoryBadge category="features" className="custom-class" />
      );
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('custom-class');
      expect(badge).toHaveClass('rounded-full'); // Base classes still present
    });

    it('should accept standard span props', () => {
      render(
        <CategoryBadge
          category="features"
          data-testid="custom-badge"
          aria-label="Feature badge"
        />
      );
      const badge = screen.getByTestId('custom-badge');
      expect(badge).toHaveAttribute('aria-label', 'Feature badge');
    });
  });

  describe('CATEGORIES constant integration', () => {
    it('should use labels from CATEGORIES constant', () => {
      const categories: Category[] = ['features', 'bugfixes', 'performance', 'devx'];

      categories.forEach((category) => {
        const { rerender } = render(<CategoryBadge category={category} />);
        expect(screen.getByText(CATEGORIES[category].label)).toBeInTheDocument();
        rerender(<></>); // Clean up for next iteration
      });
    });

    it('should use colors from CATEGORIES constant', () => {
      const { container, rerender } = render(<CategoryBadge category="features" />);
      let badge = container.querySelector('span');
      expect(badge).toHaveStyle({ color: CATEGORIES.features.color });

      rerender(<CategoryBadge category="performance" />);
      badge = container.querySelector('span'); // Re-query after rerender
      expect(badge).toHaveStyle({ color: CATEGORIES.performance.color });
    });
  });

  describe('accessibility', () => {
    it('should be accessible as inline text element', () => {
      const { container } = render(<CategoryBadge category="features" />);
      const badge = container.querySelector('span');
      // Verify it's a span (inline element, not interactive)
      expect(badge?.tagName).toBe('SPAN');
      // Label text provides sufficient context for screen readers
      expect(screen.getByText('Features')).toBeInTheDocument();
    });

    it('should support custom aria attributes when needed', () => {
      render(
        <CategoryBadge
          category="bugfixes"
          aria-label="Bug fix category indicator"
        />
      );
      expect(screen.getByLabelText('Bug fix category indicator')).toBeInTheDocument();
    });
  });
});
