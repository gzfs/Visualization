import { SearchVisualizer } from "./components/SearchVisualizer";

function App() {
  // Define 15 nodes
  const nodes = [
    { id: "1", label: "A" },
    { id: "2", label: "B" },
    { id: "3", label: "C" },
    { id: "4", label: "D" },
    { id: "5", label: "E" },
    { id: "6", label: "F" },
    { id: "7", label: "G" },
    { id: "8", label: "H" },
    { id: "9", label: "I" },
    { id: "10", label: "J" },
    { id: "11", label: "K" },
    { id: "12", label: "L" },
    { id: "13", label: "M" },
    { id: "14", label: "N" },
    { id: "15", label: "O" },
  ];

  // Define edges to connect the nodes
  const edges = [
    { source: "1", target: "2", id: "1-2", label: "A-B" },
    { source: "1", target: "3", id: "1-3", label: "A-C" },
    { source: "2", target: "4", id: "2-4", label: "B-D" },
    { source: "2", target: "5", id: "2-5", label: "B-E" },
    { source: "3", target: "6", id: "3-6", label: "C-F" },
    { source: "3", target: "7", id: "3-7", label: "C-G" },
    { source: "4", target: "8", id: "4-8", label: "D-H" },
    { source: "5", target: "9", id: "5-9", label: "E-I" },
    { source: "6", target: "10", id: "6-10", label: "F-J" },
    { source: "7", target: "11", id: "7-11", label: "G-K" },
    { source: "8", target: "12", id: "8-12", label: "H-L" },
    { source: "9", target: "12", id: "9-12", label: "I-L" },
    { source: "10", target: "13", id: "10-13", label: "J-M" },
    { source: "11", target: "13", id: "11-13", label: "K-M" },
    { source: "12", target: "14", id: "12-14", label: "L-N" },
    { source: "13", target: "15", id: "13-15", label: "M-O" },
    { source: "14", target: "15", id: "14-15", label: "N-O" },
    { source: "4", target: "7", id: "4-7", label: "D-G" },
    { source: "5", target: "6", id: "5-6", label: "E-F" },
    { source: "8", target: "11", id: "8-11", label: "H-K" },
    { source: "9", target: "10", id: "9-10", label: "I-J" },
  ];

  return <SearchVisualizer initialNodes={nodes} initialEdges={edges} />;
}

export default App;
