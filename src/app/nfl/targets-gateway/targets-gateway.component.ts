
import {throwError as observableThrowError,  Subject ,  Observable } from 'rxjs';

import {debounceTime, catchError} from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BreadcrumbService } from '../../shared/components/breadcrumb/breadcrumb.service';
import { NflService } from '../nfl.service';
import * as _ from 'lodash';
import { CommonService } from '../../shared/services/common.service';
import { NameValueObj, TargetsService } from './targets.service';
import { DropdownService } from '../../shared/components/dropdown/dropdown.service';
import { ServerResponseService } from '../../shared/services/server-response.service';
import { TitleService } from '../../shared/services/title.service';
import { SpinnerService } from '../../shared/components/spinner/spinner.service';
import { SchemaService } from '../../shared/services/schema.service';
@Component({
  selector: 'app-targets-gateway',
  templateUrl: './targets-gateway.component.html',
  styleUrls: ['./targets-gateway.component.scss']
})
export class TargetsGatewayComponent implements OnInit, OnDestroy {
  ddData: any;
  availableSeasons;
  csvShowed = false;
  pageTitle: string;
  pageDescription: string;
  bottomHeading: string;
  bottomParagraph: string;
  yearParam: string;
  params: {
    year: number
  };
  tableTypes = this.targetsService.getTableTypes();
  tableType: string;
  originData: any[];
  data: any[];
  searchModel: string;
  searchTerm$ = new Subject<string>();
  csvText: string;
  showPos = false;
  showTeam: boolean;
  sortWeek: number;
  snapsSecondaryRadio = this.targetsService.snapsSecondaryRadio;
  snapsMainRadio: NameValueObj[] = this.targetsService.snapsMainRadio;

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private title: TitleService,
    private breadcrumbService: BreadcrumbService,
    private commonService: CommonService,
    private targetsService: TargetsService,
    private spinnerService: SpinnerService,
    private nflService: NflService,
    private dropdownService: DropdownService,
    private serverResponseService: ServerResponseService,
    private schemaService: SchemaService,
  ) { }

  ngOnInit() {
    this.initFilter();
    this.route.params.subscribe((params: Params) => {
      this.targetsService.getAvailableNflStatsSeasons()
        .subscribe(seasons => {
          this.availableSeasons = seasons;

          this.yearParam = params.year;
          this.params = {
            year: this.nflService.getPreSelectedLeagueSeason() || this.nflService.getDefaultSeason(this.availableSeasons)
          };
          if (this.yearParam && !this.nflService.checkAvailableSeason(this.yearParam, seasons)) {
            return this.router.navigate(['/404']);
          }
          if (this.yearParam) {
            const redirectUrl = this.generateUrlForSeasonsDd();
            this.serverResponseService.serverRedirect(redirectUrl);
            return this.router.navigate([redirectUrl]);
          }

          this.getData().pipe(
            catchError(err => {
              this.router.navigate(['/404']);
              return observableThrowError(err);
            }))
            .subscribe(res => {
              this.handleResponse(res);
            });
        });
    });
  }

  onYearDdChange(season) {
    if (this.ddData.activeSeason === season.year) {
      return;
    }
    this.nflService.setPreSelectedLeagueSeason(season.year);
    this.spinnerService.handleAPICall(this.getData(season.year))
      .subscribe(res => {
        this.handleResponse(res);
      });
  }

  private getData(year?) {
    if (this.ddData) {
      this.ddData.activeSeason = year || this.nflService.getPreSelectedLeagueSeason() ||
        this.nflService.getDefaultSeason(this.availableSeasons);
    } else {
      this.ddData = {
        activeSeason: year || this.nflService.getPreSelectedLeagueSeason() || this.nflService.getDefaultSeason(this.availableSeasons),
        activeViewTab: '#',
        viewTabs: this.commonService.prepareDDItems(['All', '#', '%'], true, false),
        activeItemsToShow: 50,
        items_per_page: this.commonService.prepareDDItems([50, 100, 200, 'All'], true, false),
        seasons: this.availableSeasons.map(season => {
          return {
            ...season,
            name: this.nflService.handleYear(season.year)
          }
        })
      };
      this.ddData.items_per_page[0].selected = true;
      this.ddData.viewTabs[1].selected = true;
      this.tableType = this.route.snapshot.data['tableType'];
      this.showPos = this.route.snapshot.data['showPos'];
    }


    let apiCall: Observable<any>;
    if (this.route.snapshot.data['targetType'] === 'Offense') {
      if (this.route.snapshot.data['type'] === 'targets') {
        apiCall = this.targetsService.getAllNflTargets(this.ddData.activeSeason)
      } else if (this.route.snapshot.data['type'] === 'snaps') {
        apiCall = this.targetsService.getAllNflSnaps(this.ddData.activeSeason)
      } else {
        apiCall = this.targetsService.getAllNflReceptions(this.ddData.activeSeason)
      }
    } else {
      apiCall = this.targetsService.getNflTargets(
        this.route.snapshot.data['targetType'],
        this.route.snapshot.data['type'],
        this.ddData.activeSeason
      );
    }
    return apiCall;
  }

  private handleResponse(res) {
    const breadcrumbs = [
      { label: 'NFL', url: '/nfl'},
      { label: 'Players', url: '/nfl/players'}
    ];
    this.showTeam = res.show_team;
    this.pageDescription = res.intro_paragraph;
    this.bottomParagraph = res.bottom_paragraph;
    this.bottomHeading = res.bottom_header;
    this.sortWeek = res.sort_week;
    this.csvText = this.commonService.generateCSV(this.csvFormat(res.data));
    const savedDDs = this.targetsService.getSavedDD();
    const savedTargetsDD = this.targetsService.getSavedDD('savedTargetsDD');
    if (savedTargetsDD && savedTargetsDD.viewTabs) {
      this.ddData.viewTabs = savedTargetsDD.viewTabs;
      this.onPercentageDdClick();
    }
    if (savedDDs && savedDDs.teams && savedDDs.teams.length) {
      this.ddData.teams = savedDDs.teams;
      this.onTeamDropdownChange();
    }
    if (!this.ddData.teams) {
      this.ddData.teams = this.commonService.prepareDDItems(res.teams_dropdown, true, true, false, true);
    }
    this.pageTitle = res.heading;
    this.title.setTitle(res.page_title);
    this.setDatasetSchema(res.data);
    breadcrumbs.push({
      label: 'NFL Player Stats', url: '/nfl/player-stats'
    });
    if (this.route.snapshot.data['targetType'] === 'Offense') {
      breadcrumbs.push({
        label: res.heading, url: './'
      });
    } else {
      if (this.getParentPageLabel()) {
        breadcrumbs.push({
          label: this.getParentPageLabel(),
          url: `/nfl/${this.getParentPageUrl()}`
        });
      }
      breadcrumbs.push(
        {
          label: res.heading, url: './'
        }
      );
    }
    this.breadcrumbService.changeBreadcrumbs(breadcrumbs);
    this.originData = res.data;
    this.data = res.data;
  }

  ngOnDestroy() {
    this.searchTerm$.unsubscribe();
  }

  onTeamDropdownChange() {
    this.ddData.activeTeams = this.commonService.getActiveCheckBoxItems(this.ddData.teams, 'name');
    this.targetsService.saveDD({
      teams: this.ddData.teams
    });
    if (this.ddData.activeTeams.length === 0) {
      this.ddData.activeTeams = ['null'];
    }
    if (this.ddData.activeTeams.length === this.ddData.teams.length) {
      this.ddData.activeTeams = [];
    }
    this.searchTerm$.next();
  }

  onItemsToShowDropdownChange() {
    this.ddData.activeItemsToShow = this.commonService.getActiveCheckBoxItems(this.ddData.items_per_page, 'name')[0];
  }

  isMainTabActive(type) {
    return type === this.route.snapshot.data['type'];
  }

  onSnapCountMainTabClick(activeTab) {
    console.log(activeTab);
    let activeSecondaryTab: any;
    if (this.isMainRadioDisabled(activeTab)) {
      activeSecondaryTab = _.find(this.snapsSecondaryRadio, activeTab.value);
    } else {
      activeSecondaryTab = this.getActiveSecondaryTab();
    }
    if (activeSecondaryTab.name === 'Offense') {
      return this.router.navigate([
        `/nfl/${activeSecondaryTab[activeTab.value]}`
      ]);
    }
    let navVal;
    if (Array.isArray(activeSecondaryTab[activeTab.value])) {
      navVal = activeSecondaryTab[activeTab.value].slice(0);
    } else {
      navVal = [activeSecondaryTab[activeTab.value]];
    }
    this.router.navigate(['/nfl', ...navVal]);
  }

  isSecondaryTabActive(targetType) {
    return targetType === this.route.snapshot.data['targetType'];
  }

  onSnapCountSecondaryTabClick(activeTab) {
    if (activeTab.name === 'Offense') {
      const activeMainTab = (<NameValueObj>_.find(this.snapsMainRadio, {value: this.route.snapshot.data['type']})).value;
      return this.router.navigate([
        // tslint:disable-next-line:max-line-length
        `/nfl/${activeTab[activeMainTab] || activeTab['snaps']}`
      ]);
    }
    const basicNav = ['/nfl'];

    if (this.isSeconderyRadioDoesNotExist(activeTab)) {
      if (Array.isArray(activeTab[activeTab['snaps']])) {
        basicNav.push(...activeTab[activeTab['snaps']]);
      } else {
        basicNav.push(activeTab[activeTab['snaps']]);
      }
      return this.router.navigate([...basicNav]);
    }

    if (Array.isArray(activeTab[this.route.snapshot.data['type']])) {
      basicNav.push(...activeTab[this.route.snapshot.data['type']]);
    } else {
      basicNav.push(activeTab[this.route.snapshot.data['type']]);
    }

    this.router.navigate([...basicNav]);
  }

  getSnapCountSecondaryUrl(activeTab) {
    if (activeTab.name === 'Offense') {
      const activeMainTab = (<NameValueObj>_.find(this.snapsMainRadio, {value: this.route.snapshot.data['type']})).value;
      // tslint:disable-next-line:max-line-length
      return `/nfl/${activeTab[activeMainTab] || activeTab['snaps']}`;
    }
    const basicNav = ['/nfl'];
    if (Array.isArray(activeTab[this.route.snapshot.data['type']])) {
      basicNav.push(...activeTab[this.route.snapshot.data['type']]);
    } else {
      basicNav.push(activeTab[this.route.snapshot.data['type']]);
    }
    return [...basicNav].join('/');
  }

  getActiveTypeName() {
    return (<NameValueObj>_.find(this.snapsMainRadio, {value: this.route.snapshot.data['type']})).name;
  }

  getActiveTargetTypeName() {
    return this.route.snapshot.data['targetType'];
  }

  private initFilter() {
    this.searchTerm$.pipe(
      debounceTime(500))
      .subscribe(() => {
        let dataToFilter = this.originData.slice(0);
        dataToFilter = dataToFilter.filter((item) => {
          return (!this.searchModel || (item.name.toLowerCase().indexOf(this.searchModel.toLowerCase()) !== -1)) &&
            ((!this.ddData.activeTeams || !this.ddData.activeTeams.length) || (_.includes(this.ddData.activeTeams, item.team)));
        });
        this.data = dataToFilter;
      });
  }

  filterByName(filterVal) {
    this.searchModel = filterVal;
    this.searchTerm$.next();
  }

  private getParentPageLabel(): string {
    if (this.route.snapshot.data['type'] === 'snaps') {
      return 'NFL Snap Counts';
    } else if (this.route.snapshot.data['type'] === 'receptions') {
      return 'NFL Receptions';
    } else if (this.route.snapshot.data['type'] === 'targets' || this.route.snapshot.data['type'] === 'redzone-targets') {
      return 'NFL Targets';
    }
    return null;
  }


  private getParentPageUrl(): string {
    if (this.route.snapshot.data['type'].indexOf('snaps') !== -1) {
      return 'snap-counts';
    } else if (this.route.snapshot.data['type'].indexOf('receptions') !== -1) {
      return 'nfl-receptions';
    }
    return 'nfl-targets';
  }

  isSnapsOrTargets() {
    return this.route.snapshot.data.type === 'snaps' || this.route.snapshot.data.type === 'targets';
  }

  onPercentageTabClick(tab) {
    this.ddData.activeViewTab = tab.name;
    this.ddData.viewTabs.forEach(item => {
      item.selected = item.name === tab.name;
    });
    this.targetsService.saveDD({
      viewTabs: this.ddData.viewTabs
    }, 'savedTargetsDD');
  }

  onPercentageDdClick() {
    this.ddData.activeViewTab = this.commonService.getActiveCheckBoxItems(this.ddData.viewTabs, 'name')[0];
    this.targetsService.saveDD({
      viewTabs: this.ddData.viewTabs
    }, 'savedTargetsDD');
  }

  isSeconderyRadioDoesNotExist(radio) {
    for (const key in radio) {
      if (key === this.route.snapshot.data['type']) {
        return false;
      }
    }
    return true;
  }

  isMainRadioDisabled(radio) {
    const activeTab: any = _.find(this.snapsSecondaryRadio, {
      'name': this.route.snapshot.data['targetType']
    });
    for (const key in activeTab) {
      if (key === radio.value) {
        return false;
      }
    }
    return true;
  }

  onCsvShow() {
    this.csvShowed = !this.csvShowed;
  }

  private getActiveSecondaryTab() {
    return _.find(this.snapsSecondaryRadio, {
      'name': this.route.snapshot.data['targetType']
    });
  }

  private csvFormat(arr: any[]) {
    if (arr.length) {
      const GameOrTeam = this.showTeam ? 'TEAM' : 'GAME';
      return arr.map((obj) => {
        const resObj = {};
        resObj['NAME'] = obj.name;
        if (this.showPos) {
          resObj['POS'] = obj.position;
        }
        resObj['RTG'] = obj.lineups_rating;
        resObj[GameOrTeam] = obj[GameOrTeam.toLowerCase()];
        resObj['DEPTH'] = obj.fantasy_position_depth_order;
        for (let i = 1; i <= 17; i++) {
          const percentage_by_week = obj.snap_percentage_by_week || obj.receiving_targets_percentage_by_week;
          if (obj.weeks || percentage_by_week) {
            const week = obj.weeks ? obj.weeks[i] || '' : '';
            const snap_percentage_by_week = percentage_by_week ? percentage_by_week[i - 1] || '' : '';
            resObj[`Week ${i}`] = `${week}${snap_percentage_by_week ? ' ' + snap_percentage_by_week + '%' : ''}`;
          } else {
            resObj[`Week ${i}`] = '';
          }
        }
        resObj['Total'] = obj.total;
        resObj['Avg'] = obj.average;
        if (this.route.snapshot.data['type'] === 'targets') {
          resObj['TM TGT %'] = obj.season_target_percent;
        }
        if (this.route.snapshot.data['type'] === 'snaps') {
          resObj['TM SNAP %'] = obj.season_snap_percent;
        }
        if (this.tableType === this.tableTypes[2]) {
          resObj['Catches'] = obj.receptions;
        }
        if (this.tableType === this.tableTypes[5]) {
          resObj['Rush %'] = this.targetsService.countRushPercentage(arr, obj);
        }
        if (this.tableType !== this.tableTypes[1] && this.tableType !== this.tableTypes[2] && this.tableType !== this.tableTypes[5]) {
          resObj['Rec'] = obj.receptions;
        }
        if (this.tableType !== this.tableTypes[1] && this.tableType !== this.tableTypes[5]) {
          resObj['Catch %'] = obj.catch_percentage;
        }
        resObj['TD'] = obj.touchdowns;
        return resObj;
      });
    }
    return [];
  }

  private generateUrlForSeasonsDd() {
    const basicNav = `/nfl/`;
    if (this.route.snapshot.data['targetType'] === 'Offense') {
      return `${basicNav}${this.getParentPageUrl()}`;
    }

    const urlSegment = this.getActiveSecondaryTab()[this.route.snapshot.data['type']];
    if (Array.isArray(urlSegment)) {
      return `${basicNav}${urlSegment.join('/')}`;
    }
    return `${basicNav}${urlSegment}`;
  }

  private generatePlayersSchema(data) {
    return data.slice(0, 50).map((player) => {
      return {
        '@context': 'http://schema.org',

        '@type': 'Person',

        'name': player.full_name,

        'url': 'https://www.lineups.com' + player.profile_url,

        'jobTitle': player.position,

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
    })
  }

  private setDatasetSchema(data) {
    let dataSetSchema;
    switch (this.route.snapshot.data['type']) {
      case 'targets': {
        switch (this.route.snapshot.data['targetType']) {
          case 'Offense': {
            dataSetSchema = this.commonService.generateDatasetSchema(
              'NFL targets',
              // tslint:disable-next-line:max-line-length
              'NFl targets by week, total, average and team target percentage, catches, catch percentage  as well as touchdowns. Player name, position, rating, team and depth are provided. Sort by position, number of targets or percentage of team targets.',
              'nfl targets, targets by position, team target percentage',
              'https://www.lineups.com/nfl/nfl-targets',
              'NFL Targets'
            );
            break;
          }
          case 'RB': {
            dataSetSchema = this.commonService.generateDatasetSchema(
              'Running Back targets',
              // tslint:disable-next-line:max-line-length
              'NFL running back targets by week, total, average and team target percentage, catches, catch percentage  as well as touchdowns. Player name, position, rating, team and depth are provided. Display number of targets, percentage of team targets or both.',
              'running back targets,RB targets,  RB targets percentage',
              'https://www.lineups.com/nfl/nfl-targets/running-back-rb-targets',
              'Running Back Targets'
            );
            break;
          }
          case 'WR': {
            dataSetSchema = this.commonService.generateDatasetSchema(
              'Wide Receiver targets',
              // tslint:disable-next-line:max-line-length
              'NFL wide receiver targets by week, total, average and team target percentage, catches, catch percentage  as well as touchdowns. Player name, position, rating, team and depth are provided. Display number of targets, percentage of team targets or both.',
              'wide receiver targets, WR targets,  wide receiver targets percentage',
              'https://www.lineups.com/nfl/nfl-targets/wide-receiver-wr-targets',
              'Wide Receiver Targets'
            );
            break;
          }
          case 'TE': {
            dataSetSchema = this.commonService.generateDatasetSchema(
              'Tight End targets',
              // tslint:disable-next-line:max-line-length
              'NFL tight end targets by week, total, average and team target percentage, catches, catch percentage  as well as touchdowns. Player name, position, rating, team and depth are provided. Display number of targets, percentage of team targets or both.',
              'tight end targets, TE targets,  tight end targets percentage',
              'https://www.lineups.com/nfl/nfl-targets/tight-end-te-targets',
              'Tight End Targets'
            );
            break;
          }
        }
        break;
      }
      case 'snaps': {
        switch (this.route.snapshot.data['targetType']) {
          case 'Offense': {
            dataSetSchema = this.commonService.generateDatasetSchema(
              'NFL Snap Counts',
              // tslint:disable-next-line:max-line-length
              'Snap counts by week, total, average and team snap percentage as well as touchdowns. Player name, position, rating, team and depth are provided. Sort by position, number of snaps or percentage of team snaps.',
              'nfl snap counts, snap counts by position, team snap count percentage',
              'https://www.lineups.com/nfl/snap-counts',
              'NFL Snap Counts'
            );
            break;
          }
        }
        break;
      }
      case 'redzone-targets': {
        switch (this.route.snapshot.data['targetType']) {
          case 'RB': {
            dataSetSchema = this.commonService.generateDatasetSchema(
              'Running Back redzone targets',
              // tslint:disable-next-line:max-line-length
              'NFL running back redzone targets by week, total, average and team target percentage, catches, catch percentage  as well as touchdowns. Player name, position, rating, team and depth are provided. Display number of targets, percentage of team targets or both.',
              'running back redzone targets ,RB redzone targets,  RB redzone targets percentage',
              'https://www.lineups.com/nfl/running-back-rb-redzone-targets',
              'Running Back redzone targets'
            );
            break;
          }
          case 'WR': {
            dataSetSchema = this.commonService.generateDatasetSchema(
              'Wide Receiver redzone targets',
              // tslint:disable-next-line:max-line-length
              'NFL wide receiver redzone targets by week, total, average and team target percentage, catches, catch percentage  as well as touchdowns. Player name, position, rating, team and depth are provided. Display number of targets, percentage of team targets or both.',
              'wide receiver redzone targets, WR redzone targets, wide receiver redzone targets percentage',
              'https://www.lineups.com/nfl/wide-receiver-wr-redzone-targets',
              'Wide Receiver redzone targets'
            );
            break;
          }
          case 'TE': {
            dataSetSchema = this.commonService.generateDatasetSchema(
              'Tight End redzone targets',
              // tslint:disable-next-line:max-line-length
              'NFL tight end redzone targets by week, total, average and team target percentage, catches, catch percentage  as well as touchdowns. Player name, position, rating, team and depth are provided. Display number of targets, percentage of team targets or both.',
              'tight end redzone targets, TE redzone targets, tight end redzone targets percentage',
              'https://www.lineups.com/nfl/tight-end-te-redzone-targets',
              'Tight End redzone targets'
            );
            break;
          }
        }
        break;
      }
    }
    if (dataSetSchema) {
      dataSetSchema = [dataSetSchema, ...this.generatePlayersSchema(data)];
      this.schemaService.addSchema(dataSetSchema);
    }
  }
}
