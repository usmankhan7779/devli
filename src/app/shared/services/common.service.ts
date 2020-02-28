import { OrderBy } from '../pipes/order-by.pipe';
import { Inject, Injectable, Injector, PLATFORM_ID, Renderer2, RendererFactory2 } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { NotificationModalComponent } from '../modals/notification-modal/notification-modal';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
export interface CheckboxObj {
  name: string,
  selected: boolean,
  hidden?: boolean,
  id?: number
}

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private modalService;
  private renderer: Renderer2;

  isChatReady = false;
  chatReadyEvent = new Subject<any>();

  constructor(
    private orderByPipe: OrderBy,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object,
    private injector: Injector,
    private rendererFactory: RendererFactory2,
    private router: Router,
) {
    this.renderer = rendererFactory.createRenderer(null, null);
    if (isPlatformBrowser(this.platformId)) {
      this.modalService = this.injector.get(NgbModal);
    }
  }

  getCurrentUrl() {
    const urlTree = this.router.parseUrl(this.router.url);
    if (urlTree.root.children['primary'] && urlTree.root.children['primary'].segments) {
      const url = urlTree.root.children['primary'].segments.map(it => it.path).join('/');
      return `/${url}`;
    }
    return '';
  }

  chatReady() {
    this.isChatReady = true;
    this.chatReadyEvent.next();
  }

  hideChat() {
    if (this.isChatReady) {
     this._hideChat();
    } else {
      const chatReadySubscription = this.chatReadyEvent.subscribe(() => {
        this._hideChat();
        chatReadySubscription.unsubscribe();
      })
    }
  }

  private _hideChat() {
    try {
      if (this.isBrowser()) {
        (<any>this.document.querySelector('.iflychat-popup')).style.display = 'none';
      }
    } catch (e) {
      console.log('no chat');
    }
  }

  showChat() {
    try {
      if (this.isBrowser()) {
        (<any>this.document.querySelector('.iflychat-popup')).style.opacity = 'block';
      }
    } catch (e) {
      console.log('no chat');
    }
  }

  scrollTopPage() {
    if (this.isBrowser()) {
      this.document.body.scrollTop = this.document.documentElement.scrollTop = 0;
    }
  }

  prepareBettingCards(cards) {
    const cardsContainer = cards.map((card) => {return { ...card}});

    for (let j = 0; j < cardsContainer.length; j++) {
      cardsContainer[j].predicted_bets = _.groupBy(cardsContainer[j].predicted_bets, 'bookmaker_name');
      const predicted_bets = cardsContainer[j].predicted_bets;
      const predictedBetsSorted = [];
      for (const key in predicted_bets) {
        if (predicted_bets.hasOwnProperty(key)) {
          predictedBetsSorted.push({
            book: key,
            home: predicted_bets[key][0].away ? predicted_bets[key][1] : predicted_bets[key][0],
            away: predicted_bets[key][0].away ? predicted_bets[key][0] : predicted_bets[key][1]
          });
        }
      }
      cardsContainer[j].predicted_bets = predictedBetsSorted.sort((a, b) => {
        if (a.book === 'Lineups.com') {
          return 1;
        }
        if (b.book === 'Lineups.com') {
          return -1;
        }
        if (a.book === b.book) {
          return 0
        }
        return -1;
      });
    }
    return cardsContainer;
  }

  openedInIframe() {
    if (isPlatformBrowser(this.platformId)) {
      try {
        return window.self !== window.top;
      } catch (e) {
        return true;
      }
    }
    return false;
  }

  roundValDependOnEdge(val, edge) {
    if (!edge) {
      return Math.round(val);
    } else if (edge === 'min') {
      return Math.ceil(val);
    } else if (edge === 'max') {
      return Math.floor(val);
    } else {
      return Math.round(val);
    }
  }

  setRatingClass(rating: number, reverse = false, config = {
    'red': 0,
    'green': 90,
    'light-green': 84,
    'yellow': 78,
    'orange': 72,
  }) {
    if (reverse) {
      let currentClass = 'green';
      if (rating >= config['red']) {
        currentClass = 'red';
      } else if (rating >= config['orange']) {
        currentClass = 'orange';
      } else if (rating >= config['yellow']) {
        currentClass = 'yellow';
      } else if (rating >= config['light-green']) {
        currentClass = 'light-green';
      }
      return currentClass;
    } else {
      let currentClass = 'red';
      if (rating >= config['green']) {
        currentClass = 'green';
      } else if (rating >= config['light-green']) {
        currentClass = 'light-green';
      } else if (rating >= config['yellow']) {
        currentClass = 'yellow';
      } else if (rating >= config['orange']) {
        currentClass = 'orange';
      }
      return currentClass;
    }
  }

  getActiveCheckBoxItems(items: CheckboxObj[], prop = 'name', isFullObject = false) {
    return items.reduce(function(filtered, option) {
      if (option.selected) {
        if (isFullObject) {
          filtered.push(option);
        } else {
          filtered.push(option[prop]);
        }
      }
      return filtered;
    }, []);
  }

  createArrayFromNamedObj(obj, nameKey = 'name', valueKey = 'url', combineObjArray?: Array<{obj: any, prop: string}>) {
    const resArr = [];
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const res = {};
        res[nameKey] = key;
        res[valueKey] = obj[key];
        if (Array.isArray(combineObjArray)) {
          combineObjArray.forEach((item) => {
            if (item.obj && item.prop) {
              res[item.prop] = item.obj[key];
            }
          });
        }
        resArr.push(res);
      }
    }
    return resArr;
  }

  sortYearArr(seasons_dropdown) {
    seasons_dropdown.sort((a, b) => {
      const yearA = a.year;
      const yearB = b.year;
      // Compare the 2 dates
      if (yearA < yearB) {
        return 1;
      }
      if (yearA > yearB) {
        return -1;
      }
      return 0;
    });
  }

  splitArray(teams, orderBy = 'name') {
    const res = {
      leftResults: [],
      rightResults: []
    };
    const sortedTeams = this.orderByPipe.transform(teams, orderBy);
    const listMidPoint = Math.ceil(sortedTeams.length / 2);
    const listEndPoint = sortedTeams.length;
    for (let i = 0; i < listMidPoint; i++) {
      res.leftResults.push(sortedTeams[i]);
    }
    for (let i = listMidPoint; i < listEndPoint; i++) {
      res.rightResults.push(sortedTeams[i]);
    }
    return res;
  }

  checkDoubleName(names: string[]) {
    const res = names.map(name => name.toLowerCase());
    const namesArr = ['red', 'white', 'blue'];
    namesArr.forEach((item) => {
      if (res.indexOf(item) !== -1) {
        const index = res.indexOf(item);
        res[index + 1] = `${res[index]} ${res[index + 1]}`;
        res.splice(index, 1);
      }
    });
    return res;
  }

  capitalizeTeamName(string: string) {
    if (!string) {
      return;
    }

    if (string.indexOf(' ') !== -1) {
      const arr = string.split(' ');
      arr.forEach((item, i, array) => {
        array[i] = this.capitalizeWordFirstLetter(item);
      });
      return arr.join(' ');
    } else {
      return this.capitalizeWordFirstLetter(string);
    }
  }

  private capitalizeWordFirstLetter(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  prepareDDItems(itemToPrepare, isArr = true, selected = true, swapKeyVal = false, orderByName = false) {
    if (!isArr) {
      const res = [];
      for (const key in itemToPrepare) {
        if (itemToPrepare.hasOwnProperty(key)) {
          if (swapKeyVal) {
            res.push({
              id: key,
              name: itemToPrepare[key],
              selected
            });
          } else {
            res.push({
              id: itemToPrepare[key],
              name: key,
              selected
            });
          }
        }
      }
      return res;
    }
    itemToPrepare = itemToPrepare.map(item => {
      return {
        name: item,
        selected
      }
    });
    if (orderByName) {
      itemToPrepare.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
    }
    return itemToPrepare
  }

  isBetween(number, first, last) {
    return (first < last ? number >= first && number <= last : number >= last && number <= first);
  };

  getMaxDollarSelected(data) {
    if (data.dollar_ranges) {
      const value = data.dollar_ranges.reduce((prev, current) => {
        if (prev.selected && prev.name > current.name) {
          return prev;
        }
        if (current.selected && current.name > prev.name) {
          return current;
        }
        if (prev.selected) {
          return prev;
        }
        if (current.selected) {
          return current
        }
        return {
          selected: true,
          name: 0
        };
      });
      return value.name;
    }
    return 0;
  };

  filterByNumberIsBetween(filterByArr, itemPropToFilter, item) {
    const activeFilterItems: any = filterByArr.filter((filter) => filter.selected === true);
    for (let i = 0; i < activeFilterItems.length; i++) {
      const min = activeFilterItems[i].id[0];
      const max = activeFilterItems[i].id[1];
      if (item && typeof item[itemPropToFilter] === 'number' && (<any>this).commonService.isBetween(item[itemPropToFilter], min, max)) {
        return true;
      }
    }
    return false;
  }

  filterBySimpleProp(filterByArr, filterProp, itemProp, item) {
    const activeFilterItems: any = filterByArr.filter((filter) => filter.selected === true);
    for (let i = 0; i < activeFilterItems.length; i++) {
      const filterValue = activeFilterItems[i][filterProp];
      if (item && item[itemProp] === filterValue) {
        return true;
      }
    }
    return false;
  }

  bettingCardFilterByNumberIsBetween(filterByArr, itemPropToFilter, item) {
    const activeFilterItems: any = filterByArr.filter((filter) => filter.selected === true);
    for (let i = 0; i < activeFilterItems.length; i++) {
      const min = activeFilterItems[i].id[0];
      const max = activeFilterItems[i].id[1];
      for (let j = 0; j < item.predicted_bets.length; j++) {
        const predictedBet = item.predicted_bets[j];
        if (predictedBet && predictedBet.away && predictedBet.home && typeof predictedBet.away[itemPropToFilter] === 'number' &&
          typeof predictedBet.home[itemPropToFilter] === 'number' &&
          (((<any>this).commonService.isBetween(predictedBet.away[itemPropToFilter], min, max)) ||
            ((<any>this).commonService.isBetween(predictedBet.home[itemPropToFilter], min, max)))) {
          return true;
        }
      }
    }
    return false;
  }

  bettingCardFilterBySimpleProp(filterByArr, filterProp, itemProp, item) {
    const activeFilterItems: any = filterByArr.filter((filter) => filter.selected === true);
    for (let i = 0; i < activeFilterItems.length; i++) {
      const fliterValue = activeFilterItems[i][filterProp];
      for (let j = 0; j < item.predicted_bets.length; j++) {
        const predictedBet = item.predicted_bets[j];
        if (predictedBet && predictedBet.away && predictedBet.home && typeof predictedBet.away[itemProp] === 'number' &&
          typeof predictedBet.home[itemProp] === 'number' &&
          (predictedBet.away[itemProp] === fliterValue) ||
          (predictedBet.home[itemProp] === fliterValue)) {
          return true;
        }
      }
    }
    return false;
  }

  tableBettingCardFilterBySimpleProp(filterByArr, filterProp, itemProp, item) {
    const activeFilterItems: any = filterByArr.filter((filter) => filter.selected === true);
    for (let i = 0; i < activeFilterItems.length; i++) {
      const fliterValue = activeFilterItems[i][filterProp];
      if (item.predicted_bets && item.predicted_bets.main) {
        const predictedBet = item.predicted_bets.main;
        if (typeof predictedBet[itemProp] === 'number' &&
          (predictedBet[itemProp] === fliterValue)) {
          return true;
        }
      }
    }
    return false;
  }

  generateCSV(json, emptyValue = '') {
    if (json && ((Array.isArray(json) && json.length > 0) || !Array.isArray(json))) {
      const replacer = (key, value) => value === null ? emptyValue : value; // specify how you want to handle null values here
      const header = Object.keys(json[0]);
      let csv: any = json.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
      csv.unshift(header.join(','));
      csv = csv.join('\r\n');
      return csv
    }
    return '';
  }

  showNotification(text, header = '', btn = '', modalClass?, anywayCallback?) {
    const modalRef = this.modalService.open(NotificationModalComponent, {
      size: 'lg',
      windowClass: `lineups-custom-modal notification-modal md ${modalClass}`
    });
    modalRef.componentInstance.btn = btn;
    modalRef.componentInstance.text = text;
    modalRef.componentInstance.header = header;

    if (anywayCallback && typeof anywayCallback === 'function') {
      modalRef.result.then(anywayCallback, anywayCallback);
    }

    return modalRef;
  }

  arrayToObject(array, keyField) {
    return array.reduce((obj, item) => {
      obj[item[keyField]] = item;
      return obj
    }, {});
  }

  replaceStrAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
  }

  callOnResize(onResize) {
    if (isPlatformBrowser(this.platformId)) {
      const event = {
        target: {
          innerWidth: window.innerWidth
        }
      };

      onResize(event);
    }
  }

  isBrowser() {
    return isPlatformBrowser(this.platformId);
  }

  orderObjectKeys(unordered: Object) {
    const ordered = {};
    Object.keys(unordered).sort().forEach((key) => {
      ordered[key] = unordered[key];
    });
    return ordered;
  }

  generateDatasetSchema(name, description, keywords, url, variableMeasured) {
    return {
      '@context': 'http://schema.org',
      '@type': 'Dataset',
      'name': name,
      'description': description,
      'keywords': keywords,
      'url': url,
      'variableMeasured': variableMeasured,
      'license': 'https://www.lineups.com/license',
    }
  }

  handleEmptyObjectValues(object) {
    for (const key in object) {
      if (object.hasOwnProperty(key) &&
        (object[key] === '&nbsp;' || object[key] === 'N/A' || object[key] === 'None' || object[key] == null || object[key] === 'null')) {
        object[key] = '';
      }
    }
    return object;
  }


  subscribeOnHeight() {
    if (this.isBrowser()) {
      window.addEventListener('message', this.heightListener);
    }
  }

  heightListener(event) {
    if (event.data === 'FrameHeight') {
      const body = document.body, html = document.documentElement;
      const height = Math.max(body.scrollHeight, body.offsetHeight,
        html.clientHeight, html.scrollHeight, html.offsetHeight);
      event.source.postMessage({ 'FrameHeight': height }, '*');
    }
  }
}
