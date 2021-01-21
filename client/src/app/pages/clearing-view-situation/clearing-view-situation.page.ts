import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-clearing-view-situation',
  templateUrl: './clearing-view-situation.page.html',
  styleUrls: ['./clearing-view-situation.page.scss'],
})
export class ClearingViewSituationPage implements OnInit {

  constructor(
    public data: DataService
  ) { }

  ngOnInit() {
  }

}
