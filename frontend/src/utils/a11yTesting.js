export const checkWCAGCompliance = (element = document.body) => {
  const issues = [];

  const missingAriaLabels = element.querySelectorAll(
    'button:not([aria-label]):not([aria-labelledby]), a:not([aria-label]):not([aria-labelledby])'
  );
  if (missingAriaLabels.length > 0) {
    issues.push({
      level: 'warning',
      message: `Found ${missingAriaLabels.length} buttons/links without ARIA labels`,
      elements: Array.from(missingAriaLabels),
    });
  }

  const missingAltText = element.querySelectorAll('img:not([alt])');
  if (missingAltText.length > 0) {
    issues.push({
      level: 'error',
      message: `Found ${missingAltText.length} images without alt text`,
      elements: Array.from(missingAltText),
    });
  }

  const missingHeadingStructure = element.querySelectorAll('h1');
  if (missingHeadingStructure.length === 0) {
    issues.push({
      level: 'error',
      message: 'Missing H1 heading on page',
      elements: [],
    });
  }

  const missingFormLabels = element.querySelectorAll(
    'input:not([aria-label]):not([aria-labelledby]):not([id])'
  );
  if (missingFormLabels.length > 0) {
    issues.push({
      level: 'warning',
      message: `Found ${missingFormLabels.length} form inputs without labels`,
      elements: Array.from(missingFormLabels),
    });
  }

  const poorColorContrast = checkColorContrast(element);
  if (poorColorContrast.length > 0) {
    issues.push({
      level: 'warning',
      message: `Found ${poorColorContrast.length} elements with poor color contrast`,
      elements: poorColorContrast,
    });
  }

  return issues;
};

export const checkColorContrast = (element = document.body) => {
  const elementsWithPoorContrast = [];
  const textElements = element.querySelectorAll('button, a, p, span, div, li');

  textElements.forEach((el) => {
    const contrastRatio = getContrastRatio(el);
    if (contrastRatio < 4.5) {
      elementsWithPoorContrast.push(el);
    }
  });

  return elementsWithPoorContrast;
};

export const getContrastRatio = (element) => {
  const bgColor = window.getComputedStyle(element).backgroundColor;
  const fgColor = window.getComputedStyle(element).color;

  const bgLuminance = getLuminance(bgColor);
  const fgLuminance = getLuminance(fgColor);

  const lighter = Math.max(bgLuminance, fgLuminance);
  const darker = Math.min(bgLuminance, fgLuminance);

  return (lighter + 0.05) / (darker + 0.05);
};

export const getLuminance = (color) => {
  const rgb = color.match(/\d+/g);
  if (!rgb || rgb.length < 3) return 0;

  let [r, g, b] = rgb.slice(0, 3).map((val) => {
    const v = parseInt(val, 10) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const checkKeyboardNavigation = () => {
  const focusableElements = document.querySelectorAll(
    'button, a, input, textarea, select, [tabindex]:not([tabindex="-1"])'
  );

  let previousElement = null;
  const tabOrder = [];

  focusableElements.forEach((element) => {
    const tabIndex = element.getAttribute('tabindex');
    tabOrder.push({
      element,
      tabIndex: tabIndex ? parseInt(tabIndex, 10) : 0,
    });
  });

  return tabOrder.sort((a, b) => {
    if (a.tabIndex === 0 && b.tabIndex === 0) return 0;
    if (a.tabIndex === 0) return 1;
    if (b.tabIndex === 0) return -1;
    return a.tabIndex - b.tabIndex;
  });
};

export const generateAccessibilityReport = (element = document.body) => {
  const complianceIssues = checkWCAGCompliance(element);
  const keyboardOrder = checkKeyboardNavigation();

  return {
    timestamp: new Date().toISOString(),
    complianceIssues,
    keyboardNavigationOrder: keyboardOrder,
    summary: {
      totalIssues: complianceIssues.length,
      errors: complianceIssues.filter((i) => i.level === 'error').length,
      warnings: complianceIssues.filter((i) => i.level === 'warning').length,
    },
  };
};
