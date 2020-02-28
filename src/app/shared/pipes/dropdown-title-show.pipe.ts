import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dropdownTitleShow',
  pure: false
})
export class DropdownTitleShowPipe implements PipeTransform {

  transform(array: any[], action = 'Showing', singleItem = 'game' , items = 'games', defalultTitle = 'Showing All'): string {
    if (array) {
      const length = array.filter(item => item.showed).length;
      if (length === 1) {
        return `${action}  ${length} ${singleItem}`;
      }
      return length === array.length ? defalultTitle : `${action}  ${length} ${items}`;
    }
    return defalultTitle;
  }
}
