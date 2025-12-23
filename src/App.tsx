import { useState } from 'react';
import { useChangelog } from "@/hooks/useChangelog";
import { useSearch } from "@/hooks/useSearch";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { HeroSection } from "@/components/HeroSection";
import { SearchStatus } from "@/components/SearchStatus";
import { EmptySearch } from "@/components/EmptySearch";
import { ReleaseSection } from "@/components/ReleaseSection";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { Release } from "@/lib/types";

function App() {
  const { releases, isLoading, error, retry } = useChangelog();
  const [query, setQuery] = useState('');
  const { filteredReleases, matchCount, releaseCount } = useSearch({ releases, query });

  // State machine: Loading → Error | Success
  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} retry={retry} />;
  }

  // Success state: render all releases
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* ThemeToggle in top-right corner */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* HeroSection OUTSIDE centered wrapper - full width */}
      <HeroSection
        query={query}
        onQueryChange={setQuery}
      />

      {/* SearchStatus component - full width */}
      <SearchStatus
        query={query}
        matchCount={matchCount}
        releaseCount={releaseCount}
      />

      {/* Page container with padding */}
      <div className="p-8">
        {/* Centered content wrapper with max-width constraint */}
        <div className="max-w-[720px] mx-auto">
          {/* Conditional: EmptySearch when no results, otherwise release list */}
          {filteredReleases.length === 0 && query.trim() ? (
            <EmptySearch query={query} onClear={() => setQuery('')} />
          ) : (
            <div className="space-y-0">
              {filteredReleases.map((release: Release) => (
                <ReleaseSection
                  key={release.version}
                  version={release.version}
                  date={release.date}
                  entries={release.entries}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default App;
