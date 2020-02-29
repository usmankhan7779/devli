import { Directive, HostListener, Input } from '@angular/core';
import { NbaTeamStatsService } from 'app/nba/teams/nba-team-stats/nba-team-stats.service';
// import { IndTeamStatsService } from '../../../nfl/teams/ind-team-stats/ind-team-stats.service';

@Directive({
  selector: '[appPreselectNbaStatsTeamSeason]'
})
export class PreselectNflStatsTeamSeasonDirective {
  // tslint:disable-next-line:no-input-rename
  @Input('appPreselectNbaStatsTeamSeason') season: string;
  constructor(
    private nbaTeamStatsService: NbaTeamStatsService
  ) { }

  @HostListener('click') onClick() {
    alert(this.season)
    if (this.season) {
      this.nbaTeamStatsService.setPreSelectedTeamSeason(this.season);
      // console.log(  this.indTeamStatsService.setPreSelectedTeamSeason(this.season))
    }
  }
  
}

 





// import { Directive, HostListener, Input } from '@angular/core';
// import { IndTeamStatsService } from '../../../nfl/teams/ind-team-stats/ind-team-stats.service';

// @Directive({
//   selector: '[appPreselectNflStatsTeamSeason]'
// })
// export class PreselectNflStatsTeamSeasonDirective {
//   // tslint:disable-next-line:no-input-rename
//   @Input('appPreselectNflStatsTeamSeason') season: string;
//   constructor(
//     private indTeamStatsService: IndTeamStatsService
//   ) { }

//   @HostListener('click') onClick() {
//     alert(this.season)
//     if (this.season) {
//       this.indTeamStatsService.setPreSelectedTeamSeason(this.season);
//       console.log(  this.indTeamStatsService.setPreSelectedTeamSeason(this.season))
//     }
//   }
// }

