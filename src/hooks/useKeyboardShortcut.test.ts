import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, cleanup } from '@testing-library/react';
import { useKeyboardShortcut } from './useKeyboardShortcut';

describe('useKeyboardShortcut', () => {
  const mockOnTrigger = vi.fn();

  beforeEach(() => {
    mockOnTrigger.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it('should call onTrigger when Cmd+K pressed with metaKey=true', () => {
    renderHook(() =>
      useKeyboardShortcut({
        onTrigger: mockOnTrigger,
        key: 'k',
        metaKey: true
      })
    );

    const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true });
    document.dispatchEvent(event);

    expect(mockOnTrigger).toHaveBeenCalledOnce();
  });

  it('should call onTrigger when Ctrl+K pressed with ctrlKey=true', () => {
    renderHook(() =>
      useKeyboardShortcut({
        onTrigger: mockOnTrigger,
        key: 'k',
        ctrlKey: true
      })
    );

    const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true });
    document.dispatchEvent(event);

    expect(mockOnTrigger).toHaveBeenCalledOnce();
  });

  it('should NOT trigger when just K pressed without modifier', () => {
    renderHook(() =>
      useKeyboardShortcut({
        onTrigger: mockOnTrigger,
        key: 'k',
        metaKey: true
      })
    );

    const event = new KeyboardEvent('keydown', { key: 'k', bubbles: true });
    document.dispatchEvent(event);

    expect(mockOnTrigger).not.toHaveBeenCalled();
  });

  it('should call preventDefault to stop browser search', () => {
    renderHook(() =>
      useKeyboardShortcut({
        onTrigger: mockOnTrigger,
        key: 'k',
        metaKey: true
      })
    );

    const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
    document.dispatchEvent(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('should NOT trigger when typing in another input', () => {
    const mockInput = document.createElement('input');
    mockInput.id = 'other-input';
    document.body.appendChild(mockInput);
    mockInput.focus();

    renderHook(() =>
      useKeyboardShortcut({
        onTrigger: mockOnTrigger,
        key: 'k',
        metaKey: true,
        allowedInputId: 'release-search'
      })
    );

    const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true });
    document.dispatchEvent(event);

    expect(mockOnTrigger).not.toHaveBeenCalled();
    document.body.removeChild(mockInput);
  });

  it('should trigger when typing in allowedInputId', () => {
    const mockInput = document.createElement('input');
    mockInput.id = 'release-search';
    document.body.appendChild(mockInput);
    mockInput.focus();

    renderHook(() =>
      useKeyboardShortcut({
        onTrigger: mockOnTrigger,
        key: 'k',
        metaKey: true,
        allowedInputId: 'release-search'
      })
    );

    const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true });
    document.dispatchEvent(event);

    expect(mockOnTrigger).toHaveBeenCalledOnce();
    document.body.removeChild(mockInput);
  });

  it('should remove event listener on unmount', () => {
    const { unmount } = renderHook(() =>
      useKeyboardShortcut({
        onTrigger: mockOnTrigger,
        key: 'k',
        metaKey: true
      })
    );

    unmount();

    const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true });
    document.dispatchEvent(event);

    expect(mockOnTrigger).not.toHaveBeenCalled();
  });

  it('should NOT trigger when enabled is false', () => {
    renderHook(() =>
      useKeyboardShortcut({
        onTrigger: mockOnTrigger,
        key: 'k',
        metaKey: true,
        enabled: false
      })
    );

    const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true });
    document.dispatchEvent(event);

    expect(mockOnTrigger).not.toHaveBeenCalled();
  });

  it('should handle rapid fire key presses without breaking', () => {
    renderHook(() =>
      useKeyboardShortcut({
        onTrigger: mockOnTrigger,
        key: 'k',
        metaKey: true
      })
    );

    // Fire 10 rapid key presses
    for (let i = 0; i < 10; i++) {
      const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true });
      document.dispatchEvent(event);
    }

    // Should trigger exactly 10 times (no debouncing, just resilience)
    expect(mockOnTrigger).toHaveBeenCalledTimes(10);
  });

  it('should only trigger on correct modifier when both metaKey and ctrlKey configured', () => {
    // Edge case: if someone configures both, it should work with either
    renderHook(() =>
      useKeyboardShortcut({
        onTrigger: mockOnTrigger,
        key: 'k',
        metaKey: true,
        ctrlKey: true
      })
    );

    // Cmd+K should trigger
    const metaEvent = new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true });
    document.dispatchEvent(metaEvent);
    expect(mockOnTrigger).toHaveBeenCalledTimes(1);

    // Ctrl+K should also trigger
    const ctrlEvent = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true });
    document.dispatchEvent(ctrlEvent);
    expect(mockOnTrigger).toHaveBeenCalledTimes(2);

    // Just K should NOT trigger
    const plainEvent = new KeyboardEvent('keydown', { key: 'k', bubbles: true });
    document.dispatchEvent(plainEvent);
    expect(mockOnTrigger).toHaveBeenCalledTimes(2); // Still 2
  });
});
