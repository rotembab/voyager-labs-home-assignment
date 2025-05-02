import { useEffect, useMemo, useRef, useState } from 'react';
import { IGraphData } from '../interfaces/graph-data.interface';
import * as d3 from 'd3';
import { ILink } from '../interfaces/link.interface';
import { INode } from '../interfaces/node.interface';
import { getMouseNode, isNode } from '../utils/GraphCanvas.utils';

type GraphCanvasProps = {
  graphData: IGraphData;
  width: number; //In pixels
  height: number; //In pixels
};

const GraphCanvas = ({ width, height, graphData }: GraphCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simulationRef = useRef<d3.Simulation<INode, ILink> | null>(null); // For remembering the simulation between ticks
  const [selectedNode, setSelectedNode] = useState<INode | null>(null); //For reactive display of selected node
  const selectedNodeRef = useRef<INode | null>(null); //For remembering the selected node between ticks
  const dragNode = useRef<INode | null>(null); //For remembering the dragged node between ticks
  const transformRef = useRef(d3.zoomIdentity); //For remembering the zoom / pan  transform between ticks
  const nodeRadius = 5;

  /*
   * Copying the nodes and links from the graphData to avoid mutating the original data,
   * plus using memoization to avoid unnecessary re-calculations
   */
  const nodes = useMemo(
    () => graphData.nodes.map((d) => ({ ...d })),
    [graphData]
  );
  const links = useMemo(
    () => graphData.links.map((d) => ({ ...d })),
    [graphData]
  );

  /* Using useEffect to run the simulation and draw the graph after the component mounts
   *   (guaranteed access to the canvas)
   */

  useEffect(() => {
    //Getting the canvas context
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    //Setting color pallette
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Creating the simulation

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        'link',
        d3.forceLink<INode, ILink>(links).id((d) => d.id)
      )
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2))
      .on('tick', ticked);

    //Saving the simulation to the ref
    simulationRef.current = simulation;

    //The tick function is called on every tick of the simulation

    let ticking = false;

    function ticked(): void {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          /*
           * This is a throttling technique to avoid too many redraws.
           * It will only redraw when the browser is ready to do so.
           */

          draw();
          ticking = false;
        });
      }
    }
    //Helper function to select a node
    function selectNode(node: INode | null): void {
      selectedNodeRef.current = node;
      setSelectedNode(node);
    }

    //The actual drawing function
    function draw(): void {
      if (!context) return;
      context.save();

      //Initializing the canvas for drawing
      context.clearRect(0, 0, width, height); // Clear the canvas
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
          context.strokeStyle = '#99999960';
          context.lineWidth = Math.sqrt(value);
          context.moveTo(src.x!, src.y!);
          context.lineTo(tgt.x!, tgt.y!);
          context.stroke(); // Draw the current link
        }
        context.stroke();
      }

      // Draw nodes
      for (const node of nodes) {
        const isSelected = selectedNodeRef.current?.id === node.id;
        context.beginPath();
        context.arc(node.x!, node.y!, nodeRadius, 0, 2 * Math.PI);
        context.fillStyle = color(node.group.toString());
        context.fill();
        context.strokeStyle = isSelected ? 'yellow' : '#fff';
        context.lineWidth = isSelected ? 3 : 1.5;
        context.stroke();
      }
      context.restore();
    }

    //Setting up the event listeners for Drag, Zoom and Pan.
    d3.select(canvas)
      .call(
        d3
          .drag<HTMLCanvasElement, unknown>()
          .subject(function (
            event: d3.D3DragEvent<HTMLCanvasElement, unknown, unknown>
          ) {
            const [x, y] = transformRef.current.invert(
              d3.pointer(event.sourceEvent, canvas)
            );
            return getMouseNode(x, y, selectNode, nodes, nodeRadius) || null;
          })
          .on('start', (event) => {
            const [x, y] = transformRef.current.invert(
              d3.pointer(event.sourceEvent, canvas)
            );
            const node = getMouseNode(x, y, selectNode, nodes, nodeRadius);
            if (node) {
              dragNode.current = node;
              selectNode(node);
              node.fx = x;
              node.fy = y;
              simulationRef.current?.alphaTarget(0.3).restart();
            }
          })
          .on('drag', (event: any) => {
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
          .on('zoom', (event: d3.D3ZoomEvent<HTMLCanvasElement, unknown>) => {
            transformRef.current = event.transform;
            ticked(); // redraw with updated zoom
          })
      );

    //Cleaning up the event listeners when the component unmounts
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
