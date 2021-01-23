import { AfterViewInit, Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import * as d3 from 'd3';

import { ICampaign } from '../../../interfaces';

import { ContentService } from '../../services/content.service';
import { GraphCreator } from './woodland-graph-creator';
import { generateLayout } from './woodland-layout-to-graph';

@Component({
  selector: 'app-woodland-overview',
  templateUrl: './woodland-overview.component.html',
  styleUrls: ['./woodland-overview.component.scss'],
})
export class WoodlandOverviewComponent implements AfterViewInit {

  @Input() campaign: ICampaign;

  private graph: GraphCreator;

  constructor(
    private modal: ModalController,
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

    this.graph = new GraphCreator(svg);
    this.graph.loadGraph(nodes, edges);
  }

  dismiss() {
    this.modal.dismiss();
  }

}
