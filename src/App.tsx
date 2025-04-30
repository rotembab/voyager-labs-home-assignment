import GraphCanvas from './components/graph-canvas.component';

function App() {
  return (
    <>
      <GraphCanvas
        graphData={{
          nodes: [{ id: '1' }, { id: '2' }, { id: '3' }],
          links: [
            { source: '1', target: '2', value: 1 },
            { source: '2', target: '3', value: 1 },
            { source: '3', target: '1', value: 1 },
          ],
        }}
        width={800}
        height={600}
      />
    </>
  );
}

export default App;
