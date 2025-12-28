/**
 * Formats an ISO 8601 date string to human-readable format
 * @param isoDate - ISO 8601 date string (e.g., "2025-01-15T10:30:00Z")
 * @returns Formatted date string (e.g., "Jan 15, 2025") or empty string if invalid
 */
export function formatReleaseDate(isoDate: string): string {
  if (!isoDate || typeof isoDate !== 'string') {
    return '';
  }

  try {
    const date = new Date(isoDate);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return '';
    }

    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    // Use UTC methods to avoid timezone conversion issues
    const month = monthNames[date.getUTCMonth()];
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();

    return `${month} ${day}, ${year}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}
