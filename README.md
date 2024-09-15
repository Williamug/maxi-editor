![GitHub Tag](https://img.shields.io/github/v/tag/williamug/maxi-editor)
[![made-with-javascript](https://img.shields.io/badge/Made%20with-JavaScript-1f425f.svg)](https://www.javascript.com)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/williamug/maxi-editor)
[![JSDelivr CDN](https://data.jsdelivr.com/v1/package/gh/<USERNAME>/<REPOSITORY>/badge?style=rounded)](https://www.jsdelivr.com/package/gh/williamug/maxi-editor)
[![Github all releases](https://img.shields.io/github/downloads/williamug/maxi-editor/total.svg)](https://GitHub.com/williamug/maxi-editor/releases/)
![GitHub License](https://img.shields.io/github/license/williamug/maxi-editor)

# MaxiEditor Documentation

<img title="MaxiEditor" alt="MaxiEditor" src="/images/maxieditor.png">

## 1. Introduction
### 1.1. Overview
MaxiEditor is a free, open source, lightweight, customizable rich text editor designed for easy integration with web projects. It offers essential text editing features with a flexible toolbar, user-configurable size, and plugin architecture for extended functionality.

### 1.2. Features
- **Rich Text Formatting:** Bold, italic, underline, strikethrough, and more.
- **Text Alignment:** Left, center, right justification.
- **List Management:** Unordered and ordered lists.
- **Customizable Toolbar:** Add or remove tools as needed.
- **Plugin Support:** Extend functionality with custom plugins.
- **Dynamic Height and Width:** Configure editor dimensions programmatically.

### 1.3. Use Cases
- **Blog Platforms:** Use as a blog post editor with formatting options.
- **Web Applications:** Include in applications requiring rich text input.


## 2. Getting Started

### 2.1. Installation

#### CDN
To use MaxiEditor via CDN, include the following in your HTML:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/maxi-editor@1.0/dist/maxi-editor.min.css">
<script src="https://cdn.jsdelivr.net/npm/maxi-editor@1.0/dist/maxi-editor.min.js"></script>
```

#### NPM
Install MaxiEditor using npm:

```bash
npm install maxi-editor
```

#### Direct Download
Download the latest version from the [releases page](https://github.com/Williamug/maxi-editor/releases) and include the files manually in your project.


### 2.2. Basic Usage

Initialize MaxiEditor in your JavaScript code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MaxiEditor Example</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/maxi-editor@1.0/dist/maxi-editor.min.css">
</head>
<body>
    <div id="editor" class="maxi-editor"></div>

    <script src="https://cdn.jsdelivr.net/npm/maxi-editor@1.0/dist/maxi-editor.min.js"></script>

    <script>
        const editor = MaxiEditor.set('#editor', {
            toolbar: [
                'bold', 'italic', 'underline', 'justifyLeft', 
                'justifyCenter', 'justifyRight', 'insertUnorderedList', 
                'insertOrderedList', 'indent', 'undo', 'redo'
            ],
            height: '500px',
            plugins: [InsertLinkPlugin],
        });
    </script>
</body>
</html>
```

## 3. Configuration

### 3.1. Options

#### Toolbar Configuration
You can customize the toolbar by passing an array of tool names to the toolbar configuration option. The available tools include:
- ```bold```
- ```italic```
- ```underline```
- ```strikethrough```(through the strikethrough plugin)
- ```highlight``` (through the highlight plugin)
- ```heading```
- ```font```
- ```justifyLeft```
- ```justifyCenter```
- ```justifyRight```
- ```insertUnorderedList```
- ```insertOrderedList```
- ```indent```
- ```undo```
- ```redo```


The code below demonstrates how to configure the toolbar:
```js
const editor = MaxiEditor.create('#editor', {
    toolbar: ['bold', 'italic', 'underline'],
    height: '500px'
});
```


#### Editor Height and Width
Set the editor dimensions:

```js
height: '500px',
width: '800px',
```
or
```js
editor.setHieght('500px');
editor.setWidth('800px');
```

#### Plugins
Include and configure plugins. After installing the plugin, you should include it in the toolbar array to enable it on the toolbar.

```js
const editor = MaxiEditor.create('#editor', {
    toolbar: ['bold', 'italic', 'underline', 'highlight', 'strikethrough'],
    plugins: [HighlightPlugin, StrikeThroughPlugin]
});
```

### 3.2. Example Configuration

```js
const editor = MaxiEditor.create('#editor', {
    toolbar: ['bold', 'italic', 'underline', 'highlight', 'strikethrough'],
    height: '400px',
    width: '600px',
    plugins: [HighlightPlugin, StrikeThroughPlugin]
});
```

## 4. Commands

### 4.1. Built-in Commands

#### List of Commands
- **bold:** Apply bold formatting.
- **italic:** Apply italic formatting.
- **underline:** Apply underline formatting.
- **heading:** Apply heading formatting.
- **font:** Apply font formatting.
- **justifyLeft:** Apply left justification.
- **justifyCenter:** Apply center justification.
- **justifyRight:** Apply right justification.
- **insertUnorderedList:** Insert an unordered list.
- **insertOrderedList:** Insert an ordered list.
- **indent:** Indent selected text.
- **undo:** Undo the last action.
- **redo:** Redo the last undone action.


#### Usage Example

```js
editor.executeCommand('bold');
```

### 4.2. Custom Commands

#### Adding Commands

```js
editor.registerCommand('myCustomCommand', () => {
    console.log('Custom command executed');
});
editor.executeCommand('myCustomCommand');
```

## 5. Plugins

### 5.1. Built-in Plugins
- `Highlight Plugin`
- `StrikeThrough`
- `TextColorPlugin`
- `LinkPlugin`
- `RemoveLinkPlugin`
- `BackgroundColorPlugin`
- `SubscriptPlugin`
- `SuperscriptPlugin`
- `mageURLPlugin`
- `BlockquotePlugin`
- `CodeBlockPlugin`
- `ClearFormattingPlugin`
- `TablePlugin`
- `ImageUploadPlugin`

<!-- ```js
class HighlightPlugin {
    static init(editor) {
        editor.registerCommand('highlight', () => {
            const color = prompt("Enter highlight color (e.g., yellow)");
            document.execCommand('hiliteColor', false, color);
        });
    }
}
```

```js
class StrikeThrough {
    static init(editor) {
        editor.registerCommand('strikethrough', () => {
            document.execCommand('strikeThrough', false, null);
        });
    }
}
```

```js
class TextColorPlugin {
    static init(editor) {
        editor.registerCommand('text-color', () => {
            const color = prompt("Enter text color (e.g., #ff0000 or red)");
            document.execCommand('foreColor', false, color);
        });
    }
}
```

```js
class LinkPlugin {
    static init(editor) {
        editor.registerCommand('insert-link', () => {
            const url = prompt("Enter URL");
            if (url) {
                document.execCommand('createLink', false, url);
            }
        });
    }
}
```

```js
class RemoveLinkPlugin {
    static init(editor) {
        editor.registerCommand('remove-link', () => {
            document.execCommand('unlink', false, null);
        });
    }
}
```

```js
class BackgroundColorPlugin {
    static init(editor) {
        editor.registerCommand('background-color', () => {
            const color = prompt("Enter background color (e.g., #ffff00 or yellow)");
            document.execCommand('hiliteColor', false, color);
        });
    }
}
```

```js
class SubscriptPlugin {
    static init(editor) {
        editor.registerCommand('subscript', () => document.execCommand('subscript', false, null));
    }
}
```

```js
class SuperscriptPlugin {
    static init(editor) {
        editor.registerCommand('superscript', () => document.execCommand('superscript', false, null));
    }
}
```

```js
class ImageURLPlugin {
    static init(editor) {
        editor.registerCommand('insert-image', () => {
            const url = prompt("Enter image URL");
            document.execCommand('insertImage', false, url);
        });
    }
}
```

```js
class BlockquotePlugin {
    static init(editor) {
        editor.registerCommand('blockquote', () => {
            document.execCommand('formatBlock', false, 'blockquote');
        });
    }
}
```

```js
class CodeBlockPlugin {
    static init(editor) {
        editor.registerCommand('code-block', () => {
            const code = prompt("Enter your code");
            const preElement = document.createElement('pre');
            const codeElement = document.createElement('code');
            codeElement.innerText = code;
            preElement.appendChild(codeElement);
            document.execCommand('insertHTML', false, preElement.outerHTML);
        });
    }
}
```

```js
class ClearFormattingPlugin {
    static init(editor) {
        editor.registerCommand('clear-formatting', () => {
            document.execCommand('removeFormat', false, null);
        });
    }
}
```

```js
class TablePlugin {
    static init(editor) {
        editor.registerCommand('insert-table', () => {
            const rows = prompt("Enter the number of rows");
            const cols = prompt("Enter the number of columns");
            let table = "<table border='1'>";

            for (let i = 0; i < rows; i++) {
                table += "<tr>";
                for (let j = 0; j < cols; j++) {
                    table += "<td>&nbsp;</td>";
                }
                table += "</tr>";
            }
            table += "</table>";
            document.execCommand('insertHTML', false, table);
        });
    }
}
```

```js
class ImageUploadPlugin {
    static init(editor) {
        editor.registerCommand('upload-image', () => {
            // Create an input element for uploading an image
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = function () {
                const file = input.files[0];

                if (file) {
                    const reader = new FileReader();
                    reader.onload = function (event) {
                        const base64Image = event.target.result;
                        // Insert the image into the editor as a base64 string
                        document.execCommand('insertImage', false, base64Image);
                    };
                    reader.readAsDataURL(file);
                }
            };
            input.click();
        });
    }
}
``` -->

### 5.2. Creating Plugins

#### Plugin API

Create custom plugins to extend functionality:

```js
class MyCustomPlugin {
    static init(editor) {
        editor.registerCommand('myCustomCommand', () => {
            // Custom command logic here
        });
    }
}
```

## 6. Advanced Usage

### 6.1. Custom Styling

#### CSS Customization

Override default styles by adding custom CSS:

```css
.maxi-editor {
    border: 1px solid #ccc;
    border-radius: 4px;
}
.maxi-toolbar {
    background: #f4f4f4;
}
```

### 6.2. Event Handling

#### Handling Events

Listen to events emitted by the editor:

```js
editor.element.addEventListener('contentChanged', () => {
    console.log('Content has been changed');
});
```

## 7. API Reference

### 7.1. Methods

#### **1. `create`**
```js
MaxiEditor.create(element, config)
```
- **element**: The HTML element where the editor is initialized.
- **config**: The configuration object containing the editor options such as `toolbar`, `height`, `width`, and `plugins`.

#### **2. `includeBootstrapIcons`**
```js
includeBootstrapIcons()
```
- Injects the Bootstrap Icons stylesheet into the document if not already included.

#### **3. `createToolPanel`**
```js
createToolPanel()
```
- Dynamically creates the toolbar above the editor, allowing users to apply various text formatting options.

#### **4. `registerCoreCommands`**
```js
registerCoreCommands()
```
- Registers a set of core commands (bold, italic, underline, justification, etc.) for text formatting.

#### **5. `registerCommand`**
```js
registerCommand(commandName, commandFn)
```
- Registers a custom command by providing a command name and the associated function.

#### **6. `executeCommand`**
```js
executeCommand(commandName, value = null)
```
- Executes a registered command by passing the command name and an optional value.

#### **7. `trackSelection`**
```js
trackSelection()
```
- Tracks selection changes and updates the toolbar state accordingly.

#### **8. `getContent`**
```js
getContent()
```
- Returns the current HTML content of the editor.

#### **9. `setContent`**
```js
setContent(content)
```
- Sets the HTML content of the editor.

#### **10. `setHeight`**
```js
setHeight(height)
```
- Sets the height of the editor dynamically.

#### **11. `setWidth`**
```js
setWidth(width)
```
- Sets the width of the editor dynamically.

### 7.2. Properties

#### `element`
The DOM element used as the editor.

#### `config`
Configuration options for the editor.

## 8. Troubleshooting

### 8.1. Common Issues

#### Issue: Toolbar Buttons Not Visible
- **Solution:** Ensure that the correct CSS file is included and check for conflicting styles.

#### Issue: Commands Not Working
- **Solution:** Verify that the commands are registered correctly and the editor is properly initialized.

### 8.2. Debugging

#### Tips
- **Check Console:** Look for errors or warnings in the browser console.
- **Inspect Elements:** Use browser developer tools to inspect the editor elements and styles.

## 9. Examples and Demos

### 9.1. Code Examples

#### Basic Example
View a live demo of MaxiEditor in action on [CodePen](https://codepen.io/your-repo/maxi-editor).

## 10. Contributing

### 10.1. How to Contribute

#### Guidelines
If you'd like to contribute to MaxiEditor, you can:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit and push your changes.
5. Open a Pull Request.

### 10.2. Reporting Issues

#### Bug Reports
Submit issues on the [GitHub Issues page](https://github.com/your-repo/maxi-editor/issues).

## 11. Future Enhancements
- Additional built-in commands 
- More customizable toolbar 
- Support for custom toolbar layouts
- Plugin API improvements

## 12. Licensing

MaxiEditor is licensed under the [MIT License](https://opensource.org/licenses/MIT). See the [LICENSE](/LICENSE) file for more details.




