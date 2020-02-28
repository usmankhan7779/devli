import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, PLATFORM_ID } from '@angular/core';
import * as moment from 'moment';
import { ScheduleService } from '../schedule.service';
import * as _ from 'lodash';
import { TimeZoneService } from '../../../shared/services/time-zone.service';
import { NflService } from '../../nfl.service';
import { CommonService } from '../../../shared/services/common.service';
import { DropdownService } from '../../../shared/components/dropdown/dropdown.service';
import { SpinnerService } from '../../../shared/components/spinner/spinner.service';

@Component({
  selector: 'app-schedule-content',
  templateUrl: './schedule-content.component.html',
  styleUrls: ['./schedule-content.component.scss']
})
export class ScheduleContentComponent implements OnInit, OnDestroy {
  @Input() isSchedulePage: boolean;
  @Input() scheduleData: boolean;
  @Input() set params(params) {
    this._params = params;
    const preselectedWeek = this.scheduleService.getPreSelectedWeek();
    if (!this._params.week && preselectedWeek) {
      this._params.week = preselectedWeek;
      this.scheduleService.removePreSelectedWeek();
    }
    const activeTab = this.scheduleService.getTabPropDependOnUrl(params.seasonType);
    this.ddData.activeTab = activeTab;
    this.ddData.tabs = this.scheduleService.getAvailableTabs(activeTab);
    console.log(params);
    if (this.isSchedulePage && this.scheduleData) {
      if (params && params.week) {
        this.handleOneWeekSchedule(this.scheduleData);
      } else {
        this.handleScheduleData(this.scheduleData);
      }
    } else {
      this.updateWeek({week: this._params.week, initial: true});
    }
  };
  @Output() weekUpdated = new EventEmitter();
  @Output() returnData = new EventEmitter();
  @Output() matchupLinkClicked = new EventEmitter();
  _params: {year: string, week?: string | number, seasonType?: string};
  scheduledItems: Array<Object>;
  loading = false;
  timeZoneName = this.timeZoneService.getTimeZoneAbbr();
  ddData: any = {};
  availableWeeks: number;
  weeksArray: any[];

  constructor(
    private nflService: NflService,
    private timeZoneService: TimeZoneService,
    private scheduleService: ScheduleService,
    private commonService: CommonService,
    private dropdownService: DropdownService,
    private spinnerService: SpinnerService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    this.spinnerService.hideSpinner();
  }

  ngOnDestroy() {
    this.spinnerService.hideSpinner();
  }

  updateWeek({week, initial}) {
    this.weekUpdated.emit({week, initial, seasonType: this.ddData.activeTab});
    this._params.week = week;
    // if (!this.isSchedulePage || this._params.year !== 'current') {
      if (this._params.week) {
        if (this.ddData.activeTab && this._params.week &&
          this._params.week > this.scheduleService.getTabBy(this.ddData.activeTab, 'prop').available_weeks) {
          this._params.week = 1;
        }
        return this.scheduleService.getOneWeekSchedule(this._params.week, this._params['year'], this.ddData.activeTab)
          .subscribe(res => {
            this.handleOneWeekSchedule(res);
          })
      } else {
        this.scheduleService.fetchScheduleFor(this._params['year'], this.ddData.activeTab)
          .subscribe((res) => {
            this.handleScheduleData(res);
          });
      }
    // }
  }

  onDropdownChange() {
    this.ddData.activeTab = this.commonService.getActiveCheckBoxItems(this.ddData.tabs, 'prop')[0];
    this._params.year = this.commonService.getActiveCheckBoxItems(this.ddData.seasons, 'year')[0];
    if (this.nflService.checkIfDefaultSeason(this._params.year, this.ddData.unFormattedSeasons)) {
      this._params.year = 'current';
    }
    this.updateWeek({week: this.ddData.activeTab === 1 ? this._params.week : null, initial: false});
  }

  onTabClick(tabProp) {
    for (const tab of this.ddData.tabs) {
      tab.selected = false;
      if (tab.prop === tabProp) {
        tab.selected = true;
        this.ddData.activeTab = tabProp;
      }
    }
    this.updateWeek({week: null, initial: false});
  }

  sortByMatchup(game) {
    return `${game.away_team_full_name} at ${game.home_team_full_name}`;
  }

  sortByScore(game) {
    if (game.away_score != null && game.home_score != null) {
      return game.away_score + game.home_score;
    }
    return 0;
  }

  showSpinner(doNotShowSpinner) {
    if (doNotShowSpinner) {
      return;
    }
    this.spinnerService.showSpinner();
  }

  private handleOneWeekSchedule(res) {
    this.initYearDD(res.seasons_dropdown);
    this.emitReturnData(res);
    this.setAvailableWeeks(res.available_weeks);
    const resGames = this.processWeekGames(res.data, res.week_heading);
    this.scheduledItems = [resGames];
  }

  private processWeekGames(games, week_heading?) {
    const groupedGames = _.groupBy(games, (item: any) => {
      return moment(item.date).startOf('day').format('YYYY-MM-DD');
    });
    const resGames = [];
    for (const key in groupedGames) {
      if (groupedGames.hasOwnProperty(key)) {
        resGames.push({
          week_heading: week_heading,
          date: key,
          completedGames: groupedGames[key].filter(game => game.is_complete),
          pendingGames: groupedGames[key].filter(game => !game.is_complete)
        });
      }
    }
    return resGames
  }

  private handleScheduleData(result) {
    this.initYearDD(result.seasons_dropdown);
    this.emitReturnData(result);
    this.setAvailableWeeks(result.available_weeks);
    if (result.data && result.data.length) {
      // const selectedWeek: any = _.find(result.data, {current_week: true});
      // this._params.week = selectedWeek.week || 1;
      this._params.week = null;
      const scheduledItems = [];
      result.data.forEach((week) => {
        scheduledItems.push(this.processWeekGames(week.games, week.week_heading));
      });
      this.scheduledItems = scheduledItems;
    } else {
      this.scheduledItems = [];
    }
  }

  private initYearDD(seasons) {
    if (this._params.year !== 'current') {
      this._params.year = this.nflService.checkIfDefaultSeason(this._params.year, seasons) ? 'current' : this._params.year;
    }
    const activeYear = this._params.year && this._params.year !== 'current' ? this._params.year : this.nflService.getDefaultSeason(seasons);
    this.ddData.unFormattedSeasons = seasons;
    this.ddData.seasons = this.dropdownService.prepareSeasons(
      seasons,
      this.generateUrlForSeasonsDd.bind(this, this._params.week, seasons),
      activeYear
    );
  }

  private emitReturnData(result) {
    this.spinnerService.hideSpinner();
    this.returnData.emit({
      heading: result.heading,
      intro_paragraph: result.intro_paragraph,
      bottom_paragraph: result.bottom_paragraph,
      bottom_header: result.bottom_header
    });
  }

  private setAvailableWeeks(num: number) {
    this.availableWeeks = num;
    const weeks = [];
    for (let i = 0; i < this.availableWeeks; i++) {
      weeks.push(i + 1);
    }
    this.weeksArray = weeks;
  }

  generateUrlForSeasonsDd(week, seasons, season) {
    const year = (season.year === 'current' ? '' : (this.nflService.checkIfDefaultSeason(season.year, seasons) ? '' : '/' + season.year));
    const weekUrl = `${week && year === '' ? '/week-' + week : ''}`;
    // return `/nfl/schedule${this.scheduleService.getTabUrl(this.ddData.activeTab, true, true)}${year}${weekUrl}`;
    return `/nfl/schedule${this.scheduleService.getTabUrl(this.ddData.activeTab, true, true)}${year}`;
  }

  onMatchupLinkClick() {
    this.matchupLinkClicked.emit();
  }
}
