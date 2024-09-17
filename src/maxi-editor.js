
/**
 * MaxiEditor
* Copyright © 2024 William Asaba
 */
class MaxiEditor {
    /**
     * Constructs a new `MaxiEditor` instance with the provided `element` and `config` parameters.
     *
     * @param {HTMLElement} element - The DOM element that will become the editable content area for the editor.
     * @param {Object} config - The configuration object for the editor, which may include settings for plugins, toolbar, and other options.
     * @constructor
     */
    constructor(element, config) {
        this.element = element;
        this.config = config;
        this.element.style.height = config.height || '200px';
        this.commands = {};
        this.state = {};

        this.includeBootstrapIcons();

        this.init();
    }

    /**
     * Initializes the MaxiEditor instance.
     * This method sets up the contenteditable element, creates the toolbar, registers core commands, 
     * applies user plugins (if any), and tracks selection changes to update the toolbar state.
     */
    init() {
        // Set up contenteditable element
        this.element.contentEditable = true;
        this.element.classList.add('maxi-editor');
        this.element.setAttribute('data-placeholder', this.config.placeholder || 'Start typing something here...');

        // Check if the editor is initially empty
        this.checkContent();

        // Listen for input events
        this.element.addEventListener('input', () => this.checkContent());

        // Create the toolbar
        this.createToolPanel();

        // Register core commands (bold, italic, underline, etc)
        this.registerCoreCommands();

        // Apply user plugins (if any)
        if (this.config.plugins) {
            this.applyPlugins(this.config.plugins);
        }

        // Track selection changes to update toolbar state (make the toolbar item active or inactive)
        this.trackSelection();
    }

    /**
     * Injects the Bootstrap Icons CSS stylesheet into the document if it is not already included.
     * This method checks if the Bootstrap Icons CSS file is already loaded on the page, 
     * and if not, it creates a new `<link>` element and appends it to the 
     * document's `<head>`.
     */
    includeBootstrapIcons() {
        const linkHref = 'https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css';

        const isAlreadyIncluded = Array.from(document.styleSheets).some(
            (sheet) => sheet.href === linkHref
        );

        if (!isAlreadyIncluded) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = linkHref;
            document.head.appendChild(link);
        }
    }


    /**
     * Checks the content of the editor element and adds or removes the 'empty' class based on whether the text is empty or not.
     * This method is used to track the initial state of the editor and apply appropriate styling.
     */
    checkContent() {
        const text = this.element.innerText.trim();
        if (text === "") {
            this.element.classList.add('empty');
        } else {
            this.element.classList.remove('empty');
        }
    }

    /**
     * Creates the toolbar panel for the MaxiEditor instance.
     * The toolbar panel includes buttons for common formatting commands (bold, italic, underline, highlight) and 
     * dropdown selectors for headings and font families.
     * The toolbar is inserted just above the contenteditable element that the MaxiEditor instance is attached to.
     */
    createToolPanel() {
        const toolPanel = document.createElement('div');
        toolPanel.classList.add('maxi-toolbar');

        // Insert the toolbar just above the editor
        this.element.before(toolPanel);

        // Icon mapping for tools
        const iconMap = {
            undo: '<i class="bi bi-arrow-counterclockwise"></i>',
            redo: '<i class="bi bi-arrow-clockwise"></i>',
            bold: '<i class="bi bi-type-bold"></i>',
            italic: '<i class="bi bi-type-italic"></i>',
            underline: '<i class="bi bi-type-underline"></i>',
            highlight: '<i class="bi bi-brush"></i>',
            strikethrough: '<i class="bi bi-type-strikethrough"></i>',
            insertLink: '<i class="bi bi-link"></i>',
            justifyLeft: '<i class="bi bi-text-left"></i>',
            justifyCenter: '<i class="bi bi-text-center"></i>',
            justifyRight: '<i class="bi bi-text-right"></i>',
            insertUnorderedList: '<i class="bi bi-list-task"></i>',
            insertOrderedList: '<i class="bi bi-list-ol"></i>',
            indent: '<i class="bi bi-text-indent-left"></i>',
            outdent: '<i class="bi bi-text-indent-right"></i>',
        };

        // Tooltip mapping for tools
        const tooltipsMap = {
            undo: 'undo',
            redo: 'redo',
            bold: 'Bold (Ctrl+B)',
            italic: 'Italic (Ctrl+I)',
            underline: 'Underline (Ctrl+U)',
            highlight: 'Highlight Text',
            insertLink: 'Insert Link',
            strikethrough: 'Strikethrough',
            justifyLeft: 'Justify Left',
            justifyCenter: 'Justify Center',
            justifyRight: 'Justify Right',
            insertUnorderedList: 'Unordered List',
            insertOrderedList: 'Ordered List',
            indent: 'Indent',
            outdent: 'Outdent'
        };

        /**
         * Dynamically creates toolbar buttons for the MaxiEditor instance based on the configured tools.
         * Each button is created as a `<button>` element with the corresponding icon from the `iconMap` object and a tooltip based on the `tooltipsMap` object.
         * The `data-command` attribute is set to the tool name, and a click event listener is added to execute the corresponding command when the button is clicked.
         * The created buttons are then appended to the `toolPanel` element, which represents the toolbar for the MaxiEditor.
         */
        this.config.toolbar.forEach(tool => {
            // Check for heading selector
            if (tool === 'headingSelector') {
                const headingSelector = document.createElement('select');
                headingSelector.innerHTML = `
                <option value="p">Normal</option>
                <option value="H1">Heading 1</option>
                <option value="H2">Heading 2</option>
                <option value="H3">Heading 3</option>
                <option value="H4">Heading 4</option>
                <option value="H5">Heading 5</option>
                <option value="H6">Heading 6</option>
            `;
                headingSelector.addEventListener('change', (e) => this.executeCommand('formatBlock', e.target.value));
                toolPanel.appendChild(headingSelector);
                return;
            }

            // Check for font selector
            if (tool === 'fontSelector') {
                const fontSelector = document.createElement('select');
                fontSelector.innerHTML = `
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
            `;
                fontSelector.addEventListener('change', (e) => this.executeCommand('fontName', e.target.value));
                toolPanel.appendChild(fontSelector);
                return; // Continue to next tool
            }

            // Create buttons for other tools
            const button = document.createElement('button');
            button.type = 'button';
            button.innerHTML = iconMap[tool];
            button.setAttribute('data-command', tool);
            button.setAttribute('title', tooltipsMap[tool] || tool);
            button.addEventListener('click', (event) => {
                event.preventDefault();
                this.executeCommand(tool);
            });
            toolPanel.appendChild(button);
        });
    }

    /**
     * Registers a set of core commands for the editor.
     * 
     * The `formatBlock` command sets the block format of the current selection to the specified HTML tag.
     * The `fontName` command sets the font family of the current selection to the specified font name.
     * The `bold`, `italic`, and `underline` commands apply the corresponding text formatting to the current selection.
     */
    registerCoreCommands() {
        this.registerCommand('formatBlock', (tag) => document.execCommand('formatBlock', false, tag));
        this.registerCommand('fontName', (font) => document.execCommand('fontName', false, font));

        this.registerCommand('bold', () => document.execCommand('bold', false, null));
        this.registerCommand('italic', () => document.execCommand('italic', false, null));
        this.registerCommand('underline', () => document.execCommand('underline', false, null));
        this.registerCommand('justifyLeft', () => document.execCommand('justifyLeft', false, null));
        this.registerCommand('justifyCenter', () => document.execCommand('justifyCenter', false, null));
        this.registerCommand('justifyRight', () => document.execCommand('justifyRight', false, null));
        this.registerCommand('insertUnorderedList', () => document.execCommand('insertUnorderedList', false, null));
        this.registerCommand('insertOrderedList', () => document.execCommand('insertOrderedList', false, null));
        this.registerCommand('indent', () => document.execCommand('indent', false, null));
        this.registerCommand('outdent', () => document.execCommand('outdent', false, null));
        this.registerCommand('undo', () => document.execCommand('undo', false, null));
        this.registerCommand('redo', () => document.execCommand('redo', false, null));
    }


    /**
     * Registers a custom command for the editor.
     * 
     * @param {string} commandName - The name of the command to register.
     * @param {function} commandFn - The function to execute when the command is called.
     */
    registerCommand(commandName, commandFn) {
        this.commands[commandName] = commandFn;
    }


    /**
     * Executes a registered command in the editor.
     *
     * @param {string} commandName - The name of the command to execute.
     * @param {any} [value=null] - The value to pass to the command function, if any.
     * @returns {void}
     */
    executeCommand(commandName, value = null) {
        const command = this.commands[commandName];
        if (command) {
            command(value);
        } else {
            console.error(`Command ${commandName} is not registered.`);
        }
    }


    /**
     * Applies the provided plugins to the editor instance.
     *
     * @param {Plugin[]} plugins - An array of plugin objects to be initialized.
     * @returns {void}
     */
    applyPlugins(plugins) {
        plugins.forEach(plugin => plugin.init(this));
    }


    /**
     * Updates the state of the toolbar buttons based on the current selection in the editor.
     * This function checks the state of the 'bold', 'italic', and 'underline' commands and updates the
     * corresponding toolbar buttons accordingly.
     */
    updateToolbarState() {
        const commands = ['bold', 'italic', 'underline', 'strikethrough', 'justifyLeft', 'justifyCenter', 'justifyRight', 'insertUnorderedList', 'insertOrderedList', 'indent'];
        commands.forEach(cmd => {
            const isActive = document.queryCommandState(cmd);
            const button = document.querySelector(`button[data-command=${cmd}]`);
            if (button) {
                if (isActive) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            } else {
                console.warn(`Button with command '${cmd}' not found.`);
            }
        });
    }

    // Track selection changes and update toolbar state
    /**
     * Tracks changes to the selection in the editor and updates the toolbar state accordingly.
     * This method adds an event listener for the 'selectionchange' event on the document, and calls the
     * `updateToolbarState()` method whenever the selection changes.
     */
    trackSelection() {
        document.addEventListener('selectionchange', () => {
            this.updateToolbarState();
        });
    }

    // Get the content of the editor
    /**
     * Gets the content of the editor.
     * @returns {string} The HTML content of the editor.
     */
    getContent() {
        return this.element.innerHTML;
    }


    /**
     * Sets the content of the editor.
     * @param {string} content - The HTML content to be set in the editor.
     * @returns {void}
     */
    setContent(content) {
        this.element.innerHTML = content;
    }

    /**
       * Sets the height of the editor dynamically.
       * 
       * @param {string} height - The desired height (e.g., '500px').
       */
    setHeight(height) {
        this.element.style.height = height;
    }

    /**
       * Sets the width of the editor dynamically.
       * 
       * @param {string} width - The desired width (e.g., '200px').
       */
    setWidth(width) {
        this.element.style.width = width;
    }

    /**
     * Creates a new MaxiEditor instance with the specified element and configuration.
     *
     * @param {string} selector - A CSS selector that identifies the element to be used as the editor.
     * @param {Object} config - An optional configuration object for the MaxiEditor instance.
     * @returns {MaxiEditor} A new MaxiEditor instance.
     * @throws {Error} If the editor element is not found.
     */
    static set(selector, config) {
        const element = document.querySelector(selector);
        if (!element) {
            throw new Error('Editor element not found');
        }

        if (config.height) {
            element.style.height = config.height;
        }

        if (config.width) {
            element.style.width = config.width;
        }

        return new MaxiEditor(element, config);
    }
}

/** --------------------------------------------------------------------
** Plugins
** ---------------------------------------------------------------------
*/
class StrikeThroughPlugin {
    static init(editor) {
        editor.registerCommand('strikethrough', () => {
            document.execCommand('strikeThrough', false, null);
        });
    }
}

/**
 * The InsertLinkPlugin class provides a command to insert a hyperlink into the selected text in the editor using a custom modal input.
 *
 * @class InsertLinkPlugin
 */
class InsertLinkPlugin {
    static init(editor) {
        editor.registerCommand('insertLink', () => {
            InsertLinkPlugin.showLinkInputModal(editor);
        });
    }

    /**
     * Creates and displays a custom modal for entering the URL.
     * @param {MaxiEditor} editor - The instance of the editor.
     */
    static showLinkInputModal(editor) {
        // Create modal elements
        const modal = document.createElement('div');
        modal.classList.add('link-modal');
        modal.innerHTML = `
            <div class="modal-content">
                <label for="link-url">Enter URL:</label>
                <input type="text" id="link-url" value="https://" />
                <button id="insert-link-btn">Insert Link</button>
                <button id="cancel-btn">Cancel</button>
            </div>
        `;
        document.body.appendChild(modal);

        // Store the current selection
        const selection = window.getSelection();
        const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

        // Handle insert link button click
        const insertLinkButton = modal.querySelector('#insert-link-btn');
        const cancelButton = modal.querySelector('#cancel-btn');

        insertLinkButton.addEventListener('click', () => {
            const urlInput = modal.querySelector('#link-url').value;

            if (urlInput && range) {
                // Create an anchor element with the URL
                const anchor = document.createElement('a');
                anchor.href = urlInput;
                anchor.textContent = range.toString();
                range.deleteContents();
                range.insertNode(anchor);

                // Optionally, reselect the anchor for further editing if needed
                selection.removeAllRanges();
                const newRange = document.createRange();
                newRange.selectNode(anchor);
                selection.addRange(newRange);
            }

            modal.remove();
        });

        // Handle cancel button click
        cancelButton.addEventListener('click', () => {
            modal.remove();
        });
    }
}

class RemoveLinkPlugin {
    static init(editor) {
        editor.registerCommand('removeLink', () => {
            document.execCommand('unlink', false, null);
        });
    }
}
