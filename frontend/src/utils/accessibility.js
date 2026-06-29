export const ARIA_LABELS = {
  STORY_CARD: "Story card",
  GENERATE_BUTTON: "Generate new story",
  EDIT_BUTTON: "Edit story",
  DELETE_BUTTON: "Delete story",
  THEME_TOGGLE: "Toggle theme",
  MENU_BUTTON: "Open navigation menu",
  CLOSE_BUTTON: "Close",
  SAVE_BUTTON: "Save changes",
  CANCEL_BUTTON: "Cancel",
  LOADING: "Loading content",
  ERROR_MESSAGE: "Error message",
  SUCCESS_MESSAGE: "Success message",
  INPUT_FIELD: "Input field",
  TEXT_AREA: "Text area",
  SELECT_DROPDOWN: "Select dropdown",
  RADIO_GROUP: "Radio group",
  CHECKBOX_GROUP: "Checkbox group",
};

export const KEYBOARD_KEYS = {
  ENTER: "Enter",
  ESCAPE: "Escape",
  TAB: "Tab",
  SPACE: " ",
  ARROW_UP: "ArrowUp",
  ARROW_DOWN: "ArrowDown",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
};

export const handleKeyboardNavigation = (event, callbacks = {}) => {
  const { key } = event;

  if (key === KEYBOARD_KEYS.ENTER && callbacks.onEnter) {
    event.preventDefault();
    callbacks.onEnter(event);
  }
  if (key === KEYBOARD_KEYS.ESCAPE && callbacks.onEscape) {
    event.preventDefault();
    callbacks.onEscape(event);
  }
  if (key === KEYBOARD_KEYS.ARROW_UP && callbacks.onArrowUp) {
    event.preventDefault();
    callbacks.onArrowUp(event);
  }
  if (key === KEYBOARD_KEYS.ARROW_DOWN && callbacks.onArrowDown) {
    event.preventDefault();
    callbacks.onArrowDown(event);
  }
  if (key === KEYBOARD_KEYS.ARROW_LEFT && callbacks.onArrowLeft) {
    event.preventDefault();
    callbacks.onArrowLeft(event);
  }
  if (key === KEYBOARD_KEYS.ARROW_RIGHT && callbacks.onArrowRight) {
    event.preventDefault();
    callbacks.onArrowRight(event);
  }
};

export const generateAriaLabel = (action, target) => {
  return `${action} ${target}`;
};

export const announceToScreenReader = (message, priority = "polite") => {
  const announcement = document.createElement("div");
  announcement.setAttribute("role", "status");
  announcement.setAttribute("aria-live", priority);
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "sr-only";
  announcement.textContent = message;
  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 3000);
};

export const setAriaLabel = (element, label) => {
  if (element) {
    element.setAttribute("aria-label", label);
  }
};

export const setAriaDescribedBy = (element, descriptionId) => {
  if (element) {
    element.setAttribute("aria-describedby", descriptionId);
  }
};

export const setAriaLive = (element, priority = "polite") => {
  if (element) {
    element.setAttribute("aria-live", priority);
    element.setAttribute("aria-atomic", "true");
  }
};

export const makeFocusable = (element) => {
  if (element && element.tabIndex === -1) {
    element.tabIndex = 0;
  }
};

export const setAriaPressed = (element, pressed) => {
  if (element) {
    element.setAttribute("aria-pressed", pressed);
  }
};

export const setAriaExpanded = (element, expanded) => {
  if (element) {
    element.setAttribute("aria-expanded", expanded);
  }
};
