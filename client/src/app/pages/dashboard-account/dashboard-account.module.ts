import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardAccountPageRoutingModule } from './dashboard-account-routing.module';

import { DashboardAccountPage } from './dashboard-account.page';
import { SharedModule } from '../../shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SharedModule,
    DashboardAccountPageRoutingModule
  ],
  declarations: [DashboardAccountPage]
})
export class DashboardAccountPageModule {}
