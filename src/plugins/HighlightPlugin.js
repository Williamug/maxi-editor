/**
 * Highlight Plugin
 * Adds text highlighting functionality with color picker
 */

import { ColorPicker } from '../ui/ColorPicker.js';

export class HighlightPlugin {
  static init(editor) {
    let colorPicker = null;

    editor.registerCommand('highlight', () => {
      // Create color picker if it doesn't exist
      if (!colorPicker) {
        colorPicker = new ColorPicker((color) => {
          // Apply highlight color
          const selection = window.getSelection();
          if (!selection.rangeCount) return;

          const range = selection.getRangeAt(0);
          if (range.collapsed) {
            alert('Please select some text to highlight');
            return;
          }

          const span = document.createElement('span');
          span.style.backgroundColor = color;

          try {
            range.surroundContents(span);
          } catch (error) {
            // Fallback: wrap selected content
            const contents = range.extractContents();
            span.appendChild(contents);
            range.insertNode(span);
          }

          // Restore selection
          selection.removeAllRanges();
          const newRange = document.createRange();
          newRange.selectNodeContents(span);
          selection.addRange(newRange);

          editor.element.focus();
        }, editor.config.colorPalette); // Use customizable palette
      }

      // Get the button element
      const button = editor.toolbar.element.querySelector('[data-command="highlight"]');
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
