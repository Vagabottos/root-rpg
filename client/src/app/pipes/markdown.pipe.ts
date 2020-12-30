import { Pipe, PipeTransform } from '@angular/core';

import * as marked from 'marked';

@Pipe({
  name: 'markdown'
})
export class MarkdownPipe implements PipeTransform {

  private renderer: any;

  constructor() {
    this.renderer = this.getCustomRenderer();
  }

  private getCustomRenderer(): marked.Renderer {
    const renderer = new marked.Renderer();

    renderer.paragraph = t => t;

    return renderer;
  }

  private formatString(str: string): string {
    if (!str) { return ''; }
    return marked(str, { renderer: this.renderer });
  }

  transform(value: any, ...args: any[]): any {
    return this.formatString(value);
  }

}
