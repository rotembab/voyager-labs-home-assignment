import GraphCanvas from './components/graph-canvas.component';

function App() {
  return (
    <>
      <GraphCanvas
        graphData={{
          nodes: [
            { id: '1' },
            { id: '2' },
            { id: '3' },
            { id: '4' },
            { id: '5' },
          ],
          links: [
            { source: '1', target: '2' },
            { source: '1', target: '3' },
            { source: '2', target: '4' },
            { source: '3', target: '5' },
            { source: '4', target: '5' },
          ],
        }}
        width={800}
        height={600}
      />
    </>
  );
}

export default App;
