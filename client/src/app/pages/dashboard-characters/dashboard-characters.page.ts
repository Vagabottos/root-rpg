import { Component, OnInit } from '@angular/core';
import { ICharacter } from '../../models';

@Component({
  selector: 'app-dashboard-characters',
  templateUrl: './dashboard-characters.page.html',
  styleUrls: ['./dashboard-characters.page.scss'],
})
export class DashboardCharactersPage implements OnInit {

  public characters: ICharacter[] = [];

  constructor() { }

  ngOnInit() {
  }

}
