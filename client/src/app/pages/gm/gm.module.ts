import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GmPageRoutingModule } from './gm-routing.module';

import { GmPage } from './gm.page';
import { SharedModule } from '../../shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    GmPageRoutingModule
  ],
  declarations: [GmPage]
})
export class GmPageModule {}
