import * as fs from "fs";
import * as vscode from "vscode";
/**
 * Gets the currently selected file in the explorer view
 */
export async function getSelectedFile(): Promise<string | undefined> {
  const originalClipboard = await vscode.env.clipboard.readText();

  await vscode.commands.executeCommand("copyFilePath");
  const newPath = await vscode.env.clipboard.readText();
  if (newPath === originalClipboard) {
    return undefined; // No path was copied
  }
  const path = await vscode.env.clipboard.readText();

  await vscode.env.clipboard.writeText(originalClipboard);
  return path;
}

/**
 * Gets the base directory of a path. If it is a file, it will return the directory of the file.
 * If it is a directory, it will return the directory itself.
 */
export function getBaseDirectory(path: string): string {
  console.log("Debugging path", path);
  const stats = fs.statSync(path);
  return stats.isDirectory() ? path : require("path").dirname(path);
}
