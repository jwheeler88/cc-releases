import { Search } from 'lucide-react';

interface HeroSectionProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSuggestionClick?: (suggestion: string) => void;
}

const SUGGESTIONS = ['MCP', 'hooks', 'performance'];

export function HeroSection({
  query,
  onQueryChange,
  onSuggestionClick
}: HeroSectionProps) {
  const handleSuggestionClick = (suggestion: string) => {
    onQueryChange(suggestion);
    onSuggestionClick?.(suggestion);
  };

  return (
    <section
      className="min-h-[40vh] bg-[#141413] flex flex-col items-center justify-center px-4"
      aria-labelledby="hero-title"
    >
      {/* Title */}
      <h1
        id="hero-title"
        className="text-4xl font-semibold text-[#faf9f5] font-heading mb-2"
      >
        Claude Code
      </h1>

      {/* Tagline */}
      <p className="text-[#b0aea5] mb-8 font-body">
        Release Notes & Changelog
      </p>

      {/* Search input container */}
      <div className="relative max-w-xl w-full">
        <label htmlFor="release-search" className="sr-only">
          Search releases
        </label>
        <div className="bg-[#1a1a19] rounded-full p-3 flex items-center border border-[#2a2a28] focus-within:border-[#d97757] focus-within:ring-2 focus-within:ring-[#d97757]/20 transition-colors">
          <Search className="w-5 h-5 text-[#b0aea5] ml-2 shrink-0" aria-hidden="true" />
          <input
            id="release-search"
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search releases... try 'MCP' or 'hooks'"
            className="bg-transparent flex-1 outline-none text-[#faf9f5] pl-4 placeholder:text-[#b0aea5]/70"
            aria-describedby="search-hint"
          />
        </div>
        <span id="search-hint" className="sr-only">
          Type to filter releases by keyword
        </span>
      </div>

      {/* Suggestion pills */}
      <div className="flex flex-wrap justify-center gap-2 mt-6" role="group" aria-label="Search suggestions">
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => handleSuggestionClick(suggestion)}
            className="bg-[#1a1a19] hover:bg-[#2a2a28] rounded-full px-4 py-2 text-sm text-[#b0aea5] hover:text-[#faf9f5] transition-colors focus:outline-none focus:ring-2 focus:ring-[#d97757] focus:ring-offset-2 focus:ring-offset-[#141413]"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </section>
  );
}
