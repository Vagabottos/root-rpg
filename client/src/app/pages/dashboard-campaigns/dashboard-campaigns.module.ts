import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardCampaignsPageRoutingModule } from './dashboard-campaigns-routing.module';

import { DashboardCampaignsPage } from './dashboard-campaigns.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardCampaignsPageRoutingModule
  ],
  declarations: [DashboardCampaignsPage]
})
export class DashboardCampaignsPageModule {}
