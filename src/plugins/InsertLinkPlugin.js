/**
 * Insert Link Plugin
 * Adds hyperlink insertion functionality
 */

import { Modal } from '../ui/Modal.js';
import { isValidURL } from '../utils/validation.js';
import { Selection } from '../core/Selection.js';

export class InsertLinkPlugin {
  static init(editor) {
    editor.registerCommand('insertLink', () => {
      const selectedText = Selection.getSelectedText();

      if (!selectedText) {
        alert('Please select some text to convert to a link');
        return;
      }

      // Create modal content
      const content = `
        <div class="maxi-link-form">
          <label for="link-url">URL:</label>
          <input type="url" id="link-url" value="https://" placeholder="https://example.com" />
          <label for="link-text">Link Text:</label>
          <input type="text" id="link-text" value="${selectedText}" />
          <label for="link-title">Title (optional):</label>
          <input type="text" id="link-title" placeholder="Link title" />
          <label>
            <input type="checkbox" id="link-target" />
            Open in new tab
          </label>
        </div>
      `;

      const modal = new Modal({
        title: 'Insert Link',
        content: content,
        onConfirm: (savedRange) => {
          const url = modal.getInputValue('#link-url');
          const text = modal.getInputValue('#link-text');
          const title = modal.getInputValue('#link-title');
          const target = modal.element.querySelector('#link-target').checked;

          // Validate URL
          if (!isValidURL(url)) {
            alert('Please enter a valid URL');
            return;
          }

          // Restore selection and insert link
          if (savedRange) {
            Selection.restoreSelection(savedRange);

            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
              const range = selection.getRangeAt(0);

              // Create anchor element
              const anchor = document.createElement('a');
              anchor.href = url;
              anchor.textContent = text || url;

              if (title) {
                anchor.title = title;
              }

              if (target) {
                anchor.target = '_blank';
                anchor.rel = 'noopener noreferrer';
              }

              range.deleteContents();
              range.insertNode(anchor);

              // Move selection after the link
              selection.removeAllRanges();
              const newRange = document.createRange();
              newRange.setStartAfter(anchor);
              newRange.collapse(true);
              selection.addRange(newRange);
            }
          }
        }
      });

      modal.show();

      // Focus URL input
      setTimeout(() => {
        const urlInput = modal.element.querySelector('#link-url');
        if (urlInput) {
          urlInput.select();
        }
      }, 100);
    });
  }
}
