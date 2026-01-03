/**
 * HTML Sanitizer
 * Provides XSS protection for editor content using DOMPurify
 */

// Try to import DOMPurify (works in both Node and browser)
let DOMPurify;
try {
  // For bundled/Node environments
  DOMPurify = require('dompurify');
} catch (e) {
  // For browser environments, DOMPurify should be loaded globally
  if (typeof window !== 'undefined' && window.DOMPurify) {
    DOMPurify = window.DOMPurify;
  }
}

export class Sanitizer {
  constructor(options = {}) {
    this.useDOMPurify = options.useDOMPurify !== false && !!DOMPurify;

    // Define allowed tags and attributes (fallback for custom sanitizer)
    this.allowedTags = options.allowedTags || [
      'p', 'div', 'span', 'br',
      'b', 'strong', 'i', 'em', 'u', 's', 'mark',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'a', 'img',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'blockquote', 'pre', 'code'
    ];

    this.allowedAttributes = options.allowedAttributes || {
      'a': ['href', 'title', 'target', 'rel'],
      'img': ['src', 'alt', 'title', 'width', 'height'],
      'span': ['style'],
      'div': ['style'],
      'p': ['style'],
      'td': ['colspan', 'rowspan'],
      'th': ['colspan', 'rowspan']
    };

    this.allowedStyles = options.allowedStyles || [
      'color', 'background-color', 'font-size', 'font-family',
      'text-align', 'margin-left', 'padding'
    ];

    // Configure DOMPurify if available
    if (this.useDOMPurify) {
      this.domPurifyConfig = {
        ALLOWED_TAGS: this.allowedTags,
        ALLOWED_ATTR: this._getAllowedAttrs(),
        ALLOW_DATA_ATTR: false,
        KEEP_CONTENT: true,
        RETURN_DOM: false,
        RETURN_DOM_FRAGMENT: false,
        RETURN_DOM_IMPORT: false,
        FORCE_BODY: false,
        SANITIZE_DOM: true,
        ...options.domPurifyConfig
      };
    }
  }

  /**
   * Gets all allowed attributes from the allowedAttributes map
   * @private
   */
  _getAllowedAttrs() {
    const attrs = new Set();
    Object.values(this.allowedAttributes).forEach(attrList => {
      attrList.forEach(attr => attrs.add(attr));
    });
    return Array.from(attrs);
  }

  /**
   * Sanitizes HTML content
   * @param {string} html - HTML to sanitize
   * @returns {string} - Sanitized HTML
   */
  sanitize(html) {
    if (!html || typeof html !== 'string') {
      return '';
    }

    // Use DOMPurify if available
    if (this.useDOMPurify && DOMPurify) {
      try {
        return DOMPurify.sanitize(html, this.domPurifyConfig);
      } catch (error) {
        console.warn('DOMPurify sanitization failed, falling back to custom sanitizer:', error);
        return this._customSanitize(html);
      }
    }

    // Fallback to custom sanitizer
    return this._customSanitize(html);
  }

  /**
   * Custom sanitization (fallback when DOMPurify is not available)
   * @param {string} html - HTML to sanitize
   * @returns {string} - Sanitized HTML
   * @private
   */
  _customSanitize(html) {
    // Create a temporary container
    const temp = document.createElement('div');
    temp.innerHTML = html;

    // Recursively clean the DOM
    this._cleanNode(temp);

    return temp.innerHTML;
  }

  /**
   * Recursively cleans a DOM node
   * @param {Node} node - Node to clean
   * @private
   */
  _cleanNode(node) {
    // Process child nodes first (bottom-up)
    const children = Array.from(node.childNodes);

    for (const child of children) {
      if (child.nodeType === 1) { // Element node
        const tagName = child.tagName.toLowerCase();

        // Remove disallowed tags
        if (!this.allowedTags.includes(tagName)) {
          // Move children up before removing
          while (child.firstChild) {
            node.insertBefore(child.firstChild, child);
          }
          node.removeChild(child);
          continue;
        }

        // Clean attributes
        this._cleanAttributes(child);

        // Recursively clean children
        this._cleanNode(child);
      } else if (child.nodeType === 3) { // Text node
        // Text nodes are safe, keep as is
      } else {
        // Remove other node types (comments, etc.)
        node.removeChild(child);
      }
    }
  }

  /**
   * Cleans attributes of an element
   * @param {HTMLElement} element - Element to clean
   * @private
   */
  _cleanAttributes(element) {
    const tagName = element.tagName.toLowerCase();
    const allowedAttrs = this.allowedAttributes[tagName] || [];

    // Get all attributes
    const attributes = Array.from(element.attributes);

    for (const attr of attributes) {
      const attrName = attr.name.toLowerCase();

      // Remove event handlers
      if (attrName.startsWith('on')) {
        element.removeAttribute(attr.name);
        continue;
      }

      // Check if attribute is allowed
      if (!allowedAttrs.includes(attrName)) {
        element.removeAttribute(attr.name);
        continue;
      }

      // Special handling for href (prevent javascript:, data:, etc.)
      if (attrName === 'href') {
        const href = attr.value.toLowerCase().trim();
        if (href.startsWith('javascript:') ||
          href.startsWith('data:') ||
          href.startsWith('vbscript:')) {
          element.removeAttribute(attr.name);
        }
      }

      // Special handling for src
      if (attrName === 'src') {
        const src = attr.value.toLowerCase().trim();
        if (src.startsWith('javascript:') ||
          src.startsWith('vbscript:')) {
          element.removeAttribute(attr.name);
        }
      }

      // Clean style attribute
      if (attrName === 'style') {
        this._cleanStyleAttribute(element);
      }
    }
  }

  /**
   * Cleans style attribute
   * @param {HTMLElement} element - Element with style attribute
   * @private
   */
  _cleanStyleAttribute(element) {
    const style = element.style;
    const cleanedStyles = {};

    // Get all style properties
    for (let i = 0; i < style.length; i++) {
      const prop = style[i];
      if (this.allowedStyles.includes(prop)) {
        cleanedStyles[prop] = style.getPropertyValue(prop);
      }
    }

    // Clear all styles
    element.removeAttribute('style');

    // Re-apply only allowed styles
    for (const [prop, value] of Object.entries(cleanedStyles)) {
      element.style.setProperty(prop, value);
    }
  }

  /**
   * Sanitizes text for use in attributes
   * @param {string} text - Text to sanitize
   * @returns {string} - Sanitized text
   */
  sanitizeAttribute(text) {
    if (!text) return '';
    return text.replace(/[<>"']/g, (char) => {
      const entities = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      };
      return entities[char] || char;
    });
  }

  /**
   * Checks if DOMPurify is available
   * @returns {boolean}
   */
  static isDOMPurifyAvailable() {
    return !!DOMPurify;
  }
}
