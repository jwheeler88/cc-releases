function App() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <h1 className="text-4xl font-bold mb-2 font-heading">cc-releases</h1>
      <p className="text-lg mb-8 font-body text-mid-gray">
        Anthropic Claude Code Release History
      </p>

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
    </div>
  );
}

export default App;
