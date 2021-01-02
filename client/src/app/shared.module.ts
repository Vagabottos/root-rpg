import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ItemCreatorComponent } from './components/item-creator/item-creator.component';
import { ItemComponent } from './components/item/item.component';

import { MarkdownPipe } from './pipes/markdown.pipe';

@NgModule({
  declarations: [MarkdownPipe, ItemComponent, ItemCreatorComponent],
  entryComponents: [ItemCreatorComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule.forRoot()],
  providers: [],
  bootstrap: [],
  exports: [MarkdownPipe, ItemComponent, ItemCreatorComponent]
})
export class SharedModule {}
