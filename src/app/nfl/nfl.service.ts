
import {of as observableOf,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';

import * as moment from 'moment';
import { environment } from 'environments/environment';
import { TransferHttp } from '../../modules/transfer-http/transfer-http';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class NflService {
  private preSelectedLeagueSeason = '';
  private preSelectedGatewaySeason = '';
  private nflSeasons: any[];

  readonly nflTeams = {
    'ARI': {
      'primary_color': '#b00539',
      'team_depth_chart_route': '/nfl/depth-charts/arizona-cardinals',
      'team_route': 'arizona-cardinals',
      'team_name': 'Arizona Cardinals'
    },
    'ATL': {
      'primary_color': '#a71930',
      'team_depth_chart_route': '/nfl/depth-charts/atlanta-falcons',
      'team_route': 'atlanta-falcons',
      'team_name': 'Atlanta Falcons'
    },
    'BAL': {
      'primary_color': '#bb9334',
      'team_depth_chart_route': '/nfl/depth-charts/baltimore-ravens',
      'team_route': 'baltimore-ravens',
      'team_name': 'Baltimore Ravens'
    },
    'BUF': {
      'primary_color': '#00338d',
      'team_depth_chart_route': '/nfl/depth-charts/buffalo-bills',
      'team_route': 'buffalo-bills',
      'team_name': 'Buffalo Bills'
    },
    'CAR': {
      'primary_color': '#0085ca',
      'team_depth_chart_route': '/nfl/depth-charts/carolina-panthers',
      'team_route': 'carolina-panthers',
      'team_name': 'Carolina Panthers'
    },
    'CHI': {
      'primary_color': '#0b162a',
      'team_depth_chart_route': '/nfl/depth-charts/chicago-bears',
      'team_route': 'chicago-bears',
      'team_name': 'Chicago Bears'
    },
    'CIN': {
      'primary_color': '#fb4f14',
      'team_depth_chart_route': '/nfl/depth-charts/cincinnati-bengals',
      'team_route': 'cincinnati-bengals',
      'team_name': 'Cincinnati Bengals'
    },
    'CLE': {
      'primary_color': '#ff3c00',
      'team_depth_chart_route': '/nfl/depth-charts/cleveland-browns',
      'team_route': 'cleveland-browns',
      'team_name': 'Cleveland Browns'
    },
    'DAL': {
      'primary_color': '#002244',
      'team_depth_chart_route': '/nfl/depth-charts/dallas-cowboys',
      'team_route': 'dallas-cowboys',
      'team_name': 'Dallas Cowboys'
    },
    'DEN': {
      'primary_color': '#002244',
      'team_depth_chart_route': '/nfl/depth-charts/denver-broncos',
      'team_route': 'denver-broncos',
      'team_name': 'Denver Broncos'
    },
    'DET': {
      'primary_color': '#0076b6',
      'team_depth_chart_route': '/nfl/depth-charts/detroit-lions',
      'team_route': 'detroit-lions',
      'team_name': 'Detroit Lions'
    },
    'GB': {
      'primary_color': '#203731',
      'team_depth_chart_route': '/nfl/depth-charts/green-bay-packers',
      'team_route': 'green-bay-packers',
      'team_name': 'Green Bay Packers'
    },
    'HOU': {
      'primary_color': '#03202f',
      'team_depth_chart_route': '/nfl/depth-charts/houston-texans',
      'team_route': 'houston-texans',
      'team_name': 'Houston Texans'
    },
    'IND': {
      'primary_color': '#002c5f',
      'team_depth_chart_route': '/nfl/depth-charts/indianapolis-colts',
      'team_route': 'indianapolis-colts',
      'team_name': 'Indianapolis Colts'
    },
    'JAX': {
      'primary_color': '#006778',
      'team_depth_chart_route': '/nfl/depth-charts/jacksonville-jaguars',
      'team_route': 'jacksonville-jaguars',
      'team_name': 'Jacksonville Jaguars'
    },
    'KC': {
      'primary_color': '#e31837',
      'team_depth_chart_route': '/nfl/depth-charts/kansas-city-chiefs',
      'team_route': 'kansas-city-chiefs',
      'team_name': 'Kansas City Chiefs'
    },
    'LAC': {
      'primary_color': '#001532',
      'team_depth_chart_route': '/nfl/depth-charts/los-angeles-chargers',
      'team_route': 'los-angeles-chargers',
      'team_name': 'Los Angeles Chargers'
    },
    'LAR': {
      'primary_color': '#002244',
      'team_depth_chart_route': '/nfl/depth-charts/los-angeles-rams',
      'team_route': 'los-angeles-rams',
      'team_name': 'Los Angeles Rams'
    },
    'MIA': {
      'primary_color': '#008e97',
      'team_depth_chart_route': '/nfl/depth-charts/miami-dolphins',
      'team_route': 'miami-dolphins',
      'team_name': 'Miami Dolphins'
    },
    'MIN': {
      'primary_color': '#4e2683',
      'team_depth_chart_route': '/nfl/depth-charts/minnesota-vikings',
      'team_route': 'minnesota-vikings',
      'team_name': 'Minnesota Vikings'
    },
    'NE': {
      'primary_color': '#002244',
      'team_depth_chart_route': '/nfl/depth-charts/new-england-patriots',
      'team_route': 'new-england-patriots',
      'team_name': 'New England Patriots'
    },
    'NO': {
      'primary_color': '#000000',
      'team_depth_chart_route': '/nfl/depth-charts/new-orleans-saints',
      'team_route': 'new-orleans-saints',
      'team_name': 'New Orleans Saints'
    },
    'NYG': {
      'primary_color': '#0b2265',
      'team_depth_chart_route': '/nfl/depth-charts/new-york-giants',
      'team_route': 'new-york-giants',
      'team_name': 'New York Giants'
    },
    'NYJ': {
      'primary_color': '#203731',
      'team_depth_chart_route': '/nfl/depth-charts/new-york-jets',
      'team_route': 'new-york-jets',
      'team_name': 'New York Jets'
    },
    'OAK': {
      'primary_color': '#000000',
      'team_depth_chart_route': '/nfl/depth-charts/oakland-raiders',
      'team_route': 'oakland-raiders',
      'team_name': 'Oakland Raiders'
    },
    'PHI': {
      'primary_color': '#004c54',
      'team_depth_chart_route': '/nfl/depth-charts/philadelphia-eagles',
      'team_route': 'philadelphia-eagles',
      'team_name': 'Philadelphia Eagles'
    },
    'PIT': {
      'primary_color': '#00539b',
      'team_depth_chart_route': '/nfl/depth-charts/pittsburgh-steelers',
      'team_route': 'pittsburgh-steelers',
      'team_name': 'Pittsburgh Steelers'
    },
    'SF': {
      'primary_color': '#aa0000',
      'team_depth_chart_route': '/nfl/depth-charts/san-francisco-49ers',
      'team_route': 'san-francisco-49ers',
      'team_name': 'San Francisco 49ers'
    },
    'SEA': {
      'primary_color': '#002244',
      'team_depth_chart_route': '/nfl/depth-charts/seattle-seahawks',
      'team_route': 'seattle-seahawks',
      'team_name': 'Seattle Seahawks'
    },
    'TB': {
      'primary_color': '#d50a0a',
      'team_depth_chart_route': '/nfl/depth-charts/tampa-bay-buccaneers',
      'team_route': 'tampa-bay-buccaneers',
      'team_name': 'Tampa Bay Buccaneers'
    },
    'TEN': {
      'primary_color': '#002244',
      'team_depth_chart_route': '/nfl/depth-charts/tennessee-titans',
      'team_route': 'tennessee-titans',
      'team_name': 'Tennessee Titans'
    },
    'WAS': {
      'primary_color': '#5b2b2f',
      'team_depth_chart_route': '/nfl/depth-charts/washington-redskins',
      'team_route': 'washington-redskins',
      'team_name': 'Washington Redskins'
    }
  };


  constructor(
    private http: TransferHttp
  ) { }

  getNflTeamInfo(abbr) {
    return this.nflTeams[abbr];
  }

  getDefaultSeason(nflSeasons: any[], prop = 'year') {
    if (!this.nflSeasons) {
      this.nflSeasons = nflSeasons;
    }
    return _.find(nflSeasons, 'default')[prop];
  }

  checkAvailableSeason(season: string | number, nflSeasons: any[]) {
    if (season && nflSeasons) {
      return _.includes(nflSeasons.map(nflSeason => nflSeason.year + ''), season + '');
    }
    return false;
  }

  checkIfDefaultSeason(season, seasons, tryToGetWithoutApi = false, prop?) {
    let _seasons = seasons;
    if (tryToGetWithoutApi) {
      if (this.nflSeasons && this.nflSeasons.length) {
        _seasons = this.nflSeasons;
      } else {
        return true;
      }
    }
    return `${season}` === `${this.getDefaultSeason(_seasons, prop)}`
  }

  getAvailableNflSeasons() {
    if (this.nflSeasons) {
      return observableOf(_.cloneDeep(this.nflSeasons));
    }
    const endpoint = `${environment.api_url}/nfl/fetch/seasons/available`;
    return this.http.get(endpoint).pipe(
      map(res => {
        this.nflSeasons = res;
        return res;
      }));
  }

  getNflModels() {
    const endpoint = `${environment.api_url}/nfl/fetch/models`;
    return this.http.get(endpoint);
  }

  getNFLGatewayData(year?) {
    let yearUrl = '';
    if (year) {
      yearUrl = `/${year}`
    }
    const endpoint = `${environment.api_url}/nfl/fetch/gateway${yearUrl}`;
    return this.http.get(endpoint).pipe(
    map((res: any) => {
      return res;
    }));
  }

  getCurrentWeek(): number {
    const weeks = new Array(17);
    for (let i = 0; i < weeks.length; i++) {
      const startDate = this.getStartWeekDate();
      weeks[i] = moment(startDate.add(i, 'weeks'));
    }
    const today = moment(new Date());
    for (let i = weeks.length - 1; i >= 0; i--) {
      if (today.isAfter(weeks[i])) {
        return i + 1;
      }
    }
    return 0;
  }

  private getStartWeekDate() {
    let startDate = moment(`09/${new Date().getFullYear()}`, 'MM/YYYY').startOf('month').isoWeekday(4);
    if (startDate.format('M') === '8') {
      startDate = moment(startDate.add(1, 'weeks'));
    }
    return startDate;
  }

  handleYear(year: string | number) {
    const YearString = year + '';
    const firstPart = YearString.substr(0, 2);
    const secondPart = YearString.substr(2, 2);
    return `${firstPart}${secondPart}-${parseInt(secondPart, 10) + 1}`;
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

  getPreSelectedLeagueSeason() {
    return this.preSelectedLeagueSeason;
  }

  setPreSelectedLeagueSeason(year: string) {
    this.preSelectedLeagueSeason = year;
  }

  removePreSelectedLeagueSeason() {
    this.preSelectedLeagueSeason = '';
  }
}
