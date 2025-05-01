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
  const [selectedNode, setSelectedNode] = useState<INode | null>(null); //for reactive state and display
  const selectedNodeRef = useRef<INode | null>(null); //for remembering the selected node
  const dragNode = useRef<INode | null>(null);
  const transformRef = useRef(d3.zoomIdentity);
  const nodeRadius = 5;

  useEffect(() => {
    //getting the canvas context
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;
    const color = d3.scaleOrdinal(d3.schemeCategory10);
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
          context.lineWidth = Math.sqrt(value);
          context.moveTo(src.x!, src.y!);
          context.lineTo(tgt.x!, tgt.y!);
          context.stroke(); // Draw the current link
        }
        context.stroke();
      }

      for (const node of nodes) {
        context.beginPath();
        context.arc(node.x!, node.y!, nodeRadius, 0, 2 * Math.PI);
        context.fillStyle = color(node.group.toString());
        context.fill();
        context.strokeStyle =
          selectedNodeRef.current?.id === node.id ? 'yellow' : '#fff';
        context.lineWidth = selectedNodeRef.current?.id === node.id ? 3 : 1.5;
        context.stroke();
      }
      context.restore();
    }

    function getMouseNode(x: number, y: number) {
      return nodes.find((n) => {
        const dx = n.x! - x;
        const dy = n.y! - y;
        if (dx * dx + dy * dy < nodeRadius ** 2) {
          return true;
        } else {
          selectedNodeRef.current = null;
          setSelectedNode(null);
          return false;
        }
      });
    }

    function isNode(n: any): n is INode {
      return n && typeof n.x === 'number' && typeof n.y === 'number';
    }

    d3.select(canvas)
      .call(
        d3
          .drag<HTMLCanvasElement, unknown>()
          .subject(function (event) {
            const [x, y] = transformRef.current.invert(
              d3.pointer(event.sourceEvent, canvas)
            );
            return getMouseNode(x, y) || null;
          })
          .on('start', (event) => {
            const [x, y] = transformRef.current.invert(
              d3.pointer(event.sourceEvent, canvas)
            );
            const node = getMouseNode(x, y);
            if (node) {
              dragNode.current = node;
              setSelectedNode(node);
              selectedNodeRef.current = node;
              node.fx = x;
              node.fy = y;
              simulationRef.current?.alphaTarget(0.3).restart();
            }
          })
          .on('drag', (event) => {
            if (dragNode.current) {
              const [x, y] = transformRef.current.invert(
                d3.pointer(event.sourceEvent, canvas)
              );
              dragNode.current.fx = x;
              dragNode.current.fy = y;
            }
          })
          .on('end', () => {
            if (dragNode.current) {
              dragNode.current.fx = undefined;
              dragNode.current.fy = undefined;
              simulationRef.current?.alphaTarget(0);
              dragNode.current = null;
            }
          })
      )
      .call(
        d3
          .zoom<HTMLCanvasElement, unknown>()
          .scaleExtent([0.1, 8])
          .on('zoom', (event) => {
            transformRef.current = event.transform;
            ticked(); // redraw with updated zoom
          })
      );

    return () => {
      simulation.stop();
      d3.select(canvas);
      d3.select(canvas).on('zoom', null).on('drag', null);
    };
  }, [graphData, width, height]);

  return (
    <div className='container'>
      <canvas width={`${width}px`} height={`${height}px`} ref={canvasRef} />
      <div className='info'>
        {selectedNode && 'Selected Node ' + selectedNode?.id}
      </div>
    </div>
  );
};

export default GraphCanvas;
