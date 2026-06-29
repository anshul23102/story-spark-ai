import { useState, useEffect } from 'react';

export const useAccessibility = () => {
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [screenReaderMode, setScreenReaderMode] = useState(false);

  useEffect(() => {
    const savedHighContrast = localStorage.getItem('accessibility-high-contrast');
    const savedReducedMotion = localStorage.getItem('accessibility-reduced-motion');
    const savedScreenReader = localStorage.getItem('accessibility-screen-reader');

    if (savedHighContrast) setHighContrastMode(JSON.parse(savedHighContrast));
    if (savedReducedMotion) setReducedMotion(JSON.parse(savedReducedMotion));
    if (savedScreenReader) setScreenReaderMode(JSON.parse(savedScreenReader));

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prefersContrast = window.matchMedia('(prefers-contrast: more)').matches;

    if (prefersReducedMotion) setReducedMotion(true);
    if (prefersContrast) setHighContrastMode(true);
  }, []);

  const toggleHighContrast = () => {
    const newValue = !highContrastMode;
    setHighContrastMode(newValue);
    localStorage.setItem('accessibility-high-contrast', JSON.stringify(newValue));
    document.documentElement.setAttribute('data-high-contrast', newValue);
  };

  const toggleReducedMotion = () => {
    const newValue = !reducedMotion;
    setReducedMotion(newValue);
    localStorage.setItem('accessibility-reduced-motion', JSON.stringify(newValue));
    document.documentElement.setAttribute('data-reduced-motion', newValue);
  };

  const toggleScreenReaderMode = () => {
    const newValue = !screenReaderMode;
    setScreenReaderMode(newValue);
    localStorage.setItem('accessibility-screen-reader', JSON.stringify(newValue));
    document.documentElement.setAttribute('data-screen-reader', newValue);
  };

  return {
    highContrastMode,
    reducedMotion,
    screenReaderMode,
    toggleHighContrast,
    toggleReducedMotion,
    toggleScreenReaderMode,
  };
};
