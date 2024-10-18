import { SearchAlgorithmBase } from "../SearchAlgorithmsBase";

export class OracleSearch extends SearchAlgorithmBase {
  async search(start: string, goal: string): Promise<void> {
    this.clearPath();
    this.setStartNode(start);
    this.setGoalNode(goal);

    const path = this.findOptimalPath(start, goal);

    for (const nodeId of path) {
      await this.addToPath(nodeId);
    }
  }

  private findOptimalPath(start: string, goal: string): string[] {
    // In a real Oracle search, this would be an instantaneous, perfect decision.
    // For demonstration purposes, we'll use a simple breadth-first search.
    const queue: { id: string; path: string[] }[] = [
      { id: start, path: [start] },
    ];
    const visited: Set<string> = new Set();

    while (queue.length > 0) {
      const { id: current, path } = queue.shift()!;

      if (current === goal) {
        return path;
      }

      if (!visited.has(current)) {
        visited.add(current);

        const neighbors = this.getNeighbors(current);
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            queue.push({ id: neighbor, path: [...path, neighbor] });
          }
        }
      }
    }

    return []; // No path found
  }
}
