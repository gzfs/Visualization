import { SearchAlgorithmBase } from "../SearchAlgorithmsBase";

export default class BFS extends SearchAlgorithmBase {
  async search(start: string, goal: string): Promise<void> {
    this.clearPath();
    this.setStartNode(start);
    this.setGoalNode(goal);
    const queue: string[] = [start];
    const visited: Set<string> = new Set([start]);

    while (queue.length > 0) {
      const current = queue.shift()!;
      await this.addToPath(current);

      if (current === goal) return;

      for (const neighbor of this.getNeighbors(current)) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
  }
}
