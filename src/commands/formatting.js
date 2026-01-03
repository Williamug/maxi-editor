/**
 * Formatting Commands
 * Bold, italic, underline, strikethrough
 */

import { Selection } from '../core/Selection.js';

/**
 * Registers formatting commands
 * @param {CommandRegistry} registry - Command registry
 */
export function registerFormattingCommands(registry) {
  // Bold
  registry.register('bold', () => {
    Selection.toggleFormat('b');
  });

  // Italic
  registry.register('italic', () => {
    Selection.toggleFormat('i');
  });

  // Underline
  registry.register('underline', () => {
    Selection.toggleFormat('u');
  });

  // Strikethrough
  registry.register('strikethrough', () => {
    Selection.toggleFormat('s');
  });
}
