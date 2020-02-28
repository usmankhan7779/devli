import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LiveOddsService } from '../live-odds/live-odds.service';
import * as _ from 'lodash';
import { CommonService } from '../../shared/services/common.service';

@Component({
  selector: 'app-matchup-bets-odds-item',
  templateUrl: './matchup-bets-odds-item.component.html',
  styleUrls: ['./matchup-bets-odds-item.component.scss']
})
export class MatchupBetsOddsItemComponent implements OnInit {
  @Input() arrLength;
  @Input() index;
  @Input() matchup;
  @Input() league: string;

  @Input() allBetsOption;
  @Input() allAdditionalBooksOption: string[];
  @Input() allBooksOption;
  @Input() switchOptions;

  @Input() activeLineMove: string;
  @Output() onLineMoveClick = new EventEmitter();

  ddData: any;
  constructor(
    private commonService: CommonService,
    public liveOddsService: LiveOddsService
  ) {
  }

  ngOnInit() {
    const activeBooks = ['Vegas Books'];
    const bets = [
      'All Bets',
      ...this.allBetsOption
      // 'Prop Bets'
    ];
    const books = [
      'Vegas Books',
      ...this.allBooksOption,
      ...this.allAdditionalBooksOption
    ];

    this.ddData = {
      books: books.map(item => {
        return {
          name: item,
          selected: _.includes(activeBooks, item),
        }
      }),
      activeBooks: this.allBooksOption,
      activeBook: 'Vegas Books',
      activeBets: this.allBetsOption,
      bets: bets.map(item => {
        return {
          name: item,
          selected: item === 'All Bets',
        }
      }),
    };
  }

  filterItems() {
    let activeBooks: any = this.commonService.getActiveCheckBoxItems(this.ddData.books, 'name');
    this.ddData.activeBook = activeBooks[0];
    if (activeBooks[0] === 'Vegas Books') {
      activeBooks = this.allBooksOption;
    }
    let activeBets: any = this.commonService.getActiveCheckBoxItems(this.ddData.bets, 'name');
    if (activeBets[0] === 'All Bets') {
      activeBets = this.allBetsOption;
    }
    this.ddData.activeBets = activeBets;
    this.ddData.activeBooks = activeBooks;
  }

  onLineClick(matchup) {
    this.onLineMoveClick.emit(matchup);
  }

  checkActiveChart(matchup) {
    return this.activeLineMove && matchup && this.activeLineMove === this.liveOddsService.getMatchupId(matchup);
  }
}
