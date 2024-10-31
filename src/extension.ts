
import * as vscode from 'vscode';


export function activate(context: vscode.ExtensionContext)
{
	let command_convert = vscode.commands
		.registerCommand('extension.convertAsciiToHex', () =>
	{
		let editor = vscode.window.activeTextEditor;

		if (editor)
		{
			let document = editor.document;
			let selection = editor.selection;

			// Get the word within the selection
			let ascii = document.getText(selection);
			let hex = asciiToHex(ascii);
			editor.edit(editBuilder => {
				editBuilder.replace(selection, hex);
			}).then(r => {});
		}
	});

	let command_deconvert = vscode.commands
		.registerCommand('extension.convertHexToAscii', () =>
	{
		let editor = vscode.window.activeTextEditor;

		if (editor) {
			let document = editor.document;
			let selection = editor.selection;

			let hex = document.getText(selection);
			if (hex.length > 0) {
				let ascii = hexToAscii(hex);
				if (ascii.length === 0) {
					vscode.window.showErrorMessage('неправильный hex.');
				}
				else {
					editor.edit(editBuilder => {
						editBuilder.replace(selection, ascii);
					}).then(r => {});
				}
			}
		}
	});

	context.subscriptions.push(command_convert);
	context.subscriptions.push(command_deconvert);
}

export function deactivate() {}

function asciiToHex(ascii: string): string {
	let hex = '';
	for (let i = 0; i < ascii.length; i++) {
		let tmp = "00" + ascii.charCodeAt(i).toString(16);
		hex += tmp.substr(tmp.length - 2).toUpperCase();
		// tmp.slice(tmp.length - 2, tmp.length).toUpperCase();
	}

	return hex;
}

function isCorrectHexStr(str: string): boolean {
	const regExp = /([0-9A-Fa-f]{2}[\s]*)+/;
	return regExp.test(str);

}

// Convert input hex string to ascii string
function hexToAscii(hex: string): string {
	let ascii = '';

	if (!isCorrectHexStr(hex)) {
		return '';
	}

	for (let i = 0; i < hex.length; i += 2) {
		while (hex.charAt(i) === " " || hex.charAt(i) === "\t" || hex.charAt(i) === "\r" || hex.charAt(i) === "\n") {
			ascii += hex.charAt(i);
			i += 1;
		}
		const subStr = hex.substr(i, 2).trim();
		// tmp.slice(tmp.length - 2, tmp.length).toUpperCase();

		if (subStr.length === 0) {
			break;
		}

		if (subStr.length !== 2) {
			return '';
		}

		const regExp = /[0-9A-Fa-f]{2}/;
		if (!regExp.test(subStr)) {
			return '';
		}

		const parsed = parseInt(subStr, 16);
		ascii += String.fromCharCode(parsed);
	}

	return ascii;
}