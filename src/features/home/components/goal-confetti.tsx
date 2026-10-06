import { useState } from 'react';
import { CannonConfetti } from 'react-native-fast-confetti';
import { useFastingStore } from '@/src/stores/fasting-store';

export interface GoalConfettiProps {
  elapsedMs: number;
  goalMs: number;
  // Developer slider mode: fire on every upward crossing and save nothing.
  debug: boolean;
}

// Fires once per fast when the goal is reached, including the first time the
// app opens after the goal passed while it was closed. The fast is marked as
// celebrated when the animation ends, so an interrupted burst plays again.
export function GoalConfetti({ elapsedMs, goalMs, debug }: GoalConfettiProps) {
  const activeFast = useFastingStore((s) => s.activeFast);
  const markGoalCelebrated = useFastingStore((s) => s.markGoalCelebrated);

  const reached = elapsedMs >= goalMs;
  const [wasReached, setWasReached] = useState(reached);
  const [debugBurst, setDebugBurst] = useState(0);
  if (reached !== wasReached) {
    setWasReached(reached);
    if (reached && debug) setDebugBurst((n) => n + 1);
  }

  const show = debug
    ? debugBurst > 0
    : reached && activeFast !== null && !activeFast.goalCelebrated;
  if (!show) return null;

  return (
    <CannonConfetti
      key={debug ? `debug-${debugBurst}` : 'goal'}
      autoplay
      fadeOutOnEnd
      onAnimationEnd={debug ? () => setDebugBurst(0) : markGoalCelebrated}>
      <CannonConfetti.Origin position="bottom-left" count={120} initialSpeed={3}>
        <CannonConfetti.Flake width={8} height={14} radius={2} />
        <CannonConfetti.Flake size={10} radius={5} />
      </CannonConfetti.Origin>
      <CannonConfetti.Origin position="bottom-right" count={120} initialSpeed={3}>
        <CannonConfetti.Flake width={8} height={14} radius={2} />
        <CannonConfetti.Flake size={10} radius={5} />
      </CannonConfetti.Origin>
    </CannonConfetti>
  );
}
