import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorState } from './ErrorState';

describe('ErrorState', () => {
  it('should render without errors', () => {
    const mockError = new Error('Test error');
    const mockRetry = vi.fn();

    const { container } = render(<ErrorState error={mockError} retry={mockRetry} />);
    expect(container).toBeInTheDocument();
  });

  it('should have role="alert" for immediate announcement', () => {
    const mockError = new Error('Test error');
    const mockRetry = vi.fn();

    const { container } = render(<ErrorState error={mockError} retry={mockRetry} />);
    const alertElement = container.querySelector('[role="alert"]');

    expect(alertElement).toBeInTheDocument();
  });

  it('should have aria-live="assertive" for critical announcements', () => {
    const mockError = new Error('Test error');
    const mockRetry = vi.fn();

    const { container } = render(<ErrorState error={mockError} retry={mockRetry} />);
    const liveRegion = container.querySelector('[aria-live="assertive"]');

    expect(liveRegion).toBeInTheDocument();
  });

  it('should display network error message for network errors', () => {
    const mockError = new Error('Network request failed');
    const mockRetry = vi.fn();

    render(<ErrorState error={mockError} retry={mockRetry} />);

    expect(screen.getByText(/check your internet connection/i)).toBeInTheDocument();
  });

  it('should display timeout error message for timeout errors', () => {
    const mockError = new Error('Request timeout exceeded');
    const mockRetry = vi.fn();

    render(<ErrorState error={mockError} retry={mockRetry} />);

    expect(screen.getByText(/taking longer than expected/i)).toBeInTheDocument();
  });

  it('should display parse error message for parse errors', () => {
    const mockError = new Error('Failed to parse CHANGELOG');
    const mockRetry = vi.fn();

    render(<ErrorState error={mockError} retry={mockRetry} />);

    expect(screen.getByText(/processing the release notes/i)).toBeInTheDocument();
  });

  it('should display generic error message for unknown errors', () => {
    const mockError = new Error('Something random happened');
    const mockRetry = vi.fn();

    render(<ErrorState error={mockError} retry={mockRetry} />);

    expect(screen.getByText(/Unable to load release notes/i)).toBeInTheDocument();
  });

  it('should display network error message for HTTP status errors', () => {
    // This matches the actual error format from useChangelog hook
    const mockError = new Error('Failed to fetch: 404 Not Found');
    const mockRetry = vi.fn();

    render(<ErrorState error={mockError} retry={mockRetry} />);

    expect(screen.getByText(/check your internet connection/i)).toBeInTheDocument();
  });

  it('should handle TypeError for network errors', () => {
    const mockError = new TypeError('Failed to fetch');
    const mockRetry = vi.fn();

    render(<ErrorState error={mockError} retry={mockRetry} />);

    expect(screen.getByText(/check your internet connection/i)).toBeInTheDocument();
  });

  it('should handle empty error messages', () => {
    const mockError = new Error('');
    const mockRetry = vi.fn();

    render(<ErrorState error={mockError} retry={mockRetry} />);

    // Empty messages should default to 'unknown' type
    expect(screen.getByText(/Unable to load release notes/i)).toBeInTheDocument();
  });

  it('should handle Safari-specific network errors', () => {
    const mockError = new Error('Load failed');
    const mockRetry = vi.fn();

    render(<ErrorState error={mockError} retry={mockRetry} />);

    expect(screen.getByText(/check your internet connection/i)).toBeInTheDocument();
  });

  it('should render retry button with correct label', () => {
    const mockError = new Error('Test error');
    const mockRetry = vi.fn();

    render(<ErrorState error={mockError} retry={mockRetry} />);

    const button = screen.getByRole('button', { name: /try.*again/i });
    expect(button).toBeInTheDocument();
  });

  it('should call retry callback when button is clicked', async () => {
    const user = userEvent.setup();
    const mockError = new Error('Test error');
    const mockRetry = vi.fn();

    render(<ErrorState error={mockError} retry={mockRetry} />);

    const button = screen.getByRole('button', { name: /try.*again/i });
    await user.click(button);

    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  it('should render AlertCircle icon', () => {
    const mockError = new Error('Test error');
    const mockRetry = vi.fn();

    const { container } = render(<ErrorState error={mockError} retry={mockRetry} />);

    // Lucide icons render as SVGs - check for AlertCircle by aria-hidden and position
    const icons = container.querySelectorAll('svg[aria-hidden="true"]');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('should render RotateCw icon in button', () => {
    const mockError = new Error('Test error');
    const mockRetry = vi.fn();

    render(<ErrorState error={mockError} retry={mockRetry} />);

    // Verify button has an icon (SVG inside button)
    const button = screen.getByRole('button', { name: /try.*again/i });
    const icon = button.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('should have centered layout with proper spacing', () => {
    const mockError = new Error('Test error');
    const mockRetry = vi.fn();

    const { container } = render(<ErrorState error={mockError} retry={mockRetry} />);
    const wrapper = container.querySelector('[role="alert"]');

    expect(wrapper?.className).toContain('flex-col');
    expect(wrapper?.className).toContain('items-center');
    expect(wrapper?.className).toContain('justify-center');
  });

  it('should have min-height for visual balance', () => {
    const mockError = new Error('Test error');
    const mockRetry = vi.fn();

    const { container } = render(<ErrorState error={mockError} retry={mockRetry} />);
    const wrapper = container.querySelector('[role="alert"]');

    // min-h-[400px] ensures error state has adequate visual presence
    expect(wrapper?.className).toContain('min-h-[400px]');
  });

  it('should use body font (Lora) for error message', () => {
    const mockError = new Error('Test error');
    const mockRetry = vi.fn();

    const { container } = render(<ErrorState error={mockError} retry={mockRetry} />);
    const message = container.querySelector('p');

    // font-body maps to Lora via --font-body in index.css
    expect(message?.className).toContain('font-body');
    expect(message?.className).toContain('text-[17px]');
  });

  it('should have proper button styling (outline variant)', () => {
    const mockError = new Error('Test error');
    const mockRetry = vi.fn();

    render(<ErrorState error={mockError} retry={mockRetry} />);

    const button = screen.getByRole('button', { name: /try.*again/i });

    // shadcn Button with variant="outline" includes specific classes
    expect(button.className).toContain('border');
  });

  it('should be keyboard accessible', async () => {
    const user = userEvent.setup();
    const mockError = new Error('Test error');
    const mockRetry = vi.fn();

    render(<ErrorState error={mockError} retry={mockRetry} />);

    const button = screen.getByRole('button', { name: /try.*again/i });

    // Tab to button
    await user.tab();
    expect(button).toHaveFocus();

    // Press Enter to activate
    await user.keyboard('{Enter}');
    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  it('should handle Space key activation', async () => {
    const user = userEvent.setup();
    const mockError = new Error('Test error');
    const mockRetry = vi.fn();

    render(<ErrorState error={mockError} retry={mockRetry} />);

    const button = screen.getByRole('button', { name: /try.*again/i });
    button.focus();

    // Press Space to activate
    await user.keyboard(' ');
    expect(mockRetry).toHaveBeenCalledTimes(1);
  });
});

describe('ErrorState - Integration Pattern', () => {
  it('should demonstrate useChangelog integration pattern', () => {
    // This test documents how Story 2.7 will integrate ErrorState
    // with the useChangelog hook's error and retry properties
    //
    // NOTE: This test uses mocks. Full integration testing with actual
    // useChangelog hook should be performed in Story 2.7 to verify:
    // 1. Retry callback actually triggers a new fetch
    // 2. Error state clears when retry succeeds
    // 3. Loading state shows during retry
    // 4. Real network error formats are handled correctly

    const MockReleaseList = () => {
      // Simulating useChangelog hook return pattern
      const error = new Error('Network request failed');
      const retry = vi.fn();

      if (error) {
        return <ErrorState error={error} retry={retry} />;
      }

      return <div data-testid="releases-loaded">Releases</div>;
    };

    const { container } = render(<MockReleaseList />);

    // When error exists, ErrorState should render
    expect(container.querySelector('[role="alert"]')).toBeInTheDocument();
  });

  it('should transition from error to loading state after retry', () => {
    // Documents the state transition pattern for Story 2.7
    const MockReleaseListWithTransition = ({ hasError }: { hasError: boolean }) => {
      if (hasError) {
        return <ErrorState error={new Error('Test')} retry={vi.fn()} />;
      }
      return <div data-testid="loading-state">Loading...</div>;
    };

    // Render in error state
    const { rerender, container, queryByTestId } = render(
      <MockReleaseListWithTransition hasError={true} />
    );
    expect(container.querySelector('[role="alert"]')).toBeInTheDocument();
    expect(queryByTestId('loading-state')).not.toBeInTheDocument();

    // Transition to loading state (simulating retry)
    rerender(<MockReleaseListWithTransition hasError={false} />);
    expect(container.querySelector('[role="alert"]')).not.toBeInTheDocument();
    expect(queryByTestId('loading-state')).toBeInTheDocument();
  });
});
