/**
 * Highlight Plugin
 * Adds text highlighting functionality with color picker
 */

import { ColorPicker } from '../ui/ColorPicker.js';
import { Selection } from '../core/Selection.js';

export class HighlightPlugin {
  static init(editor) {
    editor.registerCommand('highlight', () => {
      // Save current selection
      const savedRange = Selection.saveSelection();

      if (!savedRange || savedRange.collapsed) {
        alert('Please select some text to highlight');
        return;
      }

      // Get button position for color picker
      const button = editor.toolbar ? editor.toolbar.getButton('highlight') : null;
      let x = 100, y = 100;

      if (button) {
        const rect = button.getBoundingClientRect();
        x = rect.left;
        y = rect.bottom + 5;
      }

      // Show color picker
      const colorPicker = new ColorPicker({
        onSelect: (color) => {
          // Restore selection
          Selection.restoreSelection(savedRange);

          // Apply highlight
          const selection = window.getSelection();
          if (!selection.rangeCount) return;

          const range = selection.getRangeAt(0);
          if (range.collapsed) return;

          const span = document.createElement('span');
          span.style.backgroundColor = color;
          span.appendChild(range.extractContents());
          range.insertNode(span);

          // Move selection to the highlighted text
          selection.removeAllRanges();
          const newRange = document.createRange();
          newRange.selectNodeContents(span);
          selection.addRange(newRange);
        }
      });

      colorPicker.show(x, y);
    });
  }
}
