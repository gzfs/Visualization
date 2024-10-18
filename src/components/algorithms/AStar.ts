import { SearchAlgorithmBase } from "../SearchAlgorithmsBase";

export default class AStar extends SearchAlgorithmBase {
  async search(start: string, goal: string): Promise<void> {
    this.clearPath();
    this.setStartNode(start);
    this.setGoalNode(goal);
    const openSet: string[] = [start];
    const cameFrom: Map<string, string> = new Map();
    const gScore: Map<string, number> = new Map([[start, 0]]);
    const fScore: Map<string, number> = new Map([
      [start, this.getHeuristic(start)],
    ]);

    while (openSet.length > 0) {
      const current = this.getLowestFScore(openSet, fScore);
      await this.addToPath(current);

      if (current === goal) return;

      openSet.splice(openSet.indexOf(current), 1);

      for (const neighbor of this.getNeighbors(current)) {
        const tentativeGScore =
          gScore.get(current)! +
          this.getEdgeCost(current, neighbor) +
          this.getNodeCost(neighbor);

        if (!gScore.has(neighbor) || tentativeGScore < gScore.get(neighbor)!) {
          cameFrom.set(neighbor, current);
          gScore.set(neighbor, tentativeGScore);
          fScore.set(neighbor, tentativeGScore + this.getHeuristic(neighbor));
          if (!openSet.includes(neighbor)) {
            openSet.push(neighbor);
          }
        }
      }
    }
  }

  private getLowestFScore(
    openSet: string[],
    fScore: Map<string, number>
  ): string {
    return openSet.reduce((a, b) => (fScore.get(a)! < fScore.get(b)! ? a : b));
  }
}
