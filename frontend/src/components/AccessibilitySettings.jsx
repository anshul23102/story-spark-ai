import React from 'react';
import { useAccessibilityContext } from './AccessibilityProvider';
import { announceToScreenReader } from '../utils/accessibility';
import '../styles/accessibility.css';

export const AccessibilitySettings = () => {
  const {
    highContrastMode,
    reducedMotion,
    screenReaderMode,
    toggleHighContrast,
    toggleReducedMotion,
    toggleScreenReaderMode,
  } = useAccessibilityContext();

  const handleHighContrastToggle = () => {
    toggleHighContrast();
    const message = highContrastMode
      ? 'High contrast mode disabled'
      : 'High contrast mode enabled';
    announceToScreenReader(message);
  };

  const handleReducedMotionToggle = () => {
    toggleReducedMotion();
    const message = reducedMotion
      ? 'Reduced motion disabled'
      : 'Reduced motion enabled';
    announceToScreenReader(message);
  };

  const handleScreenReaderToggle = () => {
    toggleScreenReaderMode();
    const message = screenReaderMode
      ? 'Screen reader mode disabled'
      : 'Screen reader mode enabled';
    announceToScreenReader(message);
  };

  return (
    <div className="accessibility-settings" role="region" aria-label="Accessibility settings">
      <h2>Accessibility</h2>

      <div className="accessibility-option">
        <label htmlFor="high-contrast-toggle">
          <input
            id="high-contrast-toggle"
            type="checkbox"
            checked={highContrastMode}
            onChange={handleHighContrastToggle}
            aria-label="Toggle high contrast mode"
          />
          High Contrast Mode
        </label>
      </div>

      <div className="accessibility-option">
        <label htmlFor="reduced-motion-toggle">
          <input
            id="reduced-motion-toggle"
            type="checkbox"
            checked={reducedMotion}
            onChange={handleReducedMotionToggle}
            aria-label="Toggle reduced motion"
          />
          Reduce Motion
        </label>
      </div>

      <div className="accessibility-option">
        <label htmlFor="screen-reader-toggle">
          <input
            id="screen-reader-toggle"
            type="checkbox"
            checked={screenReaderMode}
            onChange={handleScreenReaderToggle}
            aria-label="Toggle screen reader mode"
          />
          Screen Reader Mode
        </label>
      </div>
    </div>
  );
};
