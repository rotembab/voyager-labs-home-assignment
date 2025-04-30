import { useEffect, useRef, useState } from 'react';
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
  const simulationRef = useRef<d3.Simulation<INode, ILink> | null>(null);
  const color = d3.scaleOrdinal(d3.schemeCategory10);
  const [selectedNode, setSelectedNode] = useState<INode | null>(null);
  const dragNode = useRef<INode | null>(null);
  const transformRef = useRef(d3.zoomIdentity);
  const nodeRadius = 10;

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

    function ticked() {
      if (!context) return;
      context.save();
      context.clearRect(0, 0, width, height);
      context.translate(transformRef.current.x, transformRef.current.y);
      context.scale(transformRef.current.k, transformRef.current.k);

      // Draw links

      for (const link of links) {
        const src = link.source;
        const tgt = link.target;
        const value = link.value;
        if (isNode(src) && isNode(tgt)) {
          //type guard
          //then freely use src.x and src.y
          context.beginPath(); // Start a new path for each link
          context.strokeStyle = '#999';
          context.lineWidth = value;
          context.moveTo(src.x!, src.y!);
          context.lineTo(tgt.x!, tgt.y!);
          context.stroke(); // Draw the current link
        }
        context.stroke();
      }

      for (const node of nodes) {
        context.beginPath();
        context.arc(node.x!, node.y!, nodeRadius, 0, 2 * Math.PI);
        context.fillStyle = color((node.id ?? '0').toString()) as string;
        context.font = '12px sans-serif';
        context.fillText(node.id, node.x! + 10, node.y! + 10);
        context.fill();
        context.strokeStyle = '#fff';
        context.lineWidth = 1.5;
        context.stroke();
      }
      context.restore();
    }

    function getMouseNode(x: number, y: number) {
      return nodes.find((n) => {
        const dx = n.x! - x;
        const dy = n.y! - y;
        return dx * dx + dy * dy < nodeRadius ** 2;
      });
    }

    function onMouseDown(event: MouseEvent) {
      const [x, y] = transformRef.current.invert([
        event.offsetX,
        event.offsetY,
      ]);
      const node = getMouseNode(x, y);
      if (node) {
        setSelectedNode(node);
        dragNode.current = node;
        node.fx = node.x;
        node.fy = node.y;
        simulation.alphaTarget(0.3).restart();
      }
    }
    function onMouseMove(event: MouseEvent) {
      if (dragNode.current) {
        const [x, y] = transformRef.current.invert([
          event.offsetX,
          event.offsetY,
        ]);
        dragNode.current.fx = x;
        dragNode.current.fy = y;
      }
    }
    function isNode(n: any): n is INode {
      return n && typeof n.x === 'number' && typeof n.y === 'number';
    }

    function onMouseUp() {
      if (dragNode.current) {
        dragNode.current.fx = undefined;
        dragNode.current.fy = undefined;
        simulation.alphaTarget(0);
        dragNode.current = null;
      }
    }
    d3.select(canvas)
      .call(
        d3
          .zoom<HTMLCanvasElement, unknown>()
          .scaleExtent([0.1, 8])
          .on('zoom', (event) => {
            transformRef.current = event.transform;
            ticked();
          })
      )
      .on('mousedown', onMouseDown)
      .on('mousemove', onMouseMove)
      .on('mouseup', onMouseUp);

    return () => {
      simulation.stop();
      d3.select(canvas)
        .on('.zoom', null)
        .on('mousedown', null)
        .on('mousemove', null)
        .on('mouseup', null);
    };
  }, [graphData, width, height]);

  return (
    <div className='container'>
      <canvas width={`${width}px`} height={`${height}px`} ref={canvasRef} />
    </div>
  );
};

export default GraphCanvas;
