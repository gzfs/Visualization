import { SearchAlgorithmBase } from "../SearchAlgorithmsBase";

export default class DFS extends SearchAlgorithmBase {
  private visited: Set<string> = new Set();

  async search(start: string, goal: string): Promise<void> {
    this.clearPath();
    this.visited.clear();
    this.setStartNode(start);
    this.setGoalNode(goal);
    await this.dfsRecursive(start, goal);
  }

  private async dfsRecursive(current: string, goal: string): Promise<boolean> {
    this.visited.add(current);
    await this.addToPath(current);

    if (current === goal) return true;

    for (const neighbor of this.getNeighbors(current)) {
      if (!this.visited.has(neighbor)) {
        if (await this.dfsRecursive(neighbor, goal)) return true;
      }
    }

    await this.removeFromPath(current);
    return false;
  }
}
