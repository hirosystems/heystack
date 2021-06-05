import { useEffect, useRef } from 'react';

export function useScrollToBottom(enabled: boolean) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (enabled) setTimeout(() => ref.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  }, [enabled]);
  return ref;
}
