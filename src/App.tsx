import { useChangelog } from '@/hooks/useChangelog';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import { ReleaseSection } from '@/components/ReleaseSection';
import { ReleaseEntry } from '@/components/ReleaseEntry';

function App() {
  const { releases, isLoading, error, retry } = useChangelog();

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
      {/* Page container with padding */}
      <div className="p-8">
        {/* Centered content wrapper with max-width constraint */}
        <div className="max-w-[720px] mx-auto">
          {/* App title - placeholder for Epic 4 HeroSection */}
          <h1 className="text-4xl font-bold mb-8 font-heading">cc-releases</h1>

          {/* Release list - space-y-0 because ReleaseSection has py-16 internally */}
          <div className="space-y-0">
            {releases.map((release) => (
              <ReleaseSection
                key={release.version}
                version={release.version}
                date={release.date}
              >
                {release.entries.map((entry, index) => (
                  <ReleaseEntry
                    key={`${release.version}-${entry.category}-${index}`}
                    category={entry.category}
                    content={entry.content}
                  />
                ))}
              </ReleaseSection>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
