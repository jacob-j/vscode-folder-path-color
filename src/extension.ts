import * as vscode from 'vscode';
import * as path from 'path';
import { minimatch } from 'minimatch';
import { parseColorToHex } from './colors';

const TOTAL_SLOTS = 256;

interface FolderRule {
  path: string;
  color?: string;
  symbol?: string;
  tooltip?: string;
}

class ColorDecorationProvider implements vscode.FileDecorationProvider {
  private readonly _onDidChangeFileDecorations: vscode.EventEmitter<
    vscode.Uri | vscode.Uri[] | undefined
  > = new vscode.EventEmitter<vscode.Uri | vscode.Uri[] | undefined>();
  public readonly onDidChangeFileDecorations: vscode.Event<
    vscode.Uri | vscode.Uri[] | undefined
  > = this._onDidChangeFileDecorations.event;
  private folders: FolderRule[] = [];

  constructFolders() {
    this.folders = [];
    const config = vscode.workspace.getConfiguration('folder-path-color');
    const configFolders = config.get<FolderRule[]>('folders') || [];

    const workbenchConfig = vscode.workspace.getConfiguration('workbench');

    const rawCustomizations = workbenchConfig.get<Record<string, string>>('colorCustomizations') || {};
    const colorCustomizations = { ... rawCustomizations };

    for (const key of Object.keys(colorCustomizations)) {
      if (key.startsWith('folderPathColor.dynamic')) {
        delete colorCustomizations[key];
      }
    }

    const colorToSlotMap = new Map<string, string>();
    let slotIndex = 0;
    for (const folder of configFolders) {
      let colorSlot: string | undefined = undefined;

      if (folder.color && slotIndex < TOTAL_SLOTS) {
        const hex = parseColorToHex(folder.color)

        if (colorToSlotMap.has(hex)) {
          colorSlot = colorToSlotMap.get(hex)
        }
        else if (slotIndex < TOTAL_SLOTS) {
          colorSlot = `folderPathColor.dynamicSlot${slotIndex}`;
          colorToSlotMap.set(hex, colorSlot);
          colorCustomizations[colorSlot] = hex;
          slotIndex++;
        }
      }

      this.folders.push({
        path: folder.path,
        color: colorSlot,
        symbol: folder.symbol,
        tooltip: folder.tooltip,
      });
    }

    workbenchConfig.update('colorCustomizations', colorCustomizations, vscode.ConfigurationTarget.Workspace);
  }

  constructor() {
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('folder-path-color.folders')) {
        this.constructFolders();
        this._onDidChangeFileDecorations.fire(undefined);
      }
    });
    this.constructFolders();
    this._onDidChangeFileDecorations.fire(undefined);
  }

  provideFileDecoration(
    uri: vscode.Uri,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.FileDecoration> {
    if (vscode.workspace.workspaceFolders) {
      const workspacePaths = vscode.workspace.workspaceFolders.map(
        (folder) => folder.uri.path
      );

      for (const folder of this.folders) {
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
          const decoration = new vscode.FileDecoration(
            folder.symbol,
            folder.tooltip
          );

          if (folder.color) {
            decoration.color = new vscode.ThemeColor(folder.color);
          }

          return decoration;
        }
      }
    }

    return undefined;
  }
}

export function activate(context: vscode.ExtensionContext) {
  const provider = new ColorDecorationProvider();
  context.subscriptions.push(
    vscode.window.registerFileDecorationProvider(provider)
  );
}
