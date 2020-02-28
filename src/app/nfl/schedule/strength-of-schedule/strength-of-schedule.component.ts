import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { NflService } from '../../nfl.service';
import { DropdownService } from '../../../shared/components/dropdown/dropdown.service';
import { BreadcrumbService } from '../../../shared/components/breadcrumb/breadcrumb.service';
import { SortingService } from '../../../shared/services/sorting.service';
import { TitleService } from '../../../shared/services/title.service';
import { ScheduleService } from '../schedule.service';

@Component({
  selector: 'app-strength-of-schedule',
  templateUrl: './strength-of-schedule.component.html',
  styleUrls: ['./strength-of-schedule.component.scss']
})
export class StrengthOfScheduleComponent implements OnInit {
  scheduleData: any;
  ddData: any;
  sortFunctions: any;
  sortBy: string;
  sortOrder: string;
  params: {year: string | number};
  constructor(
    private route: ActivatedRoute,
    private nflService: NflService,
    private title: TitleService,
    private sortingService: SortingService,
    private breadcrumbService: BreadcrumbService,
    private scheduleService: ScheduleService,
    private dropdownService: DropdownService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.scheduleData = this.route.snapshot.data['scheduleData'];
      this.sortFunctions = {};
      this.scheduleData.column_headers.forEach((header, index) => {
        const isText = index === 1 || index === 9 || index === 10;
        return this.sortFunctions[header] = this.customSort.bind(this, this.scheduleData.header_map[header], isText);
      });
      this.params = {
        year: params.year || this.nflService.getDefaultSeason(this.scheduleData.seasons_dropdown),
      };
      const isDefaultSeason = this.nflService.checkIfDefaultSeason(this.params.year, this.scheduleData.seasons_dropdown);
      if (!isDefaultSeason) {
        this.nflService.setPreSelectedLeagueSeason(this.params.year.toString());
        this.scheduleService.setPreSelectedTeamSeason(this.params.year.toString());
      }
      this.ddData = {
        seasons: this.dropdownService.prepareSeasons(
          this.scheduleData.seasons_dropdown,
          this.generateUrlForSeasonsDd.bind(this),
          this.params.year
        )
      };
      this.title.setTitle(this.scheduleData.page_title);
      const breadcrumbs = [
        {label: 'NFL', url: '/nfl'},
        {label: 'Schedule', url: '/nfl/schedule'},
      ];
      if (params.year) {
        breadcrumbs.push(
          {label: this.nflService.handleYear(this.params.year), url: `/nfl/schedule/${this.params.year}`},
        );
      }
      breadcrumbs.push(
        {
          label: this.scheduleData.heading,
          url: `/nfl/schedule${isDefaultSeason ? '' : '/' + this.params.year}/strength-of-schedule`
        }
      );
      this.breadcrumbService.changeBreadcrumbs(breadcrumbs);
    });
  }

  customSort(sortBy, isText, row) {
    return this.sortingService.customSort(sortBy, row, (value) => {
      if (isText) {
        return value;
      }
      if (typeof value === 'string' && value.indexOf(',') !== -1) {
        return parseFloat(value.replace(/,/g, ''));
      }
      return parseFloat(value) || 0;
    });
  }

  private generateUrlForSeasonsDd(season) {
    const year = this.nflService.checkIfDefaultSeason(season.year, this.scheduleData.seasons_dropdown) ? '' : '/' + season.year;
    return `/nfl/schedule${year}/strength-of-schedule`;
  }

}
