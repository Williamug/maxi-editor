/**
 * Color Picker Component
 * Provides a UI for selecting colors
 */

export class ColorPicker {
  constructor(options = {}) {
    this.colors = options.colors || [
      '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff',
      '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080',
      '#ffc0cb', '#a52a2a', '#808080', '#00ff7f', '#4b0082'
    ];
    this.onSelect = options.onSelect || null;
    this.element = null;
    this.recentColors = [];
  }

  /**
   * Shows the color picker at a specific position
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   */
  show(x, y) {
    this.element = document.createElement('div');
    this.element.classList.add('maxi-color-picker');

    // Create color palette
    const palette = document.createElement('div');
    palette.classList.add('maxi-color-palette');

    // Add predefined colors
    this.colors.forEach(color => {
      const colorOption = document.createElement('div');
      colorOption.classList.add('maxi-color-option');
      colorOption.style.backgroundColor = color;
      colorOption.setAttribute('data-color', color);
      colorOption.setAttribute('title', color);
      colorOption.addEventListener('click', () => this._handleColorSelect(color));
      palette.appendChild(colorOption);
    });

    this.element.appendChild(palette);

    // Add custom color input
    const customColorSection = document.createElement('div');
    customColorSection.classList.add('maxi-color-custom');
    customColorSection.innerHTML = `
      <label for="maxi-custom-color">Custom:</label>
      <input type="color" id="maxi-custom-color" value="#000000">
      <button type="button" class="maxi-color-apply">Apply</button>
    `;

    const customInput = customColorSection.querySelector('#maxi-custom-color');
    const applyBtn = customColorSection.querySelector('.maxi-color-apply');

    applyBtn.addEventListener('click', () => {
      this._handleColorSelect(customInput.value);
    });

    this.element.appendChild(customColorSection);

    // Add recent colors if any
    if (this.recentColors.length > 0) {
      const recentSection = document.createElement('div');
      recentSection.classList.add('maxi-color-recent');
      recentSection.innerHTML = '<div class="maxi-color-label">Recent:</div>';

      const recentPalette = document.createElement('div');
      recentPalette.classList.add('maxi-color-palette');

      this.recentColors.forEach(color => {
        const colorOption = document.createElement('div');
        colorOption.classList.add('maxi-color-option');
        colorOption.style.backgroundColor = color;
        colorOption.setAttribute('data-color', color);
        colorOption.addEventListener('click', () => this._handleColorSelect(color));
        recentPalette.appendChild(colorOption);
      });

      recentSection.appendChild(recentPalette);
      this.element.appendChild(recentSection);
    }

    // Position the picker
    this.element.style.position = 'absolute';
    this.element.style.left = `${x}px`;
    this.element.style.top = `${y}px`;
    this.element.style.zIndex = '1000';

    document.body.appendChild(this.element);

    // Close on outside click
    setTimeout(() => {
      document.addEventListener('click', this._outsideClickHandler);
    }, 100);
  }

  /**
   * Handles color selection
   * @param {string} color - Selected color
   * @private
   */
  _handleColorSelect(color) {
    // Add to recent colors
    if (!this.recentColors.includes(color)) {
      this.recentColors.unshift(color);
      if (this.recentColors.length > 5) {
        this.recentColors.pop();
      }
    }

    if (this.onSelect) {
      this.onSelect(color);
    }

    this.close();
  }

  /**
   * Handles outside clicks
   * @private
   */
  _outsideClickHandler = (e) => {
    if (this.element && !this.element.contains(e.target)) {
      this.close();
    }
  }

  /**
   * Closes the color picker
   */
  close() {
    document.removeEventListener('click', this._outsideClickHandler);

    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }

    this.element = null;
  }
}
