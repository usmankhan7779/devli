import { Component, OnDestroy, OnInit } from '@angular/core';
import { ShowPercentagePipe } from '../../shared/pipes/show-percentage.pipe';
import { SortingService } from '../../shared/services/sorting.service';
import { SpinnerService } from '../../shared/components/spinner/spinner.service';
import { CommonService } from '../../shared/services/common.service';
import { BreadcrumbService } from '../../shared/components/breadcrumb/breadcrumb.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DropdownService } from '../../shared/components/dropdown/dropdown.service';
import { MlbService } from '../mlb.service';
import { StatsService } from './stats.service';
import { TitleService } from '../../shared/services/title.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
  providers: [ShowPercentagePipe]
})
export class StatsComponent implements OnInit, OnDestroy {
  searchModel: string;
  savedDDs: any;
  statsData;
  seasons;
  pageHeading;
  players;
  ddData;
  dropdownCollapsed;
  params: {year?: string, statsType?: string, statsLeague?: string};
  totalItems;
  currentPage;
  itemsPerPage;
  sortBy;
  sortOrder;
  csvShowed: boolean;
  searchTerm$ = new Subject<any>();
  searchTermImmediate$ = new Subject<any>();
  csvText: string;
  sortFunctions: any;
  selectedSortName;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private statsService: StatsService,
    private mlbService: MlbService,
    private dropdownService: DropdownService,
    private commonService: CommonService,
    private spinnerService: SpinnerService,
    private title: TitleService,
    private showPercentagePipe: ShowPercentagePipe,
    private breadcrumbService: BreadcrumbService,
    private sortingService: SortingService
  ) { }

  ngOnInit() {
    this.dropdownCollapsed = true;
    this.route.params.subscribe((params: Params) => {
      this.spinnerService.hideSpinner();

      this.afterDataReceivedAction(this.route.snapshot.data['statsData']);

      this.pageHeading = this.statsData.heading;

      this.params = {
        year: params.year || this.mlbService.getDefaultSeason(this.statsData.seasons_dropdown),
        statsType: params.statsType,
        statsLeague: params.statsLeague
      };

      const breadcrumbs = [
        {
          label: 'MLB',
          url: '/mlb'
        },
        {
          label: 'Players',
          url: '/mlb/players'
        },
        {
          label: 'MLB Player Stats',
          url: '/mlb/player-stats'
        },
      ];

      if (this.params.statsLeague) {
        breadcrumbs.push({
          label: this.statsService.statsLeagues[this.params.statsLeague].name,
          url: `/mlb/player-stats/${this.params.statsLeague}`
        })
      }
      breadcrumbs.push({
        label: this.pageHeading,
        url: `./`
      });

      this.breadcrumbService.changeBreadcrumbs(breadcrumbs);

      this.title.setTitle(this.statsData.page_title);
      this.ddData = this.statsService.getDddObj(
        this.params.statsType,
        this.params.statsLeague,
        this.statsData.team_dropdown,
        params.year,
        this.savedDDs
      );
      this.ddData.seasons = this.dropdownService.prepareSeasons(
        this.statsData.seasons_dropdown.map(season => {
          return {
            ...season,
            name: season.year
          }
        }),
        this.generateUrlForSeasonsDd.bind(this, this.statsData.seasons_dropdown, this.params.statsType, this.params.statsLeague),
        this.params.year
      );
      const sortBy = this.statsService.getSortBy();
      this.sortFunctions = {};
      this.statsData.header_order.forEach(header => {
        return this.sortFunctions[header] = this.customSort.bind(this, header);
      });
      if (sortBy) {
        this.sortBy = this.sortFunctions[sortBy];
        this.selectedSortName = sortBy;
        this.sortOrder = 'desc';
        this.statsService.removeSortBy();
      }
    });
    this.initFilter(this.searchTerm$, 700);
    this.initFilter(this.searchTermImmediate$, 0);
  }

  ngOnDestroy() {
    this.searchTerm$.unsubscribe();
    this.spinnerService.hideSpinner();
    this.statsService.removeSavedDDs();
  }

  onLinkDdClick(item) {
    if (item.url === this.router.url) {
      return;
    }
    this.statsService.saveDDs(this.savedDDs);
    this.spinnerService.showSpinner();
  }

  onDropdownChange(page?) {
    if (page) {
      this.currentPage = page;
    }
    this.searchModel = '';
    this.players = this.statsData.data.slice();
    this.ddData.itemsPerPage =  this.commonService.getActiveCheckBoxItems(this.ddData['items_per_page'], 'name')[0];
    this.updateCSVText();
  }

  onApiDropdownChange(searchTerm = this.searchTerm$) {
    const teams = this.ddData.teams.filter(team => {
      return (this.params.statsLeague ? !team.hidden : true);
    });
    this.savedDDs = {
      teams: this.commonService.getActiveCheckBoxItems(teams, 'name'),
      positions: this.commonService.getActiveCheckBoxItems(this.ddData.positions, 'name'),
      splits: this.commonService.getActiveCheckBoxItems(this.ddData.splits, 'prop')[0]
    };
    if (this.savedDDs.teams.length === teams.length) {
      delete this.savedDDs.teams;
      this.ddData.leadersDD[0].hidden = false;
    } else {
      this.ddData.leadersDD[0].hidden = true;
    }
    if (this.savedDDs.positions.length === this.ddData.positions.length) {
      delete this.savedDDs.positions;
    }
    searchTerm.next(this.savedDDs);
  }

  onSortBy($event) {
    this.selectedSortName = null;
    this.sortBy = $event;
  }

  onSortOrder($event) {
    this.sortOrder = $event;
  }

  onCsvShow() {
    this.csvShowed = !this.csvShowed;
  }

  filterByName(filterVal) {
    this.searchModel = filterVal;
    this.searchTerm$.next();
  }

  customSort(sortBy, row) {
    return this.sortingService.customSort(sortBy, row, (value) => {
      if (typeof value === 'string' && value.indexOf(',') !== -1) {
        return parseFloat(value.replace(/,/g, ''));
      }
      return parseFloat(value) || 0;
    });
  }

  private generateUrlForSeasonsDd(seasons, type, league, season) {
    // tslint:disable-next-line:max-line-length
    return `/mlb/player-stats${this.mlbService.checkIfDefaultSeason(season.year, seasons) ? '' : '/' + season.year}/${league ? league + '/' : ''}${type}`;
  }

  private updateCSVText() {
    this.csvText = this.commonService.generateCSV(this.csvFormatPlayers(this.players));
  }

  private csvFormatPlayers(players: any) {
    return players.map((obj) => {
      const resObj = {};
      resObj['NAME'] = obj.name;
      resObj['POS'] = obj.position;
      resObj['RTG'] = obj.lineups_rating;
      resObj['TEAM'] = obj.team;
      for (const header of this.statsData.header_order) {
        try {
          resObj[this.statsData.header_map[header]] =
            this.showPercentagePipe.transform(obj[header], header, '_pct');
        } catch (err) {
          resObj[this.statsData.header_map[header]] = '';
        }
      }
      return resObj;
    });
  }

  private afterDataReceivedAction(data) {
    this.searchModel = '';
    this.currentPage = 0;
    this.csvShowed = false;
    this.statsData = data;
    this.totalItems = this.statsData.data.length;
    this.players = this.statsData.data.slice();
    this.updateCSVText();
  }

  private initFilter(searchTerm$, debounceTimeArg) {
    searchTerm$
      .pipe(
        debounceTime(debounceTimeArg)
      )
      .subscribe((apiUpdateObj) => {
        if (apiUpdateObj) {
          const isCurrentYear = this.mlbService.checkIfDefaultSeason(this.params.year, this.statsData.seasons_dropdown);
          this.spinnerService.handleAPICall(
            this.statsService.getStats(
              isCurrentYear ? 'current' : this.params.year,
              this.params.statsLeague,
              this.params.statsType,
              apiUpdateObj
            )
          ).subscribe(res => {
            this.afterDataReceivedAction(res);
          });
        }
        let dataToFilter = this.statsData.data.slice(0);
        dataToFilter = dataToFilter.filter((item) => {
          return item.name.toLowerCase().indexOf(this.searchModel.toLowerCase()) !== -1;
        });
        this.players = dataToFilter;
      });
  }
}
