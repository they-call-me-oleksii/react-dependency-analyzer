// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as fs from "fs";

import traverse from "@babel/traverse";
import * as babel from "@babel/parser";

import { TreeNode } from "./tree";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "react-dependency-analyzer" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "react-dependency-analyzer.helloWorld",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage(
        "Hello World from react-dependency-analyzer!"
      );
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

async function readFile(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

readFile("filePath")
  .then((fileData) => {
    const ast = babel.parse(fileData, {
      sourceType: "module",
      plugins: ["jsx", "typescript"],
    });

    let root: TreeNode;

    traverse(ast, {
      CallExpression(path) {
        const callee = path.node.callee;

        if (
          callee.type === "Identifier" &&
          ["useEffect", "useCallback", "useMemo"].includes(callee.name)
        ) {
          root = new TreeNode(callee.name);

          const [_, deps] = path.node.arguments;

          if (deps && deps.type === "ArrayExpression") {
            deps.elements.forEach((element) => {
              if (element?.type === "Identifier") {
                const dependencyNode = new TreeNode(element.name);
                root.addChild(dependencyNode);
              }
            });
          }
        }
      },
    });

    if (root === undefined) {
      console.log("No hooks found");
    } else {
      console.log(root);
    }
  })
  .catch((err) => console.log(err));
