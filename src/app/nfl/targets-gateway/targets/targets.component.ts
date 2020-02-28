import { Component, Input, OnInit } from '@angular/core';
import { NflService } from '../../nfl.service';
import { TargetsService } from '../targets.service';
import { SortingService } from '../../../shared/services/sorting.service';

@Component({
  selector: 'app-targets',
  templateUrl: './targets.component.html',
  styleUrls: ['./targets.component.scss']
})
export class TargetsComponent implements OnInit {
  weeks = new Array(17);
  _rowsOnPage = 100000;
  @Input() params: any;
  @Input() data: any[];
  @Input() originData: any[];
  @Input() type: string;
  @Input() tableType: string;
  @Input() showPos = false;
  @Input() showGP = false;
  @Input() showTeam: boolean;
  @Input() showGame = true;
  @Input() sortWeek: number;
  @Input() isNewApiFormat = false;
  @Input() allowPagination = false;
  @Input() itemsPerPage;
  @Input() currentPage;
  @Input() set percentageType(val: string) {
    this._percentageType = val;
    if (typeof this.sortBy === 'function') {
      const sortBy = this.sortBy;
      this.sortBy = this.sortBy.bind(this);
      setTimeout(() => {
        this.sortBy = sortBy;
      }, 0);
    }
  }
  _percentageType: string;
  @Input() set showRowsOnPage(val: number) {
    if (typeof val === 'number') {
      this._rowsOnPage = val;
    } else {
      this._rowsOnPage = 100000;
    }
  }
  @Input() set weekCount(val: number) {
    this.weeks = new Array(val);
  }
  sortBy: any;
  sortOrder: string;
  currentWeekIndex: number;

  sortByCurrentWeek: any;
  sortWeekFunctions = {};
  countRushPercentage;

  tableTypes = this.targetsService.getTableTypes();


  customSortFns = {
    tmTgt: this.sortingService.customSortFn.bind(this.sortingService, 'season_target_percent')
  };

  constructor(
    private nflService: NflService,
    private targetsService: TargetsService,
    private sortingService: SortingService
  ) { }

  ngOnInit() {
    this.countRushPercentage = this.targetsService.countRushPercentage.bind(this, this.originData);
    this.currentWeekIndex = this.getCurrentWeekSorting();
    this.sortByCurrentWeek = this.sortByWeek.bind(this,  this.currentWeekIndex);
    this.sortBy = this.sortByCurrentWeek;
    this.sortOrder = 'desc';
    for (let i = 0; i < this.weeks.length; i++) {
      this.sortWeekFunctions[i] = this.sortByWeek.bind(this, i);
    }
  }

  onSortOrder(mode, $event) {
    if (mode === 'by') {
      this.sortBy = $event;
    } else if (mode === 'order') {
      this.sortOrder = $event;
    }
  }

  sortByWeek(index, item) {
    switch (this._percentageType) {
      case '%': {
        const percentageWeeks = item.snap_percentage_by_week || item.receiving_targets_percentage_by_week;
        if (percentageWeeks) {
          return typeof percentageWeeks[String(index)] === 'number' ?
            percentageWeeks[String(index)] : -1 ;
        }
        break;
      }
      default: {
        if (item.weeks) {
          return typeof item.weeks[String((this.isNewApiFormat ? index : index + 1 ))] === 'number' ?
            item.weeks[String((this.isNewApiFormat ? index : index + 1 ))] : -1 ;
        }
        break;
      }
    }
    return -1;
  }

  private getCurrentWeekSorting() {
    let currentWeek = this.sortWeek;
    if (this.isNewApiFormat) {
      currentWeek = currentWeek - 1;
    }
    const players = this.data.filter(player => {
      return player && player.weeks && player.weeks[String(currentWeek)] !== undefined;
    });
    if (players.length > 0) {
      return this.sortWeek - 1;
    }
    return this.sortWeek - 2;
  }

  checkWeek(target, weekIndex) {
    return target.weeks && typeof target.weeks[(this.isNewApiFormat ? weekIndex : weekIndex + 1 )] === 'number';
  }

}
