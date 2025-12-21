/**
 * List Commands
 * Ordered and unordered lists, indent/outdent
 */

import { Selection } from '../core/Selection.js';

/**
 * Registers list commands
 * @param {CommandRegistry} registry - Command registry
 */
export function registerListCommands(registry) {
  // Unordered list
  registry.register('insertUnorderedList', () => {
    Selection.wrapSelectionInList('ul');
  });

  // Ordered list
  registry.register('insertOrderedList', () => {
    Selection.wrapSelectionInList('ol');
  });

  // Indent
  registry.register('indent', () => {
    Selection.indentBlock();
  });

  // Outdent
  registry.register('outdent', () => {
    Selection.outdentBlock();
  });
}
