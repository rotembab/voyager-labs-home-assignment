import GraphCanvas from './components/graph-canvas.component';

function App() {
  return (
    <>
      <GraphCanvas
        graphData={{
          nodes: [],
          links: [],
        }}
        width={800}
        height={600}
      />
    </>
  );
}

export default App;
