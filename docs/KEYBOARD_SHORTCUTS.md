# Keyboard Shortcuts Guide

MaxiEditor supports a comprehensive set of keyboard shortcuts for efficient text editing.

## Default Shortcuts

### Formatting

| Shortcut | Command | Description |
|----------|---------|-------------|
| `Ctrl+B` | Bold | Toggle bold formatting |
| `Ctrl+I` | Italic | Toggle italic formatting |
| `Ctrl+U` | Underline | Toggle underline formatting |

### Undo/Redo

| Shortcut | Command | Description |
|----------|---------|-------------|
| `Ctrl+Z` | Undo | Undo last action |
| `Ctrl+Shift+Z` | Redo | Redo last undone action |
| `Ctrl+Y` | Redo | Redo (alternative) |

### Links

| Shortcut | Command | Description |
|----------|---------|-------------|
| `Ctrl+K` | Insert Link | Open link insertion dialog |

### Alignment

| Shortcut | Command | Description |
|----------|---------|-------------|
| `Ctrl+Shift+L` | Align Left | Align text to the left |
| `Ctrl+Shift+E` | Align Center | Center align text |
| `Ctrl+Shift+R` | Align Right | Align text to the right |

### Lists

| Shortcut | Command | Description |
|----------|---------|-------------|
| `Ctrl+Shift+7` | Ordered List | Create numbered list |
| `Ctrl+Shift+8` | Unordered List | Create bullet list |

### Indentation

| Shortcut | Command | Description |
|----------|---------|-------------|
| `Tab` | Indent | Increase indentation |
| `Shift+Tab` | Outdent | Decrease indentation |

## Mac Compatibility

On Mac, `Ctrl` can be replaced with `Cmd` (⌘):
- `Cmd+B` for bold
- `Cmd+I` for italic
- `Cmd+Z` for undo
- etc.

The keyboard handler automatically maps `Cmd` to `Ctrl` for cross-platform compatibility.

## Configuration

### Enable/Disable Shortcuts

```javascript
// Disable all keyboard shortcuts
const editor = MaxiEditor.set('#editor', {
  keyboardShortcuts: false
});
```

### Custom Shortcuts

```javascript
const editor = MaxiEditor.set('#editor', {
  customShortcuts: {
    'Ctrl+Shift+H': 'highlight',      // Custom highlight shortcut
    'Ctrl+Shift+T': 'insertTable',    // Custom table shortcut
    'Ctrl+Alt+L': 'removeLink'        // Custom remove link shortcut
  }
});
```

### Programmatic Access

```javascript
// Get all registered shortcuts
const shortcuts = editor.keyboardHandler.getShortcuts();
console.log(shortcuts);
// [
//   { key: 'Ctrl+B', command: 'bold', description: 'Toggle bold' },
//   { key: 'Ctrl+I', command: 'italic', description: 'Toggle italic' },
//   ...
// ]

// Get shortcuts for a specific command
const boldShortcuts = editor.keyboardHandler.getShortcutsForCommand('bold');
console.log(boldShortcuts); // ['Ctrl+B']

// Check if a shortcut is registered
const hasShortcut = editor.keyboardHandler.hasShortcut('Ctrl+B');
console.log(hasShortcut); // true

// Register a new shortcut
editor.keyboardHandler.register('Ctrl+Shift+S', 'strikethrough', 'Toggle strikethrough');

// Unregister a shortcut
editor.keyboardHandler.unregister('Ctrl+B');

// Temporarily disable shortcuts
editor.keyboardHandler.disable();

// Re-enable shortcuts
editor.keyboardHandler.enable();
```

## Advanced Usage

### Override Default Shortcuts

```javascript
const editor = MaxiEditor.set('#editor', {
  keyboardShortcuts: false, // Disable defaults
  customShortcuts: {
    // Define only the shortcuts you want
    'Ctrl+B': 'bold',
    'Ctrl+I': 'italic'
  }
});

// Then manually initialize with custom shortcuts
editor.keyboardHandler = new KeyboardHandler(editor, {
  'Ctrl+B': 'bold',
  'Ctrl+I': 'italic'
});
```

### Context-Aware Shortcuts

```javascript
// Register a shortcut that checks context
editor.keyboardHandler.register('Ctrl+Enter', 'submitForm', 'Submit form');

editor.registerCommand('submitForm', () => {
  const form = editor.element.closest('form');
  if (form) {
    form.submit();
  }
});
```

### Multiple Shortcuts for Same Command

```javascript
// Both Ctrl+Z and Ctrl+U will undo
editor.keyboardHandler.register('Ctrl+Z', 'undo');
editor.keyboardHandler.register('Ctrl+U', 'undo'); // Alternative
```

## Accessibility

Keyboard shortcuts improve accessibility by allowing users to:
- Navigate and format text without a mouse
- Use screen readers more effectively
- Work faster with familiar shortcuts

### Screen Reader Announcements

When using keyboard shortcuts, the editor maintains focus and announces changes through ARIA attributes on the toolbar buttons.

## Best Practices

1. **Don't Override Browser Shortcuts**
   - Avoid `Ctrl+S` (save), `Ctrl+P` (print), `Ctrl+F` (find)
   - These are reserved by the browser

2. **Use Standard Shortcuts**
   - `Ctrl+B` for bold (not `Ctrl+Shift+B`)
   - `Ctrl+I` for italic
   - `Ctrl+Z` for undo
   - Users expect these conventions

3. **Document Custom Shortcuts**
   - If you add custom shortcuts, document them for users
   - Consider adding a help dialog showing available shortcuts

4. **Test on Multiple Platforms**
   - Test on Windows, Mac, and Linux
   - Ensure `Cmd` works on Mac

## Troubleshooting

### Shortcuts Not Working

1. **Check if shortcuts are enabled:**
   ```javascript
   console.log(editor.config.keyboardShortcuts); // Should not be false
   ```

2. **Check if command exists:**
   ```javascript
   console.log(editor.commandRegistry.has('bold')); // Should be true
   ```

3. **Check browser console for errors**

### Conflicts with Other Libraries

If another library is capturing keyboard events:

```javascript
// Disable other library's shortcuts
otherLibrary.disableShortcuts();

// Or use event.stopPropagation() in your shortcuts
```

### Mac Cmd Key Not Working

The keyboard handler automatically maps `Cmd` to `Ctrl`. If it's not working:

1. Check browser console for errors
2. Ensure you're using the latest version
3. Try using `Ctrl` instead of `Cmd` in configuration

## Examples

### Basic Usage

```javascript
const editor = MaxiEditor.set('#editor', {
  toolbar: ['bold', 'italic', 'underline'],
  // Keyboard shortcuts enabled by default
});

// Use Ctrl+B to toggle bold
// Use Ctrl+I to toggle italic
// Use Ctrl+Z to undo
```

### Custom Shortcuts Only

```javascript
const editor = MaxiEditor.set('#editor', {
  keyboardShortcuts: false,
  customShortcuts: {
    'Alt+B': 'bold',
    'Alt+I': 'italic',
    'Alt+Z': 'undo'
  }
});
```

### Add Shortcuts to Custom Commands

```javascript
const editor = MaxiEditor.set('#editor', {
  customShortcuts: {
    'Ctrl+Shift+C': 'clearFormatting'
  }
});

editor.registerCommand('clearFormatting', () => {
  editor.setContent(editor.element.textContent);
});
```

## Reference

For more information:
- [MaxiEditor Documentation](../README.md)
- [Command API](../README.md#commands)
- [Configuration Options](../README.md#configuration)
