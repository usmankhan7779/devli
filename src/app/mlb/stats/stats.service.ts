
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { TransferHttp } from '../../../modules/transfer-http/transfer-http';
import { CommonService } from '../../shared/services/common.service';
import { environment } from '../../../environments/environment';
import * as _ from 'lodash';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class StatsService {
  private sortBy = '';
  private queryParams: any;
  private teamDD;
  private readonly splits = {
    'Splits': '',
    'vs. Left': 'left',
    'vs. Right': 'right',
    'Home': 'home',
    'Away': 'away',
    'Grass': 'grass',
    'Turf': 'turf',
    'Day': 'day',
    'Night': 'night',
    'L10': 'L10',
    'L30': 'L30',
    'L60': 'L60'
  };

  readonly statsLeagues = {
    'national-league': {
      name: 'National League',
      prop: 'NL',
      innerProp: 'national-league'
    },
    'american-league': {
      name: 'American League',
      prop: 'AL',
      innerProp: 'american-league'
    },
  };

  readonly statsTypes = {
    'pitching-stats': [
      'PIT',
      'SP',
      'RP'
    ],
    'batting-stats': [
      'BAT',
      '1B',
      '2B',
      '3B',
      'C',
      'OF',
      'RF',
      'CF',
      'LF',
      'DH'
    ]
  };

  private readonly leadersTypes = {
    'player-stats': 'Leaders',
    'pitching-stats': 'Pitching',
    'batting-stats': 'Batting'
  };

  constructor(
    private http: TransferHttp,
    private commonService: CommonService
  ) { }

  saveDDs(ddObject) {
    if (ddObject) {
      this.queryParams = {...ddObject};
    }
  }

  getSavedDDs() {
    if (this.queryParams) {
      return {...this.queryParams};
    }
    return null;
  }

  removeSavedDDs() {
    this.queryParams = null;
  }

  setSortBy(value) {
    this.sortBy = value;
  }

  getSortBy() {
    return this.sortBy;
  }

  removeSortBy() {
    this.sortBy = '';
  }

  getDddObj(statsType, statsLeague, team_dropdown, year?, savedDDs?) {
    this.teamDD = team_dropdown;
    let activeLeagueDD;

    let leagueDD = [
      {
        name: 'MLB',
        prop: '',
        selected: false
      },
      {
        name: this.statsLeagues['national-league'].name,
        prop: this.statsLeagues['national-league'].prop,
        innerProp: this.statsLeagues['national-league'].innerProp,
        selected: false
      },
      {
        name: this.statsLeagues['american-league'].name,
        prop: this.statsLeagues['american-league'].prop,
        innerProp: this.statsLeagues['american-league'].innerProp,
        selected: false
      }
    ];
    leagueDD = leagueDD.map(item => {
      return {
        ...item,
        url: this.generateLeagueUrl(item, statsType, year)
      }
    });
    let teams = team_dropdown.map(team => {
      return {
        name: team.key,
        league: team.league,
        selected: true,
        hidden: false,
      }
    });
    teams.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
    if (statsLeague) {
      activeLeagueDD = _.find(leagueDD, {prop: this.statsLeagues[statsLeague].prop});
      activeLeagueDD.selected = true;
      teams = teams.map(item => {
        return {
          ...item,
          hidden: this.statsLeagues[statsLeague].prop !== item.league,
          selected: this.statsLeagues[statsLeague].prop === item.league
        }
      });
    } else {
      activeLeagueDD = leagueDD[0];
      activeLeagueDD.selected = true;
    }

    if (savedDDs && savedDDs.teams) {
      if (savedDDs.teams.length === 0) {
        teams.forEach((team) => {
          team.selected = false;
        });
      } else {
        teams.forEach((team) => {
          if (!_.includes(savedDDs.teams, team.name) || (statsLeague && this.statsLeagues[statsLeague].prop !== team.league)) {
            team.selected = false;
          }
        });
        if (teams.filter(team => team.selected && !team.hidden).length === 0) {
          teams = teams.map(team => {
            if (!team.hidden) {
              team.selected = true;
            }
            return team;
          });
        }
      }
    }

    const leadersDD = [];
    Object.keys(this.leadersTypes).map((objectKey, index) => {
      leadersDD.push({
        name:  this.leadersTypes[objectKey],
        url:  this.generateLeadersUrl(objectKey, statsLeague, year),
        selected: objectKey === statsType,
        hidden: (index === 0 && savedDDs && savedDDs.teams && savedDDs.teams.length && savedDDs.teams.length !== team_dropdown.length)
      });
    });

    const positions = [];
    if (statsType && this.statsTypes[statsType]) {
      this.statsTypes[statsType].forEach((position, index) => {
        if (index === 0) {
          return;
        }
        positions.push({
          name: position,
          selected: true
        });
      });
    }

    if (savedDDs && savedDDs.positions) {
      if ((!this.statsTypes[statsType] || !_.includes(this.statsTypes[statsType], savedDDs.positions[0]))
      ) {
        delete savedDDs.positions;
      } else {
        positions.forEach(position => {
          if (!_.includes(savedDDs.positions, position.name)) {
            position.selected = false;
          }
        })
      }
    }


    const splits = [];
    Object.keys(this.splits).map((key) => {
      splits.push({
       name: key,
       prop: this.splits[key],
       selected: (savedDDs && savedDDs.splits ? this.splits[key] ===  savedDDs.splits : this.splits[key] === '')
      });
    });

    const items_per_page = this.commonService.prepareDDItems([50, 100, 200, 500], true, false);
    items_per_page[0].selected = true;
    const itemsPerPage = items_per_page[0].name;
    return {
      leagueDD,
      leadersDD,
      activeLeagueDD,
      positions,
      teams,
      splits,
      items_per_page,
      itemsPerPage
    };
  }

  getStats(year, statsLeague, statsType, queryParams?) {
    let _year;
    if (year) {
      _year = year;
    } else {
      _year = 'current'
    }
    let params = new HttpParams();
    if (queryParams) {
      if (queryParams.positions) {
        params = params.append('position', queryParams.positions.join(',') || 'null');
      }
      if (queryParams.teams) {
        if (statsLeague && this.teamDD) {
          if (queryParams.teams.length) {
            const filteredTeams = queryParams.teams.filter(teamName => {
              return (<any>_.find(this.teamDD, {key: teamName})).league === this.statsLeagues[statsLeague].prop;
            });
            if (filteredTeams.length !== 0) {
              params = params.append('team', filteredTeams.join(','));
            }
          } else {
            params = params.append('team', 'null');
          }
        } else {
          params = params.append('team', queryParams.teams.join(',') || 'null');
        }
      }
      if (queryParams.splits) {
        params = params.append('split', queryParams.splits);
      }
    }
    if (statsLeague) {
      params = params.append('league', this.statsLeagues[statsLeague].prop);
    }
    if (statsType && (!queryParams || !queryParams.positions) && this.statsTypes[statsType]) {
      params = params.append('position', this.statsTypes[statsType][0]);
    }
    const options = {
      params: params
    };
    const endpoint = `${environment.api_url}/mlb/fetch/player-stats/${_year}`;
    return this.http.get(endpoint, options).pipe(
      map((response: any) => {
        return response;
      }));
  }

  getLeaders(year?, league?) {
    let _year;
    if (year) {
      _year = year;
    } else {
      _year = 'current';
    }
    let params = new HttpParams();
    if (league) {
      params = params.append('league', this.statsLeagues[league].prop);
    }
    const options = {
      params: params
    };
    const endpoint = `${environment.api_url}/mlb/fetch/player-stats/leaders/${_year}`;
    return this.http.get(endpoint, options).pipe(
      map((response: any) => {
        return response;
      }));
  }

  private generateLeagueUrl(item, statsType, year?) {
    // tslint:disable-next-line:max-line-length
    return `/mlb/player-stats${year ? '/' + year : ''}${item.innerProp ? '/' + item.innerProp  : ''}${statsType && statsType !== 'player-stats' ? '/' + statsType : ''}`;
  }

  generateLeadersUrl(key, statsLeague, year?) {
    // tslint:disable-next-line:max-line-length
    return `/mlb/player-stats${year ? '/' + year : ''}${statsLeague ? '/' + statsLeague : ''}${ key && key !== 'player-stats' ? '/' + key : ''}`;
  }

}
