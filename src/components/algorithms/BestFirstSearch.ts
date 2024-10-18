import {
  SearchAlgorithmBase,
  SetPathState,
  SetNodeState,
} from "../SearchAlgorithmsBase";
import { NodeWithHeuristic } from "../../types/Nodes";
import { Edge } from "../../types/Edge";

class BestFirstSearchAlgorithm extends SearchAlgorithmBase {
  private openList: string[];
  private closedList: string[];
  private parents: { [key: string]: string };

  constructor(
    nodes: NodeWithHeuristic[],
    edges: Edge[],
    setPath: SetPathState,
    setStartNode: SetNodeState,
    setGoalNode: SetNodeState,
    delay: number = 500,
  ) {
    super(nodes, edges, setPath, setStartNode, setGoalNode, delay);
    this.openList = [];
    this.closedList = [];
    this.parents = {};
  }

  async search(start: string, goal: string): Promise<void> {
    this.clearPath();
    this.openList = [start];

    while (this.openList.length > 0) {
      const current = this.getBestNode();
      await this.addToPath(current);

      if (current === goal) {
        await this.reconstructPath(current);
        return;
      }

      this.openList = this.openList.filter((node) => node !== current);
      this.closedList.push(current);

      for (const neighbor of this.getNeighbors(current)) {
        if (this.closedList.includes(neighbor)) {
          continue;
        }

        if (!this.openList.includes(neighbor)) {
          this.parents[neighbor] = current;
          this.openList.push(neighbor);
        }
      }
    }
  }

  private getBestNode(): string {
    return this.openList.reduce((a, b) =>
      this.getHeuristic(a) < this.getHeuristic(b) ? a : b,
    );
  }

  private async reconstructPath(current: string): Promise<void> {
    const totalPath = [current];
    while (this.parents[current]) {
      current = this.parents[current];
      totalPath.unshift(current);
    }
    this.setPath(totalPath);
  }
}

export default BestFirstSearchAlgorithm;
