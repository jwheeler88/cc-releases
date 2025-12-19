import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Moon } from "lucide-react";
// Path alias test: verify @/ imports work for new types and constants
import type { Category, Theme, Release, ReleaseEntry } from "@/lib/types";
import { CATEGORIES, CHANGELOG_URL } from "@/lib/constants";

function App() {
  // Type verification for Story 1.4: Ensure all imported types are valid
  const _typeCheck: { release: Release; entry: ReleaseEntry; category: Category; theme: Theme } | null = null;
  void _typeCheck; // Suppress unused warning

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <h1 className="text-4xl font-bold mb-2 font-heading">cc-releases</h1>
      <p className="text-lg mb-8 font-body text-mid-gray">
        Anthropic Claude Code Release History
      </p>

      {/* shadcn/ui Components Test */}
      <div className="mb-8 border border-mid-gray rounded p-6 bg-background">
        <h2 className="text-xl font-semibold mb-4 font-heading">
          shadcn/ui Components
        </h2>

        {/* Button Component */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3 text-mid-gray">Buttons</h3>
          <div className="flex gap-3 flex-wrap">
            <Button>Default Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost" size="sm">
              <Moon className="mr-2 h-4 w-4" />
              Theme Toggle
            </Button>
          </div>
        </div>

        {/* Input Component */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3 text-mid-gray">Input</h3>
          <div className="flex gap-2 w-full max-w-sm">
            <Input placeholder="Search releases..." />
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Badge Component */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3 text-mid-gray">Badges</h3>
          <div className="flex gap-2 flex-wrap">
            <Badge>Features</Badge>
            <Badge variant="outline">Bug Fixes</Badge>
            <Badge variant="secondary">Performance</Badge>
            <Badge variant="destructive">DevX</Badge>
          </div>
        </div>

        {/* Skeleton Component */}
        <div>
          <h3 className="text-sm font-semibold mb-3 text-mid-gray">
            Skeleton (Loading State)
          </h3>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </div>

      {/* Original Color Palette Display */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 font-heading">
          Category Colors
        </h2>
        <div className="flex gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-features" />
            <span className="font-body">Features</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-bugfixes" />
            <span className="font-body">Bug Fixes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-performance" />
            <span className="font-body">Performance</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-devx" />
            <span className="font-body">DevX</span>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 font-heading">
          Color Palette
        </h2>
        <div className="flex gap-4 flex-wrap">
          <div className="text-center">
            <div className="w-16 h-16 rounded border border-mid-gray bg-dark" />
            <span className="text-sm text-mid-gray">Dark</span>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded border border-mid-gray bg-light" />
            <span className="text-sm text-mid-gray">Light</span>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded border border-mid-gray bg-mid-gray" />
            <span className="text-sm text-mid-gray">Mid Gray</span>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded border border-mid-gray bg-light-gray" />
            <span className="text-sm text-mid-gray">Light Gray</span>
          </div>
        </div>
      </div>

      {/* Path Alias Verification - Story 1.4 */}
      <div className="mt-8 border border-mid-gray rounded p-4 bg-background">
        <h2 className="text-xl font-semibold mb-2 font-heading">
          ✓ Path Alias Test (Story 1.4)
        </h2>
        <p className="text-sm text-mid-gray mb-2">
          Verified @/ imports working for types and constants:
        </p>
        <ul className="text-xs text-mid-gray space-y-1">
          <li>• Types: {(['Category', 'Theme', 'Release', 'ReleaseEntry'] satisfies string[]).join(', ')}</li>
          <li>• Constants: CATEGORIES ({(Object.keys(CATEGORIES) as Category[]).join(', ')})</li>
          <li>• CHANGELOG_URL: {CHANGELOG_URL}</li>
          <li>• Theme type: {(['light', 'dark'] satisfies Theme[]).join(' | ')}</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
