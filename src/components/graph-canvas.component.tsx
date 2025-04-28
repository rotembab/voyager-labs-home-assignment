import { IGraphData } from '../interfaces/graph-data.interface';

type GraphCanvasProps = {
  graphData: IGraphData;
  width: number;
  height: number;
};

const GraphCanvas = ({}: GraphCanvasProps) => {
  return (
    <div className='container'>
      <canvas />
    </div>
  );
};

export default GraphCanvas;
