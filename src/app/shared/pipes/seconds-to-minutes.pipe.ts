import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'secondsToMinutes',
  pure: false
})
export class SecondsToMinutesPipe implements PipeTransform {

  transform(seconds: any, args?: any): any {
    return (seconds - (seconds %= 60)) / 60 + ( 9 < seconds ? ':' : ':0') + seconds;
  }

}
