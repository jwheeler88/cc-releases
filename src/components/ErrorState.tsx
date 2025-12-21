import { AlertCircle, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  error: Error;
  retry: () => void;
}

/**
 * ErrorState component displays user-friendly error messages when CHANGELOG fetch fails.
 * Provides retry functionality and handles different error types.
 */
export function ErrorState({ error, retry }: ErrorStateProps) {
  // Detect error type based on error message or properties
  const errorType = detectErrorType(error);

  // Get friendly message for error type
  const message = getErrorMessage(errorType);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[400px] max-w-prose mx-auto px-4"
      role="alert"
      aria-live="assertive"
    >
      {/* Error icon */}
      <AlertCircle
        className="h-12 w-12 text-mid-gray mb-6"
        aria-hidden="true"
      />

      {/* Error message */}
      <p className="text-[17px] font-body text-center text-foreground/80 mb-6 max-w-md">
        {message}
      </p>

      {/* Retry button */}
      <Button
        variant="outline"
        onClick={retry}
        className="gap-2"
        aria-label="Try loading releases again"
      >
        <RotateCw className="h-4 w-4" />
        Try again
      </Button>
    </div>
  );
}

/**
 * Detect error type based on error message or properties
 * Handles edge cases: empty messages, browser-specific formats, TypeError instances
 */
function detectErrorType(error: Error): ErrorType {
  // Handle empty or missing error messages
  const message = (error.message || '').toLowerCase();

  // Check error type/name for additional context (e.g., TypeError, NetworkError)
  const errorName = (error.name || '').toLowerCase();

  // Network errors (including HTTP status errors like 404, 500)
  // useChangelog throws: "Failed to fetch: 404 Not Found"
  // TypeError: Failed to fetch (Chrome/Firefox)
  // Browser-specific network errors
  if (
    message.includes('network') ||
    message.includes('failed to fetch') ||
    message.includes('fetch') || // Catch bare "fetch" errors
    message.includes('offline') ||
    message.includes('status') ||
    message.includes('cors') ||
    message.includes('load failed') || // Safari network error
    message.includes('networkerror') || // Firefox
    errorName === 'typeerror' || // TypeError: Failed to fetch
    errorName === 'networkerror'
  ) {
    return 'network';
  }

  // Timeout errors
  if (
    message.includes('timeout') ||
    message.includes('aborted') ||
    message.includes('timed out') ||
    errorName === 'timeouterror'
  ) {
    return 'timeout';
  }

  // Parse errors
  if (
    message.includes('parse') ||
    message.includes('invalid') ||
    message.includes('malformed') ||
    message.includes('syntax') ||
    errorName === 'syntaxerror'
  ) {
    return 'parse';
  }

  // Unknown/general errors (fallback for empty messages or unrecognized errors)
  return 'unknown';
}

type ErrorType = 'network' | 'timeout' | 'parse' | 'unknown';

/**
 * Get user-friendly error message for error type
 */
function getErrorMessage(type: ErrorType): string {
  const messages: Record<ErrorType, string> = {
    network: "Unable to load release notes. Please check your internet connection and try again.",
    timeout: "Loading is taking longer than expected. Please try again.",
    parse: "Something went wrong while processing the release notes. Please try again.",
    unknown: "Unable to load release notes. Please try again.",
  };

  return messages[type];
}
