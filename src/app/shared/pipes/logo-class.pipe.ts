import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'logoClass'
})
export class LogoClassPipe implements PipeTransform {

  constructor() {

  }

  transform(name: string, separator = '.'): string {
    if (name) {
      const nameSplitted = name.split('/');
      return nameSplitted[nameSplitted.length - 1].split(separator)[0];
    }
    return name;
  }
}
