import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ItemComponent } from './components/item/item.component';

import { MarkdownPipe } from './pipes/markdown.pipe';

@NgModule({
  declarations: [MarkdownPipe, ItemComponent],
  entryComponents: [],
  imports: [IonicModule.forRoot()],
  providers: [],
  bootstrap: [],
  exports: [MarkdownPipe, ItemComponent]
})
export class SharedModule {}
