import { useMemo, useRef } from 'react';
import { IGraphData } from '../interfaces/graph-data.interface';
import * as d3 from 'd3';

interface CustomNodeDatum extends d3.SimulationNodeDatum {
  id: string;
}

type GraphCanvasProps = {
  graphData: IGraphData;
  width: number;
  height: number;
};

const GraphCanvas = ({ width, height, graphData }: GraphCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContext = useMemo(
    () => canvasRef.current?.getContext('2d'),
    [canvasRef.current]
  );
  const color = d3.scaleOrdinal(d3.schemeCategory10);
  //create copies
  const links = graphData.links.map((d) => ({ ...d }));
  const nodes = graphData.nodes.map((d) => ({ ...d }));
  //create simulation
  // const simulation = d3
  //   .forceSimulation(nodes)
  //   .force(
  //     'link',
  //     d3.forceLink(links).id((d) => d.id)
  //   )
  //   .force('charge', d3.forceManyBody())
  //   .force('center', d3.forceCenter(width / 2, height / 2))
  //   .on('tick', ticked);

  return (
    <div className='container'>
      <canvas width={`${width}px`} height={`${height}px`} ref={canvasRef} />
    </div>
  );
};

export default GraphCanvas;
