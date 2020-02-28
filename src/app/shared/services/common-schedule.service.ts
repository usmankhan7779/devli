import * as moment from 'moment';
import * as _ from 'lodash';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonScheduleService {

  constructor() {}

  formatScheduleData(data) {
    let scheduleItems =  this.processWeekGames(data);

    const neoScheduleItems = [];

    scheduleItems = scheduleItems.sort(this.sortByDate.bind(this, 'date'));

    for (const i in scheduleItems) {
      if (scheduleItems[i]) {
        const day = scheduleItems[i];

        day.games = day.games.sort(this.sortByDate.bind(this, 'date_time'));

        neoScheduleItems.push(day);
      }
    }

    for (const i in neoScheduleItems) {
      if (neoScheduleItems[i]) {
        const day = neoScheduleItems[i];
        const completedGames = day.games.filter(game => game.status === 'Final');
        const pendingGames = day.games.filter(game => game.status !== 'Final');

        neoScheduleItems[i].completedGames = completedGames;
        neoScheduleItems[i].pendingGames = pendingGames;
      }
    }

    return neoScheduleItems;
  }

  processWeekGames(games) {
    const groupedGames = _.groupBy(games, (item: any) => {
      return moment(item.date_time).startOf('day').format('YYYY-MM-DD');
    });
    const resGames = [];
    for (const key in groupedGames) {
      if (groupedGames.hasOwnProperty(key)) {
        resGames.push({
          date: key,
          day: moment(key).format('dddd'),
          games: groupedGames[key]
        });
      }
    }
    return resGames
  }

  private sortByDate(key, game_l, game_r) {
    if (!game_l[key]) {
      return 1;
    }

    if (!game_r[key]) {
      return -1;
    }

    if (moment(game_l[key]).valueOf() < moment(game_r[key]).valueOf()) {
      return 1;
    }

    if (moment(game_l[key]).valueOf() > moment(game_r[key]).valueOf()) {
      return -1;
    }

    return 0;
  }
}
