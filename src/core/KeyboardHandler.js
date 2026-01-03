/**
 * Keyboard Shortcut Handler
 * Manages keyboard shortcuts for the editor
 */

export class KeyboardHandler {
  /**
   * Creates a new KeyboardHandler instance
   * @param {MaxiEditor} editor - Editor instance
   * @param {Object} shortcuts - Custom shortcuts configuration
   */
  constructor(editor, shortcuts = {}) {
    this.editor = editor;
    this.shortcuts = new Map();
    this._boundHandler = null;

    // Register default shortcuts
    this._registerDefaultShortcuts();

    // Register custom shortcuts
    this._registerCustomShortcuts(shortcuts);

    // Attach event listener
    this._attachListener();
  }

  /**
   * Registers default keyboard shortcuts
   * @private
   */
  _registerDefaultShortcuts() {
    // Formatting shortcuts
    this.register('Ctrl+B', 'bold', 'Toggle bold');
    this.register('Ctrl+I', 'italic', 'Toggle italic');
    this.register('Ctrl+U', 'underline', 'Toggle underline');

    // Undo/Redo
    this.register('Ctrl+Z', 'undo', 'Undo');
    this.register('Ctrl+Shift+Z', 'redo', 'Redo');
    this.register('Ctrl+Y', 'redo', 'Redo (alternative)');

    // Link
    this.register('Ctrl+K', 'insertLink', 'Insert link');

    // Alignment
    this.register('Ctrl+Shift+L', 'justifyLeft', 'Align left');
    this.register('Ctrl+Shift+E', 'justifyCenter', 'Align center');
    this.register('Ctrl+Shift+R', 'justifyRight', 'Align right');

    // Lists
    this.register('Ctrl+Shift+7', 'insertOrderedList', 'Ordered list');
    this.register('Ctrl+Shift+8', 'insertUnorderedList', 'Unordered list');

    // Indent
    this.register('Tab', 'indent', 'Increase indent');
    this.register('Shift+Tab', 'outdent', 'Decrease indent');
  }

  /**
   * Registers custom shortcuts
   * @param {Object} shortcuts - Custom shortcuts
   * @private
   */
  _registerCustomShortcuts(shortcuts) {
    for (const [key, command] of Object.entries(shortcuts)) {
      this.register(key, command);
    }
  }

  /**
   * Registers a keyboard shortcut
   * @param {string} key - Key combination (e.g., 'Ctrl+B')
   * @param {string} command - Command to execute
   * @param {string} description - Description of the shortcut
   */
  register(key, command, description = '') {
    const normalizedKey = this._normalizeKey(key);
    this.shortcuts.set(normalizedKey, {
      command,
      description,
      originalKey: key
    });
  }

  /**
   * Unregisters a keyboard shortcut
   * @param {string} key - Key combination
   */
  unregister(key) {
    const normalizedKey = this._normalizeKey(key);
    this.shortcuts.delete(normalizedKey);
  }

  /**
   * Normalizes a key combination for consistent matching
   * @param {string} key - Key combination
   * @returns {string} - Normalized key
   * @private
   */
  _normalizeKey(key) {
    return key
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/command/g, 'ctrl') // Mac compatibility
      .replace(/cmd/g, 'ctrl');
  }

  /**
   * Converts a keyboard event to a key string
   * @param {KeyboardEvent} event - Keyboard event
   * @returns {string} - Key string
   * @private
   */
  _eventToKeyString(event) {
    const parts = [];

    if (event.ctrlKey || event.metaKey) parts.push('ctrl');
    if (event.altKey) parts.push('alt');
    if (event.shiftKey) parts.push('shift');

    // Get the key
    let key = event.key.toLowerCase();

    // Special handling for some keys
    if (key === ' ') key = 'space';
    if (key === 'escape') key = 'esc';

    // Don't add modifier keys as the main key
    if (!['control', 'alt', 'shift', 'meta'].includes(key)) {
      parts.push(key);
    }

    return parts.join('+');
  }

  /**
   * Attaches the keyboard event listener
   * @private
   */
  _attachListener() {
    this._boundHandler = (event) => this._handleKeydown(event);
    this.editor.element.addEventListener('keydown', this._boundHandler);
  }

  /**
   * Handles keydown events
   * @param {KeyboardEvent} event - Keyboard event
   * @private
   */
  _handleKeydown(event) {
    const keyString = this._eventToKeyString(event);
    const shortcut = this.shortcuts.get(keyString);

    if (shortcut) {
      // Check if command exists
      if (this.editor.commandRegistry.has(shortcut.command)) {
        event.preventDefault();
        this.editor.executeCommand(shortcut.command);
      }
    }
  }

  /**
   * Gets all registered shortcuts
   * @returns {Array} - Array of shortcut objects
   */
  getShortcuts() {
    const shortcuts = [];
    for (const [key, value] of this.shortcuts.entries()) {
      shortcuts.push({
        key: value.originalKey,
        command: value.command,
        description: value.description
      });
    }
    return shortcuts;
  }

  /**
   * Gets shortcuts for a specific command
   * @param {string} command - Command name
   * @returns {Array} - Array of key combinations
   */
  getShortcutsForCommand(command) {
    const keys = [];
    for (const [key, value] of this.shortcuts.entries()) {
      if (value.command === command) {
        keys.push(value.originalKey);
      }
    }
    return keys;
  }

  /**
   * Checks if a key combination is registered
   * @param {string} key - Key combination
   * @returns {boolean}
   */
  hasShortcut(key) {
    const normalizedKey = this._normalizeKey(key);
    return this.shortcuts.has(normalizedKey);
  }

  /**
   * Enables keyboard shortcuts
   */
  enable() {
    if (!this._boundHandler) {
      this._attachListener();
    }
  }

  /**
   * Disables keyboard shortcuts
   */
  disable() {
    if (this._boundHandler) {
      this.editor.element.removeEventListener('keydown', this._boundHandler);
      this._boundHandler = null;
    }
  }

  /**
   * Cleanup - removes event listener
   */
  destroy() {
    this.disable();
    this.shortcuts.clear();
  }
}

export default KeyboardHandler;
