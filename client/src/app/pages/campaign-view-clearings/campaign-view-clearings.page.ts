import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { IClearing } from '../../../interfaces';

@Component({
  selector: 'app-campaign-view-clearings',
  templateUrl: './campaign-view-clearings.page.html',
  styleUrls: ['./campaign-view-clearings.page.scss'],
})
export class CampaignViewClearingsPage implements OnInit {

  constructor(public data: DataService) { }

  ngOnInit() {
  }

  asClearing(clearing: IClearing): IClearing {
    return clearing;
  }

}
