import { Component, OnInit } from '@angular/core';
import { ICampaign, ICharacter } from '../../models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  public characters: ICharacter[] = [];
  public campaigns: ICampaign[] = [];

  constructor() { }

  ngOnInit() {
  }

}
