import { useEffect, useRef } from "react";

export default function useInView({
  enabled = true,
  onInteract,
  rootMargin = "200px",
}: {
  enabled?: boolean;
  onInteract: () => void;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || !ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            onInteract();
          }
        }
      },
      { rootMargin },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [enabled, onInteract, rootMargin]);

  return { ref };
}
