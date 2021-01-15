import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CampaignViewClearingsPageRoutingModule } from './campaign-view-clearings-routing.module';

import { CampaignViewClearingsPage } from './campaign-view-clearings.page';
import { SharedModule } from '../../shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    CampaignViewClearingsPageRoutingModule
  ],
  declarations: [CampaignViewClearingsPage]
})
export class CampaignViewClearingsPageModule {}
