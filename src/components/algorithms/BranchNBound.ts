import { SearchAlgorithmBase } from "../SearchAlgorithmsBase";

interface Node {
  id: string;
  cost: number;
  path: string[];
}

export class BranchAndBoundSearch extends SearchAlgorithmBase {
  async search(start: string, goal: string): Promise<void> {
    this.clearPath();
    this.setStartNode(start);
    this.setGoalNode(goal);

    const queue: Node[] = [{ id: start, cost: 0, path: [start] }];
    const visited: Set<string> = new Set();

    while (queue.length > 0) {
      queue.sort((a, b) => a.cost - b.cost);
      const { id: current, path } = queue.shift()!;

      if (!visited.has(current)) {
        await this.addToPath(current);
        visited.add(current);

        if (current === goal) {
          this.setPath(path);
          return;
        }

        const neighbors = this.getNeighbors(current);
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            const newCost =
              this.getNodeCost(current) + this.getEdgeCost(current, neighbor);
            queue.push({
              id: neighbor,
              cost: newCost,
              path: [...path, neighbor],
            });
          }
        }
      }
    }
  }
}
