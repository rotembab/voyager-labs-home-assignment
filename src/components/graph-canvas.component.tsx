import { useMemo, useRef } from 'react';
import { IGraphData } from '../interfaces/graph-data.interface';

type GraphCanvasProps = {
  graphData: IGraphData;
  width: number;
  height: number;
};

const GraphCanvas = ({ width, height }: GraphCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContext = useMemo(
    () => canvasRef.current?.getContext('2d'),
    [canvasRef.current]
  );

  return (
    <div className='container'>
      <canvas width={`${width}px`} height={`${height}px`} ref={canvasRef} />
    </div>
  );
};

export default GraphCanvas;
