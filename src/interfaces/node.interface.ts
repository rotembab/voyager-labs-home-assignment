export interface INode {
  id: string;

  //for D3 to add position dynamically to the node
  x?: number;
  y?: number;
  //for D3 to add velocity dynamically to the node
  vx?: number;
  vy?: number;
}
