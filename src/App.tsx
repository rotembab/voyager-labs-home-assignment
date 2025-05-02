import GraphCanvas from './components/graph-canvas.component';
// d3 example data
import data from './data/data.json';

function App() {
  return (
    <>
      <h1>Force Directed Graph Visualization</h1>
      <GraphCanvas graphData={data} width={800} height={600} />
    </>
  );
}

export default App;
