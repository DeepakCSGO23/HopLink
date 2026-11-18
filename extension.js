// @ts-nocheck
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
// let out;
let cachedFiles;
const watcher = vscode.workspace.createFileSystemWatcher(
  "**/backend/**/*.{go,js,ts,rs,py,java,php,cs,cpp,c,rb}",
);
watcher.onDidCreate(() => (cachedFiles = undefined));
watcher.onDidDelete(() => (cachedFiles = undefined));

function activate(context) {
  // channel created after activation
  // out = vscode.window.createOutputChannel("HopLink");
  // context.subscriptions.push(out);
  context.subscriptions.push(
    vscode.languages.registerDefinitionProvider(
      ["typescript", "typescriptreact", "javascript", "javascriptreact"],
      {
        async provideDefinition(doc, pos, token) {
          const found = findApiCall(doc, pos);

          if (!found) return;

          const target = await findRouteInBackend(found.route);
          if (!target || token.isCancellationRequested) return;

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
    const urlStart = base + m.index + m[0].length - url.length - 1;
    const urlEnd = urlStart + url.length;
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
  cachedFiles ??= await vscode.workspace.findFiles(
    "**/backend/**/*.{go,js,ts,rs,py,java,php,cs,cpp,c,rb}",
    "**/node_modules/**",
  );
  const files = cachedFiles;
  const uri = files.find((f) => {
    const path = f.fsPath;
    // out.appendLine(path);
    const p = path.split("\\");
    const lastSegment = p.at(p.length - 1);
    return (
      lastSegment.includes("server") ||
      lastSegment.includes("main") ||
      lastSegment.includes("index") ||
      lastSegment.includes("app")
    );
  });
  if (!uri) return;
  const serverDoc = await vscode.workspace.openTextDocument(uri);
  const text = serverDoc.getText();

  let idx = text.indexOf(route);
  if (idx === -1) {
    idx = text.indexOf(route.split("/").filter(Boolean).pop());
  }
  return { uri, position: serverDoc.positionAt(Math.max(idx, 0)) };
}
// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
