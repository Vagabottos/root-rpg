import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CampaignViewCampaignPageRoutingModule } from './campaign-view-campaign-routing.module';

import { CampaignViewCampaignPage } from './campaign-view-campaign.page';
import { SharedModule } from '../../shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    CampaignViewCampaignPageRoutingModule
  ],
  declarations: [CampaignViewCampaignPage]
})
export class CampaignViewCampaignPageModule {}
