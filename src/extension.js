"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vscode = require("vscode");

// this method is called when vs code is activated
function activate(context) {
    const configuration = vscode.workspace.getConfiguration('code-eol')
    const defaultValues = {
        newlineColor    : '#9e9e9e', // gray
        returnColor     : '#9e9e9e',
        crlfColor       : '#9e9e9e',
        newlineCharacter: '↓',
        returnCharacter : '←',
        crlfCharacter   : '↵',
    }
    // set color and characters at start
    const newline_color   = configuration.newlineColor     ? configuration.newlineColor     : defaultValues.newlineColor
    const return_color    = configuration.returnColor      ? configuration.returnColor      : defaultValues.returnColor
    const crlf_color      = configuration.crlfColor        ? configuration.crlfColor        : defaultValues.crlfColor
    const newline_char    = configuration.newlineCharacter ? configuration.newlineCharacter : defaultValues.newlineCharacter
    const return_char     = configuration.returnCharacter  ? configuration.returnCharacter  : defaultValues.returnCharacter
    const crlf_char       = configuration.crlfCharacter    ? configuration.crlfCharacter    : defaultValues.crlfCharacter
    // init some vars outside of updateDecorations for efficiency
    const render_newline = { after: { contentText: newline_char, color: newline_color   } }
    const render_return  = { after: { contentText: return_char, color : return_color    } }
    const render_crlf    = { after: { contentText: crlf_char, color   : crlf_color      } }
    const render_blank   = { after: { contentText: '', color          : newline_color   } }
    var match
    var the_render_option
    const regEx = /(\r(?!\n))|(\r?\n)/g
    // create a decorator type that we use to decorate small numbers
    var nullDecoration = vscode.window.createTextEditorDecorationType({});
    var activeEditor = vscode.window.activeTextEditor;

    function updateDecorations(editor) {
        // if there is a new editor, then update activeEditor
        if (editor) { activeEditor = editor }
        // if somehow there is no active editor, then just return
        if (!activeEditor) {return}
        
        const document = activeEditor.document
        var text = document.getText()
        var newLines = []
        // loop through every newline
        while ((match = regEx.exec(text))) {
            switch (match[0]) {
                case '\n': the_render_option = render_newline; break
                case '\r\n': the_render_option = render_crlf; break
                case '\r': the_render_option = render_return; break
                default: the_render_option = render_blank; break
            }
            var startPos = document.positionAt(match.index)
            var decoration = {
                // just use startPos twice since it really doesnt matter
                range: new vscode.Range(startPos, startPos),
                renderOptions: the_render_option
            }
            newLines.push(decoration)
        }
        activeEditor.setDecorations(nullDecoration, newLines)
    }
    
    // if there is an active editor then go ahead an updateDecorations
    if (activeEditor) { updateDecorations() }
    // updateDecorations whenever the doc changes
    vscode.workspace.onDidChangeTextDocument(updateDecorations, null, context.subscriptions)
    // when the editor changes, updateDecorations
    vscode.window.onDidChangeActiveTextEditor(updateDecorations, null, context.subscriptions)
}
exports.activate = activate
//# sourceMappingURL=extension.js.map
