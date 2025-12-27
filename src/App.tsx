import { useState } from 'react';
import { useChangelog } from "@/hooks/useChangelog";
import { useSearch } from "@/hooks/useSearch";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { HeroSection } from "@/components/HeroSection";
import { SearchStatus } from "@/components/SearchStatus";
import { EmptySearch } from "@/components/EmptySearch";
import { ReleaseSection } from "@/components/ReleaseSection";
import type { Release } from "@/lib/types";
import { Toaster } from "sonner";

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
      {/* Toast notifications with brand styling */}
      <Toaster
        position="bottom-right"
        duration={2000}
        toastOptions={{
          style: {
            background: '#faf9f5',
            color: '#141413',
            border: '1px solid #d97757',
          },
        }}
      />

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
      <div className="px-4 py-8 md:p-8 w-full max-w-full">
        {/* Centered content wrapper with max-width constraint */}
        <div className="w-full max-w-[720px] mx-auto">
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
