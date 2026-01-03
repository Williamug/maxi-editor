/**
 * Table Plugin
 * Adds table insertion functionality with modal dialog
 */

import { validateNumberInRange } from '../utils/validation.js';
import { Modal } from '../ui/Modal.js';

export class TablePlugin {
  static init(editor) {
    const tableHandler = () => {
      // Create modal content
      const modalContent = `
        <div class="maxi-table-form">
          <div class="maxi-form-group">
            <label for="table-rows">Number of Rows:</label>
            <input
              type="number"
              id="table-rows"
              min="1"
              max="50"
              value="3"
              class="maxi-input"
            />
          </div>
          <div class="maxi-form-group">
            <label for="table-cols">Number of Columns:</label>
            <input
              type="number"
              id="table-cols"
              min="1"
              max="50"
              value="3"
              class="maxi-input"
            />
          </div>
        </div>
      `;

      // Create modal
      const modal = new Modal({
        title: 'Insert Table',
        content: modalContent,
        buttons: [
          {
            text: 'Cancel',
            className: 'maxi-modal-btn-secondary',
            onClick: () => {
              modal.close();
            }
          },
          {
            text: 'Insert',
            className: 'maxi-modal-btn-primary',
            onClick: () => {
              const rowsInput = document.getElementById('table-rows').value;
              const colsInput = document.getElementById('table-cols').value;

              // Validate inputs
              const rows = validateNumberInRange(rowsInput, 1, 50);
              const cols = validateNumberInRange(colsInput, 1, 50);

              if (rows === null || cols === null) {
                alert("Please enter valid numbers between 1 and 50");
                return;
              }

              try {
                // Build table HTML
                let table = "<table border='1' style='border-collapse: collapse; width: 100%;'>";

                for (let i = 0; i < rows; i++) {
                  table += "<tr>";
                  for (let j = 0; j < cols; j++) {
                    table += "<td style='padding: 8px; border: 1px solid #ddd;'>&nbsp;</td>";
                  }
                  table += "</tr>";
                }
                table += "</table><p>&nbsp;</p>"; // Add paragraph after table

                // Insert table
                document.execCommand('insertHTML', false, table);
                editor.element.focus();

                modal.close();
              } catch (error) {
                console.error('Failed to insert table:', error);
                alert('Failed to insert table. Please try again.');
              }
            }
          }
        ]
      });

      modal.show();

      // Focus first input
      setTimeout(() => {
        const firstInput = document.getElementById('table-rows');
        if (firstInput) {
          firstInput.focus();
          firstInput.select();
        }
      }, 100);

      // Handle Enter key to submit
      const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const insertBtn = modal.element.querySelector('.maxi-modal-btn-primary');
          if (insertBtn) {
            insertBtn.click();
          }
        }
      };

      const rowsInput = document.getElementById('table-rows');
      const colsInput = document.getElementById('table-cols');

      if (rowsInput) rowsInput.addEventListener('keypress', handleKeyPress);
      if (colsInput) colsInput.addEventListener('keypress', handleKeyPress);
    };

    // Register both 'table' and 'insertTable' for compatibility
    editor.registerCommand('table', tableHandler);
    editor.registerCommand('insertTable', tableHandler);
  }
}
