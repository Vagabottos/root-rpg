import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';

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
export class WoodlandMapComponent implements AfterViewInit {

  @Input() campaign: ICampaign;
  @Input() editable: boolean;

  @Output() chooseClearing = new EventEmitter<number>();

  private graph: GraphCreator;

  constructor(
    public contentService: ContentService
  ) { }

  ngAfterViewInit() {
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
    const { width, height } = this.getWidthHeightOfContainer();

    const { nodes, edges } = generateLayout(this.campaign, this.contentService.getAllMapLayouts(), width, height);

    const svg = d3.select('.map-editor').append('svg')
      .attr('class', 'woodland-overview')
      .attr('width', width)
      .attr('height', height);

    const chooseClearing = (clearing) => this.chooseClearing.next(clearing);

    this.graph = new GraphCreator(svg, chooseClearing);
    this.graph.loadGraph(nodes, edges);
  }

}
