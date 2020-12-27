import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardCharactersPageRoutingModule } from './dashboard-characters-routing.module';

import { DashboardCharactersPage } from './dashboard-characters.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardCharactersPageRoutingModule
  ],
  declarations: [DashboardCharactersPage]
})
export class DashboardCharactersPageModule {}
