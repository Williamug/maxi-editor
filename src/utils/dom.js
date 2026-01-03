/**
 * DOM Utility Functions
 * Helper functions for DOM manipulation
 */

/**
 * Finds the nearest block-level parent element
 * @param {Node} node - Starting node
 * @returns {HTMLElement|null} - Block element or null
 */
export function findBlockElement(node) {
  while (node && node.nodeType !== 1) {
    node = node.parentNode;
  }
  while (node && node.nodeType === 1 && !/^(P|DIV|LI|H[1-6]|BLOCKQUOTE)$/i.test(node.nodeName)) {
    node = node.parentNode;
  }
  return node && node.nodeType === 1 ? node : null;
}

/**
 * Wraps the current selection with a tag
 * @param {string} tagName - Tag name to wrap with
 * @returns {HTMLElement|null} - Wrapped element or null
 */
export function wrapSelectionWithTag(tagName) {
  const selection = window.getSelection();
  if (!selection.rangeCount) return null;

  const range = selection.getRangeAt(0);
  if (range.collapsed) return null;

  const wrapper = document.createElement(tagName);
  wrapper.appendChild(range.extractContents());
  range.insertNode(wrapper);

  // Move selection to the wrapped content
  selection.removeAllRanges();
  const newRange = document.createRange();
  newRange.selectNodeContents(wrapper);
  selection.addRange(newRange);

  return wrapper;
}

/**
 * Unwraps an element, moving its children to its parent
 * @param {HTMLElement} element - Element to unwrap
 */
export function unwrapElement(element) {
  const parent = element.parentNode;
  if (!parent) return;

  while (element.firstChild) {
    parent.insertBefore(element.firstChild, element);
  }
  parent.removeChild(element);
}

/**
 * Checks if selection is inside a specific tag
 * @param {string} tagName - Tag name to check for
 * @returns {HTMLElement|null} - Found element or null
 */
export function getAncestorTag(tagName) {
  const selection = window.getSelection();
  if (!selection.rangeCount) return null;

  const range = selection.getRangeAt(0);
  let ancestor = selection.anchorNode;

  while (ancestor && ancestor !== range.commonAncestorContainer) {
    if (ancestor.nodeType === 1 && ancestor.nodeName.toLowerCase() === tagName) {
      return ancestor;
    }
    ancestor = ancestor.parentNode;
  }

  return null;
}

/**
 * Creates an element from HTML string
 * @param {string} html - HTML string
 * @returns {HTMLElement} - Created element
 */
export function createElementFromHTML(html) {
  const temp = document.createElement('div');
  temp.innerHTML = html.trim();
  return temp.firstChild;
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
