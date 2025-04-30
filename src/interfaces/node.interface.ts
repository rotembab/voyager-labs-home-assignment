export interface INode {
  id: string;

  group: number;
  //for D3 to add position dynamically to the node
  x?: number;
  y?: number;
  //for D3 to add velocity dynamically to the node
  vx?: number;
  vy?: number;
  // assign different colors to different groups
  fx?: number; // Fixed x position for dragging
  fy?: number; // Fixed y position for dragging
}
