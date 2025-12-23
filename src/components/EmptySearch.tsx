import { Search } from 'lucide-react';

export interface EmptySearchProps {
  query: string;
  onClear: () => void;
}

export function EmptySearch({ query, onClear }: EmptySearchProps) {
  // Return null when no query (defensive check)
  if (!query.trim()) {
    return null;
  }

  return (
    <div className="text-center pt-16 pb-8">
      {/* Search icon - decorative */}
      <Search className="h-12 w-12 text-[#b0aea5] mx-auto mb-6" aria-hidden="true" />

      {/* Heading with query */}
      <h2 className="text-2xl font-[Poppins] font-medium text-[#faf9f5] mb-4">
        No releases match "<span className="text-[#d97757]">{query}</span>"
      </h2>

      {/* Suggestions */}
      <p className="text-base font-[Lora] text-[#b0aea5] mb-6">
        Try searching for 'features', 'performance', or 'MCP'
      </p>

      {/* Clear search link */}
      <button
        onClick={onClear}
        className="text-base font-[Lora] text-[#d97757] hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-[#d97757] focus:ring-offset-2 focus:ring-offset-[#141413] rounded"
      >
        Clear search
      </button>
    </div>
  );
}
