const vscode = require("vscode");

function activate(context) {
  var editor = vscode.window.activeTextEditor;

  // Define a decoration type for the first half of each word (bold and colored)
  const colorDecorationType = vscode.window.createTextEditorDecorationType({
    //color: '#fcba03', // Text color for the first half
    fontWeight: "bold",
  });

  // Define a decoration type for the second half of each word (lower opacity)
  const fadedDecorationType = vscode.window.createTextEditorDecorationType({
    //color: '#fcba03CC', // Text color for the second half with reduced opacity
    opacity: "0.5", // Lower opacity for the faded effect
  });

  // Function to apply decorations
  function applyDecorations() {
    if (!editor) return;

    const document = editor.document;
    const fullText = document.getText();

    // Collect ranges for the first and second halves of each word
    const colorRanges = [];
    const fadedRanges = [];
    const wordPattern = /\b\w+\b/g;
    let match;

    while ((match = wordPattern.exec(fullText)) !== null) {
      const start = match.index;
      const end = start + match[0].length;
      const mid = start + Math.ceil(match[0].length / 2); // Midpoint of the word

      // Create ranges for the first half and second half of the word
      colorRanges.push(
        new vscode.Range(document.positionAt(start), document.positionAt(mid))
      );
      fadedRanges.push(
        new vscode.Range(document.positionAt(mid), document.positionAt(end))
      );
    }

    // Apply decorations
    editor.setDecorations(colorDecorationType, colorRanges);
    editor.setDecorations(fadedDecorationType, fadedRanges);
  }

  // Apply decorations when the text changes
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument(applyDecorations)
  );

  // Apply decorations initially
  if (editor) {
    applyDecorations();
  }

  // Update decorations when the active editor changes
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((newEditor) => {
      if (newEditor) {
        editor = newEditor;
        applyDecorations();
      }
    })
  );
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
