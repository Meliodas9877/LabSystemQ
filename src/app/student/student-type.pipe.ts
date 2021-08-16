import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'studentType',
})
export class StudentTypePipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): unknown {
    if (value === 'D') return '博士';
    else return '硕士';
  }
}
