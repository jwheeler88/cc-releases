import { useEffect, useState, useRef } from 'react';

const THINKING_MESSAGES = [
  'Ruminating...',
  'Contemplating...',
  'Pondering...',
  'Sparkling...',
  'Musing...',
  'Cogitating...',
  'Deliberating...',
  'Reflecting...',
];

// Speckle animation frames using unicode characters (Anthropic style)
const SPECKLE_FRAMES = ['·', '✢', '✴', '✻', '✽', '❋'];

/**
 * Ambient thinking indicator that appears periodically in sticky position
 * Mimics Claude Code's loading animation with speckle dots and witty messages
 */
export function ThinkingIndicator() {
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [message, setMessage] = useState('');
  const [speckleFrame, setSpeckleFrame] = useState(0);

  const fadeTimeoutRef = useRef<NodeJS.Timeout>();
  const hideTimeoutRef = useRef<NodeJS.Timeout>();
  const scheduleTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const showIndicator = () => {
      // Random message
      const randomMessage = THINKING_MESSAGES[Math.floor(Math.random() * THINKING_MESSAGES.length)];
      setMessage(randomMessage);

      setIsVisible(true);
      setIsFadingOut(false);
      setSpeckleFrame(0);

      // Clear any existing timeouts
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);

      // Start fade out after 5 seconds
      fadeTimeoutRef.current = setTimeout(() => {
        setIsFadingOut(true);
        // Hide completely after fade out animation (300ms)
        hideTimeoutRef.current = setTimeout(() => {
          setIsVisible(false);
        }, 300);
      }, 5000);
    };

    // Show every 9.3 seconds (5s visible + 4s gap)
    const scheduleNext = () => {
      const delay = 9300; // 9.3 seconds total (5s visible + 0.3s fade + 4s gap)
      scheduleTimeoutRef.current = setTimeout(() => {
        showIndicator();
        scheduleNext();
      }, delay);
    };

    // Show immediately on mount, then schedule repeats
    showIndicator();
    scheduleNext();

    return () => {
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      if (scheduleTimeoutRef.current) clearTimeout(scheduleTimeoutRef.current);
    };
  }, []);

  // Animate speckle frames
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setSpeckleFrame((prev) => (prev + 1) % SPECKLE_FRAMES.length);
    }, 150); // Cycle through frames every 150ms

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 z-30 pointer-events-none ${
        isFadingOut ? 'animate-fade-out' : 'animate-fade-in'
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Speckle animation */}
        <span className="text-lg font-mono" style={{ color: '#d97757' }}>
          {SPECKLE_FRAMES[speckleFrame]}
        </span>

        {/* Message */}
        <span className="text-sm font-semibold font-mono brightness-sweep" style={{ color: '#d97757' }}>
          {message}
        </span>
      </div>
    </div>
  );
}
