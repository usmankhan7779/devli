import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { CommonService } from '../../services/common.service';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {

  constructor(
    private commonService: CommonService
  ) { }

  createPages(totalCount, totalItemsPerPage, currentPage) {
    const displayPagesAfterCurrent = 2;
    const pagesArr = [];
    const totalPages = Math.ceil(totalCount / totalItemsPerPage) || 1;
    for (let i = 0; i < totalPages ; i++) {
      const value = i + 1;
      let selected = false;
      if (currentPage === value) {
        selected = true;
      }
      if (value === 1 ||
        value === totalPages ||
        (value >= currentPage && value <= currentPage + displayPagesAfterCurrent) ||
        (value <= currentPage && value >= currentPage - displayPagesAfterCurrent)) {
        pagesArr.push({
          id: value,
          name: value,
          selected
        });
      }
    }
    return pagesArr;
  }

  prepareGamesDD(gamesDD, key = 'game_id') {
    const formattedGamesDD = gamesDD.map((item) => {
      return {
        ...item,
        games: this.commonService.arrayToObject(item.games, key)
      }
    });
    return this.commonService.arrayToObject(formattedGamesDD, 'season');
  }

  prepareSeasons(seasons, urlPrefix, currentSeason, useName = true, doNotPutDefaultYear = false) {
    let generateUrl;
    if (typeof urlPrefix === 'function') {
      generateUrl = urlPrefix;
    } else {
      generateUrl = (prefix, season) => {
        return `${prefix}${(doNotPutDefaultYear && season.default ? '' : '/' + season.year)}`
      };
      generateUrl = generateUrl.bind(null, urlPrefix);
    }
    return seasons.map(season => {
      return {
        url: generateUrl(season),
        name: `${season[(useName ? 'name' : 'year')]}`,
        selected: `${currentSeason}` === `${season.year}`,
        year: season.year
      }
    });
  }

  getActiveSeason(games_dropdown, game_id, key = 'game_id') {
    const predicate = {};
    predicate[key] = game_id;
    let result;
    try {
      result = (<any>_.find(games_dropdown, _.flow(
        _.property('games'),
        _.partialRight(_.some, predicate)
      ))).season;
    } catch (err) {
      console.error('Matchup Id was not found in games_dropdown', key, ':', game_id);
      result = (<any>_.find(games_dropdown, 'default')).season;
    }
    return result;
  }

  selectActiveItems(dropdown: any[], activeItems: any[], prop = 'name') {
    dropdown.forEach(item => {
      item.selected = _.includes(activeItems, item[prop]);
    });
  }
}
