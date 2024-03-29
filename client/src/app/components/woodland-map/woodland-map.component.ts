import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, Output } from '@angular/core';

import * as d3 from 'd3';

import { ICampaign } from '../../../interfaces';

import { ContentService } from '../../services/content.service';
import { GraphCreator } from './woodland-graph-creator';
import { generateLayout } from './woodland-layout-to-graph';

@Component({
  selector: 'app-woodland-map',
  templateUrl: './woodland-map.component.html',
  styleUrls: ['./woodland-map.component.scss'],
})
export class WoodlandMapComponent implements AfterViewInit, OnChanges {

  @Input() campaign: ICampaign;
  @Input() editable: boolean;

  @Output() chooseClearing = new EventEmitter<number>();
  @Output() addEdge = new EventEmitter<{ source: number; target: number }>();
  @Output() removeEdge = new EventEmitter<{ source: number; target: number }>();
  @Output() moveNode = new EventEmitter<{ clearing: number; x: number; y: number }>();
  @Output() addForest = new EventEmitter<{ forest }>();
  @Output() moveForest = new EventEmitter<{ forest: number; x: number; y: number }>();
  @Output() deleteForest = new EventEmitter<{ forest }>();
  @Output() addLake = new EventEmitter<{ lake }>();
  @Output() moveLake = new EventEmitter<{ lake: number; x: number; y: number }>();
  @Output() deleteLake = new EventEmitter<{ lake }>();
  @Output() addLakeEdge = new EventEmitter<{ source: number; target: number }>();
  @Output() removeLakeEdge = new EventEmitter<{ source: number; target: number }>();

  private graph: GraphCreator;

  constructor(
    public contentService: ContentService
  ) { }

  ngAfterViewInit() {
    setTimeout(() => {
      this.loadMap();
    }, 0);
  }

  ngOnChanges() {
    setTimeout(() => {
      this.loadMap();
    }, 0);
  }

  private getWidthHeightOfContainer() {
    const containerEl = document.querySelector('.map-editor');
    const { width, height } = containerEl.getBoundingClientRect();

    return { width, height };
  }

  loadMap() {
    d3.select('.map-editor').selectAll('svg').remove();

    const { width, height } = this.getWidthHeightOfContainer();

    const { nodes, edges } = generateLayout(this.campaign, this.contentService.getAllMapLayouts(), width, height - 20);

    const svg = d3.select('.map-editor').append('svg')
      .attr('class', 'woodland-overview')
      .attr('width', width)
      .attr('height', height);

    const clickNode = (clearing: number) => this.chooseClearing.next(clearing);
    const addEdge = (edge: { source: number; target: number }) => this.addEdge.next(edge);
    const removeEdge = (edge: { source: number; target: number }) => this.removeEdge.next(edge);
    const moveNode = (node: number, { x, y }: { x: number; y: number }) => this.moveNode.next({ clearing: node, x, y });
    const addForest = (forest) => this.addForest.next({ forest });
    const moveForest = (node: number, { x, y }: { x: number; y: number }) => this.moveForest.next({ forest: node, x, y });
    const deleteForest = (forest) => this.deleteForest.next({ forest });
    const addLake = (lake) => this.addLake.next({ lake });
    const moveLake = (node: number, { x, y }: { x: number; y: number }) => this.moveLake.next({ lake: node, x, y });
    const deleteLake = (lake) => this.deleteLake.next({ lake });
    const addLakeEdge = (edge: { source: number; target: number }) => this.addLakeEdge.next(edge);
    const removeLakeEdge = (edge: { source: number; target: number }) => this.removeLakeEdge.next(edge);

    this.graph = new GraphCreator(svg, this.editable, {
      clickNode,
      addEdge,
      removeEdge,
      moveNode,
      addForest,
      moveForest,
      deleteForest,
      addLake,
      moveLake,
      deleteLake,
      addLakeEdge,
      removeLakeEdge
    });

    this.graph.loadGraph(nodes, edges);
  }

}
