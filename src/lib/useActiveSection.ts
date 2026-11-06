import { useEffect, useState } from 'react';

/**
 * Tracks which section currently crosses the middle of the viewport.
 * IntersectionObserver is used instead of scroll offsets so it keeps working
 * with pinned (ScrollTrigger) sections and late layout shifts.
 */
export const useActiveSection = (ids: string[]) => {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return active;
};
