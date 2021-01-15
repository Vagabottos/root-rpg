import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CampaignViewNpcsPageRoutingModule } from './campaign-view-npcs-routing.module';

import { CampaignViewNpcsPage } from './campaign-view-npcs.page';
import { SharedModule } from '../../shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    CampaignViewNpcsPageRoutingModule
  ],
  declarations: [CampaignViewNpcsPage]
})
export class CampaignViewNpcsPageModule {}
