import { use, useEffect, useMemo, useRef, useState } from 'react';
import { IGraphData } from '../interfaces/graph-data.interface';
import * as d3 from 'd3';
import { ILink } from '../interfaces/link.interface';
import { INode } from '../interfaces/node.interface';

type GraphCanvasProps = {
  graphData: IGraphData;
  width: number;
  height: number;
};

const GraphCanvas = ({ width, height, graphData }: GraphCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // const [selectedNode, setSelectedNode] = useState<INode | null>(null);
  const simulationRef = useRef<d3.Simulation<INode, ILink> | null>(null);
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  useEffect(() => {
    //getting the canvas context
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const nodes = graphData.nodes.map((d) => ({ ...d }));
    const links = graphData.links.map((d) => ({ ...d }));

    // create simulation

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        'link',
        d3.forceLink<INode, ILink>(links).id((d) => d.id)
      )
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2))
      .on('tick', ticked);

    simulationRef.current = simulation;

    function ticked() {}
  }, [graphData, width, height]);

  return (
    <div className='container'>
      <canvas width={`${width}px`} height={`${height}px`} ref={canvasRef} />
    </div>
  );
};

export default GraphCanvas;
