/**
 * MaxiEditor - Main Entry Point
 * Exports the editor and all plugins
 */

export { MaxiEditor as default } from './core/MaxiEditor.js';
export { MaxiEditor } from './core/MaxiEditor.js';

// Export plugins
export {
  HighlightPlugin,
  InsertLinkPlugin,
  StrikeThroughPlugin,
  RemoveLinkPlugin,
  TablePlugin
} from './plugins/index.js';

// Export utilities (for advanced users)
export { Sanitizer } from './core/Sanitizer.js';
export { Selection } from './core/Selection.js';
export { Modal } from './ui/Modal.js';
export { ColorPicker } from './ui/ColorPicker.js';
