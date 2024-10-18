import { SearchAlgorithmBase } from "../SearchAlgorithmsBase";

export class BritishMuseumSearch extends SearchAlgorithmBase {
  async search(start: string, goal: string): Promise<void> {
    this.clearPath();
    this.setStartNode(start);
    this.setGoalNode(goal);

    const stack: string[] = [start];
    const visited: Set<string> = new Set();

    while (stack.length > 0) {
      const current = stack.pop()!;

      if (!visited.has(current)) {
        await this.addToPath(current);
        visited.add(current);

        if (current === goal) {
          return;
        }

        const neighbors = this.getNeighbors(current);
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            stack.push(neighbor);
          }
        }
      }
    }
  }
}
