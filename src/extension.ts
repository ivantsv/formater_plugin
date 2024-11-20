import * as vscode from 'vscode';

// Преобразование из CamelCase в snake_case (для функций)
function convertCamelToSnakeCase(code: string): string {
    return code.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g, (match) => {
        // Преобразуем в snake_case только для функций
        if (match.match(/[A-Z]/)) {
            return match.charAt(0).toLowerCase() + match.slice(1).replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        }
        return match;
    });
}

// Преобразование из snake_case в CamelCase (для функций)
function convertSnakeToCamelCase(code: string): string {
    return code.replace(/\b([a-z_][a-z0-9_]*)\b/g, (match) => {
        // Преобразуем в CamelCase только для функций
        if (match.includes('_')) {
            // Преобразуем первую букву в заглавную, чтобы всегда была в CamelCase
            return match.replace(/(_\w)/g, (letter) => letter[1].toUpperCase()).replace(/^(\w)/, (firstLetter) => firstLetter.toUpperCase());
        }
        return match;
    });
}

// Активируем расширение при вызове команды
export function activate(context: vscode.ExtensionContext) {
    let disposableSnakeToCamel = vscode.commands.registerCommand('extension.convertSnakeToCamel', () => {
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            const document = editor.document;
            const selection = editor.selection;

            const code = document.getText(selection.isEmpty ? undefined : selection);
            const convertedCode = convertSnakeToCamelCase(code);

            editor.edit(editBuilder => {
                const fullRange = new vscode.Range(
                    document.positionAt(0),
                    document.positionAt(document.getText().length)
                );
                editBuilder.replace(fullRange, convertedCode);
            });
        }
    });

    let disposableCamelToSnake = vscode.commands.registerCommand('extension.convertCamelToSnake', () => {
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            const document = editor.document;
            const selection = editor.selection;

            const code = document.getText(selection.isEmpty ? undefined : selection);
            const convertedCode = convertCamelToSnakeCase(code);

            editor.edit(editBuilder => {
                const fullRange = new vscode.Range(
                    document.positionAt(0),
                    document.positionAt(document.getText().length)
                );
                editBuilder.replace(fullRange, convertedCode);
            });
        }
    });

    context.subscriptions.push(disposableSnakeToCamel, disposableCamelToSnake);
}

export function deactivate() {}
