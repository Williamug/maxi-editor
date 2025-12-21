/**
 * History Manager
 * Handles undo/redo functionality with size limits and debouncing
 */

import { debounce } from '../utils/dom.js';

export class History {
  /**
   * Creates a new History instance
   * @param {HTMLElement} element - Editor element to track
   * @param {number} maxSize - Maximum history size (default: 100)
   */
  constructor(element, maxSize = 100) {
    this.element = element;
    this.maxSize = maxSize;
    this.stack = [element.innerHTML];
    this.index = 0;
    this._boundSave = null;

    this._initListener();
  }

  /**
   * Initializes the input listener with debouncing
   * @private
   */
  _initListener() {
    // Debounce history saves to avoid too frequent updates
    const debouncedSave = debounce(() => {
      this.save();
    }, 300);

    this._boundSave = debouncedSave;
    this.element.addEventListener('input', this._boundSave);
  }

  /**
   * Saves current state to history
   */
  save() {
    const currentContent = this.element.innerHTML;

    // Don't save if content hasn't changed
    if (currentContent === this.stack[this.index]) {
      return;
    }

    // Truncate redo stack
    this.stack = this.stack.slice(0, this.index + 1);

    // Add new state
    this.stack.push(currentContent);

    // Limit history size (circular buffer approach)
    if (this.stack.length > this.maxSize) {
      this.stack.shift();
    } else {
      this.index++;
    }
  }

  /**
   * Undo last action
   * @returns {boolean} - True if undo was performed
   */
  undo() {
    if (this.index > 0) {
      this.index--;
      this.element.innerHTML = this.stack[this.index];
      return true;
    }
    return false;
  }

  /**
   * Redo last undone action
   * @returns {boolean} - True if redo was performed
   */
  redo() {
    if (this.index < this.stack.length - 1) {
      this.index++;
      this.element.innerHTML = this.stack[this.index];
      return true;
    }
    return false;
  }

  /**
   * Checks if undo is available
   * @returns {boolean}
   */
  canUndo() {
    return this.index > 0;
  }

  /**
   * Checks if redo is available
   * @returns {boolean}
   */
  canRedo() {
    return this.index < this.stack.length - 1;
  }

  /**
   * Clears history
   */
  clear() {
    this.stack = [this.element.innerHTML];
    this.index = 0;
  }

  /**
   * Cleanup - removes event listeners
   */
  destroy() {
    if (this._boundSave) {
      this.element.removeEventListener('input', this._boundSave);
    }
    this.stack = [];
    this.element = null;
  }
}
