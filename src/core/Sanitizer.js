/**
 * HTML Sanitizer
 * Provides XSS protection for editor content
 */

export class Sanitizer {
  constructor() {
    // Define allowed tags and attributes
    this.allowedTags = [
      'p', 'div', 'span', 'br',
      'b', 'strong', 'i', 'em', 'u', 's', 'mark',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'a', 'img',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'blockquote', 'pre', 'code'
    ];

    this.allowedAttributes = {
      'a': ['href', 'title', 'target'],
      'img': ['src', 'alt', 'title', 'width', 'height'],
      'span': ['style'],
      'div': ['style'],
      'p': ['style'],
      'td': ['colspan', 'rowspan'],
      'th': ['colspan', 'rowspan']
    };

    this.allowedStyles = [
      'color', 'background-color', 'font-size', 'font-family',
      'text-align', 'margin-left', 'padding'
    ];
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
}
