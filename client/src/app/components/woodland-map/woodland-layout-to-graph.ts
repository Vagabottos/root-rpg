
import { IEdge, INode } from './woodland-graph-creator';
import { ICampaign, IContentMapLayout } from '../../../interfaces';

export interface IGraphResult {
  nodes: INode[];
  edges: IEdge[];
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function generateLayout(campaign: ICampaign, mapLayouts: Record<string, IContentMapLayout>, width: number, height: number): IGraphResult {

  const nodes = [];

  const layout = mapLayouts[campaign.mapGen.layout];

  const flipX = campaign.mapGen.flipY;
  const flipY = campaign.mapGen.flipX;

  layout.nodePositions.forEach((pos, i) => {

    let clearingPos = {
      x: (flipX ? layout.maxX - pos.x : pos.x) * (width / layout.maxX),
      y: (flipY ? layout.maxY - pos.y : pos.y) * (height / layout.maxY)
    };

    if (campaign.clearings[i].position) {
      const { x, y } = campaign.clearings[i].position;
      clearingPos = {
        x: width * x,
        y: height * y
      };
    }

    nodes.push({
      id: i,
      r: 50,
      title: campaign.clearings[i].name,
      subtitle: campaign.clearings[i].status,
      x: clearingPos.x,
      y: clearingPos.y,
    });
  });

  const oneWayEdges = {};
  campaign.clearings.forEach((c, i) => {
    c.landscape.clearingConnections.forEach(conn => {
      if (oneWayEdges[`${i}-${conn}`]) { return; }
      oneWayEdges[`${conn}-${i}`] = true;
    });
  });

  const edges = Object.keys(oneWayEdges)
    .map((key) => ({ source: nodes[+key.split('-')[0]], target: nodes[+key.split('-')[1]] }));

  return { nodes, edges };
}
