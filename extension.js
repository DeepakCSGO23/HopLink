// @ts-nocheck
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
let out;
function activate(context) {
  out = vscode.window.createOutputChannel("HopLink");
  context.subscriptions.push(out);
  out.appendLine("HopLink activated");

  context.subscriptions.push(
    vscode.languages.registerDefinitionProvider(
      ["typescript", "typescriptreact", "javascript", "javascriptreact"],
      {
        async provideDefinition(doc, pos) {
          const found = findApiCall(doc, pos);

          if (!found) return;

          const target = await findRouteInBackend(found.route);
          if (!target) return;

          return [
            {
              originSelectionRange: found.range,
              targetUri: target.uri,
              targetRange: new vscode.Range(target.position, target.position),
            },
          ];
        },
      },
    ),
  );
}
function findApiCall(doc, pos) {
  const first = Math.max(0, pos.line - 1);
  const last = Math.min(doc.lineCount - 1, pos.line + 1);
  const window = new vscode.Range(first, 0, last, doc.lineAt(last).text.length);
  const text = doc.getText(window);
  const base = doc.offsetAt(window.start);
  const cursor = doc.offsetAt(pos);

  const re = /(?:fetch|\w+\.(?:get|post|put|patch|delete))\(\s*([`'"])(.*?)\1/g;

  let m;
  while ((m = re.exec(text))) {
    const url = m[2];
    // out.appendLine("This is 0: " + m[0]);
    // out.appendLine("This is 1: " + m[1]);
    // out.appendLine("This is 2: " + m[2]);
    // out.appendLine("and index is : " + m.index);
    const urlStart = base + m.index + m[0].length - url.length - 1;
    const urlEnd = urlStart + url.length;
    // out.appendLine("start : " + urlStart);
    // out.appendLine("end : " + urlEnd);
    if (cursor >= urlStart && cursor <= urlEnd) {
      return {
        route: url.replace(/^\$\{[^}]+\}/, "").split("?")[0],
        range: new vscode.Range(
          doc.positionAt(urlStart),
          doc.positionAt(urlEnd),
        ),
      };
    }
  }
}
async function findRouteInBackend(route) {
  const files = await vscode.workspace.findFiles(
    "**/backend/**/*.{go,js,ts,rs,py,java,php,cs,cpp,c,rb}",
    "**/node_modules/**",
  );
  const uri = files.find((f) => f.fsPath.includes("server"));
  if (!uri) return;

  const serverDoc = await vscode.workspace.openTextDocument(uri);
  const name = route.split("/")[1];
  const idx = serverDoc.getText().indexOf(name);

  return { uri, position: serverDoc.positionAt(Math.max(idx, 0)) };
}
// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
