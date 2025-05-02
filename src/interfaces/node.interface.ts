export interface INode {
  id: string;

  group: number; //Group nodes together and color them with the same color

  //For D3 to add position dynamically to the node
  x?: number;
  y?: number;

  //For D3 to add velocity dynamically to the node
  vx?: number;
  vy?: number;

  fx?: number; // Fixed x position for dragging
  fy?: number; // Fixed y position for dragging
}
