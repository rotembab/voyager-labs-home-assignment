import GraphCanvas from './components/graph-canvas.component';

// d3 example data
import data from './data/data.json';

function App() {
  // Generate random graph data with 100 nodes and 100 links
  // Each node has a group between 1 and 5
  // Each link has a random value between 1 and 10
  // The source and target nodes are randomly selected from the 100 nodes

  // const graphData = {
  //   nodes: Array.from({ length: 100 }, (_, i) => ({
  //     id: (i + 1).toString(),
  //     group: Math.floor(Math.random() * 5) + 1, // group 1 to 5
  //   })),
  //   links: Array.from({ length: 100 }, () => {
  //     const source = Math.floor(Math.random() * 100) + 1;
  //     let target = Math.floor(Math.random() * 100) + 1;
  //     while (target === source) target = Math.floor(Math.random() * 100) + 1;
  //     return {
  //       source: source.toString(),
  //       target: target.toString(),
  //       value: Math.random() * 10 + 1, // random value between 1 and 10
  //     };
  //   }),
  // };

  return (
    <>
      <h1>Force Directed Graph Visualization</h1>
      <GraphCanvas graphData={data} width={800} height={600} />
    </>
  );
}

export default App;
