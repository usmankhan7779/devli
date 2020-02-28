import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { CommonService } from '../../../shared/services/common.service';
@Component({
  selector: 'app-in-game-bets',
  templateUrl: './bets.component.html',
  styleUrls: ['./bets.component.scss']
})
export class BetsInGameComponent implements OnInit {
  @Input() data;

  dataToShow;
  dataDropdowns;

  filterDollars;
  filterEV;
  filterAwayProbability;
  filterHomeProbability;
  filterBetCategories;

  constructor(
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.dataDropdowns = _.cloneDeep(this.data.dropdowns);
    this.filterBetCategories = this.commonService.filterBySimpleProp
      .bind(this, this.dataDropdowns.bet_categories, 'id', 'bet_category');
    this.filterAwayProbability = this.commonService.filterByNumberIsBetween
      .bind(this, this.dataDropdowns.probabilities, 'away_probability');
    this.filterHomeProbability = this.commonService.filterByNumberIsBetween
      .bind(this, this.dataDropdowns.probabilities, 'home_probability');
    this.filterEV = this.commonService.bettingCardFilterByNumberIsBetween
      .bind(this, this.dataDropdowns.ev_ranges, 'expected_value');
    this.filterDollars = this.commonService.bettingCardFilterBySimpleProp
      .bind(this, this.dataDropdowns.dollar_ranges, 'name', 'dollar_signs');

    this.filterItems();
  }

  getSelectedBook() {
    const selected: any = _.find(this.dataDropdowns.books, {selected: true});
    if (selected) {
      return selected.name;
    }
    return '';
  }

  private filterBook(card) {
    const activeBooks: any = _.filter(this.dataDropdowns.books, {selected: true});
    for (let i = 0; i < activeBooks.length; i++) {
      const bookValue = activeBooks[i].name;
      for (let j = 0; j < card.predicted_bets.length; j++) {
        if (card.predicted_bets[j].book === bookValue) {
          return true;
        }
      }
    }
    return false;
  }

  filterItems() {
    const dataToFilter: any = this.data.bets.map(a => ({...a})); // clone array of objects
    const filtered = [];
    dataToFilter.forEach((item) => {
      if (
        this.filterBook(item) &&
        (this.filterAwayProbability(item) || this.filterHomeProbability(item)) &&
        this.filterBetCategories(item) &&
        this.filterEV(item) &&
        this.filterDollars(item)) {
         const seletedBook = this.getSelectedBook();
        if (seletedBook) {
          item.bookToShow = _.find(item.predicted_bets, {book: seletedBook});
        }
        item.lineupsBook = _.find(item.predicted_bets, {book: 'Lineups.com'});
        filtered.push(item);
      }
    });
    this.dataToShow = filtered;
  }

}
