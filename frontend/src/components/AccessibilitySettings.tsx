import React, { useState, useEffect } from 'react';
import { contrastUtils, a11yUtils } from '../utils/accessibility';
import '../styles/accessibility.css';

export const AccessibilitySettings: React.FC = () => {
  const [highContrast, setHighContrast] = useState(
    contrastUtils.getHighContrastEnabled()
  );
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);

  const handleHighContrastToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const enabled = e.target.checked;
    setHighContrast(enabled);

    if (enabled) {
      contrastUtils.enableHighContrast();
      a11yUtils.announce('High contrast mode enabled', 'assertive');
    } else {
      contrastUtils.disableHighContrast();
      a11yUtils.announce('High contrast mode disabled', 'assertive');
    }

    localStorage.setItem('a11y-high-contrast', String(enabled));
  };

  useEffect(() => {
    const stored = localStorage.getItem('a11y-high-contrast');
    if (stored === 'true') {
      contrastUtils.enableHighContrast();
      setHighContrast(true);
    }
  }, []);

  const keyboardShortcuts = [
    { key: 'Tab', description: 'Navigate between interactive elements' },
    { key: 'Shift + Tab', description: 'Navigate backwards' },
    { key: 'Enter', description: 'Activate button or link' },
    { key: 'Space', description: 'Toggle checkbox or button' },
    { key: 'Escape', description: 'Close modal or dialog' },
    { key: 'Arrow Keys', description: 'Navigate within lists or menus' },
  ];

  return (
    <div className='accessibility-settings' role='region' aria-label='Accessibility settings'>
      <div className='a11y-setting'>
        <label htmlFor='high-contrast-toggle'>
          <input
            id='high-contrast-toggle'
            type='checkbox'
            checked={highContrast}
            onChange={handleHighContrastToggle}
            aria-label='Enable high contrast mode'
          />
          <span>High Contrast Mode</span>
        </label>
        <p className='sr-only'>
          Enables increased color contrast for better readability
        </p>
      </div>

      <div className='a11y-setting'>
        <button
          onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
          aria-expanded={showKeyboardShortcuts}
          aria-controls='keyboard-shortcuts'
          className='a11y-button'
        >
          {showKeyboardShortcuts ? 'Hide' : 'Show'} Keyboard Shortcuts
        </button>

        {showKeyboardShortcuts && (
          <div id='keyboard-shortcuts' className='keyboard-shortcuts-list'>
            <h3>Keyboard Navigation Shortcuts</h3>
            <dl>
              {keyboardShortcuts.map((shortcut, idx) => (
                <div key={idx} className='shortcut-item'>
                  <dt className='shortcut-key'>{shortcut.key}</dt>
                  <dd className='shortcut-description'>{shortcut.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessibilitySettings;
