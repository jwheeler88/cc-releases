import { Search, Sparkles } from 'lucide-react';
import { useRef, useMemo } from 'react';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';

export interface HeroSectionProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSuggestionClick?: (suggestion: string) => void;
}

const SUGGESTIONS = ['skill', 'agent', 'mcp', 'tool'];

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
      className="min-h-[40vh] bg-[#e8e6dc] dark:bg-gradient-to-b dark:from-[#141413] dark:via-[#141413] dark:to-[#1a1a18] flex flex-col items-center justify-center px-4 relative overflow-hidden"
      aria-labelledby="hero-title"
    >
      {/* Subtle radial glow behind title */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(217,119,87,0.08)_0%,_transparent_70%)]"
        aria-hidden="true"
      />

      {/* Content with relative positioning */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Title - Space Grotesk display font */}
        <h1
          id="hero-title"
          className="text-5xl md:text-6xl font-bold font-display mb-2 tracking-tight"
        >
          <span className="text-[#141413] dark:text-[#faf9f5]">Claude </span>
          <span className="text-[#d97757]">Code</span>
        </h1>

      {/* Tagline */}
      <p className="text-[#9b8bb0] mb-8 font-body flex items-center gap-2">
        <span>Changelog</span>
        <span className="text-[#d97757] font-bold">~</span>
        <span className="italic">"Keep thinking."</span>
        <Sparkles className="w-4 h-4" aria-hidden="true" />
      </p>

      {/* Search input container */}
      <div className="relative max-w-xl w-full">
        <label htmlFor="release-search" className="sr-only">
          Search releases
        </label>
        <div className="bg-white dark:bg-[#1a1a19] rounded-full p-4 flex items-center border border-[#e8e6dc] dark:border-[#2a2a28] focus-within:border-[#d97757] focus-within:ring-2 focus-within:ring-[#d97757]/85 transition-colors">
          <Search className="w-5 h-5 text-[#b0aea5] ml-2 shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            id="release-search"
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder={`Search releases... (${shortcutHint})`}
            className="bg-transparent flex-1 outline-none text-[#141413] dark:text-[#faf9f5] pl-4 placeholder:text-[#b0aea5]/70 font-medium"
            aria-describedby="search-hint"
            autoComplete="off"
          />
        </div>
        <span id="search-hint" className="sr-only">
          Type to filter releases by keyword
        </span>
      </div>

      {/* Suggestion pills - enhanced hover per spec */}
      <div className="flex flex-wrap justify-center gap-2 mt-6" role="group" aria-label="Search suggestions">
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => handleSuggestionClick(suggestion)}
            className="bg-[#2a2a28] dark:bg-[#2a2a28] text-[#faf9f5] hover:bg-[#d97757] hover:border-[#d97757] hover:text-[#faf9f5] border border-transparent rounded-full px-4 py-2 text-sm transition-all duration-200 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d97757]"
          >
            {suggestion}
          </button>
        ))}
      </div>
      </div>
    </section>
  );
}
