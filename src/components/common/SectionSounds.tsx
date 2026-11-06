import { useEffect, useRef } from 'react';
import { sound } from '../../lib/sound';
import { useActiveSection } from '../../lib/useActiveSection';

const SECTION_IDS = ['home', 'about', 'skills', 'projects', 'learning', 'education', 'contact'];

/**
 * Wires the (opt-in) sound layer to the page: a soft whoosh when the active
 * section changes plus tick / click feedback on interactive elements.
 * Renders nothing; it only keeps its own state so the page tree does not
 * re-render on section changes.
 */
export const SectionSounds = () => {
  const active = useActiveSection(SECTION_IDS);
  const previous = useRef(active);

  useEffect(() => {
    if (previous.current !== active) {
      sound.whoosh();
      previous.current = active;
    }
  }, [active]);

  useEffect(() => {
    let last: Element | null = null;

    const onOver = (e: PointerEvent) => {
      if (!sound.isEnabled()) return;
      const el = (e.target as HTMLElement | null)?.closest('a, button, [data-cursor]') ?? null;
      if (el && el !== last) sound.tick();
      last = el;
    };
    const onClick = (e: MouseEvent) => {
      if (!sound.isEnabled()) return;
      if ((e.target as HTMLElement | null)?.closest('a, button')) sound.click();
    };

    document.addEventListener('pointerover', onOver, { passive: true });
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('click', onClick);
    };
  }, []);

  return null;
};
