
import * as d3 from 'd3';

export interface INode {
  title: string;
  id: number;
  x: number;
  y: number;
}

export interface IEdge {
  source: INode;
  target: INode;
}

class GraphConstants {
  public static selectedClass = 'selected';
  public static connectClass = 'connect-node';
  public static circleGClass = 'conceptG';
  public static graphClass = 'graph';
  public static activeEditId = 'active-editing';
  public static BACKSPACE_KEY = 8;
  public static DELETE_KEY = 46;
  public static ENTER_KEY = 13;
  public static nodeRadius = 50;
}

class GraphState {
  public selectedNode = null;
  public selectedEdge = null;
  public mouseDownNode = null;
  public mouseEnterNode = null;
  public mouseDownLink = null;
  public justDragged = null;
  public justScaleTransGraph = false;
  public lastKeyDown = -1;
  public shiftNodeDrag = false;
  public selectedText = false;
  public graphMouseDown = false;
}

export class GraphCreator {

  private idct = 0;
  private state: GraphState = new GraphState();

  private svgG;
  private dragLine;
  private paths;
  private circles;

  private drag: d3.drag;

  public get graph() {
    return { nodes: this.nodes, edges: this.edges };
  }

  constructor(private svg, private nodes: INode[] = [], private edges: IEdge[] = []) {
    this.init();
  }

  public loadGraph(nodes: INode[], edges: IEdge[]) {
    this.nodes = nodes;
    this.edges = edges;

    this.setIdCt(Math.max(...nodes.map((x) => x.id)) + 1);
    this.updateGraph();
  }

  private init() {
    this.initDefs();
    this.initG();
    this.initKeybinds();
  }

  private initDefs() {
    const defs = this.svg.append('svg:defs');
    defs.append('svg:marker')
      .attr('id', 'end-arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', '32')
      .attr('markerWidth', 3.5)
      .attr('markerHeight', 3.5)
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M0,-5L10,0L0,5');

    // define arrow markers for leading arrow
    defs.append('svg:marker')
      .attr('id', 'mark-end-arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 7)
      .attr('markerWidth', 3.5)
      .attr('markerHeight', 3.5)
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M0,-5L10,0L0,5');
  }

  private initG() {
    this.svgG = this.svg.append('g')
      .classed(GraphConstants.graphClass, true);

    this.dragLine = this.svgG.append('svg:path')
      .attr('class', 'link dragline hidden')
      .attr('d', 'M0,0L0,0');

    this.paths = this.svgG.append('g').selectAll('g');
    this.circles = this.svgG.append('g').selectAll('g');
  }

  private initKeybinds() {

      // listen for resize
    window.onresize = () => {
      this.updateWindow();
    };
  }

  private setIdCt(idct) {
    this.idct = idct;
  }

  private insertTitleLinebreaks(gEl, title = '') {
    const words = title.split(/\s+/g);
    const nwords = words.length;
    const el = gEl.append('text')
      .attr('text-anchor', 'middle')
      .attr('font-size', (d) => {
        const len = d.title.substring(0, d.r / 3).length;
        let size = d.r / 3;
        size *= 7 / len;
        size += 1;
        return Math.round(size) + 'px';
      })
      .attr('dy', '-' + (nwords - 1) * 7.5);

    for (let i = 0; i < words.length; i++) {
      const tspan = el.append('tspan').text(words[i]);
      if (i > 0) {
        tspan.attr('x', 0).attr('dy', '15');
      }
    }
  }

  private updateWindow() {
    const containerEl = document.querySelector('.map-editor');
    const { width, height } = containerEl.getBoundingClientRect();
    this.svg.attr('width', width).attr('height', height);
  }

  private updateGraph() {
    const paths = this.paths.data(this.edges, (d) => String(d.source.id) + '+' + String(d.target.id));

    // update existing paths
    paths
      .classed(GraphConstants.selectedClass, (d) => d === this.state.selectedEdge)
      .attr('d', (d) => 'M' + d.source.x + ',' + d.source.y + 'L' + d.target.x  + ',' + d.target.y);

    // remove old links
    paths.exit().remove();

    // add new paths
    const newPaths = paths
      .enter()
      .append('path')
      .classed('link', true)
      .attr('d', (d) => 'M' + d.source.x + ',' + d.source.y + 'L' + d.target.x  + ',' + d.target.y)
      .merge(paths);

    this.paths = newPaths;

    // update existing nodes
    const circles = this.circles.data(this.nodes, (d) => d.id);

    // remove old nodes
    this.svg.selectAll('.conceptG circle').remove();
    this.svg.selectAll('.conceptG text').remove();
    this.svg.selectAll('.conceptG image').remove();

    // add new nodes
    const newGs = circles
      .attr('transform', (d) => 'translate(' + d.x + ',' + d.y + ')')
      .enter()
      .append('g')
      .merge(circles);

    newGs
      .classed(GraphConstants.circleGClass, true)
      .attr('transform', (d) => 'translate(' + d.x + ',' + d.y + ')')
      .each((d, i, nodes) => {
        const node = d3.select(nodes[i]);
        node
          .append('circle')
          .attr('r', String(GraphConstants.nodeRadius));

        this.insertTitleLinebreaks(d3.select(nodes[i]), d.title);
      });

    this.circles = newGs;
  }

}
