import React, { useState, useEffect } from "react";
import { GraphCanvas } from "reagraph";
import { NodeWithHeuristic, Node } from "../types/Nodes";
import { SearchAlgorithmBase } from "./SearchAlgorithmsBase";
import { Edge } from "../types/Edge";
import DFS from "./algorithms/DFS";
import BFS from "./algorithms/BFS";
import AStar from "./algorithms/AStar";
import BeamSearch from "./algorithms/BeamSearch";
import { BritishMuseumSearch } from "./algorithms/BMS";
import { HillClimbingSearch } from "./algorithms/HillClimbing";
import { BranchAndBoundSearch } from "./algorithms/BranchNBound";
import { OracleSearch } from "./algorithms/Oracle";
import DeadHorseAlgorithm from "./algorithms/DeadHorse";
import BestFirstSearchAlgorithm from "./algorithms/BestFirstSearch";
import AOStarAlgorithm from "./algorithms/AOStar";

interface SearchVisualizerProps {
  initialNodes: Node[];
  initialEdges: Edge[];
}

const UpdatedGraphCanvas = ({
  nodes,
  edges,
  onCostChange,
  actives,
}: {
  nodes: Node[];
  edges: Edge[];
  onCostChange: (nodeId: string, newCost: number) => void;
  actives: string[];
}) => {
  const contextMenu = ({ data, onClose }: any) => (
    <div className="bg-white w-48 border border-blue-500 rounded p-2 text-center">
      <h1 className="text-lg font-bold mb-2">{data.label}</h1>
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700">Cost:</label>
        <input
          type="number"
          value={data.cost || 0}
          onChange={(e) => onCostChange(data.id, Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <button
        onClick={onClose}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
      >
        Close Menu
      </button>
    </div>
  );

  return (
    <GraphCanvas
      nodes={nodes}
      edges={edges}
      contextMenu={contextMenu}
      actives={actives}
    />
  );
};

const SearchVisualizer: React.FC<SearchVisualizerProps> = ({
  initialNodes,
  initialEdges,
}) => {
  const [nodes, setNodes] = useState<NodeWithHeuristic[]>(
    initialNodes.map((node) => ({
      ...node,
      heuristic: 0,
      cost: 0,
      subLabel: `H: 0, C: 0`,
    })),
  );
  const [edges] = useState<Edge[]>(
    initialEdges.map((edge) => ({ ...edge, cost: 1 })),
  );
  const [path, setPath] = useState<string[]>([]);
  const [startNode, setStartNode] = useState<string>(nodes[0]?.id || "");
  const [goalNode, setGoalNode] = useState<string>(
    nodes[nodes.length - 1]?.id || "",
  );
  const [algorithm, setAlgorithm] = useState<string>("DFS");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [delay, setDelay] = useState<number>(500);
  const [beamWidth, setBeamWidth] = useState<number>(3);

  const informedSearchAlgorithms = [
    "A*",
    "Beam",
    "HillClimbing",
    "AO*",
    "DeadHorse",
    "BestFirstSearch",
    "Oracle",
  ];
  const isInformedSearch = informedSearchAlgorithms.includes(algorithm);

  useEffect(() => {
    if (isInformedSearch) {
      calculateHeuristics();
    }
  }, [isInformedSearch]);

  const calculateHeuristics = () => {
    const nodeLevels = new Map<string, number>();
    const queue: [string, number][] = [[goalNode, 0]];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const [node, level] = queue.shift()!;
      if (!visited.has(node)) {
        visited.add(node);
        nodeLevels.set(node, level);
        const neighbors = edges
          .filter((edge) => edge.target === node)
          .map((edge) => edge.source);
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            queue.push([neighbor, level + 1]);
          }
        }
      }
    }

    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        const heuristic = nodeLevels.get(node.id) || Infinity;
        return {
          ...node,
          heuristic,
          subLabel: `H: ${heuristic}, C: ${node.cost || 0}`,
        };
      }),
    );
  };

  const handleNodeCostChange = (nodeId: string, newCost: number) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              cost: newCost,
              subLabel: `H: ${node.heuristic}, C: ${newCost}`,
            }
          : node,
      ),
    );
  };

  const runSearch = async () => {
    setIsSearching(true);
    let search: SearchAlgorithmBase;
    switch (algorithm) {
      case "DFS":
        search = new DFS(
          nodes,
          edges,
          setPath,
          setStartNode,
          setGoalNode,
          delay,
        );
        break;
      case "BFS":
        search = new BFS(
          nodes,
          edges,
          setPath,
          setStartNode,
          setGoalNode,
          delay,
        );
        break;
      case "A*":
        search = new AStar(
          nodes,
          edges,
          setPath,
          setStartNode,
          setGoalNode,
          delay,
        );
        break;
      case "Beam":
        search = new BeamSearch(
          nodes,
          edges,
          setPath,
          setStartNode,
          setGoalNode,
          delay,
          beamWidth,
        );
        break;
      case "BritishMuseum":
        search = new BritishMuseumSearch(
          nodes,
          edges,
          setPath,
          setStartNode,
          setGoalNode,
          delay,
        );
        break;
      case "HillClimbing":
        search = new HillClimbingSearch(
          nodes,
          edges,
          setPath,
          setStartNode,
          setGoalNode,
          delay,
        );
        break;
      case "BranchAndBound":
        search = new BranchAndBoundSearch(
          nodes,
          edges,
          setPath,
          setStartNode,
          setGoalNode,
          delay,
        );
        break;
      case "Oracle":
        search = new OracleSearch(
          nodes,
          edges,
          setPath,
          setStartNode,
          setGoalNode,
          delay,
        );
        break;
      case "DeadHorse":
        search = new DeadHorseAlgorithm(
          nodes,
          edges,
          setPath,
          setStartNode,
          setGoalNode,
          delay,
        );
        break;
      case "BestFirstSearch":
        search = new BestFirstSearchAlgorithm(
          nodes,
          edges,
          setPath,
          setStartNode,
          setGoalNode,
          delay,
        );
        break;
      case "AO*":
        search = new AOStarAlgorithm(
          nodes,
          edges,
          setPath,
          setStartNode,
          setGoalNode,
          delay,
        );
        break;
      default:
        search = new DFS(
          nodes,
          edges,
          setPath,
          setStartNode,
          setGoalNode,
          delay,
        );
    }
    await search.search(startNode, goalNode);
    setIsSearching(false);
  };

  return (
    <>
      <div className="absolute z-10">
        <div className="font-DMSans text-[#333] p-5 space-x-4">
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            disabled={isSearching}
          >
            <option value="DFS">Depth-First Search</option>
            <option value="BFS">Breadth-First Search</option>
            <option value="A*">A* Search</option>
            <option value="Beam">Beam Search</option>
            <option value="BritishMuseum">British Museum Search</option>
            <option value="HillClimbing">Hill Climbing Search</option>
            <option value="BranchAndBound">Branch and Bound Search</option>
            <option value="Oracle">Oracle Search</option>
            <option value="DeadHorse">Dead Horse Algorithm</option>
            <option value="BestFirstSearch">Best First Search</option>
            <option value="AO*">AO* Search</option>
          </select>
          <select
            value={startNode}
            onChange={(e) => setStartNode(e.target.value)}
            disabled={isSearching}
          >
            {nodes.map((node) => (
              <option key={node.id} value={node.id}>
                Start: {node.label}
              </option>
            ))}
          </select>
          <select
            value={goalNode}
            onChange={(e) => setGoalNode(e.target.value)}
            disabled={isSearching}
          >
            {nodes.map((node) => (
              <option key={node.id} value={node.id}>
                Goal: {node.label}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={delay}
            onChange={(e) => setDelay(Number(e.target.value))}
            min="100"
            max="2000"
            step="100"
            disabled={isSearching}
          />
          {algorithm === "Beam" && (
            <input
              type="number"
              value={beamWidth}
              onChange={(e) => setBeamWidth(Number(e.target.value))}
              min="1"
              max="10"
              step="1"
              disabled={isSearching}
            />
          )}
          <button onClick={runSearch} disabled={isSearching}>
            {isSearching ? "Searching..." : "Run Search"}
          </button>
        </div>
      </div>
      <UpdatedGraphCanvas
        nodes={nodes}
        edges={edges}
        onCostChange={handleNodeCostChange}
        actives={path}
      />
    </>
  );
};

export { SearchVisualizer };
