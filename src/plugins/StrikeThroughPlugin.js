/**
 * Strikethrough Plugin
 * Adds strikethrough formatting
 */

import { Selection } from '../core/Selection.js';

export class StrikeThroughPlugin {
  static init(editor) {
    editor.registerCommand('strikethrough', () => {
      Selection.toggleFormat('s');
    });
  }
}
