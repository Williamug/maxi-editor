/**
 * Selection Utilities
 * Helper functions for working with selections
 */

import { findBlockElement, wrapSelectionWithTag, getAncestorTag, unwrapElement } from '../utils/dom.js';

export class Selection {
  /**
   * Indents the current block
   */
  static indentBlock() {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const node = findBlockElement(selection.anchorNode);
    if (node) {
      const current = parseInt(node.style.marginLeft || 0, 10) || 0;
      node.style.marginLeft = (current + 32) + 'px';
    }
  }

  /**
   * Outdents the current block
   */
  static outdentBlock() {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const node = findBlockElement(selection.anchorNode);
    if (node) {
      const current = parseInt(node.style.marginLeft || 0, 10) || 0;
      node.style.marginLeft = Math.max(0, current - 32) + 'px';
    }
  }

  /**
   * Sets text alignment for the current block
   * @param {string} align - 'left', 'center', or 'right'
   */
  static setAlignment(align) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const node = findBlockElement(selection.anchorNode);
    if (node) {
      node.style.textAlign = align;
    }
  }

  /**
   * Wraps selection in a list (ul or ol)
   * @param {string} type - 'ul' or 'ol'
   */
  static wrapSelectionInList(type) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    if (range.collapsed) return;

    const list = document.createElement(type);
    const li = document.createElement('li');
    li.appendChild(range.extractContents());
    list.appendChild(li);
    range.insertNode(list);

    // Move selection to the new list item
    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.selectNodeContents(li);
    selection.addRange(newRange);
  }

  /**
   * Toggles formatting for the current selection
   * @param {string} tagName - Tag name to toggle
   */
  static toggleFormat(tagName) {
    const existingTag = getAncestorTag(tagName);

    if (existingTag) {
      // Unwrap existing tag
      unwrapElement(existingTag);
    } else {
      // Wrap with new tag
      wrapSelectionWithTag(tagName);
    }
  }

  /**
   * Gets the currently selected text
   * @returns {string} - Selected text
   */
  static getSelectedText() {
    const selection = window.getSelection();
    return selection ? selection.toString() : '';
  }

  /**
   * Checks if there is a selection
   * @returns {boolean}
   */
  static hasSelection() {
    const selection = window.getSelection();
    return selection && selection.rangeCount > 0 && !selection.getRangeAt(0).collapsed;
  }

  /**
   * Saves the current selection
   * @returns {Range|null} - Saved range
   */
  static saveSelection() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      return selection.getRangeAt(0);
    }
    return null;
  }

  /**
   * Restores a saved selection
   * @param {Range} range - Range to restore
   */
  static restoreSelection(range) {
    if (!range) return;

    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }
}
