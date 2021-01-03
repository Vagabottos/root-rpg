import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ICharacter } from '../../../interfaces';
import { CharacterAPIService } from '../../services/character.api.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-character-view',
  templateUrl: './character-view.page.html',
  styleUrls: ['./character-view.page.scss'],
})
export class CharacterViewPage implements OnInit {

  public character: ICharacter;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private characterAPI: CharacterAPIService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    this.characterAPI.loadCharacter(id)
      .subscribe(character => {
        this.character = character;
        this.dataService.setActiveCharacter(character);
      });
  }

  ionViewDidLeave() {
    this.dataService.setActiveCharacter(null);
  }

}
