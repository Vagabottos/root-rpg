import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CampaignViewPlayersPageRoutingModule } from './campaign-view-players-routing.module';

import { CampaignViewPlayersPage } from './campaign-view-players.page';
import { SharedModule } from '../../shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    CampaignViewPlayersPageRoutingModule
  ],
  declarations: [CampaignViewPlayersPage]
})
export class CampaignViewPlayersPageModule {}
