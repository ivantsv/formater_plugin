"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
// Преобразование из CamelCase в snake_case (для функций)
function convertCamelToSnakeCase(code) {
    return code.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g, (match) => {
        // Преобразуем в snake_case только для функций
        if (match.match(/[A-Z]/)) {
            return match.charAt(0).toLowerCase() + match.slice(1).replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        }
        return match;
    });
}
// Преобразование из snake_case в CamelCase (для функций)
function convertSnakeToCamelCase(code) {
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
function activate(context) {
    let disposableSnakeToCamel = vscode.commands.registerCommand('extension.convertSnakeToCamel', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const selection = editor.selection;
            const code = document.getText(selection.isEmpty ? undefined : selection);
            const convertedCode = convertSnakeToCamelCase(code);
            editor.edit(editBuilder => {
                const fullRange = new vscode.Range(document.positionAt(0), document.positionAt(document.getText().length));
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
                const fullRange = new vscode.Range(document.positionAt(0), document.positionAt(document.getText().length));
                editBuilder.replace(fullRange, convertedCode);
            });
        }
    });
    context.subscriptions.push(disposableSnakeToCamel, disposableCamelToSnake);
}
function deactivate() { }
