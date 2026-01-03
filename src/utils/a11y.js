/**
 * Accessibility Utilities
 * Helper functions for screen readers and accessibility
 */

export class A11yHelper {
  /**
   * Creates a live region for screen reader announcements
   * @returns {HTMLElement} - Live region element
   */
  static createLiveRegion() {
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'maxi-sr-only';
    liveRegion.style.cssText = `
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    `;
    document.body.appendChild(liveRegion);
    return liveRegion;
  }

  /**
   * Announces a message to screen readers
   * @param {string} message - Message to announce
   * @param {string} priority - 'polite' or 'assertive'
   */
  static announce(message, priority = 'polite') {
    let liveRegion = document.querySelector('.maxi-sr-only[aria-live]');

    if (!liveRegion) {
      liveRegion = this.createLiveRegion();
    }

    // Update aria-live priority
    liveRegion.setAttribute('aria-live', priority);

    // Clear and set new message
    liveRegion.textContent = '';
    setTimeout(() => {
      liveRegion.textContent = message;
    }, 100);
  }

  /**
   * Adds skip link for keyboard navigation
   * @param {HTMLElement} targetElement - Element to skip to
   * @param {string} linkText - Text for skip link
   */
  static addSkipLink(targetElement, linkText = 'Skip to editor') {
    const skipLink = document.createElement('a');
    skipLink.href = '#';
    skipLink.className = 'maxi-skip-link';
    skipLink.textContent = linkText;
    skipLink.style.cssText = `
      position: absolute;
      left: -10000px;
      top: auto;
      width: 1px;
      height: 1px;
      overflow: hidden;
    `;

    skipLink.addEventListener('focus', () => {
      skipLink.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        z-index: 10000;
        padding: 10px;
        background: #000;
        color: #fff;
        text-decoration: none;
        border-radius: 4px;
      `;
    });

    skipLink.addEventListener('blur', () => {
      skipLink.style.cssText = `
        position: absolute;
        left: -10000px;
        top: auto;
        width: 1px;
        height: 1px;
        overflow: hidden;
      `;
    });

    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      targetElement.focus();
    });

    targetElement.before(skipLink);
    return skipLink;
  }

  /**
   * Checks if high contrast mode is enabled
   * @returns {boolean}
   */
  static isHighContrastMode() {
    // Check for Windows high contrast mode
    if (window.matchMedia) {
      return window.matchMedia('(prefers-contrast: high)').matches ||
        window.matchMedia('(-ms-high-contrast: active)').matches;
    }
    return false;
  }

  /**
   * Checks if reduced motion is preferred
   * @returns {boolean}
   */
  static prefersReducedMotion() {
    if (window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  }

  /**
   * Gets appropriate ARIA label for a command
   * @param {string} command - Command name
   * @param {boolean} isActive - Whether command is active
   * @returns {string} - ARIA label
   */
  static getCommandLabel(command, isActive = false) {
    const labels = {
      bold: 'Bold',
      italic: 'Italic',
      underline: 'Underline',
      strikethrough: 'Strikethrough',
      highlight: 'Highlight text',
      insertLink: 'Insert link',
      removeLink: 'Remove link',
      justifyLeft: 'Align left',
      justifyCenter: 'Align center',
      justifyRight: 'Align right',
      insertUnorderedList: 'Bullet list',
      insertOrderedList: 'Numbered list',
      indent: 'Increase indent',
      outdent: 'Decrease indent',
      undo: 'Undo',
      redo: 'Redo',
      insertTable: 'Insert table'
    };

    const label = labels[command] || command;
    return isActive ? `${label} (active)` : label;
  }

  /**
   * Announces formatting change to screen readers
   * @param {string} format - Format that changed
   * @param {boolean} isActive - Whether format is now active
   */
  static announceFormatChange(format, isActive) {
    const action = isActive ? 'applied' : 'removed';
    const message = `${this.getCommandLabel(format)} ${action}`;
    this.announce(message);
  }

  /**
   * Announces content change to screen readers
   * @param {string} action - Action performed
   */
  static announceContentChange(action) {
    this.announce(action);
  }

  /**
   * Sets up focus trap for modal dialogs
   * @param {HTMLElement} modalElement - Modal element
   * @returns {Function} - Cleanup function
   */
  static setupFocusTrap(modalElement) {
    const focusableElements = modalElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return () => { };

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
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

    modalElement.addEventListener('keydown', handleTabKey);

    // Focus first element
    firstElement.focus();

    // Return cleanup function
    return () => {
      modalElement.removeEventListener('keydown', handleTabKey);
    };
  }

  /**
   * Adds high contrast mode support
   * @param {HTMLElement} element - Element to enhance
   */
  static addHighContrastSupport(element) {
    if (this.isHighContrastMode()) {
      element.classList.add('maxi-high-contrast');
    }

    // Listen for changes
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-contrast: high)');
      mediaQuery.addEventListener('change', (e) => {
        if (e.matches) {
          element.classList.add('maxi-high-contrast');
        } else {
          element.classList.remove('maxi-high-contrast');
        }
      });
    }
  }
}

export default A11yHelper;
