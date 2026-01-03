/**
 * Color Picker Component
 * Provides a UI for selecting colors
 */

export class ColorPicker {
  constructor(onSelectCallback, colors = null) {
    // Support both old and new constructor signatures
    if (typeof onSelectCallback === 'function') {
      this.onSelect = onSelectCallback;
      this.colors = colors || this._getDefaultColors();
    } else {
      // Old signature: constructor(options)
      const options = onSelectCallback || {};
      this.colors = options.colors || this._getDefaultColors();
      this.onSelect = options.onSelect || null;
    }

    this.element = null;
    this.recentColors = [];
  }

  /**
   * Gets default color palette
   * @private
   */
  _getDefaultColors() {
    return [
      '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff',
      '#ffeb3b', '#ff9800', '#f44336', '#e91e63', '#9c27b0',
      '#673ab7', '#3f51b5', '#2196f3', '#00bcd4', '#009688',
      '#4caf50', '#8bc34a', '#cddc39', '#ffc107', '#ff5722'
    ];
  }

  /**
   * Shows the color picker
   * @param {HTMLElement|number} targetOrX - Button element or X coordinate
   * @param {number} y - Y coordinate (if first param is number)
   */
  show(targetOrX, y) {
    // Close any existing picker
    if (this.element) {
      this.close();
    }

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
    this.element.style.zIndex = '1000';

    // Determine position
    let x, yPos;

    if (typeof targetOrX === 'object' && targetOrX.getBoundingClientRect) {
      // targetOrX is a button element
      const rect = targetOrX.getBoundingClientRect();
      x = rect.left + window.scrollX;
      yPos = rect.bottom + window.scrollY + 5; // 5px below button
    } else {
      // targetOrX is x coordinate
      x = targetOrX;
      yPos = y;
    }

    this.element.style.left = `${x}px`;
    this.element.style.top = `${yPos}px`;

    document.body.appendChild(this.element);

    // Adjust position if picker goes off-screen
    setTimeout(() => {
      const pickerRect = this.element.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Adjust horizontal position if off-screen
      if (pickerRect.right > viewportWidth) {
        const newX = viewportWidth - pickerRect.width - 10;
        this.element.style.left = `${newX}px`;
      }

      // Adjust vertical position if off-screen
      if (pickerRect.bottom > viewportHeight) {
        // Show above the button instead
        if (typeof targetOrX === 'object' && targetOrX.getBoundingClientRect) {
          const rect = targetOrX.getBoundingClientRect();
          const newY = rect.top + window.scrollY - pickerRect.height - 5;
          this.element.style.top = `${newY}px`;
        }
      }
    }, 0);

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
      if (this.recentColors.length > 8) {
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

  /**
   * Destroys the color picker and cleans up
   */
  destroy() {
    this.close();
    this.recentColors = [];
  }
}
