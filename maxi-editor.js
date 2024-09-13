class CustomEditor {
    constructor(element, config) {
        this.element = element;
        this.config = config;
        this.commands = {};
        this.state = {};

        this.init();
    }

    // Initialize the editor
    init() {
        // Set up contenteditable element
        this.element.contentEditable = true;
        this.element.classList.add('custom-editor');

        // Create the toolbar
        this.createToolPanel();

        // Register core commands (bold, italic, underline)
        this.registerCoreCommands();

        // Apply user plugins (if any)
        if (this.config.plugins) {
            this.applyPlugins(this.config.plugins);
        }

        // Track selection changes to update toolbar state
        this.trackSelection();
    }

    // Create toolbar with icons
    createToolPanel() {
        const toolPanel = document.createElement('div');
        toolPanel.classList.add('custom-toolbar');

        // Insert the toolbar just above the editor
        this.element.before(toolPanel);

        // Icon mapping for tools
        const iconMap = {
            bold: '<i class="bi bi-type-bold"></i>',
            italic: '<i class="bi bi-type-italic"></i>',
            underline: '<i class="bi bi-type-underline"></i>',
            highlight: '<i class="bi bi-brush"></i>'
        };

        // Dynamically create tools with icons based on config
        this.config.toolbar.forEach(tool => {
            const button = document.createElement('button');
            button.innerHTML = iconMap[tool];
            button.setAttribute('data-command', tool);
            button.addEventListener('click', () => this.executeCommand(tool));
            toolPanel.appendChild(button);
        });
    }

    // Register core commands (Bold, Italic, Underline)
    registerCoreCommands() {
        this.registerCommand('bold', () => document.execCommand('bold', false, null));
        this.registerCommand('italic', () => document.execCommand('italic', false, null));
        this.registerCommand('underline', () => document.execCommand('underline', false, null));
    }

    // Command registration system
    registerCommand(commandName, commandFn) {
        this.commands[commandName] = commandFn;
    }

    // Execute registered commands
    executeCommand(commandName) {
        const command = this.commands[commandName];
        if (command) {
            command();
        } else {
            console.error(`Command ${commandName} is not registered.`);
        }
    }

    // Apply custom plugins
    applyPlugins(plugins) {
        plugins.forEach(plugin => plugin.init(this));
    }

    // Update the state of the toolbar buttons based on current selection
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
    trackSelection() {
        document.addEventListener('selectionchange', () => {
            this.updateToolbarState();
        });
    }

    // Get the content of the editor
    getContent() {
        return this.element.innerHTML;
    }

    // Set the content of the editor
    setContent(content) {
        this.element.innerHTML = content;
    }

    // Static method to initialize the editor
    static create(selector, config) {
        const element = document.querySelector(selector);
        if (!element) {
            throw new Error('Editor element not found');
        }
        return new CustomEditor(element, config);
    }
}

// Sample Highlight Plugin
class HighlightPlugin {
    static init(editor) {
        editor.registerCommand('highlight', () => {
            const color = prompt("Enter highlight color (e.g., yellow)");
            document.execCommand('hiliteColor', false, color);
        });
    }
}
