import { SearchAlgorithmBase } from "../SearchAlgorithmsBase";

export class HillClimbingSearch extends SearchAlgorithmBase {
  async search(start: string, goal: string): Promise<void> {
    this.clearPath();
    this.setStartNode(start);
    this.setGoalNode(goal);

    let current = start;
    let currentHeuristic = this.getHeuristic(current);
    await this.addToPath(current);

    while (current !== goal) {
      const neighbors = this.getNeighbors(current);
      let bestNeighbor = current;
      let bestHeuristic = currentHeuristic;

      for (const neighbor of neighbors) {
        const neighborHeuristic = this.getHeuristic(neighbor);
        if (neighborHeuristic < bestHeuristic) {
          bestNeighbor = neighbor;
          bestHeuristic = neighborHeuristic;
        }
      }

      if (bestNeighbor === current) {
        // Local maximum reached
        console.log("Local maximum reached at node:", current);
        break;
      }

      current = bestNeighbor;
      currentHeuristic = bestHeuristic;
      await this.addToPath(current);

      // Add a small delay to visualize the search process
      await new Promise((resolve) => setTimeout(resolve, this.delay));
    }

    if (current === goal) {
      console.log("Goal reached!");
    } else {
      console.log("Search terminated without reaching the goal.");
    }
  }

  public getHeuristic(node: string): number {
    const nodeObj = this.nodes.find((n) => n.id === node);
    return nodeObj ? nodeObj.heuristic : Infinity;
  }

  public getNeighbors(node: string): string[] {
    return this.edges
      .filter((edge) => edge.source === node)
      .map((edge) => edge.target);
  }
}
