import { Edge } from "../../types/Edge";
import { NodeWithHeuristic } from "../../types/Nodes";
import {
  SearchAlgorithmBase,
  SetNodeState,
  SetPathState,
} from "../SearchAlgorithmsBase";

class AOStarAlgorithm extends SearchAlgorithmBase {
  private openList: string[];
  private closedList: string[];
  private parents: { [key: string]: string };
  private gScores: { [key: string]: number };
  private fScores: { [key: string]: number };

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
    this.gScores = {};
    this.fScores = {};
  }

  async search(start: string, goal: string): Promise<void> {
    this.clearPath();
    this.openList = [start];
    this.gScores[start] = 0;
    this.fScores[start] = this.getHeuristic(start);

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

        const tentativeGScore =
          this.gScores[current] + this.getEdgeCost(current, neighbor);

        if (
          !this.openList.includes(neighbor) ||
          tentativeGScore < this.gScores[neighbor]
        ) {
          this.parents[neighbor] = current;
          this.gScores[neighbor] = tentativeGScore;
          this.fScores[neighbor] =
            this.gScores[neighbor] + this.getHeuristic(neighbor);

          if (!this.openList.includes(neighbor)) {
            this.openList.push(neighbor);
          }
        }
      }
    }
  }

  private getBestNode(): string {
    return this.openList.reduce((a, b) =>
      this.fScores[a] < this.fScores[b] ? a : b,
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

export default AOStarAlgorithm;
