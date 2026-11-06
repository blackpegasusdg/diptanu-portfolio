import React from 'react';

/** Fixed film-grain layer. Pure CSS (see .grain-overlay), no JS cost. */
export const GrainOverlay: React.FC = () => (
  <div className="grain-overlay" aria-hidden="true" />
);
