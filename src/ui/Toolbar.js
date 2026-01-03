/**
 * Toolbar Component
 * Manages the editor toolbar with buttons and controls
 */

import { debounce } from '../utils/dom.js';

export class Toolbar {
  constructor(editor, config) {
    this.editor = editor;
    this.config = config;
    this.element = null;
    this.buttons = new Map();
    this._boundUpdateState = null;
  }

  /**
   * Creates and renders the toolbar
   */
  create() {
    this.element = document.createElement('div');
    this.element.classList.add('maxi-toolbar');
    this.element.setAttribute('role', 'toolbar');
    this.element.setAttribute('aria-label', 'Text formatting toolbar');

    // Icon mapping for tools
    const iconMap = {
      undo: '<i class="bi bi-arrow-counterclockwise"></i>',
      redo: '<i class="bi bi-arrow-clockwise"></i>',
      bold: '<i class="bi bi-type-bold"></i>',
      italic: '<i class="bi bi-type-italic"></i>',
      underline: '<i class="bi bi-type-underline"></i>',
      highlight: '<i class="bi bi-brush"></i>',
      strikethrough: '<i class="bi bi-type-strikethrough"></i>',
      insertLink: '<i class="bi bi-link"></i>',
      removeLink: '<i class="bi bi-link-45deg"></i>',
      justifyLeft: '<i class="bi bi-text-left"></i>',
      justifyCenter: '<i class="bi bi-text-center"></i>',
      justifyRight: '<i class="bi bi-text-right"></i>',
      insertUnorderedList: '<i class="bi bi-list-task"></i>',
      insertOrderedList: '<i class="bi bi-list-ol"></i>',
      indent: '<i class="bi bi-text-indent-left"></i>',
      outdent: '<i class="bi bi-text-indent-right"></i>',
      table: '<i class="bi bi-table"></i>',
      insertTable: '<i class="bi bi-table"></i>',
      textColor: '<i class="bi bi-palette"></i>',
      backgroundColor: '<i class="bi bi-paint-bucket"></i>',
      image: '<i class="bi bi-image"></i>',
      insertImage: '<i class="bi bi-image"></i>'
    };

    // Tooltip mapping for tools
    const tooltipsMap = {
      undo: 'Undo (Ctrl+Z)',
      redo: 'Redo (Ctrl+Shift+Z)',
      bold: 'Bold (Ctrl+B)',
      italic: 'Italic (Ctrl+I)',
      underline: 'Underline (Ctrl+U)',
      highlight: 'Highlight Text',
      insertLink: 'Insert Link (Ctrl+K)',
      removeLink: 'Remove Link',
      strikethrough: 'Strikethrough',
      justifyLeft: 'Align Left',
      justifyCenter: 'Align Center',
      justifyRight: 'Align Right',
      insertUnorderedList: 'Bullet List',
      insertOrderedList: 'Numbered List',
      indent: 'Increase Indent',
      outdent: 'Decrease Indent',
      table: 'Insert Table',
      insertTable: 'Insert Table',
      textColor: 'Text Color',
      backgroundColor: 'Background Color',
      image: 'Insert Image',
      insertImage: 'Insert Image'
    };

    // Create toolbar items
    this.config.toolbar.forEach((tool, index) => {
      // Handle heading selector
      if (tool === 'headingSelector') {
        const headingSelector = this._createHeadingSelector();
        this.element.appendChild(headingSelector);
        return;
      }

      // Handle font selector
      if (tool === 'fontSelector') {
        const fontSelector = this._createFontSelector();
        this.element.appendChild(fontSelector);
        return;
      }

      // Create button for other tools
      const button = document.createElement('button');
      button.type = 'button';
      button.classList.add('maxi-toolbar-btn');
      button.innerHTML = iconMap[tool] || tool;
      button.setAttribute('data-command', tool);
      button.setAttribute('title', tooltipsMap[tool] || tool);
      button.setAttribute('aria-label', tooltipsMap[tool] || tool);
      button.setAttribute('tabindex', index === 0 ? '0' : '-1');

      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.editor.executeCommand(tool);
      });

      this.buttons.set(tool, button);
      this.element.appendChild(button);
    });

    // Add keyboard navigation
    this._addKeyboardNavigation();

    // Insert toolbar before editor
    this.editor.element.before(this.element);

    // Set up state tracking with debouncing
    this._boundUpdateState = debounce(() => {
      this.updateState();
    }, 50);

    document.addEventListener('selectionchange', this._boundUpdateState);
  }

  /**
   * Creates heading selector dropdown
   * @private
   */
  _createHeadingSelector() {
    const select = document.createElement('select');
    select.classList.add('maxi-toolbar-select');
    select.setAttribute('aria-label', 'Text style');
    select.innerHTML = `
      <option value="p">Normal</option>
      <option value="H1">Heading 1</option>
      <option value="H2">Heading 2</option>
      <option value="H3">Heading 3</option>
      <option value="H4">Heading 4</option>
      <option value="H5">Heading 5</option>
      <option value="H6">Heading 6</option>
    `;

    select.addEventListener('change', (e) => {
      this.editor.executeCommand('formatBlock', e.target.value);
      this.editor.element.focus();
    });

    return select;
  }

  /**
   * Creates font selector dropdown
   * @private
   */
  _createFontSelector() {
    const select = document.createElement('select');
    select.classList.add('maxi-toolbar-select');
    select.setAttribute('aria-label', 'Font family');
    select.innerHTML = `
      <option value="Arial">Arial</option>
      <option value="Times New Roman">Times New Roman</option>
      <option value="Courier New">Courier New</option>
      <option value="Georgia">Georgia</option>
      <option value="Verdana">Verdana</option>
    `;

    select.addEventListener('change', (e) => {
      this.editor.executeCommand('fontName', e.target.value);
      this.editor.element.focus();
    });

    return select;
  }

  /**
   * Adds keyboard navigation to toolbar
   * @private
   */
  _addKeyboardNavigation() {
    this.element.addEventListener('keydown', (e) => {
      const buttons = Array.from(this.element.querySelectorAll('button, select'));
      const currentIndex = buttons.indexOf(document.activeElement);

      if (currentIndex === -1) return;

      let nextIndex = currentIndex;

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          nextIndex = (currentIndex + 1) % buttons.length;
          break;
        case 'ArrowLeft':
          e.preventDefault();
          nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
          break;
        case 'Home':
          e.preventDefault();
          nextIndex = 0;
          break;
        case 'End':
          e.preventDefault();
          nextIndex = buttons.length - 1;
          break;
        default:
          return;
      }

      // Update tabindex
      buttons.forEach((btn, idx) => {
        btn.setAttribute('tabindex', idx === nextIndex ? '0' : '-1');
      });

      buttons[nextIndex].focus();
    });
  }

  /**
   * Updates toolbar button states based on current selection
   */
  updateState() {
    const commands = ['bold', 'italic', 'underline', 'strikethrough'];

    commands.forEach(cmd => {
      const button = this.buttons.get(cmd);
      if (button) {
        try {
          const isActive = document.queryCommandState(cmd);
          if (isActive) {
            button.classList.add('active');
            button.setAttribute('aria-pressed', 'true');
          } else {
            button.classList.remove('active');
            button.setAttribute('aria-pressed', 'false');
          }
        } catch (e) {
          // Some commands may not be supported
        }
      }
    });
  }

  /**
   * Gets a button element by command name
   * @param {string} command - Command name
   * @returns {HTMLElement|null}
   */
  getButton(command) {
    return this.buttons.get(command) || null;
  }

  /**
   * Enables a toolbar button
   * @param {string} command - Command name
   */
  enableButton(command) {
    const button = this.buttons.get(command);
    if (button) {
      button.disabled = false;
      button.setAttribute('aria-disabled', 'false');
    }
  }

  /**
   * Disables a toolbar button
   * @param {string} command - Command name
   */
  disableButton(command) {
    const button = this.buttons.get(command);
    if (button) {
      button.disabled = true;
      button.setAttribute('aria-disabled', 'true');
    }
  }

  /**
   * Cleanup - removes event listeners
   */
  destroy() {
    if (this._boundUpdateState) {
      document.removeEventListener('selectionchange', this._boundUpdateState);
    }

    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }

    this.buttons.clear();
    this.element = null;
  }
}
