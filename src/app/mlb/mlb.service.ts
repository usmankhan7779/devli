
import {of as observableOf,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';


import { environment } from 'environments/environment';
import { TransferHttp } from '../../modules/transfer-http/transfer-http';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class MlbService {
  preSelectedGatewaySeason = '';
  mlbSeasons: any[];

  readonly mlbTeams = {
    'ARI': {
      'logo': 'assets/images/mlb/logos/white/arizona-diamondbacks-white.svg',
      'url': '/mlb/lineups/arizona-diamondbacks',
      'team_name': 'Arizona Diamondbacks'
    },
    'ATL': {
      'logo': 'assets/images/mlb/logos/white/atlanta-braves-white.svg',
      'url': '/mlb/lineups/atlanta-braves',
      'team_name': 'Atlanta Braves'
    },
    'BAL': {
      'logo': 'assets/images/mlb/logos/white/baltimore-orioles-white.svg',
      'url': '/mlb/lineups/baltimore-orioles',
      'team_name': 'Baltimore Orioles'
    },
    'BOS': {
      'logo': 'assets/images/mlb/logos/white/boston-red-sox-white.svg',
      'url': '/mlb/lineups/boston-red-sox',
      'team_name': 'Boston Red Sox'
    },
    'CHC': {
      'logo': 'assets/images/mlb/logos/white/chicago-cubs-white.svg',
      'url': '/mlb/lineups/chicago-cubs',
      'team_name': 'Chicago Cubs'
    },
    'CHW': {
      'logo': 'assets/images/mlb/logos/white/chicago-white-sox-white.svg',
      'url': '/mlb/lineups/chicago-white-sox',
      'team_name': 'Chicago White Sox'
    },
    'CIN': {
      'logo': 'assets/images/mlb/logos/white/cincinnati-reds-white.svg',
      'url': '/mlb/lineups/cincinnati-reds',
      'team_name': 'Cincinnati Reds'
    },
    'CLE': {
      'logo': 'assets/images/mlb/logos/white/cleveland-indians-white.svg',
      'url': '/mlb/lineups/cleveland-indians',
      'team_name': 'Cleveland Indians'
    },
    'COL': {
      'logo': 'assets/images/mlb/logos/white/colorado-rockies-white.svg',
      'url': '/mlb/lineups/colorado-rockies',
      'team_name': 'Colorado Rockies'
    },
    'DET': {
      'logo': 'assets/images/mlb/logos/white/detroit-tigers-white.svg',
      'url': '/mlb/lineups/detroit-tigers',
      'team_name': 'Detroit Tigers'
    },
    'HOU': {
      'logo': 'assets/images/mlb/logos/white/houston-astros-white.svg',
      'url': '/mlb/lineups/houston-astros',
      'team_name': 'Houston Astros'
    },
    'KC': {
      'logo': 'assets/images/mlb/logos/white/kansas-city-royals-white.svg',
      'url': '/mlb/lineups/kansas-city-royals',
      'team_name': 'Kansas City Royals'
    },
    'LAA': {
      'logo': 'assets/images/mlb/logos/white/los-angeles-angels-white.svg',
      'url': '/mlb/lineups/los-angeles-angels',
      'team_name': 'Los Angeles Angels'
    },
    'LAD': {
      'logo': 'assets/images/mlb/logos/white/los-angeles-dodgers-white.svg',
      'url': '/mlb/lineups/los-angeles-dodgers',
      'team_name': 'Los Angeles Dodgers'
    },
    'MIA': {
      'logo': 'assets/images/mlb/logos/white/miami-marlins-white.svg',
      'url': '/mlb/lineups/miami-marlins',
      'team_name': 'Miami Marlins'
    },
    'MIL': {
      'logo': 'assets/images/mlb/logos/white/milwaukee-brewers-white.svg',
      'url': '/mlb/lineups/milwaukee-brewers',
      'team_name': 'Milwaukee Brewers'
    },
    'MIN': {
      'logo': 'assets/images/mlb/logos/white/minnesota-twins-white.svg',
      'url': '/mlb/lineups/minnesota-twins',
      'team_name': 'Minnesota Twins'
    },
    'NYM': {
      'logo': 'assets/images/mlb/logos/white/new-york-mets-white.svg',
      'url': '/mlb/lineups/new-york-mets',
      'team_name': 'New York Mets'
    },
    'NYY': {
      'logo': 'assets/images/mlb/logos/white/new-york-yankees-white.svg',
      'url': '/mlb/lineups/new-york-yankees',
      'team_name': 'New York Yankees'
    },
    'OAK': {
      'logo': 'assets/images/mlb/logos/white/oakland-athletics-white.svg',
      'url': '/mlb/lineups/oakland-athletics',
      'team_name': 'Oakland Athletics'
    },
    'PHI': {
      'logo': 'assets/images/mlb/logos/white/philadelphia-phillies-white.svg',
      'url': '/mlb/lineups/philadelphia-phillies',
      'team_name': 'Philadelphia Phillies'
    },
    'PIT': {
      'logo': 'assets/images/mlb/logos/white/pittsburgh-pirates-white.svg',
      'url': '/mlb/lineups/pittsburgh-pirates',
      'team_name': 'Pittsburgh Pirates'
    },
    'SD': {
      'logo': 'assets/images/mlb/logos/white/san-diego-padres-white.svg',
      'url': '/mlb/lineups/san-diego-padres',
      'team_name': 'San Diego Padres'
    },
    'SEA': {
      'logo': 'assets/images/mlb/logos/white/seattle-mariners-white.svg',
      'url': '/mlb/lineups/seattle-mariners',
      'team_name': 'Seattle Mariners'
    },
    'SF': {
      'logo': 'assets/images/mlb/logos/white/san-francisco-giants-white.svg',
      'url': '/mlb/lineups/san-francisco-giants',
      'team_name': 'San Francisco Giants'
    },
    'STL': {
      'logo': 'assets/images/mlb/logos/white/st-louis-cardinals-white.svg',
      'url': '/mlb/lineups/st-louis-cardinals',
      'team_name': 'St. Louis Cardinals'
    },
    'TB': {
      'logo': 'assets/images/mlb/logos/white/tampa-bay-rays-white.svg',
      'url': '/mlb/lineups/tampa-bay-rays',
      'team_name': 'Tampa Bay Rays'
    },
    'TEX': {
      'logo': 'assets/images/mlb/logos/white/texas-rangers-white.svg',
      'url': '/mlb/lineups/texas-rangers',
      'team_name': 'Texas Rangers'
    },
    'TOR': {
      'logo': 'assets/images/mlb/logos/white/toronto-blue-jays-white.svg',
      'url': '/mlb/lineups/toronto-blue-jays',
      'team_name': 'Toronto Blue Jays'
    },
    'WSH': {
      'logo': 'assets/images/mlb/logos/white/washington-nationals-white.svg',
      'url': '/mlb/lineups/washington-nationals',
      'team_name': 'Washington Nationals'
    }
  };
  constructor(
    private http: TransferHttp
  ) { }


  getMLBGatewayData(year?) {
    let yearUrl = '';
    if (year) {
      yearUrl = `/${year}`
    }
    const endpoint = `${environment.api_url}/mlb/fetch/gateway${yearUrl}`;
    return this.http.get(endpoint).pipe(
      map((body: any) => {
        return body;
      }));
  }

  getDefaultSeason(mlbSeasons: any[]) {
    if (!this.mlbSeasons) {
      this.mlbSeasons = mlbSeasons;
    }
    return _.find(mlbSeasons, 'default').year;
  }

  checkIfDefaultSeason(season, seasons, tryToGetWithoutApi = false) {
    let _seasons = seasons;
    if (tryToGetWithoutApi) {
      if (this.mlbSeasons && this.mlbSeasons.length) {
        _seasons = this.mlbSeasons;
      } else {
        return true;
      }
    }
    return `${season}` === `${this.getDefaultSeason(_seasons)}`
  }

  checkAvailableSeason(season: string, mlbSeasons: any[]) {
    if (season && mlbSeasons) {
      return _.includes(mlbSeasons.map(mlbSeason => mlbSeason.year + ''), season + '');
    }
    return false;
  }

  getAvailableMLBSeasons() {
    if (this.mlbSeasons) {
      return observableOf(_.cloneDeep(this.mlbSeasons));
    }
    const endpoint = `${environment.api_url}/mlb/fetch/seasons/available`;
    return this.http.get(endpoint).pipe(
      map(res => {
        this.mlbSeasons = res;
        return res;
      }));
  }

  getPreSelectedGatewaySeason() {
    return this.preSelectedGatewaySeason;
  }

  setPreSelectedGatewaySeason(year: string) {
    this.preSelectedGatewaySeason = year;
  }

  removePreSelectedGatewaySeason() {
    this.preSelectedGatewaySeason = '';
  }
}
