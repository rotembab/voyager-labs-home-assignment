import GraphCanvas from './components/graph-canvas.component';

function App() {
  const graphData = {
    nodes: Array.from({ length: 100 }, (_, i) => ({
      id: (i + 1).toString(),
      group: Math.floor(Math.random() * 5) + 1, // group 1 to 5
    })),
    links: Array.from({ length: 100 }, () => {
      const source = Math.floor(Math.random() * 100) + 1;
      let target = Math.floor(Math.random() * 100) + 1;
      while (target === source) target = Math.floor(Math.random() * 100) + 1;
      return {
        source: source.toString(),
        target: target.toString(),
        value: Math.floor(Math.random() * 5) + 1, // value 1–5
      };
    }),
  };

  return (
    <>
      <GraphCanvas graphData={graphData} width={800} height={600} />
    </>
  );
}

export default App;
