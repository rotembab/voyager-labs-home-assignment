export interface ILink {
  source: string; // The ID of the link's source node
  target: string; // The ID of the link's target node
  value: number; // The value of the link, used for weight or strength
}
