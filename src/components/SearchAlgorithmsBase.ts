import { Edge } from "../types/Edge";
import { NodeWithHeuristic } from "../types/Nodes";

export type SetPathState = React.Dispatch<React.SetStateAction<string[]>>;
export type SetNodeState = React.Dispatch<React.SetStateAction<string>>;

export abstract class SearchAlgorithmBase {
  protected nodes: NodeWithHeuristic[];
  protected edges: Edge[];
  protected setPath: SetPathState;
  protected setStartNode: SetNodeState;
  protected setGoalNode: SetNodeState;
  protected delay: number;

  constructor(
    nodes: NodeWithHeuristic[],
    edges: Edge[],
    setPath: SetPathState,
    setStartNode: SetNodeState,
    setGoalNode: SetNodeState,
    delay: number = 500
  ) {
    this.nodes = nodes;
    this.edges = edges;
    this.setPath = setPath;
    this.setStartNode = setStartNode;
    this.setGoalNode = setGoalNode;
    this.delay = delay;
  }

  protected async addToPath(nodeId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, this.delay));
    this.setPath((prevPath) => [...prevPath, nodeId]);
  }

  protected async removeFromPath(nodeId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, this.delay));
    this.setPath((prevPath) => prevPath.filter((id) => id !== nodeId));
  }

  protected clearPath(): void {
    this.setPath([]);
  }

  protected getNeighbors(nodeId: string): string[] {
    return this.edges
      .filter((edge) => edge.source === nodeId)
      .map((edge) => edge.target);
  }

  protected getEdgeCost(source: string, target: string): number {
    const edge = this.edges.find(
      (e) => e.source === source && e.target === target
    );
    return edge?.cost || 1;
  }

  protected getHeuristic(nodeId: string): number {
    const node = this.nodes.find((n) => n.id === nodeId);
    return node?.heuristic || 0;
  }

  protected getNodeCost(nodeId: string): number {
    const node = this.nodes.find((n) => n.id === nodeId);
    return node?.cost || 0;
  }

  abstract search(start: string, goal: string): Promise<void>;
}
