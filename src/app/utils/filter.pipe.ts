import { Pipe, Injectable, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true,
})
@Injectable()
export class FilterPipe implements PipeTransform {
  constructor() { }

  transform(
    items: any[],
    callback: (item: any, p1?: any, p2?: any, p3?: any, p4?: any) => boolean,
    p1?: any,
    p2?: any,
    p3?: any,
    p4?: any
  ): any {
    if (!items || !callback) {
      return items;
    }
    return items.filter((item) => callback(item, p1, p2, p3, p4));
  }
}
