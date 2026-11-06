import React from 'react';

interface SplitCharsProps {
  text: string;
  /** Extra classes for each masked word wrapper. */
  wordClassName?: string;
}

/**
 * Renders text as masked words made of individually animatable characters
 * (`.split-char`). The accessible name is kept on the parent via aria-label,
 * so screen readers never hear the text letter by letter.
 */
export const SplitChars: React.FC<SplitCharsProps> = ({ text, wordClassName = '' }) => (
  <>
    {text.split(' ').map((word, wi, arr) => (
      <span
        key={`${word}-${wi}`}
        aria-hidden="true"
        className={`split-mask inline-block align-bottom ${wordClassName}`}
        style={{ marginRight: wi < arr.length - 1 ? '0.26em' : 0 }}
      >
        {word.split('').map((ch, ci) => (
          <span key={ci} className="split-char inline-block will-change-transform">
            {ch}
          </span>
        ))}
      </span>
    ))}
  </>
);
