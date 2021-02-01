import { Pipe, PipeTransform } from '@angular/core';
import { isNumber } from 'lodash';

@Pipe({
  name: 'withPlus'
})
export class NumberWithPlus implements PipeTransform {

  transform(value: number|string, ...args: any[]): any {
    if (!isNumber(value)) { return value; }
    if (value < 0) { return value; }
    return `+${value}`;
  }

}
