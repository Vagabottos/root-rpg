import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CampaignViewForestPageRoutingModule } from './campaign-view-forest-routing.module';

import { CampaignViewForestPage } from './campaign-view-forest.page';
import { SharedModule } from '../../shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    CampaignViewForestPageRoutingModule
  ],
  declarations: [CampaignViewForestPage]
})
export class CampaignViewForestPageModule {}
