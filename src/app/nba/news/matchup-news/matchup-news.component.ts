import { Component, Input, OnInit } from '@angular/core';
import { NewsService } from '../news.service';

@Component({
  selector: 'app-matchup-news',
  templateUrl: './matchup-news.component.html',
  styleUrls: ['./matchup-news.component.scss']
})
export class MatchupNewsComponent implements OnInit {
  @Input() teamNames: string;
  @Input() gameId: string;
  matchup: any;
  awayNewsItems;
  homeNewsItems;

  constructor(
    private newsService: NewsService,
  ) {}

  ngOnInit() {
    this.newsService.getMatchupNews(this.teamNames, this.gameId)
      .subscribe(data => {
        this.matchup = data;
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
