
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
        this.commands = {};
        this.state = {};

        this.injectBootstrapIcons();

        this.init();
    }

    /**
     * Injects the Bootstrap Icons CSS stylesheet into the document if it is not already included.
     * This method checks if the Bootstrap Icons CSS file is already loaded on the page, 
     * and if not, it creates a new `<link>` element and appends it to the 
     * document's `<head>`.
     */
    injectBootstrapIcons() {
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
     * Initializes the MaxiEditor instance.
     * This method sets up the contenteditable element, creates the toolbar, registers core commands, 
     * applies user plugins (if any), and tracks selection changes to update the toolbar state.
     */
    init() {
        // Set up contenteditable element
        this.element.contentEditable = true;
        this.element.classList.add('maxi-editor');

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
            bold: '<i class="bi bi-type-bold"></i>',
            italic: '<i class="bi bi-type-italic"></i>',
            underline: '<i class="bi bi-type-underline"></i>',
            highlight: '<i class="bi bi-brush"></i>'
        };

        // Tooltip mapping for tools
        const tooltipsMap = {
            bold: 'Bold (Ctrl+B)',
            italic: 'Italic (Ctrl+I)',
            underline: 'Underline (Ctrl+U)',
            highlight: 'Highlight Text',
        };

        // Add Heading Selector
        const headingSelector = document.createElement('select');
        headingSelector.innerHTML = `
            <option value="">Heading</option>
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

        // Add Font Family Selector
        const fontSelector = document.createElement('select');
        fontSelector.innerHTML = `
            <option value="">Font</option>
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
        `;
        fontSelector.addEventListener('change', (e) => this.executeCommand('fontName', e.target.value));
        toolPanel.appendChild(fontSelector);

        // Dynamically create tools with icons based on config
        /**
         * Dynamically creates toolbar buttons for the MaxiEditor instance based on the configured tools.
         * Each button is created as a `<button>` element with the corresponding icon from the `iconMap` object and a tooltip based on the `tooltipsMap` object.
         * The `data-command` attribute is set to the tool name, and a click event listener is added to execute the corresponding command when the button is clicked.
         * The created buttons are then appended to the `toolPanel` element, which represents the toolbar for the MaxiEditor.
         */
        this.config.toolbar.forEach(tool => {
            const button = document.createElement('button');
            button.innerHTML = iconMap[tool];
            button.setAttribute('data-command', tool);
            button.setAttribute('title', tooltipsMap[tool] || tool);
            button.addEventListener('click', () => this.executeCommand(tool));
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
        const commands = ['bold', 'italic', 'underline'];
        commands.forEach(cmd => {
            const isActive = document.queryCommandState(cmd);
            const button = document.querySelector(`button[data-command=${cmd}]`);
            if (isActive) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
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
     * Creates a new MaxiEditor instance with the specified element and configuration.
     *
     * @param {string} selector - A CSS selector that identifies the element to be used as the editor.
     * @param {Object} config - An optional configuration object for the MaxiEditor instance.
     * @returns {MaxiEditor} A new MaxiEditor instance.
     * @throws {Error} If the editor element is not found.
     */
    static create(selector, config) {
        const element = document.querySelector(selector);
        if (!element) {
            throw new Error('Editor element not found');
        }
        return new MaxiEditor(element, config);
    }
}
