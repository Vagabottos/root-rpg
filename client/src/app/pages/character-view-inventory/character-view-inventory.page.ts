import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-character-view-inventory',
  templateUrl: './character-view-inventory.page.html',
  styleUrls: ['./character-view-inventory.page.scss'],
})
export class CharacterViewInventoryPage implements OnInit {

  constructor(public data: DataService) { }

  ngOnInit() {
  }

}
