import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SortingService {
  constructor() {}

  customSort(sortBy, row, sortFn?) {
    let value = row;
    for (const sortByProperty of sortBy.split('.')) {
      if (value) {
        value = value[sortByProperty];
      }
    }
    if (sortFn && typeof sortFn  === 'function') {
      return sortFn(value);
    }
    if (value && typeof value === 'string' || value instanceof String) {
      return value.toLowerCase();
    }
    return value;
  }

  customSortFn(sortBy, row) {
    return this.customSort(sortBy, row, (value) => {
      if (typeof value === 'string' && value.indexOf(',') !== -1) {
        return parseFloat(value.replace(/,/g, ''));
      }
      return parseFloat(value) || 0;
    });
  }
}
