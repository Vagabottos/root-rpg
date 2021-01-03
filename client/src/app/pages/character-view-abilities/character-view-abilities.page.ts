import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-character-view-abilities',
  templateUrl: './character-view-abilities.page.html',
  styleUrls: ['./character-view-abilities.page.scss'],
})
export class CharacterViewAbilitiesPage implements OnInit {

  constructor(public data: DataService) { }

  ngOnInit() {
  }

}
