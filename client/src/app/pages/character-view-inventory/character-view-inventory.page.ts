import { Component, OnInit } from '@angular/core';
import { ICharacter, Stat } from '../../../../../shared/interfaces';
import { DataService } from '../../services/data.service';
import { ItemService } from '../../services/item.service';

@Component({
  selector: 'app-character-view-inventory',
  templateUrl: './character-view-inventory.page.html',
  styleUrls: ['./character-view-inventory.page.scss'],
})
export class CharacterViewInventoryPage implements OnInit {

  constructor(
    private itemService: ItemService,
    public data: DataService
  ) { }

  ngOnInit() {
  }

  carrying(char: ICharacter): number {
    return char.items.reduce((prev, cur) => prev + this.itemService.load(cur), 0);
  }

  burdened(char: ICharacter): number {
    return 4 + char.stats[Stat.Might];
  }

  max(char: ICharacter): number {
    return this.burdened(char) * 2;
  }

}
