import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

import { SHOW_PANEL } from "./commands";
import getNonce from "./getNonce";
import { CSP_SOURCE, NONCE, SCRIPT_SRC, STYLE_SRC } from "./replaceables";

export default function registerDependencyView(
  extensionContext: vscode.ExtensionContext
) {
  const disposable = vscode.commands.registerCommand(SHOW_PANEL, function () {
    const panel = vscode.window.createWebviewPanel(
      "react-dependency-analyzer-center-panel",
      "React dependency analyzer | Dependency view",
      vscode.ViewColumn.One,
      {
        enableScripts: true,
      }
    );

    const panelPath = panel.webview.asWebviewUri(
      vscode.Uri.file(
        path.join(
          extensionContext.extensionPath,
          "src",
          "webview",
          "dependency-view",
          "index.html"
        )
      )
    );

    const stylesPath = panel.webview.asWebviewUri(
      vscode.Uri.file(
        path.join(
          extensionContext.extensionPath,
          "src",
          "web-views",
          "dependency-view",
          "styles.css"
        )
      )
    );

    const initScriptPath = panel.webview.asWebviewUri(
      vscode.Uri.file(
        path.join(
          extensionContext.extensionPath,
          "src",
          "web-views",
          "dependency-view",
          "out",
          "index.js"
        )
      )
    );

    const nonce = getNonce();

    const template = fs
      .readFileSync(panelPath.fsPath, "utf-8")
      .replace(STYLE_SRC, stylesPath.toString())
      .replace(SCRIPT_SRC, initScriptPath.toString())
      .replace(CSP_SOURCE, panel.webview.cspSource)
      .replace(new RegExp(NONCE, "g"), nonce);

    panel.webview.html = template;
  });

  extensionContext.subscriptions.push(disposable);
}
