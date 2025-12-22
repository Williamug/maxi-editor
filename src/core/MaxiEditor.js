/**
 * MaxiEditor
 * A lightweight, customizable rich text editor
 * Copyright © 2024 William Asaba
 */

import { History } from './History.js';
import { Sanitizer } from './Sanitizer.js';
import { CommandRegistry } from './CommandRegistry.js';
import { Toolbar } from '../ui/Toolbar.js';
import { registerFormattingCommands, registerAlignmentCommands, registerListCommands } from '../commands/index.js';

export class MaxiEditor {
  /**
   * Creates a new MaxiEditor instance
   * @param {HTMLElement} element - Editor element
   * @param {Object} config - Configuration options
   */
  constructor(element, config = {}) {
    this.element = element;
    this.config = {
      toolbar: config.toolbar || ['bold', 'italic', 'underline'],
      height: config.height || '200px',
      width: config.width || 'auto',
      placeholder: config.placeholder || 'Start typing...',
      plugins: config.plugins || [],
      maxHistorySize: config.maxHistorySize || 100,
      sanitize: config.sanitize !== false, // Default true
      ...config
    };

    // Initialize core components
    this.commandRegistry = new CommandRegistry();
    this.sanitizer = new Sanitizer();
    this.history = null;
    this.toolbar = null;

    // Event handlers (stored for cleanup)
    this._boundCheckContent = null;
    this._boundPasteHandler = null;

    // Include Bootstrap Icons
    this._includeBootstrapIcons();

    // Initialize editor
    this._init();
  }

  /**
   * Initializes the editor
   * @private
   */
  _init() {
    // Set up contenteditable element
    this.element.contentEditable = true;
    this.element.classList.add('maxi-editor');
    this.element.setAttribute('role', 'textbox');
    this.element.setAttribute('aria-multiline', 'true');
    this.element.setAttribute('aria-label', 'Rich text editor');
    this.element.setAttribute('data-placeholder', this.config.placeholder);

    // Set dimensions
    if (this.config.height) {
      this.element.style.height = this.config.height;
    }
    if (this.config.width) {
      this.element.style.width = this.config.width;
    }

    // Check initial content
    this._boundCheckContent = () => this._checkContent();
    this._checkContent();
    this.element.addEventListener('input', this._boundCheckContent);

    // Initialize history
    this.history = new History(this.element, this.config.maxHistorySize);

    // Create toolbar
    this.toolbar = new Toolbar(this, this.config);
    this.toolbar.create();

    // Register core commands
    this._registerCoreCommands();

    // Apply plugins
    if (this.config.plugins && this.config.plugins.length > 0) {
      this._applyPlugins(this.config.plugins);
    }

    // Add paste handler
    this._boundPasteHandler = (e) => this._handlePaste(e);
    this.element.addEventListener('paste', this._boundPasteHandler);
  }

  /**
   * Registers core commands
   * @private
   */
  _registerCoreCommands() {
    // Register command groups
    registerFormattingCommands(this.commandRegistry);
    registerAlignmentCommands(this.commandRegistry);
    registerListCommands(this.commandRegistry);

    // Register undo/redo
    this.commandRegistry.register('undo', () => {
      this.history.undo();
    });

    this.commandRegistry.register('redo', () => {
      this.history.redo();
    });

    // Register format block (for headings)
    this.commandRegistry.register('formatBlock', (value) => {
      try {
        document.execCommand('formatBlock', false, value);
      } catch (error) {
        console.error('Failed to format block:', error);
      }
    });

    // Register font name
    this.commandRegistry.register('fontName', (value) => {
      try {
        document.execCommand('fontName', false, value);
      } catch (error) {
        console.error('Failed to set font:', error);
      }
    });
  }

  /**
   * Applies plugins to the editor
   * @param {Array} plugins - Array of plugin classes
   * @private
   */
  _applyPlugins(plugins) {
    plugins.forEach(plugin => {
      try {
        if (plugin && typeof plugin.init === 'function') {
          plugin.init(this);
        }
      } catch (error) {
        console.error('Failed to initialize plugin:', error);
      }
    });
  }

  /**
   * Checks if editor is empty and updates placeholder visibility
   * @private
   */
  _checkContent() {
    const text = (this.element.textContent || '').trim();
    if (text === '') {
      this.element.classList.add('empty');
    } else {
      this.element.classList.remove('empty');
    }
  }

  /**
   * Handles paste events
   * @param {ClipboardEvent} e - Paste event
   * @private
   */
  _handlePaste(e) {
    if (!this.config.sanitize) return;

    e.preventDefault();

    // Get pasted data
    const html = e.clipboardData.getData('text/html');
    const text = e.clipboardData.getData('text/plain');

    // Sanitize and insert
    const content = html || text;
    const sanitized = this.sanitizer.sanitize(content);

    try {
      document.execCommand('insertHTML', false, sanitized);
    } catch (error) {
      // Fallback to plain text
      document.execCommand('insertText', false, text);
    }
  }

  /**
   * Includes Bootstrap Icons stylesheet
   * @private
   */
  _includeBootstrapIcons() {
    const linkHref = 'https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css';

    const isAlreadyIncluded = Array.from(document.styleSheets).some(
      (sheet) => sheet.href === linkHref
    );

    if (!isAlreadyIncluded) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = linkHref;
      document.head.appendChild(link);
    }
  }

  /**
   * Registers a custom command
   * @param {string} name - Command name
   * @param {Function} handler - Command handler
   */
  registerCommand(name, handler) {
    this.commandRegistry.register(name, handler);
  }

  /**
   * Executes a command
   * @param {string} name - Command name
   * @param {*} value - Optional value
   * @returns {*} - Command result
   */
  executeCommand(name, value = null) {
    return this.commandRegistry.execute(name, value);
  }

  /**
   * Gets the editor content
   * @returns {string} - HTML content
   */
  getContent() {
    return this.element.innerHTML;
  }

  /**
   * Sets the editor content
   * @param {string} content - HTML content
   */
  setContent(content) {
    const sanitized = this.config.sanitize ? this.sanitizer.sanitize(content) : content;
    this.element.innerHTML = sanitized;
    this._checkContent();
  }

  /**
   * Sets the editor height
   * @param {string} height - Height value (e.g., '500px')
   */
  setHeight(height) {
    this.element.style.height = height;
  }

  /**
   * Sets the editor width
   * @param {string} width - Width value (e.g., '800px')
   */
  setWidth(width) {
    this.element.style.width = width;
  }

  /**
   * Gets content statistics
   * @returns {Object} - Statistics object
   */
  getStats() {
    const text = this.element.textContent || '';
    return {
      characters: text.length,
      charactersNoSpaces: text.replace(/\s/g, '').length,
      words: text.trim().split(/\s+/).filter(w => w.length > 0).length,
      paragraphs: this.element.querySelectorAll('p').length || 1
    };
  }

  /**
   * Destroys the editor and cleans up resources
   */
  destroy() {
    // Remove event listeners
    if (this._boundCheckContent) {
      this.element.removeEventListener('input', this._boundCheckContent);
    }
    if (this._boundPasteHandler) {
      this.element.removeEventListener('paste', this._boundPasteHandler);
    }

    // Destroy components
    if (this.history) {
      this.history.destroy();
    }
    if (this.toolbar) {
      this.toolbar.destroy();
    }

    // Clear command registry
    this.commandRegistry.clear();

    // Remove contenteditable
    this.element.contentEditable = false;
    this.element.classList.remove('maxi-editor');

    // Clear references
    this.element = null;
    this.config = null;
  }

  /**
   * Static factory method to create an editor
   * @param {string} selector - CSS selector
   * @param {Object} config - Configuration options
   * @returns {MaxiEditor} - Editor instance
   */
  static set(selector, config = {}) {
    const element = document.querySelector(selector);
    if (!element) {
      throw new Error(`Editor element not found: ${selector}`);
    }

    return new MaxiEditor(element, config);
  }
}

export default MaxiEditor;
