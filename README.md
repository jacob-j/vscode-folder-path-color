# Folder Path Color

This extension allows you to color-code folders and files in Visual Studio Code by specifying paths and colors in your workspace settings. The colors are visible in the Explorer view and in the tabs, unless overridden by the app.

![Screenshot](https://user-images.githubusercontent.com/5649576/243261401-2aa9ba17-c25e-40b0-b478-4da80d6a3b93.png)

## Features

This extension provides the ability to customize the appearance of folders in your workspace explorer. You can assign colors and symbols to folders based on their paths, and the assigned color and symbol will be displayed next to the folder name. You can also specify a tooltip for each folder, which will be displayed when you hover over the folder's symbol.

It's important to note that when a file is under source control and there are changes to be committed, Git will overwrite the file's color with its own color scheme. However, the symbol assigned by this extension will remain visible next to the file name. The custom color will still be shown for folders with Git changes.

In the source control tab, custom colors on files won't be visible due to VS Code's design, but the symbol will still be displayed next to the file name, providing a visual cue even in this scenario.

## Requirements

This extension does not have any additional requirements or dependencies.

## Extension Settings

- `folder-path-color.folders`: An array of objects representing the folders to be colored. Each object can have the following properties:

| Property  | Type   | Description                                                                                                                                       |
| --------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `path`    | string | The path of the folder, relative to the workspace.                                                                                                |
| `color`   | string | The color to assign to the folder. This should be one of the predefined color names.                                                              |
| `symbol`  | string | A short symbol to display next to the folder. This should be a string of maximum 2 characters. You can also use an emoji for more visual display. |
| `tooltip` | string | A tooltip to display when you hover over the folder's symbol.                                                                                     |

Predefined color names: `blue`, `magenta`, `red`, `cyan`, `green`, `yellow`.

Example configuration:

```json
"folder-path-color.folders": [
    { "path": "frontend", "symbol": "SR", "tooltip": "Source files" },
    { "path": "packages/common", "symbol": "T", "tooltip": "Common" }
]
```

**Important note**: Due to limitations of the VS Code API, the extension does not support specifying custom RGB colors. Colors can only be specified as predefined color names which map to theme colors in VS Code.

If you find this extension useful and would like to show your appreciation, you can [Buy me a beer](https://www.buymeacoffee.com/j92v58tyrjT)! Your support is greatly appreciated. Cheers!

## Known Issues

There are currently no known issues.

## Release Notes

### 0.0.1

Initial release of the vscode-folder-color extension.

### 0.0.2

Updated README and added more colors.

---

## Following extension guidelines

This extension follows the [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines) provided by Visual Studio Code.

**Enjoy!**
