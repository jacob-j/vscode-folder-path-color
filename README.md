# vscode-folder-color README

This is the README for the "vscode-folder-color" extension. This extension allows you to color-code folders in Visual Studio Code by specifying paths and colors in your workspace settings.

## Features

This extension provides the ability to customize the appearance of folders in your workspace explorer. You can assign colors and symbols to folders based on their paths, and the assigned color and symbol will be displayed next to the folder name. You can also specify a tooltip for each folder, which will be displayed when you hover over the folder's symbol.

It's important to note that when a file is under source control and there are changes to be committed, Git will overwrite the file's color with its own color scheme. However, the symbol assigned by this extension will remain visible next to the file name. The custom color will still be shown for folders with Git changes.

In the source control tab, custom colors on files won't be visible due to VS Code's design, but the symbol will still be displayed next to the file name, providing a visual cue even in this scenario.

## Requirements

This extension does not have any additional requirements or dependencies.

## Extension Settings

This extension adds the following settings in the `contributes.configuration` section:

- `vscode-folder-color.folders`: An array of objects representing the folders to be colored. Each object can have the following properties:

| Property  | Type   | Description                                                                                    |
| --------- | ------ | ---------------------------------------------------------------------------------------------- |
| `path`    | string | The path of the folder, relative to the workspace.                                             |
| `color`   | string | The color to assign to the folder. This should be one of the predefined color names.           |
| `symbol`  | string | A short symbol to display next to the folder. This should be a string of maximum 2 characters. |
| `tooltip` | string | A tooltip to display when you hover over the folder's symbol.                                  |

Please note that the `color` should be one of the following predefined color names: `lightRed`, `lightBlue`, `lightGreen`, `lightYellow`, `lightCyan`, `lightMagenta`, `lightWhite`, `orange`, `brightBlue`, `brightGreen`, `brightRed`, `pink`, `purple`.

Example configuration:

```json
"vscode-folder-color.folders": [
    { "path": "frontend", "symbol": "SR", "tooltip": "Source files" },
    { "path": "packages/common", "symbol": "T", "tooltip": "Common" }
]
```

**Important note**: Due to limitations of the VS Code API, the extension does not support specifying custom RGB colors. Colors can only be specified as predefined color names which map to theme colors in VS Code.

## Known Issues

There are currently no known issues.

## Release Notes

### 1.0.0

Initial release of the vscode-folder-color extension.

### 1.0.1

Fixed issue with handling of relative paths.

### 1.1.0

Added support for specifying symbols and tooltips for folders.

---

## Following extension guidelines

This extension follows the [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines) provided by Visual Studio Code.

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

- Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
- Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
- Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

- [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
- [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
