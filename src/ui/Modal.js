/**
 * Modal Component
 * Reusable modal dialog
 */

export class Modal {
  constructor(options = {}) {
    this.title = options.title || '';
    this.content = options.content || '';
    this.onConfirm = options.onConfirm || null;
    this.onCancel = options.onCancel || null;
    this.element = null;
    this._savedRange = null;
  }

  /**
   * Shows the modal
   */
  show() {
    // Save current selection
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      this._savedRange = selection.getRangeAt(0);
    }

    // Create modal element
    this.element = document.createElement('div');
    this.element.classList.add('maxi-modal');
    this.element.innerHTML = `
      <div class="maxi-modal-overlay"></div>
      <div class="maxi-modal-content">
        ${this.title ? `<h3 class="maxi-modal-title">${this.title}</h3>` : ''}
        <div class="maxi-modal-body">${this.content}</div>
        <div class="maxi-modal-footer">
          <button type="button" class="maxi-modal-btn maxi-modal-confirm">OK</button>
          <button type="button" class="maxi-modal-btn maxi-modal-cancel">Cancel</button>
        </div>
      </div>
    `;

    document.body.appendChild(this.element);

    // Add event listeners
    const confirmBtn = this.element.querySelector('.maxi-modal-confirm');
    const cancelBtn = this.element.querySelector('.maxi-modal-cancel');
    const overlay = this.element.querySelector('.maxi-modal-overlay');

    confirmBtn.addEventListener('click', () => this._handleConfirm());
    cancelBtn.addEventListener('click', () => this._handleCancel());
    overlay.addEventListener('click', () => this._handleCancel());

    // Handle Escape key
    this._escapeHandler = (e) => {
      if (e.key === 'Escape') {
        this._handleCancel();
      }
    };
    document.addEventListener('keydown', this._escapeHandler);

    // Focus first input if exists
    const firstInput = this.element.querySelector('input, textarea');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  }

  /**
   * Handles confirm action
   * @private
   */
  _handleConfirm() {
    if (this.onConfirm) {
      this.onConfirm(this._savedRange);
    }
    this.close();
  }

  /**
   * Handles cancel action
   * @private
   */
  _handleCancel() {
    if (this.onCancel) {
      this.onCancel();
    }
    this.close();
  }

  /**
   * Closes the modal
   */
  close() {
    if (this._escapeHandler) {
      document.removeEventListener('keydown', this._escapeHandler);
    }

    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }

    this.element = null;
  }

  /**
   * Gets input value from modal
   * @param {string} selector - Input selector
   * @returns {string}
   */
  getInputValue(selector) {
    if (!this.element) return '';
    const input = this.element.querySelector(selector);
    return input ? input.value : '';
  }
}
