import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

export function activate(context: vscode.ExtensionContext) {
  const createDirectoryCommand = vscode.commands.registerCommand(
    "create-python-package.createDirectory",
    async (uri: vscode.Uri) => {
      // Get the selected file in the explorer
      const selectedFile = await getSelectedFile();
      if (!selectedFile) {
        vscode.window.showErrorMessage(
          "No file selected in the explorer view."
        );
        return;
      }

      const baseDirectory = getBaseDirectory(selectedFile);

      const options = ["Directory", "Python Package"];
      const selectedOption = await vscode.window.showQuickPick(options, {
        placeHolder: "Select what to create",
      });

      if (!selectedOption) {
        return; // User cancelled the selection
      }

      // Handle the selected option
      if (selectedOption === "Directory") {
        createDirectory(baseDirectory);
      } else if (selectedOption === "Python Package") {
        createPythonPackage(baseDirectory);
      }
    }
  );

  const createFileCommand = vscode.commands.registerCommand(
    "create-python-package.createFile",
    async (uri: vscode.Uri) => {
      // Get the selected file in the explorer
      const selectedFile = await getSelectedFile();
      if (!selectedFile) {
        vscode.window.showErrorMessage(
          "No file selected in the explorer view."
        );
        return;
      }

      const baseDirectory = getBaseDirectory(selectedFile);

      const options = ["File", "Python File"];
      const selectedOption = await vscode.window.showQuickPick(options, {
        placeHolder: "Select what to create",
      });

      if (!selectedOption) {
        return; // User cancelled the selection
      }

      // Handle the selected option
      if (selectedOption === "File") {
        createFile(baseDirectory);
      } else if (selectedOption === "Python File") {
        createPythonFile(baseDirectory);
      }
    }
  );

  context.subscriptions.push(createDirectoryCommand, createFileCommand);
}

/**
 * Gets the currently selected file in the explorer view
 */
async function getSelectedFile(): Promise<string | undefined> {
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
function getBaseDirectory(path: string): string {
  console.log("Debugging path", path);
  const stats = fs.statSync(path);
  return stats.isDirectory() ? path : require("path").dirname(path);
}

/**
 * Creates a directory at the specified location
 */
function createDirectory(targetDir: string): void {
  vscode.window
    .showInputBox({
      prompt: "Enter the name of the directory",
    })
    .then((fileName) => {
      if (!fileName) {
        return; // User cancelled
      }

      const packageDir = path.join(targetDir, fileName);
      if (!fs.existsSync(packageDir)) {
        fs.mkdirSync(packageDir);
      } else {
        vscode.window.showInformationMessage(
          `Directory already exists at ${packageDir}`
        );
      }
    });
}

/**
 * Creates a Python package at the specified location
 */
function createPythonPackage(targetDir: string): void {
  vscode.window
    .showInputBox({
      prompt: "Enter the name of the Python package",
    })
    .then((fileName) => {
      if (!fileName) {
        return; // User cancelled
      }

      const packageDir = path.join(targetDir, fileName);
      if (!fs.existsSync(packageDir)) {
        fs.mkdirSync(packageDir);
      }
      const initFilePath = path.join(packageDir, "__init__.py");

      if (!fs.existsSync(initFilePath)) {
        fs.writeFileSync(initFilePath, "");
      } else {
        vscode.window.showInformationMessage(
          `Python package already exists at ${packageDir}`
        );
      }
    });
}

/**
 * Creates file at the specified location
 */
function createFile(targetDir: string): void {
  vscode.window
    .showInputBox({
      prompt: "Enter the name of the file",
      placeHolder: "example",
    })
    .then((fileName) => {
      if (!fileName) {
        return; // User cancelled
      }

      const filePath = path.join(targetDir, fileName);

      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, "");

        // Open the newly created file
        vscode.workspace.openTextDocument(filePath).then((doc) => {
          vscode.window.showTextDocument(doc);
        });
      } else {
        vscode.window.showErrorMessage(`File ${filePath} already exists`);
      }
    });
}

/**
 * Creates a Python file at the specified location
 */
function createPythonFile(targetDir: string): void {
  vscode.window
    .showInputBox({
      prompt: "Enter the name of the Python file (without .py extension)",
      placeHolder: "example",
    })
    .then((fileName) => {
      if (!fileName) {
        return; // User cancelled
      }

      const pythonFilename = getPythonFilename(fileName);
      const pythonFilePath = path.join(targetDir, pythonFilename);

      if (!fs.existsSync(pythonFilePath)) {
        fs.writeFileSync(pythonFilePath, "");

        // Open the newly created file
        vscode.workspace.openTextDocument(pythonFilePath).then((doc) => {
          vscode.window.showTextDocument(doc);
        });
      } else {
        vscode.window.showErrorMessage(`File ${pythonFilePath} already exists`);
      }
    });
}

function getPythonFilename(fileName: string): string {
  return fileName.endsWith(".py") ? fileName : `${fileName}.py`;
}

export function deactivate() {}
