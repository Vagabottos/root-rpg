import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-clearing-view-landscape',
  templateUrl: './clearing-view-landscape.page.html',
  styleUrls: ['./clearing-view-landscape.page.scss'],
})
export class ClearingViewLandscapePage implements OnInit {

  constructor(
    public data: DataService
  ) { }

  ngOnInit() {
  }

}
