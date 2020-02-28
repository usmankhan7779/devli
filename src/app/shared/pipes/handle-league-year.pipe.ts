import { Pipe, PipeTransform } from '@angular/core';
import { NflService } from '../../nfl/nfl.service';
import { NbaService } from '../../nba/nba.service';

@Pipe({
  name: 'handleLeagueYear'
})
export class HandleLeagueYearPipe implements PipeTransform {

  constructor(
    private nflService: NflService,
    private nbaService: NbaService
  ) {}

  transform(value: string, league: string): any {
    if (value) {
      switch (league) {
        case 'nba': {
          return this.nbaService.handleYear(value);
        }
        case 'nfl': {
          return this.nflService.handleYear(value);
        }
        default: {
          return value;
        }
      }
    }
    return value;
  }
}
