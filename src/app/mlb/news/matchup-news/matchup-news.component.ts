
import {throwError as observableThrowError, Observable} from 'rxjs';

import {catchError} from 'rxjs/operators';
import { Component, Input, OnInit } from '@angular/core';
import { NewsService } from '../news.service';

@Component({
  selector: 'app-matchup-news',
  templateUrl: './matchup-news.component.html',
  styleUrls: ['./matchup-news.component.scss']
})
export class MatchupNewsComponent implements OnInit {
  activeYear: number;
  newsData: any;
  awayNewsItems = [];
  homeNewsItems = [];
  @Input() gameId: number;
  @Input() teamNamesParam: number;

  constructor(
    private newsService: NewsService,
  ) {
  }

  ngOnInit() {
    if (!this.teamNamesParam && !this.gameId) {
      return;
    }
    this.newsService.getMatchupNews(this.teamNamesParam, this.gameId).pipe(
      catchError(err => {
        return observableThrowError(err);
      }))
      .subscribe(newsRes => {
        this.newsData = newsRes;
        this.homeNewsItems = this.newsData.home_news.slice(0);
        this.awayNewsItems = this.newsData.away_news.slice(0);
      });
  }

  filterByName(filterVal) {
    return {
      awayNewsItems: this.filterNews(this.newsData.away_news, filterVal),
      homeNewsItems: this.filterNews(this.newsData.home_news, filterVal)
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
