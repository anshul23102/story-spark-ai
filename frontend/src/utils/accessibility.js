export const ARIA_LABELS = {
  screenReaderOnly: 'Screen reader only content',
  menuButton: 'Open navigation menu',
  closeButton: 'Close dialog',
  navigationMenu: 'Main navigation',
  contentRegion: 'Main content',
};

export const KEYBOARD_KEYS = {
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
};

export const handleKeyboardNavigation = (event, handlers) => {
  const key = event.key;
  if (handlers[key]) {
    event.preventDefault();
    handlers[key](event);
  }
};

export const generateAriaLabel = (text) => {
  return text.replace(/[^\w\s]/g, '').toLowerCase().replace(/\s+/g, ' ');
};

export const announceToScreenReader = (message, priority = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);

  setTimeout(() => {
    announcement.remove();
  }, 1000);
};

export const setAriaLabel = (element, label) => {
  element.setAttribute('aria-label', label);
};

export const setAriaDescribedBy = (element, descriptionId) => {
  element.setAttribute('aria-describedby', descriptionId);
};

export const setAriaLabelledBy = (element, labelId) => {
  element.setAttribute('aria-labelledby', labelId);
};

export const setAriaExpanded = (element, expanded) => {
  element.setAttribute('aria-expanded', expanded);
};

export const setAriaHidden = (element, hidden) => {
  element.setAttribute('aria-hidden', hidden);
};
