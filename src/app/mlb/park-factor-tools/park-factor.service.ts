import { Injectable } from '@angular/core';
import { TransferHttp } from '../../../modules/transfer-http/transfer-http';
import { map } from 'rxjs/operators';
import { ParkFactor } from './park-factor.model';
import { of } from 'rxjs';
import { MlbService } from '../mlb.service';

@Injectable()
export class ParkFactorService {


  constructor(
    private http: TransferHttp,
    private mlbService: MlbService
  ) { }

  getParks() {
    return this.http.get('https://mlbdata.dailyfantasycafe.com/api/parks')
    .pipe(
      map(res => {
        return res.data.reduce((filtered, park: ParkFactor) => {
          if (park.home_team && park.away_team) {
            try {
              park.logo = this.getParkLogo(park);
              park.homeTeamUrl = this.getParkHomeTeam(park);
              park.awayTeamUrl = this.getParkAwayTeam(park);
              filtered.push(park);
            } catch (err) {
              console.error('ERROR in PARK: ', err);
              console.log(park);
            }
          }
          return filtered;
        }, []);
      })
    );
  }

  private getParkLogo(park: ParkFactor) {
    return this.mlbService.mlbTeams[park.home_team].logo;
  }

  private getParkHomeTeam(park: ParkFactor) {
    return this.mlbService.mlbTeams[park.home_team].url;
  }
  private getParkAwayTeam(park: ParkFactor) {
    return this.mlbService.mlbTeams[park.away_team].url;
  }


  getPlayersColor(value) {
    if (value >= 7) {
      return '#70ad46';
    }
    if (value >= 4) {
      return '#ffda65';
    }
    return '#fa5656';
  }

  getRainColor(value) {
    if (value >= 51) {
      return '#fa5656';
    }
    if (value >= 31) {
      return '#ffda65';
    }
    return '#70ad46';
  }
}
