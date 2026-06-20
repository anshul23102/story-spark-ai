import { useEffect, useRef } from 'react';
import { keyboardShortcuts } from '../utils/accessibility';

interface UseKeyboardNavigationOptions {
  onEnter?: (e: KeyboardEvent) => void;
  onEscape?: (e: KeyboardEvent) => void;
  onArrowUp?: (e: KeyboardEvent) => void;
  onArrowDown?: (e: KeyboardEvent) => void;
  onArrowLeft?: (e: KeyboardEvent) => void;
  onArrowRight?: (e: KeyboardEvent) => void;
  onSpace?: (e: KeyboardEvent) => void;
}

export const useKeyboardNavigation = (options: UseKeyboardNavigationOptions) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (keyboardShortcuts.isEnterKey(e)) {
        options.onEnter?.(e);
      } else if (keyboardShortcuts.isEscapeKey(e)) {
        options.onEscape?.(e);
      } else if (e.key === 'ArrowUp') {
        options.onArrowUp?.(e);
      } else if (e.key === 'ArrowDown') {
        options.onArrowDown?.(e);
      } else if (e.key === 'ArrowLeft') {
        options.onArrowLeft?.(e);
      } else if (e.key === 'ArrowRight') {
        options.onArrowRight?.(e);
      } else if (keyboardShortcuts.isSpaceKey(e)) {
        options.onSpace?.(e);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (container) {
        container.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [options]);

  return containerRef;
};

export const useSkipToMain = () => {
  useEffect(() => {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'sr-only sr-only-focusable';
    skipLink.textContent = 'Skip to main content';
    document.body.prepend(skipLink);

    return () => skipLink.remove();
  }, []);
};

export const useFocusTrap = (elementRef: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    element.addEventListener('keydown', handleKeyDown);
    return () => element.removeEventListener('keydown', handleKeyDown);
  }, [elementRef]);
};
