import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	const disposable = vscode.commands.registerCommand('create-python-package.createPackage', async () => {
		const options = ["Option 1", "Option 2", "Option 3"];

		const selected = await vscode.window.showQuickPick(options, {
		  placeHolder: "Select an option...",
		});
	
		if (selected) {
		  vscode.window.showInformationMessage(`You selected: ${selected}`);
		}
	});

	context.subscriptions.push(disposable);
}


export function deactivate() {}
