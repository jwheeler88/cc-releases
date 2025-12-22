import { Skeleton } from "@/components/ui/skeleton";

/**
 * LoadingState component displays skeleton loaders while CHANGELOG is being fetched.
 * Mirrors the ReleaseSection layout structure for seamless transition to actual content.
 */

/** Skeleton entry with left border for category simulation */
function SkeletonEntry() {
  return (
    <div className="pl-4 border-l-2 border-[#b0aea5]/20">
      <Skeleton className="h-16 w-full bg-[#b0aea5]/20" />
    </div>
  );
}

/** Skeleton category group with header and entries */
function SkeletonCategoryGroup({ entryCount = 3 }: { entryCount?: number }) {
  return (
    <div className="space-y-3">
      <Skeleton className="h-5 w-32 mb-4 bg-[#b0aea5]/20" />
      {Array.from({ length: entryCount }, (_, i) => (
        <SkeletonEntry key={`entry-${i}`} />
      ))}
    </div>
  );
}

/** Skeleton release section mirroring ReleaseSection layout */
function SkeletonReleaseSection() {
  return (
    <article className="relative flex flex-col md:flex-row gap-4 md:gap-16 py-16">
      {/* Sticky version/date sidebar skeleton */}
      <div className="md:sticky top-8 h-fit w-48 shrink-0">
        <Skeleton className="h-7 md:h-9 w-32 mb-1 bg-[#b0aea5]/20" />
        <Skeleton className="h-3.5 w-24 bg-[#b0aea5]/20" />
      </div>

      {/* Release content area skeleton */}
      <div className="flex-1 max-w-prose space-y-6">
        <SkeletonCategoryGroup entryCount={3} />
        <SkeletonCategoryGroup entryCount={2} />
      </div>
    </article>
  );
}

export function LoadingState() {
  return (
    <div
      className="space-y-0"
      aria-busy="true"
      aria-label="Loading releases"
      role="status"
    >
      {/* Render 3 release section skeletons */}
      {Array.from({ length: 3 }, (_, i) => (
        <SkeletonReleaseSection key={`skeleton-release-${i}`} />
      ))}
    </div>
  );
}
