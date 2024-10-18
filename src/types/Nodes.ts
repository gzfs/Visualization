export interface Node {
  id: string;
  label: string;
}

export interface NodeWithHeuristic extends Node {
  heuristic: number;
  cost: number;
}
