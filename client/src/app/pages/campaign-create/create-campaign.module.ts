import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateCampaignPageRoutingModule } from './create-campaign-routing.module';

import { CreateCampaignPage } from './create-campaign.page';
import { SharedModule } from '../../shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SharedModule,
    CreateCampaignPageRoutingModule
  ],
  declarations: [CreateCampaignPage]
})
export class CreateCampaignPageModule {}
