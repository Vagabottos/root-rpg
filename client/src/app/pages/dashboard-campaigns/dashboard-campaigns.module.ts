import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardCampaignsPageRoutingModule } from './dashboard-campaigns-routing.module';

import { DashboardCampaignsPage } from './dashboard-campaigns.page';
import { SharedModule } from '../../shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    DashboardCampaignsPageRoutingModule
  ],
  declarations: [DashboardCampaignsPage]
})
export class DashboardCampaignsPageModule {}
