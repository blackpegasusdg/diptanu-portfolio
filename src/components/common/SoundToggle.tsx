import React, { useEffect, useState } from 'react';
import { sound } from '../../lib/sound';

/** Visible opt-in switch. Sound is off until the visitor turns it on. */
export const SoundToggle: React.FC = () => {
  const [on, setOn] = useState(sound.isEnabled());

  useEffect(() => sound.subscribe(setOn), []);

  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? 'Turn sound off' : 'Turn sound on'}
      data-cursor="magnetic"
      data-cursor-label={on ? 'MUTE' : 'SOUND'}
      onClick={() => sound.toggle()}
      className="fixed top-4 right-4 md:top-6 md:right-8 z-[46] flex items-center gap-2.5 rounded-full border border-white/10 bg-[#0c0c10]/70 backdrop-blur-xl px-3.5 py-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[#a1a1aa] hover:text-white hover:border-white/30 transition-colors cursor-pointer select-none"
    >
      <span className="flex items-end gap-[2px] h-3" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`w-[2px] rounded-full bg-current ${on ? 'sound-bar' : ''}`}
            style={{ height: on ? undefined : 3, animationDelay: `${i * 0.12}s` }}
          />
        ))}
      </span>
      <span className="hidden sm:inline">{on ? 'Sound on' : 'Sound off'}</span>
    </button>
  );
};
