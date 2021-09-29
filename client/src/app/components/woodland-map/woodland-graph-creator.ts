
import * as d3 from 'd3';

export interface INode {
  title: string;
  id: string;
  x: number;
  y: number;

  isForest?: boolean;
  isLake?: boolean;
}

export interface IEdge {
  source: INode;
  target: INode;
}

class GraphConstants {
  public static selectedClass = 'selected';
  public static connectClass = 'connect-node';
  public static circleGClass = 'conceptG';
  public static forestGClass = 'conceptG forest';
  public static lakeGClass = 'conceptG lake';
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

  private state: GraphState = new GraphState();
  private nodes: INode[] = [];
  private edges: IEdge[] = [];

  private svgG;
  private paths;
  private circles;

  private drag: d3.drag;
  private dragLine;

  public get graph() {
    return { nodes: this.nodes, edges: this.edges };
  }

  constructor(
    private svg,
    private canEdit: boolean,
    private callbacks: {
      clickNode: (clearing) => void;
      addEdge: (edge) => void;
      removeEdge: (edge) => void;
      moveNode: (node, { x, y }) => void;
      addForest: (node) => void;
      moveForest: (node, { x, y }) => void;
      addLake: (node) => void;
      moveLake: (node, { x, y }) => void;
      addLakeEdge: (edge) => void;
      removeLakeEdge: (edge) => void;
    }
  ) {
    this.init();
  }

  public loadGraph(nodes: INode[], edges: IEdge[]) {
    this.nodes = nodes;
    this.edges = edges;

    this.updateGraph();
  }

  private init() {
    this.initDefs();
    this.initG();
    this.initDrag();
    this.initKeybinds();

    setTimeout(() => {
      this.updateGraph();
    }, 0);
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
    d3.select(window)
      .on('keydown', (event) => {
        this.svgKeyDown(event);
      })
      .on('keyup', (event) => {
        this.svgKeyUp(event);
      });

    this.svg
      .on('mousedown', (event) => {
        this.svgMouseDown();
        if (event.shiftKey) {
          event.stopImmediatePropagation();
        }
      })
      .on('mouseup', (event) => {
        this.svgMouseUp(event);
      });
  }

  private insertTitleLinebreaks(gEl, title = '', subtitle = '') {
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

    const el2 = gEl.append('text')
      .attr('text-anchor', 'middle')
      .attr('font-style', 'italic')
      .attr('font-size', '10px')
      .attr('dy', '-' + (nwords - 1) * 7.5);

    const tspan2 = el2.append('tspan').text(subtitle);
    tspan2.attr('x', 0).attr('dy', '15');
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
      .on('mousedown', (event, d) => {
        this.edgeMouseDown(event, d3.select(event.currentTarget), d);
      })
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
      .on('mouseover', (event, d) => {
        this.state.mouseEnterNode = d;
        if (this.state.shiftNodeDrag) {
          d3.select(event.currentTarget).classed(GraphConstants.connectClass, true);
        }
      })
      .on('mouseout', (event) => {
        this.state.mouseEnterNode = null;
        d3.select(event.currentTarget).classed(GraphConstants.connectClass, false);
      })
      .on('mousedown', (event, d) => {
        this.circleMouseDown(event, d3.select(event.currentTarget), d);
      })
      .call(this.drag)
      .on('click', (event, d) => {
        this.circleMouseUp(event, d3.select(event.currentTarget), d);
      })
      .each((d, i, nodes) => {
        const node = d3.select(nodes[i]);
        node
          .append('circle')
          .attr('r', String(GraphConstants.nodeRadius));

        this.insertTitleLinebreaks(d3.select(nodes[i]), d.title, d.subtitle);

        if (d.isForest) {
          node.classed(GraphConstants.forestGClass, true);
        }

        if (d.isLake) {
          node.classed(GraphConstants.lakeGClass, true);
        }

        // add population indicator
        if (d.population) {
          node
            .append('svg:image')
            .attr('x', -10)
            .attr('y', 20)
            .attr('width', 20)
            .attr('height', 24)
            .attr('xlink:href', (d2) => `assets/map/card-${d2.population}.png`);
        }

        // add faction indicator
        if (d.controller) {
          node
            .append('svg:image')
            .attr('x', -24)
            .attr('y', -40)
            .attr('width', 20)
            .attr('height', 24)
            .attr('xlink:href', (d2) => `assets/map/faction-${d2.controller}.png`);
        }

        // add faction subindicator
        if (d.token) {
          node
            .append('svg:image')
            .attr('x', 4)
            .attr('y', -40)
            .attr('width', 20)
            .attr('height', 24)
            .attr('xlink:href', (d2) => `assets/map/token-${d2.token}.png`);
        }

        // add sympathy subindicator
        if (d.sympathy) {
          node
            .append('svg:image')
            .attr('x', -35)
            .attr('y', 15)
            .attr('width', 20)
            .attr('height', 24)
            .attr('xlink:href', () => `assets/map/token-sympathy.png`);
        }
      });

    this.circles = newGs;
  }

  private initDrag() {
    this.drag = d3.drag()
      .subject((d) => ({ x: d.x, y: d.y }))
      .on('drag', (event, d) => {
        this.state.justDragged = true;
        this.dragMove(event, d);
      })
      .on('end', (event ) => {
        if (this.state.shiftNodeDrag) {
          this.dragEnd(d3.select(event.currentTarget), this.state.mouseEnterNode);
        }
      });
  }

  private dragMove(event, d) {
    if (!this.canEdit) { return; }

    if (this.state.shiftNodeDrag) {
      const [x, y] = d3.pointer(event, this.svgG.node());
      this.dragLine.attr(
        'd',
        'M' + d.x + ',' + d.y + 'L' + x + ',' + y,
      );

    // this moves the circle
    } else {
      const svgWidth = this.svg.node().width.baseVal.value;
      const svgHeight = this.svg.node().height.baseVal.value;

      d.x += event.dx;
      d.y += event.dy;

      const proportionalX = d.x / svgWidth;
      const proportionalY = d.y / svgHeight;

      if (d.isForest) {
        this.callbacks.moveForest(d.id, { x: proportionalX, y: proportionalY });

      } else if (d.isLake) {
        this.callbacks.moveLake(d.id, { x: proportionalX, y: proportionalY });

      } else {
        this.callbacks.moveNode(d.id, { x: proportionalX, y: proportionalY });
      }

      this.updateGraph();
    }
  }

  private dragEnd(d3node, d) {

    // reset the states
    this.state.shiftNodeDrag = false;
    d3node.classed(GraphConstants.connectClass, false);

    const mouseDownNode = this.state.mouseDownNode;
    const mouseEnterNode = this.state.mouseEnterNode;

    if (this.state.justDragged) {
      // dragged, not clicked
      this.state.justDragged = false;
    }

    this.dragLine.classed('hidden', true);

    if (!mouseDownNode || !mouseEnterNode) { return; }

    if (mouseDownNode !== d) {
      // we're in a different node: create new edge for mousedown edge and add to graph
      const newEdge = { source: mouseDownNode, target: d };
      const filtRes = this.paths.filter((dd) => {
        if (dd.source === newEdge.target && dd.target === newEdge.source) {
          this.edges.splice(this.edges.indexOf(dd), 1);
        }

        return d.source === newEdge.source && d.target === newEdge.target;
      });

      const isEitherForest = newEdge.source.id.includes('forest') || newEdge.target.id.includes('forest');
      const isEitherLake = newEdge.source.id.includes('lake') || newEdge.target.id.includes('lake');
      const isBothLake = newEdge.source.id.includes('lake') && newEdge.target.id.includes('lake');

      if ((!filtRes || !filtRes[0] || !filtRes[0].length) && !isEitherForest) {

        if (isBothLake) {
          this.callbacks.addLakeEdge({ source: newEdge.source.id, target: newEdge.target.id });
          this.edges.push(newEdge);
        }

        if (!isEitherLake) {
          this.callbacks.addEdge({ source: newEdge.source.id, target: newEdge.target.id });
          this.edges.push(newEdge);
        }

        this.updateGraph();
      }
    }

    this.state.mouseDownNode = null;
    this.state.mouseEnterNode = null;
  }

  private svgKeyDown(event) {
    if (this.state.lastKeyDown !== -1) { return; }
    this.state.lastKeyDown = event.keyCode;
  }

  private svgKeyUp(event) {
    this.state.lastKeyDown = -1;
  }

  private svgMouseDown() {
    this.state.graphMouseDown = true;
  }

  private svgMouseUp(event) {

    const xycoords = d3.pointer(event, this.svgG.node());
    const svgWidth = this.svg.node().width.baseVal.value;
    const svgHeight = this.svg.node().height.baseVal.value;

    const proportionalX = xycoords[0] / svgWidth;
    const proportionalY = xycoords[1] / svgHeight;

    if (this.state.justScaleTransGraph) {
      // dragged not clicked

      this.state.justScaleTransGraph = false;

    } else if (this.state.shiftNodeDrag) {
      // dragged from node

      this.state.shiftNodeDrag = false;
      this.dragLine.classed('hidden', true);

    } else if (this.state.graphMouseDown && event.altKey) {
      // add a new forest node

      const totalForests = this.nodes.filter(x => x.isForest).length - 1;

      const extraNode = {
        id: `forest-${totalForests + 1}`,
        isForest: true,
        title: 'new forest',
        x: proportionalX,
        y: proportionalY,
      };

      this.nodes.push({ ...extraNode, x: xycoords[0], y: xycoords[1] });
      this.updateGraph();

      this.callbacks.addForest(extraNode);

    } else if (this.state.graphMouseDown && event.shiftKey) {
      // add a new lake node

      const totalLakes = this.nodes.filter(x => x.isLake).length - 1;

      const extraNode = {
        id: `lake-${totalLakes + 1}`,
        isLake: true,
        title: '',
        x: proportionalX,
        y: proportionalY,
      };

      this.nodes.push(extraNode);
      this.updateGraph();

      this.callbacks.addLake(extraNode);
    }

    this.state.graphMouseDown = false;
  }

  private circleMouseDown(event, d3node, d) {
    event.stopPropagation();

    if (!this.canEdit) {
      if (d.isForest || d.isLake) { return; }

      this.callbacks.clickNode(d.id);
      return;
    }

    this.state.mouseDownNode = d;
    if (event.shiftKey) {
      this.state.shiftNodeDrag = event.shiftKey;

      // reposition dragged directed edge
      this.dragLine.classed('hidden', false)
        .attr('d', 'M' + d.x + ',' + d.y + 'L' + d.x + ',' + d.y);
    }
  }

  private circleMouseUp(event, d3node, d) {
    // reset the states
    this.state.shiftNodeDrag = false;
    d3node.classed(GraphConstants.connectClass, false);
  }

  private edgeMouseDown(event, d3node, d) {
    if (!this.canEdit) { return; }
    event.stopPropagation();

    this.edges.splice(this.edges.indexOf(d), 1);
    this.callbacks.removeEdge({ source: d.source.id, target: d.target.id });

    this.updateGraph();
  }

}
