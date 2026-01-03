/**
 * Text Color Plugin
 * Allows users to change text color using a color picker
 */

import { ColorPicker } from '../ui/ColorPicker.js';

export class TextColorPlugin {
  /**
   * Initializes the plugin
   * @param {MaxiEditor} editor - Editor instance
   */
  static init(editor) {
    let colorPicker = null;

    // Register the textColor command
    editor.registerCommand('textColor', () => {
      // Create color picker if it doesn't exist
      if (!colorPicker) {
        colorPicker = new ColorPicker((color) => {
          // Apply text color
          try {
            document.execCommand('foreColor', false, color);
            editor.element.focus();
          } catch (error) {
            console.error('Failed to apply text color:', error);
          }
        }, editor.config.colorPalette);
      }

      // Get the button element
      const button = editor.toolbar.element.querySelector('[data-command="textColor"]');
      if (button) {
        colorPicker.show(button);
      }
    });

    // Cleanup when editor is destroyed
    const originalDestroy = editor.destroy.bind(editor);
    editor.destroy = () => {
      if (colorPicker) {
        colorPicker.destroy();
      }
      originalDestroy();
    };
  }
}

export default TextColorPlugin;
