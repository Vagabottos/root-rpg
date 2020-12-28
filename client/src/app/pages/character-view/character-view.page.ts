import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ICharacter } from '../../models';
import { CharacterAPIService } from '../../services/character.api.service';

@Component({
  selector: 'app-character-view',
  templateUrl: './character-view.page.html',
  styleUrls: ['./character-view.page.scss'],
})
export class CharacterViewPage implements OnInit {

  public character: ICharacter;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private characterAPI: CharacterAPIService
  ) { }

  ngOnInit() {

    // TODO: make CharacterExists guard
    const id = this.route.snapshot.paramMap.get('id');

    const kickback = () => {
      this.router.navigate(['/dashboard']);
    };

    if (!id) {
      kickback();
      return;
    }

    this.characterAPI.loadCharacter(id)
      .subscribe(character => {
        this.character = character;
      }, () => {
        kickback();
      });
  }

}
