import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-clearing-view-npcs',
  templateUrl: './clearing-view-npcs.page.html',
  styleUrls: ['./clearing-view-npcs.page.scss'],
})
export class ClearingViewNpcsPage implements OnInit {

  constructor(
    public data: DataService
  ) { }

  ngOnInit() {
  }

}
