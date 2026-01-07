import { Search, Sparkles } from "lucide-react";
import { useRef, useMemo } from "react";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { ThemeToggle } from "./ThemeToggle";
import { ThinkingIndicator } from "./ThinkingIndicator";

export interface HeroSectionProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSuggestionClick?: (suggestion: string) => void;
}

const SUGGESTIONS = ["skill", "agent", "mcp", "tool"];

export function HeroSection({
  query,
  onQueryChange,
  onSuggestionClick,
}: HeroSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Platform detection with modern API fallback
  const isMac = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    if (
      "userAgentData" in navigator &&
      (navigator as Navigator & { userAgentData?: { platform: string } })
        .userAgentData?.platform
    ) {
      return /mac/i.test(
        (navigator as Navigator & { userAgentData: { platform: string } })
          .userAgentData.platform,
      );
    }
    return /Mac|iPhone|iPod|iPad/.test(
      navigator.platform || navigator.userAgent,
    );
  }, []);

  // Shortcut hint text for placeholder
  const shortcutHint = isMac ? "⌘K" : "Ctrl+K";

  // Cmd+K (Mac) or Ctrl+K (Windows/Linux) to focus search
  useKeyboardShortcut({
    onTrigger: () => {
      inputRef.current?.focus();
      inputRef.current?.select();
    },
    key: "k",
    metaKey: isMac,
    ctrlKey: !isMac,
    allowedInputId: "release-search",
  });

  // Escape to clear focus
  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onQueryChange(suggestion);
    onSuggestionClick?.(suggestion);
  };

  return (
    <section
      className="min-h-[40vh] bg-[#F0EEE5] dark:bg-gradient-to-b dark:from-[#141413] dark:via-[#141413] dark:to-[#1a1a18] flex flex-col items-center justify-center px-4 relative rounded-3xl mx-4 my-4"
      aria-labelledby="hero-title"
      style={{
        boxShadow: "0 4px 20px -4px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* ThemeToggle in top-right corner - absolute positioned within hero */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-50">
        <ThemeToggle />
      </div>

      {/* ThinkingIndicator in bottom-left corner - absolute positioned within hero */}
      <div className="absolute bottom-4 left-4 z-50 hidden sm:block">
        <ThinkingIndicator />
      </div>

      {/* Floating organic blobs */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        {/* Blob 1 - upper left */}
        <div
          className="absolute bg-[#9b8bb0] opacity-20 dark:opacity-15"
          style={{
            top: "8%",
            left: "5%",
            width: "200px",
            height: "200px",
            borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
            animation:
              "morphBlob 15s infinite alternate, floatBlob 20s infinite ease-in-out",
            filter: "blur(1px)",
          }}
        />

        {/* Blob 1b - bottom right of purple blob */}
        <div
          className="absolute bg-[#d97757] opacity-18 dark:opacity-12 hidden md:block"
          style={{
            top: "23%",
            left: "16%",
            width: "140px",
            height: "140px",
            borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
            animation:
              "morphBlob 13s infinite alternate, floatBlob 19s infinite ease-in-out 2s",
            filter: "blur(1px)",
          }}
        />

        {/* Blob 2 - upper right */}
        <div
          className="absolute bg-[#d97757] opacity-20 dark:opacity-15"
          style={{
            top: "12%",
            right: "8%",
            width: "160px",
            height: "160px",
            borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
            animation:
              "morphBlob 14s infinite alternate, floatBlob 18s infinite ease-in-out 3s",
            filter: "blur(1px)",
          }}
        />

        {/* Blob 3 - bottom right */}
        <div
          className="absolute bg-[#6a9bcc] opacity-20 dark:opacity-15 hidden md:block"
          style={{
            bottom: "10%",
            right: "6%",
            width: "220px",
            height: "220px",
            borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
            animation:
              "morphBlob 16s infinite alternate, floatBlob 22s infinite ease-in-out 6s",
            filter: "blur(1px)",
          }}
        />

        {/* Blob 4 - center (subtle) */}
        <div
          className="absolute bg-[#788c5d] opacity-15 dark:opacity-10"
          style={{
            top: "45%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "280px",
            height: "280px",
            borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
            animation:
              "morphBlob 17s infinite alternate, floatBlob 25s infinite ease-in-out 9s",
            filter: "blur(1px)",
          }}
        />
      </div>

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

        {/* Changelog text */}
        <p className="text-[#9b8bb0] mb-2 font-body font-bold text-xl flex items-center gap-2">
          Changelog
          <Sparkles className="w-5 h-5" aria-hidden="true" />
        </p>

        {/* Tagline */}
        <p className="text-[#9b8bb0] mb-8 font-body flex items-center gap-2">
          <span className="text-[#d97757] font-bold">«</span>
          <span className="italic">Keep thinking.</span>
          <span className="text-[#d97757] font-bold">»</span>
        </p>

        {/* Search input container */}
        <div className="relative w-full max-w-xl">
          <label htmlFor="release-search" className="sr-only">
            Search releases
          </label>
          <div className="bg-white dark:bg-[#1a1a19] rounded-full p-2 flex items-center border border-[#e8e6dc] dark:border-[#2a2a28] focus-within:border-[#d97757]/50 focus-within:shadow-[0_0_8px_rgba(217,119,87,0.6),0_0_24px_rgba(217,119,87,0.3)] transition-all duration-200">
            <Search
              className="w-5 h-5 text-[#b0aea5] ml-2 shrink-0"
              aria-hidden="true"
            />
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
        <div
          className="flex flex-wrap justify-center gap-2 mt-6"
          role="group"
          aria-label="Search suggestions"
        >
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className="bg-[#3a3a38] dark:bg-[#2a2a28] text-[#faf9f5] hover:bg-[#d97757] hover:border-[#d97757] hover:text-[#faf9f5] border border-transparent rounded-full px-4 py-2 text-sm transition-all duration-200 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d97757]"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
