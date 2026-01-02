import { useEffect, useState } from "react";

const THINKING_MESSAGES = [
  "Ruminating...",
  "Contemplating...",
  "Pondering...",
  "Sparkling...",
  "Musing...",
  "Cogitating...",
  "Deliberating...",
  "Reflecting...",
];

/**
 * Ambient thinking indicator that cycles through messages
 * Always visible with animated text glow, positioned in bottom-left of hero
 */
export function ThinkingIndicator() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    // Cycle through messages every 8 seconds
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % THINKING_MESSAGES.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-3 pointer-events-none">
      {/* Static speckle icon */}
      <span className="text-2xl font-mono" style={{ color: "#d97757" }}>
        ✽
      </span>

      {/* Message with animated glow sweep */}
      <span className="text-base font-semibold font-mono brightness-sweep">
        {THINKING_MESSAGES[messageIndex]}
      </span>
    </div>
  );
}
