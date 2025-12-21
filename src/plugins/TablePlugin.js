/**
 * Table Plugin
 * Adds table insertion functionality
 */

import { validateNumberInRange } from '../utils/validation.js';

export class TablePlugin {
  static init(editor) {
    editor.registerCommand('insertTable', () => {
      const rowsInput = prompt("Enter the number of rows (1-50):");
      const colsInput = prompt("Enter the number of columns (1-50):");

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
        table += "</table>";

        // Insert table
        document.execCommand('insertHTML', false, table);
      } catch (error) {
        console.error('Failed to insert table:', error);
        alert('Failed to insert table. Please try again.');
      }
    });
  }
}
