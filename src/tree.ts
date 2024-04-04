export class TreeNode {
  constructor(name: string) {
    this.name = name;
    this.children = [];
  }
  name: string;
  children: TreeNode[];

  addChild(node: TreeNode) {
    this.children.push(node);
  }
}
