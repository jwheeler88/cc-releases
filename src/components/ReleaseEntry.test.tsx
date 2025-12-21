import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ReleaseEntry } from './ReleaseEntry';
import { CATEGORIES } from '@/lib/constants';

describe('ReleaseEntry', () => {
  it('should render content', () => {
    const { getByText } = render(
      <ReleaseEntry category="features">
        <p>Test entry content</p>
      </ReleaseEntry>
    );

    expect(getByText('Test entry content')).toBeInTheDocument();
  });

  it('should apply correct border color for features category', () => {
    const { container } = render(
      <ReleaseEntry category="features">
        <p>Content</p>
      </ReleaseEntry>
    );

    const entry = container.firstChild as HTMLElement;
    expect(entry.style.borderLeft).toBe(`2px solid ${CATEGORIES.features.color}`);
  });

  it('should apply correct border colors for all categories', () => {
    const categories: Array<keyof typeof CATEGORIES> = ['features', 'bugfixes', 'performance', 'devx'];

    categories.forEach(category => {
      const { container } = render(
        <ReleaseEntry category={category}>
          <p>Content</p>
        </ReleaseEntry>
      );

      const entry = container.firstChild as HTMLElement;
      expect(entry.style.borderLeft).toBe(`2px solid ${CATEGORIES[category].color}`);
    });
  });

  it('should have exact hover and transition classes', () => {
    const { container } = render(
      <ReleaseEntry category="features">
        <p>Content</p>
      </ReleaseEntry>
    );

    const entry = container.firstChild as HTMLElement;
    expect(entry.className).toContain('hover:bg-[#1a1a19]');
    expect(entry.className).toContain('transition-colors');
  });

  it('should have correct typography and spacing classes', () => {
    const { container } = render(
      <ReleaseEntry category="features">
        <p>Content</p>
      </ReleaseEntry>
    );

    const entry = container.firstChild as HTMLElement;
    expect(entry.className).toContain('text-[17px]');
    expect(entry.className).toContain('font-[Lora]');
    expect(entry.className).toContain('text-[#faf9f5]');
    expect(entry.className).toContain('leading-relaxed');
    expect(entry.className).toContain('pl-4');
    expect(entry.className).toContain('py-2');
    expect(entry.className).toContain('rounded-r');
  });

  it('should gracefully handle invalid category with fallback color', () => {
    const { container } = render(
      // @ts-expect-error - Testing runtime safety with invalid category
      <ReleaseEntry category="invalid-category">
        <p>Content</p>
      </ReleaseEntry>
    );

    const entry = container.firstChild as HTMLElement;
    // Should fallback to features color instead of crashing
    expect(entry.style.borderLeft).toBe(`2px solid ${CATEGORIES.features.color}`);
    expect(entry).toBeInTheDocument();
  });
});
