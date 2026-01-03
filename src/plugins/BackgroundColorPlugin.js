/**
 * Background Color Plugin
 * Allows users to change text background color using a color picker
 */

import { ColorPicker } from '../ui/ColorPicker.js';

export class BackgroundColorPlugin {
  /**
   * Initializes the plugin
   * @param {MaxiEditor} editor - Editor instance
   */
  static init(editor) {
    let colorPicker = null;

    // Register the backgroundColor command
    editor.registerCommand('backgroundColor', () => {
      // Create color picker if it doesn't exist
      if (!colorPicker) {
        colorPicker = new ColorPicker((color) => {
          // Apply background color
          try {
            document.execCommand('backColor', false, color);
            editor.element.focus();
          } catch (error) {
            console.error('Failed to apply background color:', error);
          }
        }, editor.config.colorPalette);
      }

      // Get the button element
      const button = editor.toolbar.element.querySelector('[data-command="backgroundColor"]');
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

export default BackgroundColorPlugin;
