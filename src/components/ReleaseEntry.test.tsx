import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ReleaseEntry } from './ReleaseEntry';
import { CATEGORIES } from '@/lib/constants';

describe('ReleaseEntry', () => {
  it('should render content', () => {
    const { getByText } = render(
      <ReleaseEntry category="features" content="Test entry content" />
    );

    expect(getByText('Test entry content')).toBeInTheDocument();
  });

  it('should apply correct border color for features category', () => {
    const { container } = render(
      <ReleaseEntry category="features" content="Content" />
    );

    const entry = container.firstChild as HTMLElement;
    expect(entry.style.borderLeft).toBe(`2px solid ${CATEGORIES.features.color}`);
  });

  it('should apply correct border colors for all categories', () => {
    const categories: Array<keyof typeof CATEGORIES> = ['features', 'bugfixes', 'performance', 'devx'];

    categories.forEach(category => {
      const { container } = render(
        <ReleaseEntry category={category} content="Content" />
      );

      const entry = container.firstChild as HTMLElement;
      expect(entry.style.borderLeft).toBe(`2px solid ${CATEGORIES[category].color}`);
    });
  });

  it('should have exact hover and transition classes', () => {
    const { container } = render(
      <ReleaseEntry category="features" content="Content" />
    );

    const entry = container.firstChild as HTMLElement;
    expect(entry.className).toContain('hover:bg-[#1a1a19]');
    expect(entry.className).toContain('transition-colors');
  });

  it('should have correct typography and spacing classes', () => {
    const { container } = render(
      <ReleaseEntry category="features" content="Content" />
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
      <ReleaseEntry category="invalid-category" content="Content" />
    );

    const entry = container.firstChild as HTMLElement;
    // Should fallback to features color instead of crashing
    expect(entry.style.borderLeft).toBe(`2px solid ${CATEGORIES.features.color}`);
    expect(entry).toBeInTheDocument();
  });
});

describe('ReleaseEntry - Markdown Rendering', () => {
  it('should render plain text content', () => {
    const { getByText } = render(
      <ReleaseEntry category="features" content="Plain text entry" />
    );

    expect(getByText('Plain text entry')).toBeInTheDocument();
  });

  it('should render inline code with code tags', () => {
    const { container } = render(
      <ReleaseEntry category="features" content="Text with `inline code` here" />
    );

    const code = container.querySelector('code');
    expect(code).toBeInTheDocument();
    expect(code?.textContent).toBe('inline code');
  });

  it('should render links with target="_blank" and rel attributes', () => {
    const { container } = render(
      <ReleaseEntry
        category="features"
        content="Check [documentation](https://example.com)"
      />
    );

    const link = container.querySelector('a');
    expect(link).toBeInTheDocument();
    expect(link?.getAttribute('href')).toBe('https://example.com');
    expect(link?.getAttribute('target')).toBe('_blank');
    expect(link?.getAttribute('rel')).toBe('noopener noreferrer');
    expect(link?.textContent).toBe('documentation');
  });

  it('should render unordered lists correctly', () => {
    const content = 'Features:\n- Item 1\n- Item 2';
    const { container } = render(
      <ReleaseEntry category="features" content={content} />
    );

    const ul = container.querySelector('ul');
    expect(ul).toBeInTheDocument();

    const items = container.querySelectorAll('li');
    expect(items.length).toBe(2);
  });

  it('should render bold and italic text', () => {
    const { container } = render(
      <ReleaseEntry
        category="features"
        content="**bold text** and *italic text*"
      />
    );

    const strong = container.querySelector('strong');
    expect(strong?.textContent).toBe('bold text');

    const em = container.querySelector('em');
    expect(em?.textContent).toBe('italic text');
  });

  it('should handle empty content gracefully', () => {
    const { container } = render(
      <ReleaseEntry category="features" content="" />
    );

    const entry = container.firstChild as HTMLElement;
    expect(entry).toBeInTheDocument();
  });

  it('should render HTML entities safely', () => {
    const { container } = render(
      <ReleaseEntry
        category="features"
        content="Safe content with <code>tags</code>"
      />
    );

    // marked preserves code tags as HTML
    const code = container.querySelector('code');
    expect(code).toBeInTheDocument();
    expect(code?.textContent).toBe('tags');
  });

  it('should maintain category border color with markdown content', () => {
    const { container } = render(
      <ReleaseEntry category="bugfixes" content="Fixed **bug** in `parser`" />
    );

    const entry = container.firstChild as HTMLElement;
    // Border color should still be category-specific
    expect(entry.style.borderLeft).toBe(`2px solid ${CATEGORIES.bugfixes.color}`);
  });
});

describe('ReleaseEntry - CHANGELOG Integration', () => {
  it('should render realistic CHANGELOG entry with GitHub link', () => {
    const content = 'Added new feature for file uploads [#1234](https://github.com/user/repo/issues/1234)';
    const { container } = render(
      <ReleaseEntry category="features" content={content} />
    );

    const link = container.querySelector('a');
    expect(link).toBeInTheDocument();
    expect(link?.getAttribute('href')).toBe('https://github.com/user/repo/issues/1234');
    expect(link?.getAttribute('target')).toBe('_blank');
    expect(link?.textContent).toBe('#1234');
  });

  it('should render entry with inline code and bold text', () => {
    const content = 'Fixed **critical bug** in `parseChangelog` function';
    const { container } = render(
      <ReleaseEntry category="bugfixes" content={content} />
    );

    const strong = container.querySelector('strong');
    expect(strong?.textContent).toBe('critical bug');

    const code = container.querySelector('code');
    expect(code?.textContent).toBe('parseChangelog');
  });

  it('should render complex markdown with multiple elements', () => {
    const content = 'Added **new hook** `useChangelog` with:\n- Automatic retries\n- Error handling\n- See [docs](https://example.com/docs)';
    const { container } = render(
      <ReleaseEntry category="features" content={content} />
    );

    expect(container.querySelector('strong')).toBeInTheDocument();
    expect(container.querySelector('code')).toBeInTheDocument();
    expect(container.querySelector('ul')).toBeInTheDocument();
    expect(container.querySelector('a')).toBeInTheDocument();
  });

  it('should handle entries with code blocks', () => {
    const content = 'Fixed bug in parser: `const result = parse(input)`';
    const { container } = render(
      <ReleaseEntry category="bugfixes" content={content} />
    );

    const code = container.querySelector('code');
    expect(code?.textContent).toBe('const result = parse(input)');
  });
});
