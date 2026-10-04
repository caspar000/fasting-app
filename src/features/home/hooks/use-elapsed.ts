import { useEffect, useState } from 'react';

export function useElapsed(startedAt: number | null, intervalMs = 1000): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (startedAt === null) return;
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [startedAt, intervalMs]);

  if (startedAt === null) return 0;
  return Math.max(0, now - startedAt);
}
