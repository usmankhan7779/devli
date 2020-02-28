import { Pipe, PipeTransform } from '@angular/core';
import { CommonService } from '../services/common.service';

@Pipe({
  name: 'lastTeamName'
})
export class LastTeamNamePipe implements PipeTransform {

  constructor(private commonService: CommonService) {

  }

  transform(name: string, separator = ' ', allowLastTeamName = true): string {
    if (name && typeof name === 'string' && allowLastTeamName) {
      let nameSplitted = name.split(separator);
      nameSplitted = this.commonService.checkDoubleName(nameSplitted);
      return this.commonService.capitalizeTeamName(nameSplitted[nameSplitted.length - 1]);
    }
    return name;
  }
}
