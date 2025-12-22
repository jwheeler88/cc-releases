export interface SearchStatusProps {
  query: string;
  matchCount: number;
  releaseCount: number;
}

export function SearchStatus({ query, matchCount, releaseCount }: SearchStatusProps) {
  // Return null when no query or no matches (AC #5, #6)
  if (!query.trim() || matchCount === 0) {
    return null;
  }

  // Handle singular/plural grammar (AC #2)
  const entryLabel = matchCount === 1 ? 'entry' : 'entries';
  const releaseLabel = releaseCount === 1 ? 'release' : 'releases';

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="text-sm text-[#b0aea5] font-[Lora] text-center py-4"
    >
      <span className="text-[#faf9f5] font-medium">{matchCount}</span> {entryLabel} across{" "}
      <span className="text-[#faf9f5] font-medium">{releaseCount}</span> {releaseLabel} match{" "}
      "<span className="text-[#d97757]">{query}</span>"
    </div>
  );
}
