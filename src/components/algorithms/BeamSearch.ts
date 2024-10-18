import { Edge } from "../../types/Edge";
import { NodeWithHeuristic } from "../../types/Nodes";
import {
  SearchAlgorithmBase,
  SetNodeState,
  SetPathState,
} from "../SearchAlgorithmsBase";

export default class BeamSearch extends SearchAlgorithmBase {
  private beamWidth: number;

  constructor(
    nodes: NodeWithHeuristic[],
    edges: Edge[],
    setPath: SetPathState,
    setStartNode: SetNodeState,
    setGoalNode: SetNodeState,
    delay: number,
    beamWidth: number
  ) {
    super(nodes, edges, setPath, setStartNode, setGoalNode, delay);
    this.beamWidth = beamWidth;
  }

  async search(start: string, goal: string): Promise<void> {
    this.clearPath();
    this.setStartNode(start);
    this.setGoalNode(goal);
    let beam: string[] = [start];

    while (beam.length > 0) {
      const candidates: [string, number][] = [];

      for (const node of beam) {
        await this.addToPath(node);
        if (node === goal) return;

        for (const neighbor of this.getNeighbors(node)) {
          candidates.push([
            neighbor,
            this.getHeuristic(neighbor) + this.getNodeCost(neighbor),
          ]);
        }
      }

      beam = candidates
        .sort((a, b) => a[1] - b[1])
        .slice(0, this.beamWidth)
        .map(([node, _]) => node);
    }
  }
}
