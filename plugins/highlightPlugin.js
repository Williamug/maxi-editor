/**
 * The HighlightPlugin class provides a way to add a "highlight" command to a MaxiEditor instance.
 * 
 * When the "highlight" command is executed, it prompts the user to enter a highlight color (e.g. "yellow"),
 * and then applies that highlight color to the selected text in the editor using the `document.execCommand('hiliteColor', false, color)` method.
 * 
 * To use the HighlightPlugin, you need to call the `init` method and pass in the MaxiEditor instance you want to add the "highlight" command to.
 */
export class HighlightPlugin {
    static init(editor) {
        editor.registerCommand('highlight', () => {
            const color = prompt("Enter highlight color (e.g., yellow)");
            document.execCommand('hiliteColor', false, color);
        });
    }
}