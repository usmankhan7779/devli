import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { CheckboxObj, CommonService } from '../../services/common.service';
import { BetPredictorService } from '../../../mlb/bet-predictor/bet-predictor.service';
import { NflBetPredictorService } from '../../../nfl/bet-predictor/bet-predictor.service';
import { OrderBy } from '../../pipes/order-by.pipe';

@Component({
  selector: 'app-predicted-bets',
  templateUrl: './predicted-bets.component.html',
  styleUrls: ['./predicted-bets.component.scss']
})
export class PredictedBetsComponent implements OnInit {
  viewModes: string[] = ['table', 'list'];
  activeMode: string = this.viewModes[0];
  data: any;
  originTabsData: any;
  selectedTab: any;
  betPredictorService;
  _predictiveModel: {label: string, value: string};
  @Input() set predictiveModel(predictiveModel) {
    this._predictiveModel = predictiveModel;
    if (this.data && this.data.tabs && this.originTabsData && this.originTabsData.length) {
      this.data.tabs = this.originTabsData.filter(tab => tab.model_type === this._predictiveModel.value);
      if (this.data.tabs && this.data.tabs && this.data.tabs.length) {
        this.selectTabByOrder(this.data.tabs);
      } else {
        this.selectedTab = null;
      }
    }
  }
  get predictiveModel() {
    return this._predictiveModel;
  }
  @Input() type: string;
  @Input() league: string;

  filterAwayProbability;
  filterHomeProbability;
  filterCategory;
  filterBetType;
  filterEV;
  filterDollars;

  sortByBettingUnits = this.customTableSort.bind(this, 'dollar_signs', 'main');

  ORDER_BY_BET: number[] = [1, 0, 2];
  dollarRangeColors = ['#e14747', '#e14747', '#f4dd1c', '#e3b720', '#79d25e', '#2bb673'];

  getMaxDollarSelected = this.commonService.getMaxDollarSelected;


  @Input() set predictedBetsData(predictedBetsData) {
    console.log('predictedBetsData', predictedBetsData);
    this.selectedTab = undefined;
    if (predictedBetsData) {
      const data = _.cloneDeep(predictedBetsData);
      if (this.data &&
        this.data.dollar_ranges &&
        this.data.ev_ranges &&
        this.data.probabilities &&
        this.data.books &&
        this.data.models &&
        this.data.bet_categories &&
        this.data.bet_types
      ) {
        this.data.tabs = this.prepareBettingCards(data.tabs);
      } else {
        data.dollar_ranges = this.commonService.prepareDDItems(data.dollar_ranges);
        data.ev_ranges = this.commonService.prepareDDItems(data.ev_ranges, false);
        data.probabilities = this.commonService.prepareDDItems(data.probabilities, false);
        data.tabs = this.prepareBettingCards(data.tabs);
        data.books = this.commonService.prepareDDItems(data.books);
        data.models = this.commonService.prepareDDItems(data.models, false);
        const betOrdering = {};
        for (let i = 0; i < this.ORDER_BY_BET.length; i++) {
          betOrdering[this.ORDER_BY_BET[i]] = i;
        }
        data.bet_types = this.commonService.prepareDDItems(data.bet_types, false).sort((item1: any, item2: any) => {
          return (betOrdering[item1['id']] - betOrdering[item2['id']]);
        });
        data.bet_categories = this.commonService.prepareDDItems(data.bet_categories, false);

        this.filterBetType = this.commonService.filterBySimpleProp.bind(this, data.bet_types, 'id', 'bet_type');
        this.filterCategory = this.commonService.filterBySimpleProp.bind(this, data.bet_categories, 'id', 'bet_category');
        this.filterAwayProbability = this.commonService.filterByNumberIsBetween.bind(this, data.probabilities, 'away_probability');
        this.filterHomeProbability = this.commonService.filterByNumberIsBetween.bind(this, data.probabilities, 'home_probability');
        this.filterEV = this.commonService.bettingCardFilterByNumberIsBetween
          .bind(this, data.ev_ranges, 'expected_value');
        this.filterDollars = this.commonService.bettingCardFilterBySimpleProp.bind(this, data.dollar_ranges, 'name', 'dollar_signs');

        this.data = data;
      }
      if (this.data.tabs && this.data.tabs[0]) {
        this.selectTabByOrder(this.data.tabs);
      }
      if (this.data.tabs) {
        this.originTabsData = this.data.tabs.slice(0);
      } else {
        this.originTabsData = [];
      }
      // filter cards by predictive model
      this.predictiveModel = this._predictiveModel;

      console.log('data', this.data);
    }
  }

  constructor(
    private mlbBetPredictorService: BetPredictorService,
    private nflBetPredictorService: NflBetPredictorService,
    private commonService: CommonService,
    private orderByPipe: OrderBy,
  ) { }

  ngOnInit() {
    if (this.league === 'mlb') {
      this.betPredictorService = this.mlbBetPredictorService;
    } else if (this.league === 'nfl') {
      this.betPredictorService = this.nflBetPredictorService;
    }
  }

  onGameSelect(index: number) {
    if (this.selectedTab && this.data && this.data.tabs && this.data.tabs[index] && this.selectedTab.id === this.data.tabs[index].id) {
      return;
    }
    this.selectedTab = this.data.tabs[index];
    for (let i = 0; i < this.data.tabs.length; i++) {
      if (i === index) {
        this.data.tabs[i].active = true;
      } else {
        this.data.tabs[i].active = false;
      }
    }
    this.filterCards();
  }

  onCardSaved(card) {
    console.log('card Saved', card);
    this.betPredictorService.savePredictedCard(card.saved, card.id)
      .subscribe(res => {
        console.log('savePredictedCard', res);
      });
  }

  onTabDelete(game) {
    if (this.type === 'savedBets') {
      this.betPredictorService.deleteSavedBetsTab(game.id)
        .subscribe(() => {
          this.betPredictorService.savedBetTabWasDeleted.next({tabId: game.id});
        });
    } else {
      this.betPredictorService.deletePredictedBetsTab(game.id)
        .subscribe(() => {
          this.betPredictorService.predictedBetTabWasDeleted.next({tabId: game.id});
        });
    }
  }

  filterCards() {
    const activeTab: any = _.cloneDeep(_.find(this.data.tabs, {active: true}));
    const filtered = [];
    activeTab.cards.forEach((item, i , arr) => {
      if ((this.filterAwayProbability(item) || this.filterHomeProbability(item)) &&
        this.filterEV(item) &&
        this.filterDollars(item) && this.filterCategory(item) &&
        this.filterBetType(item) && this.filterBook(item)) {
        filtered.push(item);
      }
    });
    activeTab.cards = this.orderByPipe.transform(filtered, 'bet_type', false, this.ORDER_BY_BET, 'title');

    activeTab.tableCards = this.prepareTableCards(activeTab.cards);

    this.selectedTab = activeTab;
  }

  private prepareTableCards(cards) {
    const tableCards = [];
    cards.forEach((card) => {
      const title = card.title.split(' ');
      const betTypeName = title.splice(-1).join(' ');
      const matchup = title.join(' ');
      const predictedBets = _.keyBy(card.predicted_bets, (obj: any) => {
        if (obj.book === 'Lineups.com') {
          return 'lineups'
        }
        return 'main'
      });
      const homeCard = {
        ...card,
        team: 'home',
        matchup,
        betTypeName,
        teamName: title[2],
        probability: card.home_probability,
        predicted_bets: {
          main: predictedBets.main.home,
          lineups: predictedBets.lineups.home
        }
      };
      const awayCard = {
        ...card,
        team: 'away',
        matchup,
        betTypeName,
        teamName: title[0],
        probability: card.away_probability,
        predicted_bets: {
          main: predictedBets.main.away,
          lineups: predictedBets.lineups.away
        }
      };
      delete awayCard.away_probability;
      delete awayCard.home_probability;
      delete homeCard.away_probability;
      delete homeCard.home_probability;
      this.filterTableCard(tableCards, awayCard);
      this.filterTableCard(tableCards, homeCard);
    });
    console.log('tableCards', tableCards);
    return tableCards;
  }

  private filterTableCard(tableCards, item) {
    if (this.commonService.tableBettingCardFilterBySimpleProp.call(this, this.data.dollar_ranges, 'name', 'dollar_signs', item)) {
      tableCards.push(item);
    }
  }

  private filterBook(card) {
    const activeBooks: any = _.filter(this.data.books, {selected: true});
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

  getSelectedBookForTableHeader(): string {
    const activeBooks: any = _.filter(this.data.books, {selected: true});
    if (activeBooks.length === 1) {
      return activeBooks[0].name;
    }
    return 'Sportsbook';
  }

  onToggleItem(event, item: CheckboxObj) {
    event.stopPropagation();
    item.selected = !item.selected;
    this.filterCards();
  }

  showSelectedValues(names: string, items) {
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
    return arr.filter((obj) => obj.selected).length === 0;
  }

  toggleAll(event, arr: CheckboxObj[], selected: boolean) {
    event.stopPropagation();
    for (const arrItem of arr) {
      arrItem.selected = selected;
    }
    this.filterCards();
  }

  private prepareBettingCards(tabs) {
    const res = [];
    for (let i = 0; i < tabs.length; i++) {
      tabs[i].cards = this.commonService.prepareBettingCards(tabs[i].cards);
      res.push(tabs[i]);
    }
    return res;
  }

  private selectTabByOrder(tabs) {
    if (tabs.length) {
      if (tabs.length === 1) {
        return this.onGameSelect(0);
      }
      const order = tabs.slice().sort((a, b) => {
        return  a.order - b.order;
      })[0].order;
      this.onGameSelect(_.findIndex(tabs, {order}));
    }
  }

  customTableSort(itemProp, deepProp, item) {
    let itemToCheck;
    if (deepProp) {
      itemToCheck = item.predicted_bets[deepProp];
    } else {
      itemToCheck = item;
    }
    if (itemToCheck[itemProp] == null || typeof itemToCheck[itemProp] === 'string') {
      return -9999999;
    }
    return itemToCheck[itemProp];
  }

  sortBetType(item) {
    if (item.bet_type === 2) {
      return -1
    }
    return item.bet_type;
  }

}
