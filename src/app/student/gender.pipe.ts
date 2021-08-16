import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'gender',
})
export class GenderPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): unknown {
    if (value === 'M') return '男';
    else return '女';
  }
}
