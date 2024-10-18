import {
  SearchAlgorithmBase,
  SetPathState,
  SetNodeState,
} from "../SearchAlgorithmsBase";
import { NodeWithHeuristic } from "../../types/Nodes";
import { Edge } from "../../types/Edge";

class DeadHorseAlgorithm extends SearchAlgorithmBase {
  private openList: string[];
  private closedList: string[];
  private parents: { [key: string]: string };
  private gScores: { [key: string]: number };
  private fScores: { [key: string]: number };
  private deadNodes: Set<string>;
  private deadThresholdMultiplier: number;

  constructor(
    nodes: NodeWithHeuristic[],
    edges: Edge[],
    setPath: SetPathState,
    setStartNode: SetNodeState,
    setGoalNode: SetNodeState,
    delay: number = 500,
    deadThresholdMultiplier: number = 2,
  ) {
    super(nodes, edges, setPath, setStartNode, setGoalNode, delay);
    this.openList = [];
    this.closedList = [];
    this.parents = {};
    this.gScores = {};
    this.fScores = {};
    this.deadNodes = new Set();
    this.deadThresholdMultiplier = deadThresholdMultiplier;
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
        if (
          this.closedList.includes(neighbor) ||
          this.deadNodes.has(neighbor)
        ) {
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

          // DeadHorse specific: Mark nodes as dead if they exceed a threshold
          const deadThreshold = this.calculateDeadThreshold(neighbor);
          if (this.fScores[neighbor] > deadThreshold) {
            this.deadNodes.add(neighbor);
            this.openList = this.openList.filter((node) => node !== neighbor);
            console.log(
              `Node ${neighbor} marked as dead. f-score: ${this.fScores[neighbor]}, threshold: ${deadThreshold}`,
            );
          }
        }
      }
    }

    console.log("No path found");
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

  private calculateDeadThreshold(nodeId: string): number {
    const nodeCost = this.getNodeCost(nodeId);
    const heuristic = this.getHeuristic(nodeId);
    return (nodeCost + heuristic) * this.deadThresholdMultiplier;
  }
}

export default DeadHorseAlgorithm;
