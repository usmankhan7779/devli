import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { LiveOddsService } from '../live-odds.service';
import { Subscription } from 'rxjs';
import { CommonService } from '../../../shared/services/common.service';
import { DropdownService } from '../../../shared/components/dropdown/dropdown.service';

@Component({
  selector: 'app-live-odds-chart',
  templateUrl: './live-odds-chart.component.html',
  styleUrls: ['./live-odds-chart.component.scss']
})
export class LiveOddsChartComponent implements OnInit, OnDestroy {
  @Input() switchOptions: any[];
  @Input() allBooksOption: string[];
  @Input() allAdditionalBooksOption: string[];
  @Input() allBetsOption: string[];
  @Input() matchup: any;
  @Input() league: string;
  @Input() parentDdData: any;
  @Output() onLineMoveClose = new EventEmitter();

  subscriptions: Subscription[] = [];
  lineChartData: any;
  ddData: any;
  constructor(
    public liveOddsService: LiveOddsService,
    public commonService: CommonService,
    public dropdownService: DropdownService
  ) {}

  ngOnInit() {
    this.initActions();
    this.subscriptions.push(
      this.liveOddsService.dropDownsHasBeenUpdated.subscribe(ddData => {
        const activeBook = ddData.activeBook;
        let activeBets = ddData.activeBets;
        if (activeBook !== 'Vegas Books') {
          this.ddData.books = this.ddData.books.map(item => {
            return {
              name: item.name,
              selected: item.name === activeBook,
            }
          });
        }
        if (activeBets.length === this.allBetsOption.length) {
          activeBets = ['All Bets'];
        }
        this.dropdownService.selectActiveItems(this.ddData.bets, activeBets, 'name');
        this.filterItems();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  closeLineMove() {
    this.onLineMoveClose.emit(null);
  }

  filterItems() {
    this.ddData.activeBook = this.commonService.getActiveCheckBoxItems(this.ddData.books, 'name')[0];
    let activeBets: any = this.commonService.getActiveCheckBoxItems(this.ddData.bets, 'name');
    if (activeBets[0] === 'All Bets') {
      activeBets = this.allBetsOption;
    }
    this.ddData.activeBets = activeBets;
    this.setLineChartData();
  }

  private setLineChartData() {
    let activeBook = this.ddData.activeBook;
    if (!this.matchup.home.bets[activeBook]) {
      this.ddData.activeBook = Object.keys(this.matchup.home.bets)[0];
      activeBook = this.ddData.activeBook;
    }
    this.lineChartData = {
      home: {
        moneyline: {
          open: this.matchup.home.bets[activeBook].moneyline.moneyline_open,
          current: this.matchup.home.bets[activeBook].moneyline.moneyline_current,
          difference: this.matchup.home.bets[activeBook].moneyline.moneyline_difference
        },
        spread: {
          open: this.matchup.home.bets[activeBook].spread.spread_open,
          current: this.matchup.home.bets[activeBook].spread.spread_current,
          difference: this.matchup.home.bets[activeBook].spread.spread_difference
        },
        under: {
          open: this.matchup.home.bets[activeBook].under.under_open,
          current: this.matchup.home.bets[activeBook].under.under_current,
          difference: this.matchup.home.bets[activeBook].under.under_difference
        }
      },
      away: {
        moneyline: {
          open: this.matchup.away.bets[activeBook].moneyline.moneyline_open,
          current: this.matchup.away.bets[activeBook].moneyline.moneyline_current,
          difference: this.matchup.away.bets[activeBook].moneyline.moneyline_difference
        },
        spread: {
          open: this.matchup.away.bets[activeBook].spread.spread_open,
          current: this.matchup.away.bets[activeBook].spread.spread_current,
          difference: this.matchup.away.bets[activeBook].spread.spread_difference
        },
        over: {
          open: this.matchup.away.bets[activeBook].over.over_open,
          current: this.matchup.away.bets[activeBook].over.over_current,
          difference: this.matchup.away.bets[activeBook].over.over_difference
        }
      },
      moneyline: {
        data: [
          {data: this.matchup.away.bets[activeBook].moneyline.moneyline_history.away || [], label: this.matchup.away.team_name},
          {data: this.matchup.home.bets[activeBook].moneyline.moneyline_history.home || [], label: this.matchup.home.team_name}
        ],
        dates: this.matchup.away.bets[activeBook].moneyline.moneyline_history.dates,
        show_labels: this.matchup.away.bets[activeBook].moneyline.moneyline_history.show
      },
      spread: {
        data: [
          {data: this.matchup.away.bets[activeBook].spread.spread_history.away || [], label: this.matchup.away.team_name},
          {data: this.matchup.home.bets[activeBook].spread.spread_history.home || [], label: this.matchup.home.team_name}
        ],
        dates: this.matchup.away.bets[activeBook].spread.spread_history.dates,
        show_labels: this.matchup.away.bets[activeBook].spread.spread_history.show
      },
      overUnder: {
        data: [
          {data: this.matchup.away.bets[activeBook].over.over_history.away || [], label: this.matchup.away.team_name},
          {data: this.matchup.home.bets[activeBook].under.under_history.home || [], label: this.matchup.home.team_name}
        ],
        dates: this.matchup.away.bets[activeBook].over.over_history.dates,
        show_labels: this.matchup.away.bets[activeBook].over.over_history.show
      }
    };
  }

  private initActions() {
    const bets = [
      'All Bets',
      ...this.allBetsOption
      // 'Prop Bets'
    ];
    const books = [
      ...this.allBooksOption,
      ...this.allAdditionalBooksOption
    ];
    const activeBook = this.parentDdData.activeBook === 'Vegas Books' ? 'Caesars' : this.parentDdData.activeBook;
    const activeBets = this.parentDdData.activeBets.length === this.allBetsOption.length ? 'All Bets' : this.parentDdData.activeBets;

    this.ddData = {
      books: books.map(item => {
        return {
          name: item,
          selected: item === activeBook,
        }
      }),
      activeBook,
      activeBets,
      bets: bets.map(item => {
        return {
          name: item,
          selected: item === activeBets,
        }
      }),
    };
    this.setLineChartData();
  }
}
