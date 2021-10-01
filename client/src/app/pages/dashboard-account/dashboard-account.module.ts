import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardAccountPageRoutingModule } from './dashboard-account-routing.module';

import { DashboardAccountPage } from './dashboard-account.page';
import { SharedModule } from '../../shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    DashboardAccountPageRoutingModule
  ],
  declarations: [DashboardAccountPage]
})
export class DashboardAccountPageModule {}
