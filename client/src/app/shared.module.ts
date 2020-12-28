import { NgModule } from '@angular/core';

import { MarkdownPipe } from './pipes/markdown.pipe';

@NgModule({
  declarations: [MarkdownPipe],
  entryComponents: [],
  imports: [],
  providers: [],
  bootstrap: [],
  exports: [MarkdownPipe]
})
export class SharedModule {}
