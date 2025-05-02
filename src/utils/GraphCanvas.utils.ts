import { INode } from '../interfaces/node.interface';

//Type guard to check if the object is a node
export function isNode(n: any): n is INode {
  return n && typeof n.x === 'number' && typeof n.y === 'number';
}

// Detect if the mouse is over a node, and call the selectNode function appropriately
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
        selectNode(n);
        return true;
      } else {
        selectNode(null);
        return false;
      }
    }) ?? null
  );
}
