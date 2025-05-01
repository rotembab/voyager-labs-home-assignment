import { INode } from './node.interface';

export interface ILink {
  source: string | INode; // The source node of the link, at runtime this will be an INode object
  target: string | INode; // The target node of the link, at runtime this will be an INode object
  value: number; // The value of the link, used for weight or strength
}
