
import {of as observableOf,  Observable } from 'rxjs';

import {map, catchError} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '../breadcrumb/breadcrumb.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';
import { TransferHttp } from '../../../../modules/transfer-http/transfer-http';
import { CommonService } from '../../services/common.service';
import { SpinnerService } from '../spinner/spinner.service';
import { SortingService } from '../../services/sorting.service';
import { SchemaService } from '../../services/schema.service';

@Component({
  selector: 'app-standings-page',
  templateUrl: './standings-page.component.html',
  styleUrls: ['./standings-page.component.scss']
})
export class StandingsPageComponent implements OnInit {
  readonly logos = {
    nfl: {
      american: '/assets/images/nfl/logos/leagues/afc.png',
      national: '/assets/images/nfl/logos/leagues/nfc.png'
    }
  };
  data;
  dropdowns;
  league;
  year = 'current';

  tablesData: any;

  sortBy = 'percentage';
  sortOrder = 'desc';

  sortFunctions = {
    'games_behind': this.customSort.bind(this, 'games_behind'),
    'games_behind_division': this.customSort.bind(this, 'games_behind_division'),
    'games_behind_league': this.customSort.bind(this, 'games_behind_league'),
    'games_behind_overall': this.customSort.bind(this, 'games_behind_overall')
  };

  readonly mlbStandings = ['East', 'Central', 'West'];
  readonly nflStandings = ['East', 'North', 'South', 'West'];
  readonly nbaWesternStandings = ['Northwest', 'Pacific', 'Southwest'];
  readonly nbaEasternStandings = ['Atlantic', 'Central', 'Southeast'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,
    private http: TransferHttp,
    private commonService: CommonService,
    private breadcrumbService: BreadcrumbService,
    private spinnerService: SpinnerService,
    private sortingService: SortingService,
    private schemaService: SchemaService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.getStandings();
    });
  }

  onSeasonDropdownChange() {
    this.spinnerService.showSpinner();
    this.year = this.commonService.getActiveCheckBoxItems(this.dropdowns.seasons, 'year')[0];
    this.getStandings();
  }

  onSortBy($event) {
    this.sortBy = $event;
  }

  onSortOrder($event) {
    this.sortOrder = $event;
  }

  onDropdownChange() {
    this.setActiveTab(this.commonService.getActiveCheckBoxItems(this.dropdowns.tabs, 'prop')[0]);
  }

  onButtonGroupClick(tabProp) {
    for (const tab of this.dropdowns.tabs) {
      tab.selected = false;
      if (tab.prop === tabProp) {
        tab.selected = true;
        this.setActiveTab(tabProp);
      }
    }
  }

  private setActiveTab(tab) {
    this.dropdowns.activeTab = tab;
    if (
      this.sortBy === this.sortFunctions['games_behind'] ||
      this.sortBy === this.sortFunctions['games_behind_league'] ||
      this.sortBy === this.sortFunctions['games_behind_division'] ||
      this.sortBy === this.sortFunctions['games_behind_overall']) {
      let propName = 'games_behind';
      if (this.league === 'mlb') {
        propName += (tab === 'division' ? '' : '_' + tab);
      }
      if (this.league === 'nba') {
        propName += (tab === 'league' ? '' : '_' + tab);
      }
      this.sortBy = this.sortFunctions[propName];
    }
  }

  private getStandings() {
    this.league = this.route.snapshot.data['league'].toLowerCase();
    const endpoint = `${environment.api_url}/${this.league}/fetch/standings/${this.year}`;
    return this.http.get(endpoint).pipe(
      catchError(() => {
        this.spinnerService.hideSpinner();
        this.router.navigate(['/404']);
        return observableOf(null);
      }),
      map((res: any) => res))
      .subscribe((data) => {
        if (!data) {
          return;
        }
        this.title.setTitle(data.page_title);
        const breadcrumbs = [
          {
            url: `/${this.league}`,
            label: this.league.toUpperCase()
          },
          {
            url: `/${this.league}/standings`,
            label: this.league.toUpperCase() + ' Standings'
          }
        ];
        this.breadcrumbService.changeBreadcrumbs(breadcrumbs);

        if (!this.dropdowns || !this.dropdowns.seasons) {
          const OrderedSeasons = data.seasons_dropdown.sort().reverse();
          const seasons = [];
          OrderedSeasons.forEach((season) => {
            seasons.push({
              name: season.name,
              year: season.default ? 'current' : season.year,
              selected: season.default
            });
          });
          this.dropdowns = {
            seasons,
            activeTab: 'division',
            tabs: [
              {
                name: 'Division',
                prop: 'division',
                selected: true
              },
              {
                name: this.league === 'mlb' ? 'League' : 'Conference',
                prop: 'league',
                selected: false
              },
              {
                name: 'Overall',
                prop: 'overall',
                selected: false
              }
            ]
          };
        }

        switch (this.league) {
          case 'nba': {
            this.prepareNbaData(data);
            break;
          }
          default: {
            this.prepareMlbOrNflData(data);
            break;
          }
        }
        this.data = data;
        this.setSchema(this.tablesData);
        this.spinnerService.hideSpinner();
      });
  }

  customSort(sortBy, row) {
    return this.sortingService.customSort(sortBy, row, (value) => {
      if (typeof value === 'string' && value.indexOf(',') !== -1) {
        return parseFloat(value.replace(/,/g, ''));
      }
      return parseFloat(value) || 0;
    });
  }

  private prepareMlbOrNflData(data) {
    this.tablesData = {
      division: {
        american: data.american,
        national: data.national,
      },
      league: {
        american: this.handleLeague(data, 'american'),
        national: this.handleLeague(data, 'national'),
      },
      overall: this.handleOverallData(data)
    };
  }
  private prepareNbaData(data) {
    this.tablesData = {
      division: {
        eastern: data.eastern,
        western: data.western
      },
      league: {
        eastern: this.handleLeague(data, 'eastern'),
        western: this.handleLeague(data, 'western')
      },
      overall: this.handleOverallData(data, 'western', 'eastern')
    };
  }

  private handleOverallData(data, leagueOne = 'american', leagueTwo = 'national') {
    const resArr = [];
    for (const key in data[leagueOne].standings) {
      if (data[leagueOne].standings.hasOwnProperty(key)) {
        resArr.push(...data[leagueOne].standings[key]);
      }
    }
    for (const key in data[leagueTwo].standings) {
      if (data[leagueTwo].standings.hasOwnProperty(key)) {
        resArr.push(...data[leagueTwo].standings[key]);
      }
    }
    return resArr;
  }
  private handleLeague(data, league) {
    const resArr = [];
    for (const key in data[league].standings) {
      if (data[league].standings.hasOwnProperty(key)) {
        resArr.push(...data[league].standings[key]);
      }
    }
    return resArr;
  }

  private setSchema(tableData) {
    if (this.league === 'nba') {
      this.schemaService.addSchema([this.commonService.generateDatasetSchema(
        'NBA Standings',
        // tslint:disable-next-line:max-line-length
        'NBA standings for all teams. Data includes team win-loss record, team standing in division, conference and overall. Includes winning percentage, home record, away record, record over last 10 games and their streak.',
        'nba standings, nba team standings',
        'https://www.lineups.com/nba/standings',
        'Dataset'
      ), this.generateSchema(tableData)]);
    } else if (this.league === 'nfl') {
      this.schemaService.addSchema([this.commonService.generateDatasetSchema(
        'NFL Standings',
        // tslint:disable-next-line:max-line-length
        'NFL standings for all teams. Data includes team win-loss record, points for, points against, Net Points, team standing in division, conference and overall. Includes winning percentage, home record, away record, record over last 10 games and their streak.',
        'nfl standings, nfl team standings, nfl season standings',
        'https://www.lineups.com/nfl/standings',
        'Dataset'
      ), this.generateSchema(tableData)]);
    } else {
      this.schemaService.addSchema(this.generateSchema(tableData));
    }

  }

  private generateSchema(tableData) {
    return  {
      '@context': 'http://schema.org',
      '@type': 'SportsOrganization',
      'name': this.league.toUpperCase(),
      'sport': this.schemaService.getSportType(this.league),
      'url': `https://www.lineups.com/${this.league}/standings`,
      'members': tableData.overall.map((teamData) => {
        return     {
          '@type': 'SportsTeam',
          'name': `${teamData.city ? teamData.city + ' ' + teamData.name : teamData.name}`,
          'url': `https://www.lineups.com${teamData.team_lineup_route || teamData.team_depth_chart_route}`,
          'memberOf': [{
              '@type': 'SportsOrganization',
              'name': this.getTeamConference(teamData),
            }
          ]
        }
      })
    }
  }

  private getTeamConference(teamData) {
    if (this.league === 'nfl') {
      if (teamData.conference === 'AFC') {
        return this.data.american.heading;
      } else {
        return this.data.national.heading;
      }
    } else if (this.league === 'nba') {
      return this.data[teamData.conference.toLowerCase()].heading;
    } else if (this.league === 'mlb') {
      if (teamData.league === 'AL') {
        return this.data.american.heading;
      } else {
        return this.data.national.heading;
      }
    }
  }
}
