/**
 * Alignment Commands
 * Left, center, right alignment
 */

import { Selection } from '../core/Selection.js';

/**
 * Registers alignment commands
 * @param {CommandRegistry} registry - Command registry
 */
export function registerAlignmentCommands(registry) {
  // Align left
  registry.register('justifyLeft', () => {
    Selection.setAlignment('left');
  });

  // Align center
  registry.register('justifyCenter', () => {
    Selection.setAlignment('center');
  });

  // Align right
  registry.register('justifyRight', () => {
    Selection.setAlignment('right');
  });
}
