# Accessibility Implementation Guide

This document outlines the accessibility features implemented in Story Spark AI to ensure WCAG 2.1 AA compliance and inclusive user experience.

## Features Implemented

### 1. Screen Reader Support

All interactive elements include proper ARIA labels and live regions for screen reader announcements.

**Key Features:**
- Semantic HTML structure with proper heading hierarchy
- ARIA labels for all interactive elements
- Live regions (`aria-live`) for dynamic content updates
- Descriptive text for images and icons
- Proper role attributes for custom components

**Example Usage:**
```tsx
import { a11yUtils } from './utils/accessibility';

// Announce to screen readers
a11yUtils.announce('Story saved successfully', 'assertive');

// Set descriptive label
a11yUtils.setAriaLabel(element, 'Delete story');
```

### 2. Keyboard Navigation

Full keyboard navigation support without requiring a mouse.

**Supported Shortcuts:**
- `Tab` - Navigate between interactive elements
- `Shift + Tab` - Navigate backwards
- `Enter` - Activate buttons and links
- `Space` - Toggle checkboxes and buttons
- `Escape` - Close modals and dialogs
- `Arrow Keys` - Navigate within lists and menus

**Implementation:**
```tsx
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation';

const containerRef = useKeyboardNavigation({
  onEnter: (e) => handleActivate(e),
  onEscape: (e) => handleClose(e),
  onArrowUp: (e) => handlePrevious(e),
  onArrowDown: (e) => handleNext(e),
});

return <div ref={containerRef}>Content</div>;
```

### 3. Focus Management

Clear focus indicators and focus trapping for modal dialogs.

**Features:**
- Visible focus outline (3px blue outline with 2px offset)
- Focus trap in modals to prevent focus loss
- Skip-to-main-content link for keyboard users
- Focus restoration after modal close

**Usage:**
```tsx
import { useFocusTrap } from './hooks/useKeyboardNavigation';

const modalRef = useRef<HTMLDivElement>(null);
useFocusTrap(modalRef);

return <div ref={modalRef}>Modal content</div>;
```

### 4. High Contrast Mode

Dedicated high contrast theme for users with visual impairments.

**Features:**
- Toggle-able via accessibility settings panel
- Persists user preference in localStorage
- Meets WCAG AAA contrast ratios (7:1 for text)
- Automatically applies to all components

**Activation:**
- Via settings panel in AccessibilitySettings component
- Automatically restores on page reload
- Uses `data-contrast="high"` attribute on root element

**CSS:**
```css
[data-contrast='high'] {
  background-color: #fff !important;
  color: #000 !important;
  border-color: #000 !important;
}
```

### 5. Motion Preferences

Respects user's motion preferences set in operating system.

**Features:**
- Respects `prefers-reduced-motion` media query
- Disables animations for users who prefer reduced motion
- Maintains full functionality without animations

**CSS:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 6. Accessibility Settings Component

User-accessible panel for managing accessibility preferences.

**Features:**
- High contrast mode toggle
- Keyboard shortcuts reference
- Clear, descriptive labels
- No reliance on color alone

**Usage:**
```tsx
import { AccessibilitySettings } from './components/AccessibilitySettings';

export const Settings = () => (
  <AccessibilitySettings />
);
```

## WCAG 2.1 AA Compliance

### Perceivable (WCAG 1)
- **Criterion 1.1.1 (Level A)**: All images have alt text
- **Criterion 1.3.1 (Level A)**: Proper semantic structure
- **Criterion 1.4.3 (Level AA)**: Contrast ratio 4.5:1 for text
- **Criterion 1.4.11 (Level AA)**: High contrast mode available

### Operable (WCAG 2)
- **Criterion 2.1.1 (Level A)**: Fully keyboard accessible
- **Criterion 2.1.2 (Level A)**: No keyboard traps
- **Criterion 2.4.3 (Level A)**: Logical focus order
- **Criterion 2.4.7 (Level AA)**: Visible focus indicator

### Understandable (WCAG 3)
- **Criterion 3.2.1 (Level A)**: Predictable behavior
- **Criterion 3.3.1 (Level A)**: Clear error messages
- **Criterion 3.3.4 (Level AA)**: Error suggestions

### Robust (WCAG 4)
- **Criterion 4.1.1 (Level A)**: Valid HTML syntax
- **Criterion 4.1.2 (Level A)**: Proper ARIA attributes
- **Criterion 4.1.3 (Level AA)**: Live regions configured

## Testing Accessibility

### Manual Testing
1. Navigate using only keyboard (no mouse)
2. Test with screen reader (NVDA, JAWS, or VoiceOver)
3. Enable high contrast mode and verify visibility
4. Test with zoom at 200%
5. Check color contrast with tools like WebAIM

### Automated Testing
```bash
npm run test:accessibility
```

### Tools
- **axe DevTools**: Automated accessibility scanning
- **WAVE**: Web accessibility evaluation tool
- **Lighthouse**: Built-in accessibility audits
- **NVDA**: Free and open-source screen reader

## Browser Support

Accessibility features are tested and supported on:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Implementation Guidelines

When adding new features:

1. **Use semantic HTML** - Prefer native elements (button, link, etc.)
2. **Add ARIA labels** - All interactive elements need labels
3. **Test keyboard navigation** - Ensure all features work with keyboard
4. **Check color contrast** - Maintain 4.5:1 ratio for text
5. **Test with screen readers** - Verify announcements work
6. **Respect motion preferences** - Disable animations if requested
7. **Provide alt text** - All images need descriptions
8. **Include focus indicators** - Make focus clearly visible

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Guide](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Articles](https://webaim.org/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

## Contribution

When contributing, ensure:
- All new components are keyboard accessible
- Proper ARIA attributes are used
- Color contrast is verified
- Screen reader announces all important information
- Tests include accessibility checks
