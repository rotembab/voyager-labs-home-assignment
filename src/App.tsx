import GraphCanvas from './components/graph-canvas.component';

function App() {
  return (
    <>
      <GraphCanvas
        graphData={{
          nodes: [
            { id: '1', group: 1 },
            { id: '2', group: 1 },
            { id: '3', group: 1 },
            { id: '4', group: 1 },
            { id: '5', group: 1 },
          ],
          links: [
            { source: '1', target: '2', value: 1 },
            { source: '1', target: '3', value: 1 },
            { source: '2', target: '4', value: 1 },
            { source: '3', target: '5', value: 1 },
            { source: '4', target: '5', value: 1 },
          ],
        }}
        width={800}
        height={600}
      />
    </>
  );
}

export default App;
