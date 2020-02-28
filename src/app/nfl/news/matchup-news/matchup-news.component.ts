
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {catchError} from 'rxjs/operators';
import { Component, Input, OnInit } from '@angular/core';
import { NewsService } from '../news.service';

@Component({
  selector: 'app-matchup-news',
  templateUrl: './matchup-news.component.html',
  styleUrls: ['./matchup-news.component.scss']
})
export class MatchupNewsComponent implements OnInit {
  matchup: any;
  awayNewsItems = [];
  homeNewsItems = [];
  @Input() teamNamesParam: string;
  @Input() gameId: string;
  constructor(
    private newsService: NewsService
  ) {}

  ngOnInit() {
    if (!this.teamNamesParam && !this.gameId) {
      return
    }
    this.newsService.getNflMatchupNews(this.teamNamesParam, this.gameId).pipe(
      catchError(err => {
        return observableThrowError(err);
      }))
      .subscribe(newsRes => {
        this.matchup = newsRes;
        this.awayNewsItems = this.matchup.away_news.slice(0);
        this.homeNewsItems = this.matchup.home_news.slice(0);
      });
  }

  filterByName(filterVal) {
    return {
      awayNewsItems: this.filterNews(this.matchup.away_news, filterVal),
      homeNewsItems: this.filterNews(this.matchup.home_news, filterVal)
    }
  }

  updateNews({awayNewsItems, homeNewsItems}) {
    this.awayNewsItems = awayNewsItems;
    this.homeNewsItems = homeNewsItems;
  }

  private filterNews(news, filterVal) {
    return news.filter((item) => {
      return item.title.toLowerCase().indexOf(filterVal.toLowerCase()) !== -1;
    });
  }

}
