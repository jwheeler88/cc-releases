/**
 * Attribution badge displayed in bottom-left corner
 * Shows "Generated with Claude Code" with link
 */
export function Attribution() {
  return (
    <div className="fixed bottom-4 left-4 z-40 hidden sm:block">
      <a
        href="https://claude.com/claude-code"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-xs font-semibold hover:opacity-80 transition-opacity duration-200"
        style={{
          color: '#9b8bb0',
        }}
      >
        <span>🤖</span>
        <span>Generated with Claude Code</span>
        <span>❤️</span>
      </a>
    </div>
  );
}
