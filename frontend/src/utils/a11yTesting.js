export const checkWCAGCompliance = (element) => {
  const issues = [];

  const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
  if (headings.length === 0) {
    issues.push('No headings found');
  }

  const links = element.querySelectorAll('a');
  links.forEach((link) => {
    if (!link.textContent.trim() && !link.getAttribute('aria-label')) {
      issues.push('Link without text or aria-label');
    }
  });

  const images = element.querySelectorAll('img');
  images.forEach((img) => {
    if (!img.getAttribute('alt')) {
      issues.push(`Image without alt text: ${img.src}`);
    }
  });

  const buttons = element.querySelectorAll('button');
  buttons.forEach((btn) => {
    if (!btn.textContent.trim() && !btn.getAttribute('aria-label')) {
      issues.push('Button without text or aria-label');
    }
  });

  return issues;
};

export const getContrastRatio = (color1, color2) => {
  const lum1 = getRelativeLuminance(color1);
  const lum2 = getRelativeLuminance(color2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
};

export const getRelativeLuminance = (color) => {
  const rgb = color.match(/\d+/g);
  if (!rgb || rgb.length < 3) return 0;

  const [r, g, b] = rgb.map((val) => {
    const v = parseInt(val) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const checkColorContrast = (element, minRatio = 4.5) => {
  const style = window.getComputedStyle(element);
  const color = style.color;
  const bgColor = style.backgroundColor;

  const ratio = getContrastRatio(color, bgColor);
  return ratio >= minRatio;
};

export const checkKeyboardNavigation = (element) => {
  const focusableElements = element.querySelectorAll(
    'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  return focusableElements.length > 0;
};

export const generateAccessibilityReport = (element) => {
  return {
    wcagIssues: checkWCAGCompliance(element),
    hasKeyboardNav: checkKeyboardNavigation(element),
    timestamp: new Date().toISOString(),
  };
};
