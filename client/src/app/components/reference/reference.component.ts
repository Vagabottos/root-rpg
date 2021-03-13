import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { groupBy, sortBy, toPairs } from 'lodash';

import { ContentService } from '../../services/content.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-reference',
  templateUrl: './reference.component.html',
  styleUrls: ['./reference.component.scss'],
})
export class ReferenceComponent implements OnInit {


  public isSearchOpen: boolean;
  public searchQuery: string;

  public activeCategory: string;

  public categories: any[] = [
    {
      header: 'Archetypes',
      categories: this.content.getVagabonds().map(v => ({ header: v, text: this.content.getVagabond(v).description }))
    },
    {
      header: 'Connections',
      categories: this.content.getConnections().map(v => ({ header: v, text: this.content.getConnection(v).text }))
    },
    {
      header: 'Drives',
      categories: this.content.getDrives().map(v => ({ header: v, text: this.content.getDrive(v).text }))
    },
    {
      header: 'Equipment Tags',
      categories: this.content.getTags('default').map(v => ({ header: v, text: this.content.getTag(v).text }))
    },
    {
      header: 'Factions',
      categories: this.content.getFactions().map(v => ({ header: v.name, text: v.text }))
    },
    {
      header: 'Moves (Archetype)',
      categories: toPairs(
        groupBy(
          sortBy(
            this.content.getMoves().map(v => ({ header: v, ...this.content.getMove(v) })),
            ['archetype', 'header']
          ),
          (x => x.archetype)
        )
      )
      .map(([headerKey, children]) => ([
        { header: headerKey, big: true },
        ...children
      ]))
      .flat()
    },
    {
      header: 'Moves (Basic)',
      categories: this.content.getBasicSkills().map(v => ({ header: v, text: this.content.getBasicSkill(v).text }))
    },
    {
      header: 'Moves (Combat)',
      categories: this.content.getCombatSkills().map(v => ({ header: v, text: this.content.getCombatSkill(v).text }))
    },
    {
      header: 'Moves (Reputation)',
      categories: this.content.getReputationMoves().map(v => ({ header: v, ...this.content.getOtherMove(v) }))
    },
    {
      header: 'Moves (Travel)',
      categories: this.content.getTravelMoves().map(v => ({ header: v, ...this.content.getOtherMove(v) }))
    },
    {
      header: 'Moves (Weapon)',
      categories: this.content.getSkills().map(v => ({ header: v, text: this.content.getSkill(v).text }))
    },
    {
      header: 'Natures',
      categories: this.content.getNatures().map(v => ({ header: v, text: this.content.getNature(v).text }))
    },
    {
      header: 'Roguish Feats',
      categories: this.content.getFeats().map(v => ({ header: v, text: this.content.getFeat(v).text }))
    },
    {
      header: 'Roguish Feats Risks',
      categories: this.content.getRisks().map(v => ({ header: v, text: this.content.getRisk(v).text }))
    }
  ];

  constructor(
    private modal: ModalController,
    public data: DataService,
    public content: ContentService
  ) { }

  ngOnInit() {}

  dismiss() {
    this.modal.dismiss();
  }

  setCategory(category: string) {
    this.activeCategory = category;
  }

  public isHeaderVisible(header: string): boolean {
    return !!(this.searchQuery || header === this.activeCategory);
  }

  public isItemVisible({ header, text, archetype }: { header: string; text: string; archetype: string }): boolean {
    if (this.searchQuery) {
      return (text || '').toLowerCase().includes(this.searchQuery.toLowerCase())
          || (header || '').toLowerCase().includes(this.searchQuery.toLowerCase())
          || ((archetype || '').toLowerCase().includes(this.searchQuery.toLowerCase()));
    }

    return true;
  }

  toggleSearch() {
    if (this.isSearchOpen) {
      this.closeSearch();
      return;
    }

    this.openSearch();
  }

  openSearch() {
    this.isSearchOpen = true;
    this.searchQuery = '';
  }

  closeSearch() {
    this.isSearchOpen = false;
    this.searchQuery = '';
  }

  setSearchValue(value: string) {
    this.searchQuery = value;
  }

}
