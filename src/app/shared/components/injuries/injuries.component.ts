import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {InjuriesService} from './injuries.service';

import {Injury} from './injury.model';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from '../breadcrumb/breadcrumb.service';
import { CheckboxObj, CommonService } from '../../services/common.service';
import * as moment from 'moment';

@Component({
  selector: 'app-injuries',
  templateUrl: './injuries.component.html',
  styleUrls: ['./injuries.component.scss']
})
export class InjuriesComponent implements OnInit {
  @Input() isTeamPage: boolean;
  @Input() currentLeague: string;
  @Input() selectedTeamNames: string[];
  @Input() isMatchupInjuriesPage = false;
  @Input() itemsPerPage = 25;
  @Output() onApiUpdate = new EventEmitter();
  currentPage = 1;
  totalItems: number;
  injuries: Injury[];
  statuses: CheckboxObj[];
  teams: CheckboxObj[];
  positions: CheckboxObj[];
  teamPropName: string;
  statusPropName: string;
  introParagraph: string;
  preselectedStatuses: string[] = [];
  searchPlayerVal: string;
  constructor(
    private injuriesService: InjuriesService,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    if (!this.currentLeague) {
      this.currentLeague = this.route.snapshot.data['url'].toLowerCase();
    }
    switch (this.currentLeague) {
      case 'nfl': {
        this.statusPropName = 'injury_status';
        this.preselectedStatuses = ['Questionable', 'Doubtful', 'Out'];
        break;
      }
      case 'mlb': {
        // this.preselectedStatuses = ['Probable', 'Questionable'];
        this.statusPropName = 'injury_status';
        break;
      }
      case 'nba': {
        this.statusPropName = 'injury_status';
        break;
      }
    }
    if (!this.isTeamPage) {
      this.breadcrumbService.changeBreadcrumbs([
        {label: this.currentLeague.toUpperCase(), url: `/${this.currentLeague}`},
        {label: 'Players', url: `/${this.currentLeague}/players`},
        {label: 'Injuries', url: `/${this.currentLeague}/player-injuries`}
      ]);
    }
    this.teamPropName = 'team';
    if (this.selectedTeamNames && this.selectedTeamNames.length) {
      this.getInjuries(1, true, true, null, this.selectedTeamNames.map(name => {
        return {name: name, selected: true};
      }));
    } else {
      this.getInjuries(1, true, true);
    }
  }

  getInjuries(page: number, getDefaultData: boolean, updatePagination: boolean, statuses?: CheckboxObj[],
              teams?: CheckboxObj[], positions?: CheckboxObj[], itemsPerPage?: number) {
    let params;
    if (statuses || teams || positions || itemsPerPage) {
      params = {};
      if (statuses && statuses.length !== statuses.filter(item => item.selected).length) {
        params.statuses = this.commonService.getActiveCheckBoxItems(statuses);
      }
      if (!statuses && this.preselectedStatuses && this.preselectedStatuses.length) {
        params.statuses = this.preselectedStatuses;
      }
      const activeTeamsLength = teams.filter(item => item.selected).length;
      if (teams && (teams.length !== activeTeamsLength || activeTeamsLength === 1)) {
        params.teams = this.commonService.getActiveCheckBoxItems(teams);
      }
      if (positions && positions.length !== positions.filter(item => item.selected).length) {
        params.positions = this.commonService.getActiveCheckBoxItems(positions);
      }
      if (itemsPerPage) {
        params.itemsPerPage = itemsPerPage;
      }
      if (this.searchPlayerVal) {
        params.player = this.searchPlayerVal;
      }
      if (this.isMatchupInjuriesPage) {
        params.isMatchupInjuriesPage = this.isMatchupInjuriesPage;
      }
    }

    this.currentPage = page;
    this.injuriesService.getInjuries(this.currentLeague, page, params)
      .subscribe((injuries) => {
        this.handleApiResponse(injuries, getDefaultData, updatePagination);
      });
  }

  setItemsPerPage(value: number) {
    this.itemsPerPage = value;
    this.getInjuries(this.currentPage, false, true, this.statuses, this.teams, this.positions, this.itemsPerPage);
  }

  onToggleItem(event, item: CheckboxObj) {
    event.stopPropagation();
    item.selected = !item.selected;
    this.getInjuries(1, false, true, this.statuses, this.teams, this.positions, this.itemsPerPage);
  }

  showSelectedValues(name: string, names: string, items: CheckboxObj[]) {
    const activeItems = this.commonService.getActiveCheckBoxItems(items);
    const activeItemsLength = activeItems.length;
    if (activeItemsLength === items.length) {
      return `All ${names}`;
    } else if (activeItemsLength === 1) {
      return `${activeItems[0]}`;
    } else if (activeItemsLength === 0) {
      return `No ${names}`;
    }
    return `${activeItemsLength} ${names}`;
  }

  isSelectedNone(arr: CheckboxObj[]) {
    return arr.filter((obj: CheckboxObj) => obj.selected).length === 0;
  }

  toggleAll(event, arr: CheckboxObj[], selected: boolean) {
    event.stopPropagation();
    for (const arrItem of arr) {
      arrItem.selected = selected;
    }
    this.getInjuries(1, false, true, this.statuses, this.teams, this.positions, this.itemsPerPage);
  }

  filterByName(filterVal) {
    this.searchPlayerVal = filterVal;
    this.getInjuries(this.currentPage, false, true, this.statuses, this.teams, this.positions, this.itemsPerPage);
  }

  private getFilterValues(teams?: string[], statuses?: string[], positions?: string[]) {
    this.teams = teams.map(objMap);
    this.statuses = statuses.map(objMap);
    this.positions = positions.map(objMap);
    if (this.preselectedStatuses && this.preselectedStatuses.length) {
      this.setDefaultFilters(this.statuses, this.preselectedStatuses);
    }
    if (this.isTeamPage) {
      this.setDefaultFilters(this.teams, this.selectedTeamNames);
    }
    function objMap(name) {
      return {
        name: name,
        selected: true
      }
    }
  }

  private setDefaultFilters(filterArr: CheckboxObj[], preselectedProps: string[]) {
    for (const filter of filterArr) {
      if (preselectedProps && preselectedProps.indexOf(filter.name) === -1) {
        filter.selected = false;
      }
    }
  }

  private handleApiResponse(injuries, getDefaultData, updatePagination) {
    this.onApiUpdate.emit(injuries);
    this.injuries = injuries.results;
    if (injuries.intro_paragraph) {
      this.introParagraph = injuries.intro_paragraph;
    }
    if (getDefaultData) {
      this.getFilterValues(injuries.teams, injuries.statuses, injuries.positions);
      if (!this.isTeamPage && this.currentLeague !== 'nba') {
        this.getInjuries(1, false, true, this.statuses, this.teams, this.positions, this.itemsPerPage);
      }
    }
    if (updatePagination) {
      this.totalItems = injuries.count;
      // this.itemsPerPage = injuries.results.length;
    }
  }
}
