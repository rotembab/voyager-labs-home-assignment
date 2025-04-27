import { ILink } from './link.interface';
import { INode } from './node.interface';

export interface IGraphData {
  nodes: INode[];
  links: ILink[];
}
