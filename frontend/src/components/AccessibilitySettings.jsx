import React from 'react';
import { useAccessibilityContext } from './AccessibilityProvider';
import { announceToScreenReader } from '../utils/accessibility';

export const AccessibilitySettings = () => {
  const {
    highContrastMode,
    reducedMotion,
    screenReaderMode,
    toggleHighContrast,
    toggleReducedMotion,
    toggleScreenReaderMode,
  } = useAccessibilityContext();

  const handleToggleHighContrast = () => {
    toggleHighContrast();
    announceToScreenReader(
      highContrastMode ? 'High contrast mode disabled' : 'High contrast mode enabled'
    );
  };

  const handleToggleReducedMotion = () => {
    toggleReducedMotion();
    announceToScreenReader(
      reducedMotion ? 'Reduced motion disabled' : 'Reduced motion enabled'
    );
  };

  const handleToggleScreenReader = () => {
    toggleScreenReaderMode();
    announceToScreenReader(
      screenReaderMode ? 'Screen reader mode disabled' : 'Screen reader mode enabled'
    );
  };

  return (
    <div className="accessibility-settings" role="region" aria-label="Accessibility settings">
      <h2>Accessibility Settings</h2>

      <label>
        <input
          type="checkbox"
          checked={highContrastMode}
          onChange={handleToggleHighContrast}
          aria-label="Enable high contrast mode"
        />
        High Contrast Mode
      </label>

      <label>
        <input
          type="checkbox"
          checked={reducedMotion}
          onChange={handleToggleReducedMotion}
          aria-label="Enable reduced motion"
        />
        Reduce Motion
      </label>

      <label>
        <input
          type="checkbox"
          checked={screenReaderMode}
          onChange={handleToggleScreenReader}
          aria-label="Enable screen reader mode"
        />
        Screen Reader Mode
      </label>
    </div>
  );
};
