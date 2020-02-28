import { Pipe } from '@angular/core';

@Pipe({
  name: 'reverse'
})
export class ReversePipe {
  transform(arr, reverse = true) {
    if (Array.isArray(arr) && reverse) {
      return arr.slice(0).reverse();
    }
    return arr;
  }
}
