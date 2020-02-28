
import { Observable, of } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

import { environment } from 'environments/environment';
import { TransferHttp } from '../../modules/transfer-http/transfer-http';
import * as _ from 'lodash';
import { CommonService } from '../shared/services/common.service';
import { ParseTableService } from '../shared/services/parseTable.service';

@Injectable({
  providedIn: 'root'
})
export class NbaService {
  forceOffseason = false;
  preSelectedGatewaySeason = '';
  preSelectedLeagueSeason = '';
  nbaSeasons = [
    {
      'year': 2017,
      'default': false
    },
    {
      'year': 2018,
      'default': false,
      'offseason': false
    },
    {
      'year': 2019,
      'default': false,
      'offseason': true
    },
    {
      'year': 2020,
      'default': true,
      'offseason': false
    }
  ];
  private renderer: Renderer2;
  private wpDepthCharts = [];
  private singleWpDepthCharts = [];

  readonly posAbbrs = {
    point_guards: 'PG',
    shooting_guards: 'SG',
    small_forwards: 'SF',
    power_forwards: 'PF',
    centers: 'C'
  };

  readonly nbaTeams = {
    'ATL': {
      'primary_color': 'E03A3E',
      'team_depth_chart_route': '/nba/depth-charts/atlanta-hawks',
      'team_route': 'atlanta-hawks',
      'lineup_route': '/nba/lineups/atlanta-hawks',
      'team_name': 'Atlanta Hawks',
      'wp_page_id': 153
    },
    'BOS': {
      'primary_color': '008348',
      'team_depth_chart_route': '/nba/depth-charts/boston-celtics',
      'team_route': 'boston-celtics',
      'lineup_route': '/nba/lineups/boston-celtics',
      'team_name': 'Boston Celtics',
      'wp_page_id': 380
    },
    'BKN': {
      'primary_color': '000000',
      'team_depth_chart_route': '/nba/depth-charts/brooklyn-nets',
      'team_route': 'brooklyn-nets',
      'lineup_route': '/nba/lineups/brooklyn-nets',
      'team_name': 'Brooklyn Nets',
      'wp_page_id': 383
    },
    'CHA': {
      'primary_color': '1D1160',
      'team_depth_chart_route': '/nba/depth-charts/charlotte-hornets',
      'team_route': 'charlotte-hornets',
      'lineup_route': '/nba/lineups/charlotte-hornets',
      'team_name': 'Charlotte Hornets',
      'wp_page_id': 90
    },
    'CHI': {
      'primary_color': 'CE1141',
      'team_depth_chart_route': '/nba/depth-charts/chicago-bulls',
      'team_route': 'chicago-bulls',
      'lineup_route': '/nba/lineups/chicago-bulls',
      'team_name': 'Chicago Bulls',
      'wp_page_id': 386
    },
    'CLE': {
      'primary_color': '6F263D',
      'team_depth_chart_route': '/nba/depth-charts/cleveland-cavaliers',
      'team_route': 'cleveland-cavaliers',
      'lineup_route': '/nba/lineups/cleveland-cavaliers',
      'team_name': 'Cleveland Cavaliers',
      'wp_page_id': 388
    },
    'DAL': {
      'primary_color': '0053BC',
      'team_depth_chart_route': '/nba/depth-charts/dallas-mavericks',
      'team_route': 'dallas-mavericks',
      'lineup_route': '/nba/lineups/dallas-mavericks',
      'team_name': 'Dallas Mavericks',
      'wp_page_id': 391
    },
    'DEN': {
      'primary_color': '00285E',
      'team_depth_chart_route': '/nba/depth-charts/denver-nuggets',
      'team_route': 'denver-nuggets',
      'lineup_route': '/nba/lineups/denver-nuggets',
      'team_name': 'Denver Nuggets',
      'wp_page_id': 394
    },
    'DET': {
      'primary_color': '006BB6',
      'team_depth_chart_route': '/nba/depth-charts/detroit-pistons',
      'team_route': 'detroit-pistons',
      'lineup_route': '/nba/lineups/detroit-pistons',
      'team_name': 'Detroit Pistons',
      'wp_page_id': 397
    },
    'GS': {
      'primary_color': '006BB6',
      'team_depth_chart_route': '/nba/depth-charts/golden-state-warriors',
      'team_route': 'golden-state-warriors',
      'lineup_route': '/nba/lineups/golden-state-warriors',
      'team_name': 'Golden State Warriors',
      'wp_page_id': 401
    },
    'HOU': {
      'primary_color': 'CE1141',
      'team_depth_chart_route': '/nba/depth-charts/houston-rockets',
      'team_route': 'houston-rockets',
      'lineup_route': '/nba/lineups/houston-rockets',
      'team_name': 'Houston Rockets',
      'wp_page_id': 404
    },
    'IND': {
      'primary_color': '002D62',
      'team_depth_chart_route': '/nba/depth-charts/indiana-pacers',
      'team_route': 'indiana-pacers',
      'lineup_route': '/nba/lineups/indiana-pacers',
      'team_name': 'Indiana Pacers',
      'wp_page_id': 408
    },
    'LAC': {
      'primary_color': 'ED174C',
      'team_depth_chart_route': '/nba/depth-charts/los-angeles-clippers',
      'team_route': 'los-angeles-clippers',
      'lineup_route': '/nba/lineups/los-angeles-clippers',
      'team_name': 'Los Angeles Clippers',
      'wp_page_id': 58
    },
    'LAL': {
      'primary_color': '552583',
      'team_depth_chart_route': '/nba/depth-charts/los-angeles-lakers',
      'team_route': 'los-angeles-lakers',
      'lineup_route': '/nba/lineups/los-angeles-lakers',
      'team_name': 'Los Angeles Lakers',
      'wp_page_id': 92
    },
    'MEM': {
      'primary_color': '00285E',
      'team_depth_chart_route': '/nba/depth-charts/memphis-grizzlies',
      'team_route': 'memphis-grizzlies',
      'lineup_route': '/nba/lineups/memphis-grizzlies',
      'team_name': 'Memphis Grizzlies',
      'wp_page_id': 94
    },
    'MIA': {
      'primary_color': '98002E',
      'team_depth_chart_route': '/nba/depth-charts/miami-heat',
      'team_route': 'miami-heat',
      'lineup_route': '/nba/lineups/miami-heat',
      'team_name': 'Miami Heat',
      'wp_page_id': 376
    },
    'MIL': {
      'primary_color': '00471B',
      'team_depth_chart_route': '/nba/depth-charts/milwaukee-bucks',
      'team_route': 'milwaukee-bucks',
      'lineup_route': '/nba/lineups/milwaukee-bucks',
      'team_name': 'Milwaukee Bucks',
      'wp_page_id': 96
    },
    'MIN': {
      'primary_color': '0C2340',
      'team_depth_chart_route': '/nba/depth-charts/minnesota-timberwolves',
      'team_route': 'minnesota-timberwolves',
      'lineup_route': '/nba/lineups/minnesota-timberwolves',
      'team_name': 'Minnesota Timberwolves',
      'wp_page_id': 98
    },
    'NO': {
      'primary_color': '002B5C',
      'team_depth_chart_route': '/nba/depth-charts/new-orleans-pelicans',
      'team_route': 'new-orleans-pelicans',
      'lineup_route': '/nba/lineups/new-orleans-pelicans',
      'team_name': 'New Orleans Pelicans',
      'wp_page_id': 410
    },
    'NY': {
      'primary_color': '006BB6',
      'team_depth_chart_route': '/nba/depth-charts/new-york-knicks',
      'team_route': 'new-york-knicks',
      'lineup_route': '/nba/lineups/new-york-knicks',
      'team_name': 'New York Knicks',
      'wp_page_id': 100
    },
    'OKC': {
      'primary_color': '007AC1',
      'team_depth_chart_route': '/nba/depth-charts/oklahoma-city-thunder',
      'team_route': 'oklahoma-city-thunder',
      'lineup_route': '/nba/lineups/oklahoma-city-thunder',
      'team_name': 'Oklahoma City Thunder',
      'wp_page_id': 102
    },
    'ORL': {
      'primary_color': '0077C0',
      'team_depth_chart_route': '/nba/depth-charts/orlando-magic',
      'team_route': 'orlando-magic',
      'lineup_route': '/nba/lineups/orlando-magic',
      'team_name': 'Orlando Magic',
      'wp_page_id': 104
    },
    'PHI': {
      'primary_color': 'ED174C',
      'team_depth_chart_route': '/nba/depth-charts/philadelphia-76ers',
      'team_route': 'philadelphia-76ers',
      'lineup_route': '/nba/lineups/philadelphia-76ers',
      'team_name': 'Philadelphia 76ers',
      'wp_page_id': 106
    },
    'PHO': {
      'primary_color': '1D1160',
      'team_depth_chart_route': '/nba/depth-charts/phoenix-suns',
      'team_route': 'phoenix-suns',
      'lineup_route': '/nba/lineups/phoenix-suns',
      'team_name': 'Phoenix Suns',
      'wp_page_id': 108
    },
    'POR': {
      'primary_color': 'E03A3E',
      'team_depth_chart_route': '/nba/depth-charts/portland-trail-blazers',
      'team_route': 'portland-trail-blazers',
      'lineup_route': '/nba/lineups/portland-trail-blazers',
      'team_name': 'Portland Trail Blazers',
      'wp_page_id': 110
    },
    'SAC': {
      'primary_color': '5A2B81',
      'team_depth_chart_route': '/nba/depth-charts/sacramento-kings',
      'team_route': 'sacramento-kings',
      'lineup_route': '/nba/lineups/sacramento-kings',
      'team_name': 'Sacramento Kings',
      'wp_page_id': 112
    },
    'SA': {
      'primary_color': '000000',
      'team_depth_chart_route': '/nba/depth-charts/san-antonio-spurs',
      'team_route': 'san-antonio-spurs',
      'lineup_route': '/nba/lineups/san-antonio-spurs',
      'team_name': 'San Antonio Spurs',
      'wp_page_id': 114
    },
    'TOR': {
      'primary_color': 'CE1141',
      'team_depth_chart_route': '/nba/depth-charts/toronto-raptors',
      'team_route': 'toronto-raptors',
      'lineup_route': '/nba/lineups/toronto-raptors',
      'team_name': 'Toronto Raptors',
      'wp_page_id': 116
    },
    'UTA': {
      'primary_color': '002B5C',
      'team_depth_chart_route': '/nba/depth-charts/utah-jazz',
      'team_route': 'utah-jazz',
      'lineup_route': '/nba/lineups/utah-jazz',
      'team_name': 'Utah Jazz',
      'wp_page_id': 118
    },
    'WAS': {
      'primary_color': 'E31837',
      'team_depth_chart_route': '/nba/depth-charts/washington-wizards',
      'team_route': 'washington-wizards',
      'lineup_route': '/nba/lineups/washington-wizards',
      'team_name': 'Washington Wizards',
      'wp_page_id': 120
    }
  };

  constructor(
    private http: TransferHttp,
    private commonService: CommonService,
    private rendererFactory: RendererFactory2,
    private parseTableService: ParseTableService
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  // getBadgeFormatterClass(val: number): string {
  //   let badgeClass = 'red';
  //   if (val >= 90) {
  //     badgeClass = 'green';
  //   } else if (val >= 70) {
  //     badgeClass = 'yellow';
  //   }
  //   return badgeClass;
  // }

  getWPdepthCharts(): Observable<any> {
    if (this.wpDepthCharts && this.wpDepthCharts.length) {
      return of(this.wpDepthCharts.slice(0));
    }
    return this.http.get('https://depthcharts.com/wp-json/wp/v2/pages/2074')
      .pipe(map(res => {
      const dp_html = this.renderer.createElement('div');
      dp_html.innerHTML = res.content.rendered;
      const teamsKeys = Object.keys(this.nbaTeams);
      this.wpDepthCharts = teamsKeys.map(key => {
        try {
          const teamInfo = this.nbaTeams[key];
          const teamPlayersPositions = this.getTeamPlayersPositions(
            this.getHTMLTableByName(dp_html, teamInfo.lineup_route.slice('/nba/lineups/'.length))
          );
          return {
            ...teamInfo,
            ...teamPlayersPositions
          }
        } catch (e) {
          console.error('ERROR:', key);
          console.error('ERROR:', e);
        }
        return {};
      });
      return this.wpDepthCharts.slice(0);
    }));
  }

  getLineupsKey(key) {
    if (key === 'GSW') {
      return 'GS';
    }
    if (key === 'NYK') {
      return 'NY';
    }
    if (key === 'PHX') {
      return 'PHO';
    }
    if (key === 'SAS') {
      return 'SA';
    }
    if (key === 'NOP') {
      return 'NO';
    }
    return key;
  }

  getTeamByKey(key) {
    return this.nbaTeams[this.getLineupsKey(key)];
  }

  getSingleWPdepthChart(nameUrl) {
    const teamKey = this.getWPTeamKey(nameUrl);
    if (this.wpDepthCharts && this.wpDepthCharts.length) {
      return of(_.find(this.wpDepthCharts, {team_name: this.nbaTeams[teamKey].team_name}));
    }
    const singleWpDepthchart = _.find(this.singleWpDepthCharts, {team_name: this.nbaTeams[teamKey].team_name});
    if (singleWpDepthchart) {
      return of(singleWpDepthchart);
    }
    return this.http.get('https://depthcharts.com/wp-json/wp/v2/pages/' + this.nbaTeams[teamKey].wp_page_id)
      .pipe(map(res => {
        const dp_html = this.renderer.createElement('div');
        dp_html.innerHTML = res.content.rendered;
          try {
            const teamInfo = this.nbaTeams[teamKey];
            const teamPlayersPositions = this.getTeamPlayersPositions(
              this.getHTMLTable(dp_html)
            );
            const result = {
              ...teamInfo,
              ...teamPlayersPositions
            };
            if (!_.find(this.singleWpDepthCharts, {team_name: result.team_name})) {
              this.singleWpDepthCharts.push(result);
            }
            return result;
          } catch (e) {
            console.error('ERROR:', teamKey);
            console.error('ERROR:', e);
          }
          return {};
        })
      );
  }

  private getWPTeamKey(nameUrl) {
    const teamsKeys = Object.keys(this.nbaTeams);
    for (let i = 0; i < teamsKeys.length; i ++) {
      if (this.nbaTeams[teamsKeys[i]].lineup_route.indexOf(nameUrl) !== -1) {
        return teamsKeys[i];
      }
    }
  }

  private getHTMLTable(dp_html) {
    return Array.prototype.slice.call(dp_html.getElementsByTagName('table'))[0];
  }
  private getHTMLTableByName(dp_html, name) {
    const items = Array.prototype.slice.call(dp_html.getElementsByTagName('p'));
    for (let i = 0; i < items.length; i++) {
      if ((name === 'philadelphia-76ers' && items[i].innerHTML.indexOf('philadelphia-sixers') !== -1) ||
        items[i].innerHTML.indexOf(name) !== -1) {
        return items[i].nextElementSibling;
      }
    }
  }

  private getTeamPlayersPositions(table) {
    const res = {
      centers: {},
      point_guards: {},
      power_forwards: {},
      shooting_guards: {},
      small_forwards: {}
    };
    const tableData = this.parseTableService.parseTable(table, true);
    tableData.forEach(data => {
      switch (data['Position']) {
        case 'Point Guard': {
          res.point_guards = data;
          delete res.point_guards['Position'];
          break;
        }
        case 'Shooting Guard': {
          res.shooting_guards = data;
          delete res.shooting_guards['Position'];
          break;
        }
        case 'Small Forward': {
          res.small_forwards = data;
          delete res.small_forwards['Position'];
          break;
        }
        case 'Power Forward': {
          res.power_forwards = data;
          delete res.power_forwards['Position'];
          break;
        }
        case 'Center': {
          res.centers = data;
          delete res.centers['Position'];
          break;
        }
      }
    });
    Object.keys(res).forEach(key => {
      Object.keys(res[key]).forEach((i) => {
        if (i === '#' || i === 'starterImage') {
          return;
        }
        res[key][i] = this.proceedPlayerWithNameOnly(res[key], key, i);
      });
      delete res[key]['#'];
      delete res[key]['starterImage'];
    });
    return res;
  }

  private getPosAbbr(position) {
    return this.posAbbrs[position];
  }

  private proceedPlayerWithNameOnly(posObj, position, order) {
    if (!posObj) {
      return;
    }
    const name = posObj[order].trim();
    const nameSplitted = name.split(' ');
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
    let short_name =  firstName + lastName;
    if (hasJR) {
      short_name = short_name + ' Jr.';
    }
    const _position = this.getPosAbbr(position);
    const nameUrl = name.replace(/[^a-zA-Z ]/g, '').toLowerCase().split(' ').join('-');
    const res: any = {
      depth_chart_order: order,
      depth_chart_position: _position,
      name: name,
      position: _position,
      nameUrl: nameUrl,
      profile_url: `/nba/player-stats/${nameUrl}`,
      short_name: short_name
    };
    if (order === '1') {
      res.number = posObj['#'];
      res.image = posObj['starterImage'];
    }
    return res;
  }

  getNBAGatewayData(year?) {
    let yearUrl = '';
    if (year) {
      yearUrl = `/${year}`
    }
    const endpoint = `${environment.api_url}/nba/fetch/gateway${yearUrl}`;
    return this.http.get(endpoint).pipe(
      map((res: any) => {
        if (this.forceOffseason) {
          res.top_links = [];
        }
        return res;
      }));
  }

  getDefaultSeason(nbaSeasons: any[]) {
    try {
      if (!this.nbaSeasons) {
        this.nbaSeasons = nbaSeasons;
      }
      return _.find(nbaSeasons, 'default').year;
    } catch (err) {
      console.error('No default property on provided seasons', nbaSeasons);
      return false;
    }
  }

  checkIfOffSeason(seasons): boolean {
    return Boolean((<any>_.find(seasons, 'default')).offseason);
  }

  checkIfDefaultSeason(season, seasons, tryToGetWithoutApi = false) {
    let _seasons = seasons;
    if (tryToGetWithoutApi) {
      if (this.nbaSeasons && this.nbaSeasons.length) {
        _seasons = this.nbaSeasons;
      } else {
        return true;
      }
    }
    return `${season}` === `${this.getDefaultSeason(_seasons)}`
  }

  checkAvailableSeason(season: string, nbaSeasons: any[]) {
    if (season && nbaSeasons) {
      return _.includes(nbaSeasons.map(nbaSeason => nbaSeason.year + ''), season + '');
    }
    return false;
  }

  getAvailableNBASeasons() {
    if (this.nbaSeasons) {
      return of(_.cloneDeep(this.nbaSeasons));
    }
    const endpoint = `${environment.api_url}/nba/fetch/seasons/available`;
    return this.http.get(endpoint).pipe(
      map(res => {
        this.commonService.sortYearArr(res);
        this.nbaSeasons = res;
        return res;
      }));
  }

  handleYear(year: string | number) {
    const YearString = year + '';
    const firstPart = YearString.substr(0, 2);
    const secondPart = YearString.substr(2, 2);
    return `${firstPart}${parseInt(secondPart, 10) - 1}-${secondPart}`;
  }

  showHalftime(status) {
    return parseInt(status.quarter_integer, 10) === 2 &&
      parseInt(status.minutes, 10) === 0 &&
      parseInt(status.seconds, 10) === 0;
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
