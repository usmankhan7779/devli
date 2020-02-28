import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BreadcrumbService } from '../../../shared/components/breadcrumb/breadcrumb.service';
import { TargetsService } from '../../targets-gateway/targets.service';
import { StatsService } from '../stats.service';
import { CommonService } from '../../../shared/services/common.service';
import { SpinnerService } from '../../../shared/components/spinner/spinner.service';
import * as _ from 'lodash';
import { TitleService } from '../../../shared/services/title.service';
import { DepthChartService } from '../../depth-charts/depth-chart.service';
import { NflService } from '../../nfl.service';
import { SchemaService } from '../../../shared/services/schema.service';

@Component({
  selector: 'app-stats-gateway',
  templateUrl: './stats-gateway.component.html',
  styleUrls: ['./stats-gateway.component.scss']
})
export class StatsGatewayComponent implements OnInit, OnDestroy {
  params: {year?: string} = {};
  data;
  ddData;
  pageTitle: string;
  dropdownCollapsed = true;
  snapsMainRadio: any[];
  snapsSecondaryRadio: any[];
  hasData: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private title: TitleService,
    private statsService: StatsService,
    private commonService: CommonService,
    private spinnerService: SpinnerService,
    private depthChartService: DepthChartService,
    private targetsService: TargetsService,
    private nflService: NflService,
    private schemaService: SchemaService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.targetsService.removeSavedDD();
      this.targetsService.removeSavedDD('savedStatsDD');
      this.spinnerService.hideSpinner();

      this.params.year = this.nflService.getPreSelectedLeagueSeason() ||
        this.route.snapshot.data['leadersData'].currentSeason;

      this.snapsMainRadio = this.targetsService.snapsMainRadio;
      this.snapsSecondaryRadio = this.targetsService.snapsSecondaryRadio;
      this.snapsSecondaryRadio.push(
        {
          'name': 'K',
          'stats': ['player-stats', 'kicker-stats']
        }
      );

      this.ddData = {
        seasons: this.route.snapshot.data['leadersData'].seasons_dropdown,
        tabs: this.statsService.getDddObj('', 'player-stats', []).tabs
      };
      this.handleResponse(this.route.snapshot.data['leadersData']);
    });
  }

  ngOnDestroy() {
    this.spinnerService.hideSpinner();
  }

  onSnapCountMainTabClick(activeTab) {
    console.log(activeTab);
    if (activeTab.value === 'stats') {
      return;
    }
    const activeSecondaryTab = _.find(this.snapsSecondaryRadio, activeTab.value);
    let navVal;
    if (Array.isArray(activeSecondaryTab[activeTab.value])) {
      navVal = activeSecondaryTab[activeTab.value];
    } else {
      navVal = [activeSecondaryTab[activeTab.value]];
    }
    this.router.navigate(['/nfl', ...navVal]);
  }

  onButtonGroupClick(isDropdown, tabClickOnFirst?) {
    if (isDropdown) {
      const tabProp = this.commonService.getActiveCheckBoxItems(this.ddData.tabs, 'prop')[0];
      if (tabProp !== 'player-stats') {
        this.spinnerService.showSpinner();
        this.navigateTab(tabProp);
      }
    } else if (!tabClickOnFirst) {
      this.spinnerService.showSpinner();
    }
  }

  onViewMoreClick(data) {
    this.spinnerService.showSpinner();
    this.statsService.setSortBy(data.sort_stat);
    return this.router.navigate([data.stat_url]);
  }

  preselectTeamSeason() {
    this.depthChartService.setPreSelectedTeamSeason(this.commonService.getActiveCheckBoxItems(this.ddData.seasons, 'year')[0]);
  }

  onYearDdChange(season) {
    if (this.params.year === season.year) {
      return;
    }
    this.nflService.setPreSelectedLeagueSeason(season.year);
    this.params.year = season.year;
    this.spinnerService.handleAPICall(this.statsService.getLeaders(this.params.year))
      .subscribe(res => {
        this.handleResponse(res);
      });
  }

  handleResponse(res) {
    this.data = res;
    this.pageTitle = this.data.heading;

    this.checkNoData();

    const breadcrumbs: any = [
      { label: 'NFL', url: '/nfl' },
      { label: 'Players', url: '/nfl/players' }
    ];

    if (!this.nflService.checkIfDefaultSeason(this.params.year, this.ddData.seasons)) {
      breadcrumbs.push({
        label: this.params.year,
        url: '/nfl/schedule/' + this.params.year
      });
    }

    breadcrumbs.push({
      label: 'NFL Player Stats',
      url: `/nfl/player-stats`
    });

    this.setSchema();

    this.breadcrumbService.changeBreadcrumbs(breadcrumbs);
    this.title.setTitle(this.data.page_title);
  }

  private navigateTab(tabProp) {
    this.router.navigate([
      this.generateUrlForSeasonsDd(tabProp)
    ]);
  }

  private generateUrlForSeasonsDd(type) {
    return `/nfl/player-stats/${type}`;
  }

  private setSchema() {
    const keys = this.data.subheadings.reduce((filtered: any[], sub: any) => {
      sub.api_keys.forEach(api_key => {
        filtered.push(api_key);
      });
      return filtered;
    }, []);
    let players = [];
    keys.forEach(key => {
      if (this.data[key] && this.data[key].leaders) {
        players = _.concat(players, this.data[key].leaders)
      }
    });
    players = _.uniq(players);
    players = _.uniqBy(players, 'player_fk__profile_url');
    const playersSchema = players.map(player => {
      return {
        '@context': 'http://schema.org',
        '@type': 'Person',
        'name': player.name,
        'url': 'https://www.lineups.com' + player.player_fk__profile_url,
        'memberOf': [
          {
            '@type': 'SportsTeam',
            'name': player.team,
            'sport': 'American Football',
            'memberOf': [
              {
                '@type': 'SportsOrganization',
                'name': 'NFL'
              }
            ]
          }
        ]
      }
    });
    this.schemaService.addSchema([this.commonService.generateDatasetSchema(
      'NFL Player Stats Leaders',
      // tslint:disable-next-line:max-line-length
      'Stat leaders at each position including Passing Leaders, Rushing Leaders, Wide Receiver Leaders, Tight End Leaders, Defensive Leaders, Kicking Leaders.',
      'nfl leaders, nfl player stats, nfl stat leaders',
      'https://www.lineups.com/nfl/player-stats',
      'Dataset'
    ), ...playersSchema]);
  }

  checkNoData() {
    this.hasData = false;
    for (let i = 0; i < this.data.subheadings.length; i++) {
      for (let j = 0; j < this.data.subheadings[i].api_keys.length; j++) {
        const tempDataToCheck = this.data[this.data.subheadings[i].api_keys[j]];
        if (tempDataToCheck && tempDataToCheck.leaders && tempDataToCheck.leaders.length) {
          return this.hasData = true;
        }
      }
    }
  }
}
