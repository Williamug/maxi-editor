/**
 * Remove Link Plugin
 * Removes hyperlinks from selected text
 */

export class RemoveLinkPlugin {
  static init(editor) {
    editor.registerCommand('removeLink', () => {
      try {
        document.execCommand('unlink', false, null);
      } catch (error) {
        console.error('Failed to remove link:', error);
      }
    });
  }
}
