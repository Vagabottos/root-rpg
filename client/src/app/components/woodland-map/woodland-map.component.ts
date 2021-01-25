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

    const chooseClearing = (clearing: number) => this.chooseClearing.next(clearing);
    const addEdge = (edge: { source: number; target: number }) => this.addEdge.next(edge);
    const removeEdge = (edge: { source: number; target: number }) => this.removeEdge.next(edge);

    this.graph = new GraphCreator(svg, this.editable, {
      clickNode: chooseClearing,
      addEdge,
      removeEdge
    });

    this.graph.loadGraph(nodes, edges);
  }

}
