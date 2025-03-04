import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { getBaseDirectory, getSelectedFile } from "../utils/file";

export const createDirectoryCommand = vscode.commands.registerCommand(
  "create-python-package.createDirectory",
  async () => {
    // Get the selected file in the explorer
    const selectedFile = await getSelectedFile();
    if (!selectedFile) {
      vscode.window.showErrorMessage("No file selected in the explorer view.");
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
