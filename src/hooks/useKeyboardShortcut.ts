import { useEffect, useCallback } from 'react';

export interface UseKeyboardShortcutOptions {
  onTrigger: () => void;
  key: string;
  metaKey?: boolean;
  ctrlKey?: boolean;
  enabled?: boolean;
  allowedInputId?: string;
}

export function useKeyboardShortcut({
  onTrigger,
  key,
  metaKey = false,
  ctrlKey = false,
  enabled = true,
  allowedInputId
}: UseKeyboardShortcutOptions): void {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // Skip if user is typing in another input/textarea
    const activeElement = document.activeElement;
    if (activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement) {
      if (!allowedInputId || activeElement.id !== allowedInputId) {
        return;
      }
    }

    // Check if correct key (case-insensitive)
    const isCorrectKey = event.key.toLowerCase() === key.toLowerCase();
    if (!isCorrectKey) return;

    // Check if required modifiers match
    const hasRequiredModifier = (metaKey && event.metaKey) || (ctrlKey && event.ctrlKey);

    if (hasRequiredModifier) {
      event.preventDefault();
      onTrigger();
    }
  }, [onTrigger, key, metaKey, ctrlKey, enabled, allowedInputId]);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, enabled]);
}
