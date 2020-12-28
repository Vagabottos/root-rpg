import { Component, OnInit } from '@angular/core';
import { ICharacter } from '../../models';
import { CharacterAPIService } from '../../services/character.api.service';

@Component({
  selector: 'app-dashboard-characters',
  templateUrl: './dashboard-characters.page.html',
  styleUrls: ['./dashboard-characters.page.scss'],
})
export class DashboardCharactersPage implements OnInit {

  public characters: ICharacter[] = [];

  private page = 0;

  constructor(private characterAPI: CharacterAPIService) { }

  ngOnInit() {
    this.loadCharacters(0);
  }

  loadCharacters(page = 0, $event = null): void {
    this.characterAPI.getCharacters(page)
      .subscribe(characters => {
        if ($event) {
          this.characters.push(...characters.data);

          if (this.characters.length >= characters.total) {
            $event.target.disabled = true;
          }

          $event.target.complete();
          return;
        }

        this.characters = characters.data;
      });
  }

  loadMoreCharacters($event) {
    this.page += 1;
    this.loadCharacters(this.page, $event);
  }

}
