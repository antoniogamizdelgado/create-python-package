import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { getBaseDirectory, getSelectedFile } from "../utils/file";

export const createFileCommand = vscode.commands.registerCommand(
  "create-python-package.createFile",
  async () => {
    // Get the selected file in the explorer
    const selectedFile = await getSelectedFile();
    if (!selectedFile) {
      vscode.window.showErrorMessage("No file selected in the explorer view.");
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
