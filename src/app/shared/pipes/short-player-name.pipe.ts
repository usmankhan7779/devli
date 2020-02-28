import { Pipe, PipeTransform } from '@angular/core';
import { CommonService } from '../services/common.service';

@Pipe({
  name: 'shortPlayerName'
})
export class ShortPlayerNamePipe implements PipeTransform {

  constructor(private commonService: CommonService) {

  }

  transform(name: string, separator = ' '): string {
    if (name) {
      const nameSplitted = name.split(separator);
      let hasJR = false;
      if (nameSplitted[nameSplitted.length - 1].toLowerCase() === 'jr.') {
        hasJR = true;
        nameSplitted.pop();
      }
      let firstName = '';
      nameSplitted.slice(0, -1).forEach((item) => {
        firstName += item.charAt(0).toUpperCase() + '. ';
      });
      const lastName = this.commonService.capitalizeTeamName(nameSplitted[nameSplitted.length - 1]);
      let shortName = firstName + lastName;
      if (hasJR) {
        shortName = shortName + ' Jr.';
      }
      return shortName;
    }
    return name;
  }
}

