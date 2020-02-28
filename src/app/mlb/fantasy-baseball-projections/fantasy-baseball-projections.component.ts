import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreadcrumbService } from '../../shared/components/breadcrumb/breadcrumb.service';
import { Subject } from 'rxjs';
import { CommonService } from '../../shared/services/common.service';
import { debounceTime } from 'rxjs/operators';
import { FantasyProjectionsService } from './fantasy-baseball-projections.service';
@Component({
  selector: 'app-fantasy-baseball-projections',
  templateUrl: './fantasy-baseball-projections.component.html',
  styleUrls: ['./fantasy-baseball-projections.component.scss']
})
export class FantasyBaseballProjectionsComponent implements OnInit, OnDestroy {
  dropdownCollapsed: boolean;
  ddData: any = {
    fantasy: [
      {
        name: 'FanDuel',
        prop: 'fanduel',
        selected: true
      },
      {
        name: 'DraftKings',
        prop: 'draftkings',
        selected: false
      }
    ],
    activeFantasy: 'fanduel'
  };
  data: any = {};
  itemsPerPage: number;
  totalItems: number;
  csvText;
  csvShowed = false;
  searchModel: string;
  searchTerm$ = new Subject<any>();
  searchByNameTerm$ = new Subject<any>();
  currentPage = 0;
  sortByFantasy = 'fanduel_salary';
  sortOrderFantasy = 'desc';

  colorConfig = this.fantasyProjectionsService.colorConfig;

  dataToShow = [];

  // mainRadios = ['P', 'C'];
  secondaryRadios = ['P', 'C', '1B', '2B', '3B', 'SS', 'OF'];
  // activeMainRadio = 'P';
  activeSecondaryRadio = 'P';
  // tslint:disable-next-line:max-line-length
  introParagraph = 'The growing sensation that is fantasy sports continues to climb on a global basis. The surge for sports betting to be spread in the states is gaining traction, marking this leisure activity only a few steps away from complete, global coverage. Projecting the sport is something that has been tried, practiced, and studied for many years. Baseball analysts take all sorts of factors into consideration before constructing a fantasy team. Weather, ball park factors, wind speed, and other such mentions are a few of the non-statistical items that the analysts use for roster consideration. While the raw numbers are as good of a prediction factor as any, they undermine the mentioned items above. Below we will take a deeper look into items analysts use when creating fantasy projections and pay some homage to the numbers when it comes to salary construction for daily fantasy play.';

  constructor(
    private breadcrumbService: BreadcrumbService,
    private fantasyProjectionsService: FantasyProjectionsService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.initSearchSubject(this.searchTerm$, 0);
    this.initSearchSubject(this.searchByNameTerm$, 700);
    this.breadcrumbService.changeBreadcrumbs([
      {
        url: '/mlb',
        label: 'MLB'
      },
      {
        url: '/mlb/fantasy/baseball-projections',
        label: 'MLB Fantasy Baseball Projections'
      }
    ]);
    this.ddData.items_per_page = this.commonService.prepareDDItems([50, 100, 200, 500], true, false);
    this.ddData.items_per_page[0].selected = true;
    this.itemsPerPage = this.ddData.items_per_page[0].name;
    this.fantasyProjectionsService.getPlayers().subscribe((data) => {
      this.data = data.data;
      this.searchTerm$.next();
    });
  }


  ngOnDestroy() {
    this.searchTerm$.unsubscribe();
    this.searchByNameTerm$.unsubscribe();
  }

  onDropdownChange() {
    const prevActiveFantasy = this.ddData.activeFantasy;
    this.ddData.activeFantasy = this.commonService.getActiveCheckBoxItems(this.ddData.fantasy, 'prop')[0];
    // sort bug fix after 3rd dd change
    setTimeout(() => {
      this.handleTableSortingAfterDdChange('sortByFantasy',
        this.ddData.activeFantasy, prevActiveFantasy, 'fantasy');
    }, 10);
    this.searchTerm$.next();
  }

  private handleTableSortingAfterDdChange(sortBy, ddVal, prevDDVal, thirdName) {
    if (this[sortBy] && (this[sortBy].indexOf(this.ddData[thirdName][0].prop) !== -1 ||
        this[sortBy].indexOf(this.ddData[thirdName][1].prop) !== -1 || (
          this.ddData[thirdName][2] && this[sortBy].indexOf(this.ddData[thirdName][2].prop) !== -1))) {
      this[sortBy] = this.commonService.replaceStrAll(this[sortBy], prevDDVal, ddVal);
    }
  }

  filterByName(filterVal) {
    this.searchModel = filterVal;
    this.searchByNameTerm$.next();
  }

  onPageChange(page) {
    this.currentPage = page;
    this.updateCSVText();
  }

  onItemsPerPageChange() {
    this.itemsPerPage =  this.commonService.getActiveCheckBoxItems(this.ddData['items_per_page'], 'name')[0];
    this.updateCSVText();
  }

  onCsvShow() {
    this.csvShowed = !this.csvShowed;
  }

  isTabActive(name, priority) {
    // if (priority === 'main') {
    //   return this.activeMainRadio === name;
    // }
    if (priority === 'secondary') {
      return this.activeSecondaryRadio === name;
    }
  }

  onRadioClick(name, priority) {
    // if (priority === 'main') {
    //   this.activeMainRadio = name;
    // }
    if (priority === 'secondary') {
      this.activeSecondaryRadio = name;
      this.searchModel = '';
    }
    this.searchTerm$.next();
  }

  private initSearchSubject(searchTerm$, debounceTimeArg) {
    searchTerm$
      .pipe(
        debounceTime(debounceTimeArg)
      )
      .subscribe(() => {
        this.dataToShow = this.data.filter(player => {
          if ((this.searchModel && this.searchModel.length &&
              player.full_name.toLowerCase().indexOf(this.searchModel.toLowerCase()) === -1) ||
            this.checkPosition(player)) {
            return false;
          }
          return true;
        });
        this.totalItems = this.dataToShow.length;
        this.updateCSVText();
      });
  }

  private checkPosition(player) {
    if (this.activeSecondaryRadio === 'P') {
      return player.position[this.ddData.activeFantasy] !== 'P' && player.position[this.ddData.activeFantasy] !== 'SP';
    }
    return player.position[this.ddData.activeFantasy] !== this.activeSecondaryRadio;
  }

  private updateCSVText() {
    const start = (this.currentPage === 1 || this.currentPage === 0 ? 0 : this.currentPage - 1) * this.itemsPerPage;
    this.csvText = this.commonService.generateCSV(this.dataToShow.slice(start, start + this.itemsPerPage)
      .map((player) => {
        const resObj = {};
        resObj['Name'] = player.full_name;
        resObj['Pos'] = player.position[this.ddData.activeFantasy];
        resObj['Rating'] = player.efficiency_rating;
        resObj['Order'] = player.batting_order;
        resObj['Projection'] = player.projections[this.ddData.activeFantasy + '_cash'];
        resObj['Salary'] = player[this.ddData.activeFantasy + '_salary'];
        resObj['Pts/$1k'] = player[this.ddData.activeFantasy + '_pointsPerK'];
        resObj['Teams'] = player.team + ' @ ' + player.opponent;
        resObj['Rain'] = player.rain || '';
        resObj['Wind'] = player.wind || '';
        resObj['Moneyline'] = player.moneyline || '';
        if (this.activeSecondaryRadio === this.secondaryRadios[1]) {
          resObj['Opp Run Total'] = player.opp_team_runs || '';
        } else {
          resObj['Run Total'] = player.team_runs || '';
        }
        resObj['Park Factor'] = player.park_factor || '';
        resObj['Theory'] = player.theory || '';
        if (this.activeSecondaryRadio === this.secondaryRadios[1]) {
          resObj['Name - Hand'] = player.opp_pitcher_name_hand || '';
        } else {
          resObj['WOBA vs. Hand'] = player.opp_woba || '';
        }
        resObj['ISO vs. Hand'] = player.opp_iso || '';
        if (this.activeSecondaryRadio === this.secondaryRadios[1]) {
          resObj['K% vs. Hand'] = player.opp_k || '';
          resObj['ERA'] = player.era || '';
          resObj['Avg. Innings'] = player.avg_innings || '';
          resObj['Floor L10'] = player.points_min[this.ddData.activeFantasy] || '';
          resObj['Ceiling L10'] = player.points_max[this.ddData.activeFantasy] || '';
          resObj['Consistency'] = player.consistency[this.ddData.activeFantasy] || '';
        } else {
          resObj['HR/9 vs. Hand'] = player.opp_pitcher_hr_9 || '';
          resObj['K% vs. Hand'] = player.opp_pitcher_k || '';
          resObj['WOBA vs. Hand'] = player.woba || '';
          resObj['ISO vs. Hand'] = player.iso || '';
          resObj['WRC+ vs. Hand'] = player.wrc || '';
          resObj['Floor L60'] = player.points_min[this.ddData.activeFantasy] || '';
          resObj['Ceiling L10'] = player.points_max[this.ddData.activeFantasy] || '';
          resObj['Consistency'] = player.consistency[this.ddData.activeFantasy] || '';
        }
        return resObj;
      }));
  }

  onSortOrder(sortBy, sortOrder, mode, $event) {
    if (mode === 'by') {
      this[sortBy] = $event;
    } else if (mode === 'order') {
      this[sortOrder] = $event;
    }
  }

}
