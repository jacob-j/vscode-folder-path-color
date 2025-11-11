import * as vscode from 'vscode';
import * as path from 'path';
import { minimatch } from 'minimatch';

const colorMap: Record<string, string> = {
  blue: 'terminal.ansiBlue',
  magenta: 'terminal.ansiBrightMagenta',
  red: 'terminal.ansiBrightRed',
  cyan: 'terminal.ansiBrightCyan',
  green: 'terminal.ansiBrightGreen',
  yellow: 'terminal.ansiBrightYellow',
	custom1: 'folderPathColor.custom1',
	custom2: 'folderPathColor.custom2',
	custom3: 'folderPathColor.custom3',
	custom4: 'folderPathColor.custom4',
	custom5: 'folderPathColor.custom5',
	custom6: 'folderPathColor.custom6',
};

class ColorDecorationProvider implements vscode.FileDecorationProvider {
  private readonly _onDidChangeFileDecorations: vscode.EventEmitter<
    vscode.Uri | vscode.Uri[] | undefined
  > = new vscode.EventEmitter<vscode.Uri | vscode.Uri[] | undefined>();
  public readonly onDidChangeFileDecorations: vscode.Event<
    vscode.Uri | vscode.Uri[] | undefined
  > = this._onDidChangeFileDecorations.event;
  private folders: {
    path: string;
    color: string;
    symbol?: string;
    tooltip?: string;
  }[] = [];

  constructFolders() {
    this.folders = [];
    const config = vscode.workspace.getConfiguration('folder-path-color');
    const folders: {
      path: string;
      color?: string;
      symbol?: string;
      tooltip?: string;
    }[] = config.get('folders') || [];
    const colors = Object.keys(colorMap).filter(
      (color) => !folders.find((folder) => folder.color === color)
    );
    let i = 0;
    for (const folder of folders) {
      if (!Object.keys(colorMap)[i]) {
        i = 0;
      }
      this.folders.push({
        path: folder.path,
        color: folder.color || colors[i] || Object.keys(colorMap)[i],
        symbol: folder.symbol,
        tooltip: folder.tooltip,
      });
      i++;
    }
  }

  constructor() {
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('folder-path-color.folders')) {
        this.constructFolders();
        this._onDidChangeFileDecorations.fire(undefined);
      }
    });
    this.constructFolders();
  }

  provideFileDecoration(
    uri: vscode.Uri,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.FileDecoration> {
    if (vscode.workspace.workspaceFolders) {
      const workspacePaths = vscode.workspace.workspaceFolders.map(
        (folder) => folder.uri.path
      );

      let i = 0;
      for (const folder of this.folders) {
        let colorId = colorMap[folder.color];

        const pathIsInConfig = workspacePaths.some((root) => {
          const normalizedUriPath = uri.path.replace(/\\/g, '/');
          const fullPath = path.join(root, folder.path).replace(/\\/g, '/');
          
          // Check if the path contains glob patterns
          const hasGlob = /[\*\?\[\]]/.test(folder.path);
          
          if (hasGlob) {
            // For glob patterns, match against the relative path from workspace root
            const relativePath = path.relative(root, uri.fsPath).replace(/\\/g, '/');
            return minimatch(relativePath, folder.path, { matchBase: true });
          }
          
          // For backward compatibility, check if the path is included
          return normalizedUriPath.includes(fullPath);
        });

        if (pathIsInConfig) {
          return new vscode.FileDecoration(
            folder.symbol,
            folder.tooltip,
            new vscode.ThemeColor(colorId)
          );
        }
        i++;
      }
    }

    return undefined;
  }
}

export function activate(context: vscode.ExtensionContext) {
  const provider = new ColorDecorationProvider();

  const getContrastColor = (hex: string): string => {
    const r = Number.parseInt(hex.substr(1, 2), 16);
    const g = Number.parseInt(hex.substr(3, 2), 16);
    const b = Number.parseInt(hex.substr(5, 2), 16);

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? "#000000" : "#FFFFFF";
  }

  const applyTitleBarColor = (color: string | undefined) => {
    const config = vscode.workspace.getConfiguration("workbench");
    const current = config.get<any>("colorCustomizations") || {};

    const updates = { ...current };

    if (color) {
      const foreground = color ? getContrastColor(color) : undefined;

      updates["titleBar.activeBackground"] = color;
      updates["titleBar.inactiveBackground"] = color;
      updates["titleBar.activeForeground"] = foreground;
      updates["titleBar.inactiveForeground"] = foreground ? "#CCCCCC" : undefined;
    } else {
      delete updates["titleBar.activeBackground"];
      delete updates["titleBar.inactiveBackground"];
      delete updates["titleBar.activeForeground"];
      delete updates["titleBar.inactiveForeground"];
    }

    config.update(
      "colorCustomizations",
      updates,
      vscode.ConfigurationTarget.Global
    );
  };

  const updateTitleBarColorForUri = (uri?: vscode.Uri) => {
    if (!uri) {
      applyTitleBarColor(undefined);
      return;
    }

    const filePath = uri.fsPath.replace(/\\/g, "/");
    const workspacePaths = vscode.workspace.workspaceFolders?.map(
      (f) => f.uri.fsPath.replace(/\\/g, "/")
    ) || [];

    for (const folder of provider["folders"]) {
      const colorId = colorMap[folder.color];

      const pathIsInConfig = workspacePaths.some((root) => {
        const relativePath = path.relative(root, filePath).replace(/\\/g, "/");
        return minimatch(relativePath, folder.path, { matchBase: true });
      });

      if (pathIsInConfig) {
        const hex =
          vscode.workspace
            .getConfiguration("workbench")
            .get<any>("colorCustomizations")?.[colorId] || undefined;

        applyTitleBarColor(hex);
        return;
      }
    }

    // no match → reset
    applyTitleBarColor(undefined);
  };

  context.subscriptions.push(
    vscode.window.registerFileDecorationProvider(provider),
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      updateTitleBarColorForUri(editor?.document.uri);
    }),
    vscode.window.onDidChangeVisibleTextEditors(() => {
      const active = vscode.window.activeTextEditor;
      updateTitleBarColorForUri(active?.document.uri);
    })
  );

  const activeUri = vscode.window.activeTextEditor?.document.uri;
  updateTitleBarColorForUri(activeUri);
}
