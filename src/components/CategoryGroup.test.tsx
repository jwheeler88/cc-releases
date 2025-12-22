import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CategoryGroup } from './CategoryGroup';
import { CATEGORIES } from '@/lib/constants';
import type { Category } from '@/lib/types';

describe('CategoryGroup', () => {
  // ============================================================================
  // RENDERING TESTS (4 tests)
  // ============================================================================

  describe('Rendering Tests', () => {
    it('should render with features category', () => {
      render(
        <CategoryGroup category="features">
          <div>Test child</div>
        </CategoryGroup>
      );

      const header = screen.getByRole('heading', { level: 3 });
      expect(header).toHaveTextContent('Features');
    });

    it('should render with bugfixes category', () => {
      render(
        <CategoryGroup category="bugfixes">
          <div>Test child</div>
        </CategoryGroup>
      );

      const header = screen.getByRole('heading', { level: 3 });
      expect(header).toHaveTextContent('Bug Fixes');
    });

    it('should render with performance category', () => {
      render(
        <CategoryGroup category="performance">
          <div>Test child</div>
        </CategoryGroup>
      );

      const header = screen.getByRole('heading', { level: 3 });
      expect(header).toHaveTextContent('Performance');
    });

    it('should render with devx category', () => {
      render(
        <CategoryGroup category="devx">
          <div>Test child</div>
        </CategoryGroup>
      );

      const header = screen.getByRole('heading', { level: 3 });
      expect(header).toHaveTextContent('DevX');
    });
  });

  // ============================================================================
  // STYLING TESTS (8 tests)
  // ============================================================================

  describe('Styling Tests', () => {
    it('should apply header color matching category color', () => {
      render(
        <CategoryGroup category="features">
          <div>Test child</div>
        </CategoryGroup>
      );

      const header = screen.getByRole('heading', { level: 3 });
      expect(header).toHaveStyle({ color: CATEGORIES.features.color });
    });

    it('should apply border bottom color matching category color', () => {
      render(
        <CategoryGroup category="bugfixes">
          <div>Test child</div>
        </CategoryGroup>
      );

      const header = screen.getByRole('heading', { level: 3 });
      expect(header).toHaveStyle({
        borderBottom: `2px solid ${CATEGORIES.bugfixes.color}`,
      });
    });

    it('should apply 2px border bottom width', () => {
      render(
        <CategoryGroup category="performance">
          <div>Test child</div>
        </CategoryGroup>
      );

      const header = screen.getByRole('heading', { level: 3 });
      const borderStyle = header.style.borderBottom;
      expect(borderStyle).toContain('2px');
    });

    it('should apply correct header typography classes', () => {
      render(
        <CategoryGroup category="devx">
          <div>Test child</div>
        </CategoryGroup>
      );

      const header = screen.getByRole('heading', { level: 3 });
      expect(header).toHaveClass('text-lg');
      expect(header).toHaveClass('font-semibold');
      expect(header).toHaveClass('font-[Poppins]');
    });

    it('should apply correct spacing classes', () => {
      const { container } = render(
        <CategoryGroup category="features">
          <div>Test child</div>
        </CategoryGroup>
      );

      const section = container.firstChild as HTMLElement;
      const header = screen.getByRole('heading', { level: 3 });
      const childrenContainer = header.nextElementSibling as HTMLElement;

      expect(section).toHaveClass('mb-8');
      expect(header).toHaveClass('pb-2');
      expect(header).toHaveClass('mb-4');
      expect(childrenContainer).toHaveClass('space-y-3');
    });

    it('should apply children container vertical spacing', () => {
      render(
        <CategoryGroup category="features">
          <div>Child 1</div>
          <div>Child 2</div>
        </CategoryGroup>
      );

      const header = screen.getByRole('heading', { level: 3 });
      const childrenContainer = header.nextElementSibling as HTMLElement;
      expect(childrenContainer).toHaveClass('space-y-3');
    });

    it('should apply CVA base classes correctly', () => {
      const { container } = render(
        <CategoryGroup category="features">
          <div>Test child</div>
        </CategoryGroup>
      );

      const section = container.firstChild as HTMLElement;
      expect(section).toHaveClass('mb-8');
    });

    it('should merge custom className with CVA classes', () => {
      const { container } = render(
        <CategoryGroup category="features" className="custom-class">
          <div>Test child</div>
        </CategoryGroup>
      );

      const section = container.firstChild as HTMLElement;
      expect(section).toHaveClass('mb-8');
      expect(section).toHaveClass('custom-class');
    });
  });

  // ============================================================================
  // CHILDREN RENDERING TESTS (3 tests)
  // ============================================================================

  describe('Children Rendering Tests', () => {
    it('should render children components', () => {
      render(
        <CategoryGroup category="features">
          <div data-testid="test-child">Test child content</div>
        </CategoryGroup>
      );

      expect(screen.getByTestId('test-child')).toBeInTheDocument();
      expect(screen.getByText('Test child content')).toBeInTheDocument();
    });

    it('should render multiple children in correct order', () => {
      render(
        <CategoryGroup category="features">
          <div data-testid="child-1">First child</div>
          <div data-testid="child-2">Second child</div>
          <div data-testid="child-3">Third child</div>
        </CategoryGroup>
      );

      const children = [
        screen.getByTestId('child-1'),
        screen.getByTestId('child-2'),
        screen.getByTestId('child-3'),
      ];

      expect(children[0]).toHaveTextContent('First child');
      expect(children[1]).toHaveTextContent('Second child');
      expect(children[2]).toHaveTextContent('Third child');
    });

    it('should return null when children is empty or undefined', () => {
      const { container: container1 } = render(
        <CategoryGroup category="features">{undefined}</CategoryGroup>
      );
      expect(container1.firstChild).toBeNull();

      const { container: container2 } = render(
        <CategoryGroup category="features">{null}</CategoryGroup>
      );
      expect(container2.firstChild).toBeNull();

      const { container: container3 } = render(
        <CategoryGroup category="features">{[]}</CategoryGroup>
      );
      expect(container3.firstChild).toBeNull();
    });
  });

  // ============================================================================
  // CATEGORIES INTEGRATION TESTS (2 tests)
  // ============================================================================

  describe('CATEGORIES Integration Tests', () => {
    it('should derive label text from CATEGORIES constant', () => {
      const categories: Category[] = ['features', 'bugfixes', 'performance', 'devx'];

      categories.forEach((category) => {
        const { rerender } = render(
          <CategoryGroup category={category}>
            <div>Test</div>
          </CategoryGroup>
        );

        const header = screen.getByRole('heading', { level: 3 });
        expect(header).toHaveTextContent(CATEGORIES[category].label);

        rerender(<div />);
      });
    });

    it('should derive color values from CATEGORIES constant', () => {
      const categories: Category[] = ['features', 'bugfixes', 'performance', 'devx'];

      categories.forEach((category) => {
        const { rerender } = render(
          <CategoryGroup category={category}>
            <div>Test</div>
          </CategoryGroup>
        );

        const header = screen.getByRole('heading', { level: 3 });
        expect(header).toHaveStyle({ color: CATEGORIES[category].color });
        expect(header).toHaveStyle({
          borderBottom: `2px solid ${CATEGORIES[category].color}`,
        });

        rerender(<div />);
      });
    });
  });

  // ============================================================================
  // ACCESSIBILITY TESTS (2 tests)
  // ============================================================================

  describe('Accessibility Tests', () => {
    it('should use semantic HTML elements', () => {
      const { container } = render(
        <CategoryGroup category="features">
          <div>Test child</div>
        </CategoryGroup>
      );

      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();

      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toBeInTheDocument();
    });

    it('should support ARIA attributes via props spreading', () => {
      const { container } = render(
        <CategoryGroup category="features" aria-label="Feature updates">
          <div>Test child</div>
        </CategoryGroup>
      );

      const section = container.firstChild as HTMLElement;
      expect(section).toHaveAttribute('aria-label', 'Feature updates');
    });
  });
});
