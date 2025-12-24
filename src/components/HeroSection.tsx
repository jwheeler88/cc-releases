import { Search } from 'lucide-react';
import { useRef, useMemo } from 'react';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';

export interface HeroSectionProps {
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
  const inputRef = useRef<HTMLInputElement>(null);

  // Platform detection with modern API fallback
  const isMac = useMemo(() => {
    if (typeof navigator === 'undefined') return false;
    if ('userAgentData' in navigator && (navigator as Navigator & { userAgentData?: { platform: string } }).userAgentData?.platform) {
      return /mac/i.test((navigator as Navigator & { userAgentData: { platform: string } }).userAgentData.platform);
    }
    return /Mac|iPhone|iPod|iPad/.test(navigator.platform || navigator.userAgent);
  }, []);

  // Shortcut hint text for placeholder
  const shortcutHint = isMac ? '⌘K' : 'Ctrl+K';

  // Cmd+K (Mac) or Ctrl+K (Windows/Linux) to focus search
  useKeyboardShortcut({
    onTrigger: () => {
      inputRef.current?.focus();
      inputRef.current?.select();
    },
    key: 'k',
    metaKey: isMac,
    ctrlKey: !isMac,
    allowedInputId: 'release-search'
  });

  // Escape to clear focus
  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      inputRef.current?.blur();
    }
  };

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
        <div className="bg-white dark:bg-[#1a1a19] rounded-full p-4 flex items-center border border-[#e8e6dc] dark:border-[#2a2a28] focus-within:border-[#d97757] focus-within:ring-2 focus-within:ring-[#d97757]/20 transition-colors">
          <Search className="w-5 h-5 text-[#b0aea5] ml-2 shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            id="release-search"
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder={`Search releases... (${shortcutHint})`}
            className="bg-transparent flex-1 outline-none text-[#141413] dark:text-[#faf9f5] pl-4 placeholder:text-[#b0aea5]/70"
            aria-describedby="search-hint"
            autoComplete="off"
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
            className="bg-[#e8e6dc] dark:bg-[#1a1a19] hover:bg-[#d1cfc5] dark:hover:bg-[#2a2a28] rounded-full px-4 py-4 text-sm text-[#b0aea5] hover:text-[#141413] dark:hover:text-[#faf9f5] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d97757] focus-visible:ring-offset-2"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </section>
  );
}
