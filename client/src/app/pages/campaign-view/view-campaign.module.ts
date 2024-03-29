import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewCampaignPageRoutingModule } from './view-campaign-routing.module';

import { ViewCampaignPage } from './view-campaign.page';
import { SharedModule } from '../../shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ViewCampaignPageRoutingModule
  ],
  declarations: [ViewCampaignPage]
})
export class ViewCampaignPageModule {}
