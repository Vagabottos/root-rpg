import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'withPlus'
})
export class NumberWithPlus implements PipeTransform {

  transform(value: number, ...args: any[]): any {
    if (value < 0) { return value; }
    return `+${value}`;
  }

}
