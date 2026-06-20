export const a11yUtils = {
  announce: (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 1000);
  },

  setAriaLabel: (element: HTMLElement, label: string) => {
    element.setAttribute('aria-label', label);
  },

  setAriaDescribedBy: (element: HTMLElement, descriptionId: string) => {
    element.setAttribute('aria-describedby', descriptionId);
  },

  setAriaLabelledBy: (element: HTMLElement, labelId: string) => {
    element.setAttribute('aria-labelledby', labelId);
  },

  makeButton: (element: HTMLElement) => {
    element.setAttribute('role', 'button');
    element.setAttribute('tabindex', '0');
  },

  makeNavigable: (element: HTMLElement) => {
    element.setAttribute('tabindex', '0');
  },

  announcePageLoad: (pageTitle: string) => {
    const announcement = document.createElement('h1');
    announcement.className = 'sr-only';
    announcement.textContent = pageTitle;
    document.body.prepend(announcement);
  },
};

export const keyboardShortcuts = {
  isEnterKey: (event: KeyboardEvent) => event.key === 'Enter',
  isSpaceKey: (event: KeyboardEvent) => event.key === ' ',
  isEscapeKey: (event: KeyboardEvent) => event.key === 'Escape',
  isTabKey: (event: KeyboardEvent) => event.key === 'Tab',
  isArrowKey: (event: KeyboardEvent) =>
    ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key),
};

export const focusManagement = {
  trapFocus: (container: HTMLElement, initialFocus?: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    initialFocus?.focus();

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

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  },

  restoreFocus: (element: HTMLElement) => {
    element?.focus();
  },
};

export const contrastUtils = {
  enableHighContrast: () => {
    document.documentElement.setAttribute('data-contrast', 'high');
  },

  disableHighContrast: () => {
    document.documentElement.removeAttribute('data-contrast');
  },

  toggleHighContrast: () => {
    const current = document.documentElement.getAttribute('data-contrast');
    if (current === 'high') {
      contrastUtils.disableHighContrast();
    } else {
      contrastUtils.enableHighContrast();
    }
  },

  getHighContrastEnabled: () => {
    return document.documentElement.getAttribute('data-contrast') === 'high';
  },
};

export const srOnly = {
  css: 'position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border-width: 0;',
  className: 'sr-only',
};
