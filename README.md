# Folder Path Color

This extension allows you to color-code folders and files in Visual Studio Code by specifying paths and colors in your workspace settings. The colors are visible in the Explorer view and in the tabs, unless overridden by the app.

![Screenshot](https://user-images.githubusercontent.com/5649576/243261401-2aa9ba17-c25e-40b0-b478-4da80d6a3b93.png)

Works in search and tabs as well.

<img width="1057" alt="CleanShot 2023-06-05 at 15 43 35@2x" src="https://github.com/jacob-j/vscode-folder-path-color/assets/5649576/45f713a0-f1a1-42d2-bf44-206400ceaa3c">

## Features

This extension provides the ability to customize the appearance of folders in your workspace explorer. You can assign colors and symbols to folders based on their paths, and the assigned color and symbol will be displayed next to the folder name. You can also specify a tooltip for each folder, which will be displayed when you hover over the folder's symbol.

There are 6 slots for custom colors at this time, which you can update with the `workbench.colorCustomizations` user setting.

> [!NOTE]
> It's important to note that when a file is under source control and there are changes to be committed, Git will overwrite the file's color with its own color scheme. However, the symbol assigned by this extension will remain visible next to the file name. The custom color will still be shown for folders with Git changes.

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

- `folderPathColor`: A color object with 6 slots to use for custom HEX codes. Used under the `workbench.colorCustomizations` user setting.

| Property  | Type   | Default based on theme (Dark/Light) |
| --------- | ------ | ----------------------------------- |
| `custom1` | string | `#ABCDEF` / `#123456`               |
| `custom2` | string | `#FEDCBA` / `#654321`               |
| `custom3` | string | `#AADDFF` / `#336699`               |
| `custom4` | string | `#FF99AA` / `#882244`               |
| `custom5` | string | `#AAFF99` / `#448822`               |
| `custom6` | string | `#AA99FF` / `#442288`               |

Example configuration:

```json
"workbench.colorCustomizations": {
    "folderPathColor.custom1": "#FF4488",
    "folderPathColor.custom2": "#88ff44",
    "folderPathColor.custom3": "#4488FF",
},
```

## Following extension guidelines

This extension follows the [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines) provided by Visual Studio Code.

**Enjoy!**
