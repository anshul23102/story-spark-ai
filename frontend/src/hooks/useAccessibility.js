import { useState, useEffect, useCallback } from 'react';

export const useAccessibility = () => {
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [screenReaderMode, setScreenReaderMode] = useState(false);

  useEffect(() => {
    const savedHighContrast = localStorage.getItem('accessibility-high-contrast');
    const savedReducedMotion = localStorage.getItem('accessibility-reduced-motion');
    const savedScreenReader = localStorage.getItem('accessibility-screen-reader');

    if (savedHighContrast === 'true') {
      setHighContrastMode(true);
      document.documentElement.setAttribute('data-high-contrast', 'true');
    }

    if (savedReducedMotion === 'true') {
      setReducedMotion(true);
      document.documentElement.setAttribute('data-reduced-motion', 'true');
    }

    if (savedScreenReader === 'true') {
      setScreenReaderMode(true);
    }

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) {
      setReducedMotion(true);
      document.documentElement.setAttribute('data-reduced-motion', 'true');
    }

    const contrastQuery = window.matchMedia('(prefers-contrast: more)');
    if (contrastQuery.matches) {
      setHighContrastMode(true);
      document.documentElement.setAttribute('data-high-contrast', 'true');
    }
  }, []);

  const toggleHighContrast = useCallback(() => {
    setHighContrastMode((prev) => {
      const newValue = !prev;
      localStorage.setItem('accessibility-high-contrast', newValue);
      if (newValue) {
        document.documentElement.setAttribute('data-high-contrast', 'true');
      } else {
        document.documentElement.removeAttribute('data-high-contrast');
      }
      return newValue;
    });
  }, []);

  const toggleReducedMotion = useCallback(() => {
    setReducedMotion((prev) => {
      const newValue = !prev;
      localStorage.setItem('accessibility-reduced-motion', newValue);
      if (newValue) {
        document.documentElement.setAttribute('data-reduced-motion', 'true');
      } else {
        document.documentElement.removeAttribute('data-reduced-motion');
      }
      return newValue;
    });
  }, []);

  const toggleScreenReaderMode = useCallback(() => {
    setScreenReaderMode((prev) => {
      const newValue = !prev;
      localStorage.setItem('accessibility-screen-reader', newValue);
      return newValue;
    });
  }, []);

  return {
    highContrastMode,
    reducedMotion,
    screenReaderMode,
    toggleHighContrast,
    toggleReducedMotion,
    toggleScreenReaderMode,
  };
};
