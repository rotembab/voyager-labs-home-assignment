import { INode } from '../interfaces/node.interface';

export function isNode(n: any): n is INode {
  return n && typeof n.x === 'number' && typeof n.y === 'number';
}

export function getMouseNode(
  x: number,
  y: number,
  selectNode: (value: INode | null) => void,
  nodes: INode[],
  nodeRadius: number
): INode | null {
  return (
    nodes.find((n) => {
      const dx = n.x! - x;
      const dy = n.y! - y;
      if (dx * dx + dy * dy < nodeRadius ** 2) {
        return true;
      } else {
        selectNode(null);
        return false;
      }
    }) ?? null
  );
}
